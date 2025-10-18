import { getDBType } from '../../core/database/database.config.js';
import { MongoModel } from '../mongo.model.js';
import { PgModel } from '../pg.model.js';

class AdminMongoModel extends MongoModel {
	constructor() {
		super('admins');
	}

	async findByUsername(username) {
		return await this.getCollection().findOne({
			username: username
		});
	}

	async updatePassword(id, newPasswordHash) {
		const result = await this.getCollection().updateOne(
			{ _id: this.getObjectId(id) },
			{ 
				$set: { 
					password_hash: newPasswordHash,
					updated_at: new Date()
				}
			}
		);
		return result.modifiedCount > 0;
	}

	async getStats() {
		const db = this.getCollection();
		const today = new Date().toISOString().split('T')[0];

		const todayAppointments = await db.countDocuments({
			appointment_date: today
		});

		const totalAppointments = await db.countDocuments();

		const pendingAppointments = await db.countDocuments({
			status: APPOINTMENT_STATUS.PENDING,
			appointment_date: { $gte: today }
		});

		const activeServices = await db.countDocuments({
			is_active: true
		});

		return {
			todayAppointments,
			totalAppointments,
			pendingAppointments,
			activeServices
		};
	}

	async updateAccessToken(adminId, token) {
		const result = await this.getCollection().updateOne(
			{ _id: this.getObjectId(adminId) },
			{ 
				$set: { 
					access_token: token,
					updated_at: new Date()
				}
			}
		);
		return result.modifiedCount > 0;
	}
}

class AdminPgModel extends PgModel {
	constructor() {
		super('admins');
	}

	async findByUsername(username) {
		const pool = this.getPool();
		const result = await pool.query(
			`SELECT * FROM ${this.collectionName} WHERE username = $1`,
			[username]
		);
		return result.rows[0] || null;
	}

	async updatePassword(id, newPasswordHash) {
		const pool = this.getPool();
		const result = await pool.query(
			`UPDATE ${this.collectionName} SET password_hash = $1 WHERE id = $2 RETURNING id`,
			[newPasswordHash, id]
		);
		return result.rows.length > 0;
	}

	async getStats() {
		const pool = this.getPool();

		const todayResult = await pool.query(
			`SELECT COUNT(*) as count FROM appointments 
			 WHERE appointment_date = CURRENT_DATE`
		);

		const totalResult = await pool.query(
			'SELECT COUNT(*) as count FROM appointments'
		);

		const pendingResult = await pool.query(
			`SELECT COUNT(*) as count FROM appointments 
			 WHERE status = '${APPOINTMENT_STATUS.PENDING}' AND appointment_date >= CURRENT_DATE`
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
	}

	async updateAccessToken(adminId, token) {
		const pool = this.getPool();
		const result = await pool.query(
			`UPDATE ${this.collectionName} SET access_token = $1 WHERE id = $2 RETURNING id`,
			[token, adminId]
		);
		return result.rows.length > 0;
	}
}

let AdminModel = null;

export function getAdminModel() {
  if (AdminModel) {
    return AdminModel;
  }

  const dbType = getDBType();
  AdminModel = dbType === 'postgres' ? new AdminPgModel() : new AdminMongoModel();

  return AdminModel;
}