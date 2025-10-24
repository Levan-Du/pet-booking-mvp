import { MongoModel } from '../mongo.model.js';
import { APPOINTMENT_STATUS } from '../../shared/enums/appointment-status.js';

export class AdminMongoModel extends MongoModel {
  constructor() {
    super('admins');
  }

  async findByUsername(username) {
    return await this.getCollection().findOne({
      username: username
    });
  }

  async updatePassword(id, newPasswordHash) {
    const result = await this.getCollection().updateOne(
      { _id: this.getObjectId(id) },
      {
        $set: {
          password_hash: newPasswordHash,
          updated_at: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  async getStats() {
    const db = this.getCollection();
    const today = new Date().toISOString().split('T')[0];

    const todayAppointments = await db.countDocuments({
      appointment_date: today
    });

    const totalAppointments = await db.countDocuments();

    const pendingAppointments = await db.countDocuments({
      status: APPOINTMENT_STATUS.PENDING,
      appointment_date: { $gte: today }
    });

    const activeServices = await db.countDocuments({
      is_active: true
    });

    return {
      todayAppointments,
      totalAppointments,
      pendingAppointments,
      activeServices
    };
  }

  async updateAccessToken(adminId, token) {
    const result = await this.getCollection().updateOne(
      { _id: this.getObjectId(adminId) },
      {
        $set: {
          access_token: token,
          updated_at: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }
}