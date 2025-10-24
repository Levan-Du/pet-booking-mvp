import { getDBType } from '../../core/database/database.config.js';
import OperationLogMongoModel from './operation-log.mongo.model.js';
import { OperationLogPgModel } from './operation-log.pg.model.js';

class OperationLogModel {
  constructor() {
    this.dbType = getDBType();
    this.model = this.dbType === 'postgres' 
      ? new OperationLogPgModel() 
      : new OperationLogMongoModel();
  }

  async create(operationData) {
    return await this.model.create(operationData);
  }

  async findByAppointmentId(appointmentId) {
    return await this.model.findByAppointmentId(appointmentId);
  }

  async findAll(page = 1, limit = 20) {
    return await this.model.findAll(page, limit);
  }

  async findByOperator(operator, page = 1, limit = 20) {
    return await this.model.findByOperator(operator, page, limit);
  }
}

export default OperationLogModel;