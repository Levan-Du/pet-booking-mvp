import {
	BaseMongoModel
} from './base.mongo.model.js';

export class ServiceMongoModel extends BaseMongoModel {
	constructor() {
		super('services');
	}

	async find(query = {}) {
		return await this.getCollection().find(query).sort({
			name: 1
		}).toArray();
	}
}