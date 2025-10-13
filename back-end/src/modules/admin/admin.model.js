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

export class AdminModel {
	constructor() {
		this.dbType = getDBType();
	}

	async findByUsername(username) {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(
				'SELECT * FROM admins WHERE username = $1',
				[username]
			);
			return result.rows[0] || null;
		} else {
			const db = getMongoDB();
			return await db.collection('admins').findOne({
				username
			});
		}
	}

	async findById(id) {
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

	async updatePassword(id, newPasswordHash) {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(
				'UPDATE admins SET password_hash = $1 WHERE id = $2 RETURNING id',
				[newPasswordHash, id]
			);
			return result.rows.length > 0;
		} else {
			const db = getMongoDB();
			const result = await db.collection('admins').updateOne({
				_id: new ObjectId(id)
			}, {
				$set: {
					password_hash: newPasswordHash,
					updated_at: new Date()
				}
			});
			return result.modifiedCount > 0;
		}
	}

	async create(adminData) {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();
			const {
				username,
				password_hash
			} = adminData;
			const result = await pool.query(
				'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING *',
				[username, password_hash]
			);
			return result.rows[0];
		} else {
			const db = getMongoDB();
			const admin = {
				...adminData,
				created_at: new Date()
			};
			const result = await db.collection('admins').insertOne(admin);
			return {
				...admin,
				_id: result.insertedId
			};
		}
	}

	async getStats() {
		if (this.dbType === 'postgres') {
			const pool = getPostgresPool();

			const todayResult = await pool.query(
				`SELECT COUNT(*) as count FROM appointments 
         WHERE appointment_date = CURRENT_DATE`
			);

			const totalResult = await pool.query(
				'SELECT COUNT(*) as count FROM appointments'
			);

			const pendingResult = await pool.query(
				`SELECT COUNT(*) as count FROM appointments 
         WHERE status = 'pending' AND appointment_date >= CURRENT_DATE`
			);

			const servicesResult = await pool.query(
				'SELECT COUNT(*) as count FROM services WHERE is_active = true'
			);

			return {
				todayAppointments: parseInt(todayResult.rows[0].count),
				totalAppointments: parseInt(totalResult.rows[0].count),
				pendingAppointments: parseInt(pendingResult.rows[0].count),
				activeServices: parseInt(servicesResult.rows[0].count)
			};
		} else {
			const db = getMongoDB();
			const today = new Date().toISOString().split('T')[0];

			const todayAppointments = await db.collection('appointments').countDocuments({
				appointment_date: today
			});

			const totalAppointments = await db.collection('appointments').countDocuments();

			const pendingAppointments = await db.collection('appointments').countDocuments({
				status: 'pending',
				appointment_date: {
					$gte: today
				}
			});

			const activeServices = await db.collection('services').countDocuments({
				is_active: true
			});

			return {
				todayAppointments,
				totalAppointments,
				pendingAppointments,
				activeServices
			};
		}
	}
}