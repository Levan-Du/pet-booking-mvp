import {
	BasePgModel
} from './base.pg.model.js';

export class AppointmentPgModel extends BasePgModel {
	constructor() {
		super('appointments');
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

	async findById(id) {
		const pool = this.getPool();
		const result = await pool.query(
			`SELECT a.*, s.name as service_name, s.duration, s.price 
       FROM appointments a 
       LEFT JOIN services s ON a.service_id = s.id 
       WHERE a.id = $1`,
			[id]
		);
		return result.rows[0] || null;
	}

	async create(data) {
		const pool = this.getPool();
		const {
			customer_name,
			customer_phone,
			pet_type,
			pet_breed,
			pet_size,
			special_notes,
			service_id,
			appointment_date,
			appointment_time,
			end_time,
			status = 'pending'
		} = data;

		const result = await pool.query(
			`INSERT INTO appointments (
        customer_name, customer_phone, pet_type, pet_breed, pet_size,
        special_notes, service_id, appointment_date, appointment_time, end_time, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
			[
				customer_name,
				customer_phone,
				pet_type,
				pet_breed,
				pet_size,
				special_notes,
				service_id,
				appointment_date,
				appointment_time,
				end_time,
				status
			]
		);

		return result.rows[0];
	}

	async checkTimeConflict(appointment_date, appointment_time, end_time, excludeId = null) {
		const pool = this.getPool();
		let sql = `
      SELECT id FROM appointments 
      WHERE appointment_date = $1 
      AND NOT (end_time <= $2 OR appointment_time >= $3)
      AND status != 'cancelled'
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