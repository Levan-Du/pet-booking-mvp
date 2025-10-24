import { PgModel } from '../pg.model.js';
import { APPOINTMENT_STATUS } from '../../shared/enums/appointment-status.js';

export class AdminPgModel extends PgModel {
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