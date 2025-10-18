import { PgModel } from '../pg.model.js';

export class AuthPgModel extends PgModel {
  constructor() {
    super('admin_sessions');
  }

  async validateAdminCredentials(username, passwordHash) {
    const pool = this.getPool();
    const result = await pool.query(
      'SELECT id, username FROM admins WHERE username = $1 AND password_hash = $2',
      [username, passwordHash]
    );
    return result.rows[0] || null;
  }

  async getAdminById(id) {
    const pool = this.getPool();
    const result = await pool.query(
      'SELECT id, username, created_at FROM admins WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async createSession(adminId, token, expiresAt) {
    const pool = this.getPool();
    const result = await pool.query(
      `INSERT INTO ${this.collectionName} (admin_id, token, expires_at) 
       VALUES ($1, $2, $3) RETURNING *`,
      [adminId, token, expiresAt]
    );
    return result.rows[0];
  }

  async getSessionByToken(token) {
    const pool = this.getPool();
    const result = await pool.query(
      `SELECT s.*, a.username 
       FROM ${this.collectionName} s 
       JOIN admins a ON s.admin_id = a.id 
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );
    return result.rows[0] || null;
  }

  async deleteSession(token) {
    const pool = this.getPool();
    const result = await pool.query(
      `DELETE FROM ${this.collectionName} WHERE token = $1`,
      [token]
    );
    return result.rowCount > 0;
  }

  async cleanupExpiredSessions() {
    const pool = this.getPool();
    const result = await pool.query(
      `DELETE FROM ${this.collectionName} WHERE expires_at <= NOW()`
    );
    return result.rowCount;
  }
}