import {
	BasePgModel
} from './base.pg.model.js';

export class ServicePgModel extends BasePgModel {
	constructor() {
		super('services');
	}

	async find(query = {}) {
		let sql = 'SELECT * FROM services';
		const params = [];

		if (query.is_active !== undefined) {
			sql += ' WHERE is_active = $1';
			params.push(query.is_active);
		}

		sql += ' ORDER BY name';

		const result = await this.getPool().query(sql, params);
		return result.rows;
	}
}