import {
	getDBType
} from '../../core/database/database.config.js';
import {
	getPostgresPool
} from '../../core/database/postgres.config.js';
import {
	getMongoDB
} from '../../core/database/mongodb.config.js';
import {
	ObjectId
} from 'mongodb';

export class SessionModel {
	constructor() {
		this.dbType = getDBType();
	}

	async save(sessionData) {
		const {
			adminId,
			token,
			refreshToken,
			expiresAt,
			ipAddress,
			userAgent
		} = sessionData;

		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(`
				INSERT INTO admin_sessions 
				(admin_id, token, refresh_token, expires_at, ip_address, user_agent, is_active, created_at) 
				VALUES ($1, $2, $3, $4, $5, $6, true, NOW()) 
				RETURNING *
			`, [adminId, token, refreshToken, expiresAt, ipAddress, userAgent]);
			return result.rows[0];
		} else {
			const db = getMongoDB();
			const session = {
				adminId: new ObjectId(adminId),
				token,
				refreshToken,
				isActive: true,
				expiresAt: new Date(expiresAt),
				ipAddress,
				userAgent,
				loginTime: new Date(),
				lastActivity: new Date(),
				created_at: new Date()
			};
			const result = await db.collection('admin_sessions').insertOne(session);
			return {
				...session,
				_id: result.insertedId
			};
		}
	}

	async findOne(query) {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			if (query.token) {
				const result = await pool.query(`
					SELECT s.*, a.username, a.id as admin_id
					FROM admin_sessions s
					LEFT JOIN admins a ON s.admin_id = a.id
					WHERE s.token = $1 AND s.is_active = true AND s.expires_at > NOW()
				`, [query.token]);
				return result.rows[0] || null;
			}
		} else {
			const db = getMongoDB();
			if (query.token) {
				const result = await db.collection('admin_sessions').aggregate([
					{
						$match: {
							token: query.token,
							isActive: true,
							expiresAt: { $gt: new Date() }
						}
					},
					{
						$lookup: {
							from: 'admins',
							localField: 'adminId',
							foreignField: '_id',
							as: 'admin'
						}
					},
					{
						$unwind: '$admin'
					}
				]).toArray();
				return result[0] || null;
			} else {
				return await db.collection('admin_sessions').findOne(query);
			}
		}
		return null;
	}

	async updateMany(query, update) {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			if (query.adminId && update.isActive === false) {
				const result = await pool.query(`
					UPDATE admin_sessions 
					SET is_active = false, updated_at = NOW() 
					WHERE admin_id = $1 AND is_active = true
				`, [query.adminId]);
				return result.rowCount;
			}
		} else {
			const db = getMongoDB();
			const mongoQuery = {};
			const mongoUpdate = {};

			if (query.adminId) {
				mongoQuery.adminId = new ObjectId(query.adminId);
			}
			if (query.isActive !== undefined) {
				mongoQuery.isActive = query.isActive;
			}

			if (update.isActive !== undefined) {
				mongoUpdate.$set = { 
					isActive: update.isActive,
					updated_at: new Date()
				};
			}

			const result = await db.collection('admin_sessions').updateMany(mongoQuery, mongoUpdate);
			return result.modifiedCount;
		}
	}

	async updateOne(query, update) {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			if (query.token && update.isActive === false) {
				const result = await pool.query(`
					UPDATE admin_sessions 
					SET is_active = false, updated_at = NOW() 
					WHERE token = $1
				`, [query.token]);
				return result.rowCount > 0;
			}
		} else {
			const db = getMongoDB();
			const mongoUpdate = {};
			if (update.isActive !== undefined) {
				mongoUpdate.$set = { 
					isActive: update.isActive,
					updated_at: new Date()
				};
			}

			const result = await db.collection('admin_sessions').updateOne(query, mongoUpdate);
			return result.modifiedCount > 0;
		}
	}

	// 静态方法，用于创建实例并调用方法
	static async create(sessionData) {
		const model = new SessionModel();
		return await model.save(sessionData);
	}

	static async findOne(query) {
		const model = new SessionModel();
		return await model.findOne(query);
	}

	static async updateMany(query, update) {
		const model = new SessionModel();
		return await model.updateMany(query, update);
	}

	static async updateOne(query, update) {
		const model = new SessionModel();
		return await model.updateOne(query, update);
	}

	static async findActiveSessions(adminId) {
		const model = new SessionModel();
		if (model.dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(`
				SELECT * FROM admin_sessions 
				WHERE admin_id = $1 AND is_active = true AND expires_at > NOW()
				ORDER BY created_at DESC
			`, [adminId]);
			return result.rows;
		} else {
			const db = getMongoDB();
			return await db.collection('admin_sessions').find({
				adminId: new ObjectId(adminId),
				isActive: true,
				expiresAt: { $gt: new Date() }
			}).sort({ created_at: -1 }).toArray();
		}
	}

	static async cleanupExpiredSessions() {
		const model = new SessionModel();
		if (model.dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(`
				UPDATE admin_sessions 
				SET is_active = false 
				WHERE expires_at <= NOW() AND is_active = true
			`);
			return result.rowCount;
		} else {
			const db = getMongoDB();
			const result = await db.collection('admin_sessions').updateMany({
				expiresAt: { $lte: new Date() },
				isActive: true
			}, {
				$set: { isActive: false }
			});
			return result.modifiedCount;
		}
	}
}