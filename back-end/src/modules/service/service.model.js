import {
	getDBType
} from '../../core/database/database.config.js';
import { MongoModel } from '../mongo.model.js';
import { PgModel } from '../pg.model.js';

class ServiceMongoModel extends MongoModel {
	constructor() {
		super('services');
	}

	async findByType(type) {
		return await this.getCollection().find({
			type: type
		}).toArray();
	}
}

class ServicePgModel extends PgModel {
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

let ServiceModel = null;

export function getServiceModel() {
	if (ServiceModel) {
		return ServiceModel;
	}

	const dbType = getDBType();
	ServiceModel = dbType === 'postgres' ? new ServicePgModel() : new ServiceMongoModel();

	return ServiceModel;
}