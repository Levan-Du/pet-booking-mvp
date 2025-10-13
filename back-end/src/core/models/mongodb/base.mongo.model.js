import {
	getMongoDB
} from '../../../core/database/mongodb.config.js';
import {
	BaseModel
} from '../base.model.js';
import {
	ObjectId
} from 'mongodb';

export class BaseMongoModel extends BaseModel {
	constructor(collectionName) {
		super(collectionName);
	}

	getCollection() {
		return getMongoDB().collection(this.collectionName);
	}

	async find(query = {}) {
		return await this.getCollection().find(query).toArray();
	}

	async findById(id) {
		let objectId;
		try {
			objectId = new ObjectId(id);
		} catch (error) {
			return null;
		}
		return await this.getCollection().findOne({
			_id: objectId
		});
	}

	async create(data) {
		const entity = {
			...data,
			created_at: new Date()
		};

		const result = await this.getCollection().insertOne(entity);
		return {
			...entity,
			_id: result.insertedId
		};
	}

	async update(id, data) {
		let objectId;
		try {
			objectId = new ObjectId(id);
		} catch (error) {
			return null;
		}

		const result = await this.getCollection().findOneAndUpdate({
			_id: objectId
		}, {
			$set: {
				...data,
				updated_at: new Date()
			}
		}, {
			returnDocument: 'after'
		});

		return result;
	}

	async delete(id) {
		let objectId;
		try {
			objectId = new ObjectId(id);
		} catch (error) {
			return false;
		}

		const result = await this.getCollection().deleteOne({
			_id: objectId
		});
		return result.deletedCount > 0;
	}
}