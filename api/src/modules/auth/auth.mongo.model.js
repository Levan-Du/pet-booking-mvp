import { MongoModel } from '../mongo.model.js';

export class AuthMongoModel extends MongoModel {
  constructor() {
    super('admin_sessions');
  }

  async validateAdminCredentials(username, passwordHash) {
    const db = this.getCollection();
    return await db.findOne({
      username,
      password_hash: passwordHash
    }, {
      projection: { password_hash: 0 }
    });
  }

  async getAdminById(id) {
    const db = this.getCollection();
    return await db.findOne({
      _id: this.getObjectId(id)
    }, {
      projection: { password_hash: 0 }
    });
  }

  async createSession(adminId, token, expiresAt) {
    const db = this.getCollection();
    const session = {
      admin_id: this.getObjectId(adminId),
      token,
      expires_at: expiresAt,
      created_at: new Date()
    };
    const result = await db.insertOne(session);
    return {
      ...session,
      _id: result.insertedId
    };
  }

  async getSessionByToken(token) {
    const db = this.getCollection();
    return await db.aggregate([
      {
        $match: {
          token,
          expires_at: { $gt: new Date() }
        }
      },
      {
        $lookup: {
          from: 'admins',
          localField: 'admin_id',
          foreignField: '_id',
          as: 'admin'
        }
      },
      {
        $unwind: '$admin'
      },
      {
        $project: {
          _id: 1,
          token: 1,
          expires_at: 1,
          created_at: 1,
          admin_id: 1,
          username: '$admin.username'
        }
      }
    ]).next();
  }

  async deleteSession(token) {
    const db = this.getCollection();
    const result = await db.deleteOne({ token });
    return result.deletedCount > 0;
  }

  async cleanupExpiredSessions() {
    const db = this.getCollection();
    const result = await db.deleteMany({
      expires_at: { $lte: new Date() }
    });
    return result.deletedCount;
  }
}