import { getServiceModel } from '../model.factory.js';

export class ServiceService {
	constructor() {
		this.serviceModel = getServiceModel();
	}

	async getAllServices(activeOnly = true) {
		const query = activeOnly ? {
			is_active: true
		} : {};
		return await this.serviceModel.find(query);
	}

	async getServiceById(id) {
		return await this.serviceModel.findById(id);
	}

	async createService(serviceData) {
		return await this.serviceModel.create(serviceData);
	}

	async updateService(id, serviceData) {
		return await this.serviceModel.update(id, serviceData);
	}

	async deleteService(id) {
		return await this.serviceModel.delete(id);
	}
}