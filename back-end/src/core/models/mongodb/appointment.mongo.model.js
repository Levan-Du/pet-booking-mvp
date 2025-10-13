import {
	BaseMongoModel
} from './base.mongo.model.js';
import {
	ObjectId
} from 'mongodb';

export class AppointmentMongoModel extends BaseMongoModel {
	constructor() {
		super('appointments');
	}

	async find(query = {}) {
		const pipeline = [{
				$lookup: {
					from: 'services',
					localField: 'service_id',
					foreignField: '_id',
					as: 'service'
				}
			},
			{
				$unwind: {
					path: '$service',
					preserveNullAndEmptyArrays: true
				}
			}
		];

		const matchStage = {};
		if (query.status) {
			matchStage.status = query.status;
		}
		if (query.appointment_date) {
			matchStage.appointment_date = query.appointment_date;
		}

		if (Object.keys(matchStage).length > 0) {
			pipeline.push({
				$match: matchStage
			});
		}

		pipeline.push({
			$project: {
				_id: 1,
				customer_name: 1,
				customer_phone: 1,
				pet_type: 1,
				pet_breed: 1,
				pet_size: 1,
				special_notes: 1,
				service_id: 1,
				appointment_date: 1,
				appointment_time: 1,
				end_time: 1,
				status: 1,
				created_at: 1,
				service_name: '$service.name',
				duration: '$service.duration',
				price: '$service.price'
			}
		});

		pipeline.push({
			$sort: {
				appointment_date: -1,
				appointment_time: -1
			}
		});

		return await this.getCollection().aggregate(pipeline).toArray();
	}

	async findById(id) {
		let objectId;
		try {
			objectId = new ObjectId(id);
		} catch (error) {
			return null;
		}

		const result = await this.getCollection().aggregate([{
				$match: {
					_id: objectId
				}
			},
			{
				$lookup: {
					from: 'services',
					localField: 'service_id',
					foreignField: '_id',
					as: 'service'
				}
			},
			{
				$unwind: {
					path: '$service',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$project: {
					_id: 1,
					customer_name: 1,
					customer_phone: 1,
					pet_type: 1,
					pet_breed: 1,
					pet_size: 1,
					special_notes: 1,
					service_id: 1,
					appointment_date: 1,
					appointment_time: 1,
					end_time: 1,
					status: 1,
					created_at: 1,
					service_name: '$service.name',
					duration: '$service.duration',
					price: '$service.price'
				}
			}
		]).toArray();

		return result[0] || null;
	}

	async create(data) {
		const {
			service_id,
			...rest
		} = data;

		let serviceObjectId;
		try {
			serviceObjectId = new ObjectId(service_id);
		} catch (error) {
			throw new Error('服务ID格式不正确');
		}

		const appointment = {
			...rest,
			service_id: serviceObjectId,
			status: 'pending',
			created_at: new Date()
		};

		const result = await this.getCollection().insertOne(appointment);
		return {
			...appointment,
			_id: result.insertedId
		};
	}

	async checkTimeConflict(appointment_date, appointment_time, end_time, excludeId = null) {
		const query = {
			appointment_date,
			status: {
				$ne: 'cancelled'
			},
			$nor: [{
					end_time: {
						$lte: appointment_time
					}
				},
				{
					appointment_time: {
						$gte: end_time
					}
				}
			]
		};

		if (excludeId) {
			let excludeObjectId;
			try {
				excludeObjectId = new ObjectId(excludeId);
				query._id = {
					$ne: excludeObjectId
				};
			} catch (error) {
				// 如果 excludeId 格式无效，忽略它
			}
		}

		const conflict = await this.getCollection().findOne(query);
		return conflict !== null;
	}
}