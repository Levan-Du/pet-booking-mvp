import {
	ServiceService
} from './service.service.js';
import { BaseController } from '../base.controller.js';
import { serviceValidation } from './service.validation.js';

const serviceService = new ServiceService();

export class ServiceController extends BaseController {
	constructor() {
		super(serviceValidation, 'services')
	}

	buildRouteMap() {
		return {
			...super.buildRouteMap()
		}
	}

	async getAll(req, res, next) {
		try {
			const activeOnly = req.query.active !== 'false';
			const services = await serviceService.getAllServices(activeOnly);

			res.json({
				success: true,
				data: services
			});
		} catch (error) {
			next(error);
		}
	}

	async getById(req, res, next) {
		try {
			const {
				id
			} = req.params;
			const service = await serviceService.getServiceById(id);

			if (!service) {
				return res.status(404).json({
					success: false,
					message: '服务不存在'
				});
			}

			res.json({
				success: true,
				data: service
			});
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			const serviceData = req.validatedData;
			const newService = await serviceService.createService(serviceData);

			res.status(201).json({
				success: true,
				message: '服务创建成功',
				data: newService
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req, res, next) {
		try {
			const {
				id
			} = req.params;
			const serviceData = req.validatedData;

			const existingService = await serviceService.getServiceById(id);
			if (!existingService) {
				return res.status(404).json({
					success: false,
					message: '服务不存在'
				});
			}

			const updatedService = await serviceService.updateService(id, serviceData);

			res.json({
				success: true,
				message: '服务更新成功',
				data: updatedService
			});
		} catch (error) {
			next(error);
		}
	}

	async delete(req, res, next) {
		try {
			const {
				id
			} = req.params;

			const existingService = await serviceService.getServiceById(id);
			if (!existingService) {
				return res.status(404).json({
					success: false,
					message: '服务不存在'
				});
			}

			await serviceService.deleteService(id);

			res.json({
				success: true,
				message: '服务删除成功'
			});
		} catch (error) {
			next(error);
		}
	}
}