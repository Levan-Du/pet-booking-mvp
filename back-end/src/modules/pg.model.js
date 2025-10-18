import { getPostgresPool } from '../core/database/postgres.config.js';
import { BaseModel } from './base.model.js';

export class PgModel extends BaseModel {
	getPool() {
		return getPostgresPool();
	}

	async find(query = {}) {
		const pool = this.getPool();
		let sql = `SELECT * FROM ${this.collectionName}`;
		const params = [];
		let paramCount = 1;

		const conditions = [];
		Object.keys(query).forEach(key => {
			conditions.push(`${key} = $${paramCount}`);
			params.push(query[key]);
			paramCount++;
		});

		if (conditions.length > 0) {
			sql += ` WHERE ${conditions.join(' AND ')}`;
		}

		const result = await pool.query(sql, params);
		return result.rows;
	}

	async findById(id) {
		const pool = this.getPool();
		const result = await pool.query(
			`SELECT * FROM ${this.collectionName} WHERE id = $1`,
			[id]
		);
		return result.rows[0] || null;
	}

	async create(data) {
		const pool = this.getPool();
		const fields = Object.keys(data);
		const values = Object.values(data);
		const placeholders = fields.map((_, index) => `$${index + 1}`);

		const sql = `
      INSERT INTO ${this.collectionName} (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;

		const result = await pool.query(sql, values);
		return result.rows[0];
	}

	async update(id, data) {
		const pool = this.getPool();
		const fields = [];
		const values = [];
		let paramCount = 1;

		Object.keys(data).forEach(key => {
			if (data[key] !== undefined) {
				fields.push(`${key} = $${paramCount}`);
				values.push(data[key]);
				paramCount++;
			}
		});

		if (fields.length === 0) {
			throw new Error('No fields to update');
		}

		values.push(id);
		const sql = `UPDATE ${this.collectionName} SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;

		const result = await pool.query(sql, values);
		return result.rows[0] || null;
	}

	async delete(id) {
		const pool = this.getPool();
		const result = await pool.query(
			`DELETE FROM ${this.collectionName} WHERE id = $1 RETURNING *`,
			[id]
		);
		return result.rows.length > 0;
	}
}