import { MongoModel } from '../mongo.model.js'

class OperationLogModel extends MongoModel {
  constructor() {
    super('operation_logs')
  }

  get collection() {
    return this.getCollection()
  }

  async create(operationData) {
    const operationLog = {
      operation_type: operationData.operation_type,
      operator: operationData.operator,
      target_appointment_id: operationData.target_appointment_id,
      old_status: operationData.old_status,
      new_status: operationData.new_status,
      details: operationData.details,
      created_at: new Date(),
      updated_at: new Date()
    }

    return await this.getCollection().insertOne(operationLog)
  }

  async findByAppointmentId(appointmentId) {
    return await this.getCollection()
      .find({ target_appointment_id: appointmentId })
      .sort({ created_at: -1 })
      .toArray()
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const logs = await this.getCollection()
      .find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await this.getCollection().countDocuments()

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  async findByOperator(operator, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const logs = await this.getCollection()
      .find({ operator })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await this.getCollection().countDocuments({ operator })

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}

export default OperationLogModel