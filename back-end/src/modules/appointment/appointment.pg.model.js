import { PgModel } from '../pg.model.js';
import { APPOINTMENT_STATUS } from '../../shared/enums/appointment-status.js';

export class AppointmentPgModel extends PgModel {
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