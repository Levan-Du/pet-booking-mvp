import { PgModel } from '../pg.model.js';

export class ServicePgModel extends PgModel {
  constructor() {
    super('services');
  }

  async findByType(type) {
    const pool = this.getPool();
    const result = await pool.query(
      `SELECT * FROM ${this.collectionName} WHERE type = $1`,
      [type]
    );
    return result.rows;
  }
}