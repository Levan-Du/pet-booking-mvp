import { MongoModel } from '../mongo.model.js';
import { ObjectId } from 'mongodb';
import { APPOINTMENT_STATUS } from '../../shared/enums/appointment-status.js';

export class AppointmentMongoModel extends MongoModel {
  constructor() {
    super('appointments');
  }

  async findByUserId(userId) {
    let objectId;
    try {
      objectId = new ObjectId(userId);
    } catch (error) {
      return [];
    }
    return await this.getCollection().find({
      user_id: objectId
    }).toArray();
  }

  async findByNo(docNo) {
    return await this.getCollection().findOne({
      appointment_no: docNo
    });
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

    const matchStage = { ...query };

    // 处理日期范围查询
    if (query.appointment_date && typeof query.appointment_date === 'object' &&
      query.appointment_date.$gte && query.appointment_date.$lte) {
      // 日期范围查询
      matchStage.appointment_date = {
        $gte: new Date(query.appointment_date.$gte),
        $lte: new Date(query.appointment_date.$lte)
      };
    } else if (query.appointment_date) {
      // 单日查询
      matchStage.appointment_date = query.appointment_date;
    }

    console.log('appointment.mongo.model.js -> find -> matchStage', matchStage)

    if (query.status) {
      matchStage.status = query.status;
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({
        $match: matchStage
      });
    }

    pipeline.push({
      $project: {
        _id: 1,
        appointment_no: 1,
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

    const arr = await this.getCollection().aggregate(pipeline).toArray();
    // console.log('appointment.mongo.model.js -> find -> arr', arr)
    return arr;
  }

  async checkTimeConflict(appointment_date, appointment_time, end_time, excludeId = null) {
    const query = {
      appointment_date,
      status: {
        $ne: APPOINTMENT_STATUS.CANCELLED
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
        excludeObjectId = this.getObjectId(excludeId);
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