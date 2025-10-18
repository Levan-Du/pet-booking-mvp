import {
	getDBType
} from '../../core/database/database.config.js';
import { MongoModel } from '../mongo.model.js';
import { PgModel } from '../pg.model.js';
import { ObjectId } from 'mongodb';
import { APPOINTMENT_STATUS } from '../../shared/enums/appointment-status.js';

class AppointmentMongoModel extends MongoModel {
	constructor() {
		super('appointments');
	}

	async findByUserId(userId) {
		let objectId;
		try {
			objectId = new ObjectId(userId);
		} catch (error) {
			return [];
		}
		return await this.getCollection().find({
			user_id: objectId
		}).toArray();
	}

	async find(query = {}) {
		const pipeline = [{
				$lookup: {
					from: 'services',
					localField: 'service_id',
					foreignField: '_id',
					as: 'service'
				}
			},
			{
				$unwind: {
					path: '$service',
					preserveNullAndEmptyArrays: true
				}
			}
		];

		const matchStage = {};
		if (query.status) {
			matchStage.status = query.status;
		}
		if (query.appointment_date) {
			matchStage.appointment_date = query.appointment_date;
		}

		if (Object.keys(matchStage).length > 0) {
			pipeline.push({
				$match: matchStage
			});
		}

		pipeline.push({
			$project: {
				_id: 1,
				customer_name: 1,
				customer_phone: 1,
				pet_type: 1,
				pet_breed: 1,
				pet_size: 1,
				special_notes: 1,
				service_id: 1,
				appointment_date: 1,
				appointment_time: 1,
				end_time: 1,
				status: 1,
				created_at: 1,
				service_name: '$service.name',
				duration: '$service.duration',
				price: '$service.price'
			}
		});

		pipeline.push({
			$sort: {
				appointment_date: -1,
				appointment_time: -1
			}
		});

		return await this.getCollection().aggregate(pipeline).toArray();
	}

	async checkTimeConflict(appointment_date, appointment_time, end_time, excludeId = null) {
		const query = {
			appointment_date,
			status: {
				$ne: APPOINTMENT_STATUS.CANCELLED
			},
			$nor: [{
					end_time: {
						$lte: appointment_time
					}
				},
				{
					appointment_time: {
						$gte: end_time
					}
				}
			]
		};

		if (excludeId) {
			let excludeObjectId;
			try {
				excludeObjectId = this.getObjectId(excludeId);
				query._id = {
					$ne: excludeObjectId
				};
			} catch (error) {
				// 如果 excludeId 格式无效，忽略它
			}
		}

		const conflict = await this.getCollection().findOne(query);
		return conflict !== null;
	}
}

class AppointmentPgModel extends PgModel {
	constructor() {
		super('appointments');
	}

	async findByUserId(userId) {
		const pool = this.getPool();
		const result = await pool.query(
			`SELECT * FROM ${this.collectionName} WHERE user_id = $1`,
			[userId]
		);
		return result.rows;
	}

	async find(query = {}) {
		const pool = this.getPool();
		let sql = `
      SELECT a.*, s.name as service_name, s.duration, s.price
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
    `;

		const params = [];
		const conditions = [];
		let paramCount = 1;

		if (query.status) {
			conditions.push(`a.status = $${paramCount}`);
			params.push(query.status);
			paramCount++;
		}

		if (query.appointment_date) {
			conditions.push(`a.appointment_date = $${paramCount}`);
			params.push(query.appointment_date);
			paramCount++;
		}

		if (conditions.length > 0) {
			sql += ` WHERE ${conditions.join(' AND ')}`;
		}

		sql += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

		const result = await pool.query(sql, params);
		return result.rows;
	}

	async checkTimeConflict(appointment_date, appointment_time, end_time, excludeId = null) {
		const pool = this.getPool();
		let sql = `
      SELECT id FROM appointments 
      WHERE appointment_date = $1 
      AND NOT (end_time <= $2 OR appointment_time >= $3)
      AND status != '${APPOINTMENT_STATUS.CANCELLED}'
    `;

		const params = [appointment_date, appointment_time, end_time];

		if (excludeId) {
			sql += ` AND id != $4`;
			params.push(excludeId);
		}

		const result = await pool.query(sql, params);
		return result.rows.length > 0;
	}
}

let AppointmentModel = null;

export function getAppointmentModel() {
	if (AppointmentModel) {
		return AppointmentModel;
	}

	const dbType = getDBType();
	AppointmentModel = dbType === 'postgres' ? new AppointmentPgModel() : new AppointmentMongoModel();

	return AppointmentModel;
}