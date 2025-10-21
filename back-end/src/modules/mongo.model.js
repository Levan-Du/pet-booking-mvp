import { getMongoDB } from '../core/database/mongodb.config.js';
import { ObjectId } from 'mongodb';
import { BaseModel } from './base.model.js';

export class MongoModel extends BaseModel {
	getCollection() {
		return getMongoDB().collection(this.collectionName);
	}

	getObjectId(id) {
		try {
			return new ObjectId(id);
		} catch (error) {
			throw new Error('Invalid ObjectId format');
		}
	}

	async find(query = {}) {
		return await this.getCollection().find(query).toArray();
	}

	async findById(id) {
		let objectId;
		try {
			objectId = this.getObjectId(id);
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
			objectId = this.getObjectId(id);
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
			objectId = this.getObjectId(id);
		} catch (error) {
			return false;
		}

		const result = await this.getCollection().deleteOne({
			_id: objectId
		});
		return result.deletedCount > 0;
	}
}