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

export class AuthModel {
	constructor() {
		this.dbType = getDBType();
	}

	async validateAdminCredentials(username, passwordHash) {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(
				'SELECT id, username FROM admins WHERE username = $1 AND password_hash = $2',
				[username, passwordHash]
			);
			return result.rows[0] || null;
		} else {
			const db = getMongoDB();
			return await db.collection('admins').findOne({
				username,
				password_hash: passwordHash
			}, {
				projection: {
					password_hash: 0
				}
			});
		}
	}

	async getAdminById(id) {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(
				'SELECT id, username, created_at FROM admins WHERE id = $1',
				[id]
			);
			return result.rows[0] || null;
		} else {
			const db = getMongoDB();
			return await db.collection('admins').findOne({
				_id: new ObjectId(id)
			}, {
				projection: {
					password_hash: 0
				}
			});
		}
	}

	async createSession(adminId, token, expiresAt) {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(
				`INSERT INTO admin_sessions (admin_id, token, expires_at) 
         VALUES ($1, $2, $3) RETURNING *`,
				[adminId, token, expiresAt]
			);
			return result.rows[0];
		} else {
			const db = getMongoDB();
			const session = {
				admin_id: new ObjectId(adminId),
				token,
				expires_at: expiresAt,
				created_at: new Date()
			};
			const result = await db.collection('admin_sessions').insertOne(session);
			return {
				...session,
				_id: result.insertedId
			};
		}
	}

	async getSessionByToken(token) {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(
				`SELECT s.*, a.username 
         FROM admin_sessions s 
         JOIN admins a ON s.admin_id = a.id 
         WHERE s.token = $1 AND s.expires_at > NOW()`,
				[token]
			);
			return result.rows[0] || null;
		} else {
			const db = getMongoDB();
			return await db.collection('admin_sessions').aggregate([{
					$match: {
						token,
						expires_at: {
							$gt: new Date()
						}
					}
				},
				{
					$lookup: {
						from: 'admins',
						localField: 'admin_id',
						foreignField: '_id',
						as: 'admin'
					}
				},
				{
					$unwind: '$admin'
				},
				{
					$project: {
						_id: 1,
						token: 1,
						expires_at: 1,
						created_at: 1,
						admin_id: 1,
						username: '$admin.username'
					}
				}
			]).next();
		}
	}

	async deleteSession(token) {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(
				'DELETE FROM admin_sessions WHERE token = $1',
				[token]
			);
			return result.rowCount > 0;
		} else {
			const db = getMongoDB();
			const result = await db.collection('admin_sessions').deleteOne({
				token
			});
			return result.deletedCount > 0;
		}
	}

	async cleanupExpiredSessions() {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(
				'DELETE FROM admin_sessions WHERE expires_at <= NOW()'
			);
			return result.rowCount;
		} else {
			const db = getMongoDB();
			const result = await db.collection('admin_sessions').deleteMany({
				expires_at: {
					$lte: new Date()
				}
			});
			return result.deletedCount;
		}
	}
}