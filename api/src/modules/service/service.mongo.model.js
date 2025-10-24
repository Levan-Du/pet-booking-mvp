import { MongoModel } from '../mongo.model.js';

export class ServiceMongoModel extends MongoModel {
  constructor() {
    super('services');
  }

  async findByType(type) {
    return await this.getCollection().find({
      type: type
    }).toArray();
  }
}