import { getDBType } from '../core/database/database.config.js';
import { AdminMongoModel } from './admin/admin.mongo.model.js';
import { AdminPgModel } from './admin/admin.pg.model.js';
import { AuthMongoModel } from './auth/auth.mongo.model.js';
import { AuthPgModel } from './auth/auth.pg.model.js';
import { AppointmentMongoModel } from './appointment/appointment.mongo.model.js';
import { AppointmentPgModel } from './appointment/appointment.pg.model.js';
import { ServiceMongoModel } from './service/service.mongo.model.js';
import { ServicePgModel } from './service/service.pg.model.js';

class ModelFactory {
  constructor() {
    this.dbType = getDBType();
    this.models = new Map();
  }

  getAdminModel() {
    if (!this.models.has('admin')) {
      const model = this.dbType === 'postgres' ? new AdminPgModel() : new AdminMongoModel();
      this.models.set('admin', model);
    }
    return this.models.get('admin');
  }

  getAuthModel() {
    if (!this.models.has('auth')) {
      const model = this.dbType === 'postgres' ? new AuthPgModel() : new AuthMongoModel();
      this.models.set('auth', model);
    }
    return this.models.get('auth');
  }

  getAppointmentModel() {
    if (!this.models.has('appointment')) {
      const model = this.dbType === 'postgres' ? new AppointmentPgModel() : new AppointmentMongoModel();
      this.models.set('appointment', model);
    }
    return this.models.get('appointment');
  }

  getServiceModel() {
    if (!this.models.has('service')) {
      const model = this.dbType === 'postgres' ? new ServicePgModel() : new ServiceMongoModel();
      this.models.set('service', model);
    }
    return this.models.get('service');
  }
}

// 创建单例实例
const modelFactory = new ModelFactory();

// 导出工厂实例和各个方法
export default modelFactory;
export const getAdminModel = () => modelFactory.getAdminModel();
export const getAuthModel = () => modelFactory.getAuthModel();
export const getAppointmentModel = () => modelFactory.getAppointmentModel();
export const getServiceModel = () => modelFactory.getServiceModel();