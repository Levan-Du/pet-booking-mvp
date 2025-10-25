import { AppointmentService } from './appointment.service.js';
// import webSocketServer from '../../core/websocket/websocket.server.js';
import { appointmentValidation } from './appointment.validation.js';
import { BaseController } from '../base.controller.js';

const appointmentService = new AppointmentService();

export class AppointmentController extends BaseController {
	constructor() {
		super(appointmentValidation, 'appointments')
	}

	buildRouteMap() {
		return {
			...super.buildRouteMap(),
			'GET:/available-slots': {
				handler: this.getAvailableSlots?.bind(this),
				middlewares: [] // 需要认证
			},
			'GET:/today': {
				handler: this.getToday?.bind(this),
				middlewares: [this.authenticateAdminToken] // 需要认证
			},
			'GET:/stats/today': {
				handler: this.getTodayStats?.bind(this),
				middlewares: [this.authenticateAdminToken]
			},
			'GET:/new': {
				handler: this.getNew?.bind(this),
				middlewares: [this.authenticateAdminToken]
			},
			'PUT:/:id/status': {
				handler: this.updateStatus?.bind(this),
				middlewares: [this.validateRequest(appointmentValidation.updateStatus), this.authenticateAdminToken]
			}
		};
	}

	async getAvailableSlots(req, res, next) {
		try {
			const {
				date,
				serviceId
			} = req.query;

			if (!date || !serviceId) {
				return res.status(400).json({
					success: false,
					message: '日期和服务ID为必填项'
				});
			}

			const availableSlots = await appointmentService.getAvailableSlots(date, serviceId);

			res.json({
				success: true,
				data: availableSlots
			});
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			const appointmentData = req.validatedData;
			const newAppointment = await appointmentService.createAppointment(appointmentData);

			// 推送WebSocket更新
			// webSocketServer.notifyAppointmentChange(newAppointment);

			res.status(201).json({
				success: true,
				message: '预约成功',
				data: newAppointment
			});
		} catch (error) {
			if (error.message.includes('时段已被预约') || error.message.includes('服务不存在')) {
				return res.status(409).json({
					success: false,
					message: error.message
				});
			}
			next(error);
		}
	}

	async getByUser(req, res, next) {
		try {
			const filters = this.convertFilter(req);

			const appointments = await appointmentService.getUserAppointments(filters);

			res.json({
				success: true,
				data: appointments
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
			const {
				status
			} = req.body;

			const existingAppointment = await appointmentService.getAppointmentById(id);
			if (!existingAppointment) {
				return res.status(404).json({
					success: false,
					message: '预约不存在'
				});
			}

			const updatedAppointment = await appointmentService.updateAppointmentStatus(id, status);

			// 推送WebSocket更新
			webSocketServer.notifyAppointmentChange(id);

			res.json({
				success: true,
				message: '预约状态更新成功',
				data: updatedAppointment
			});
		} catch (error) {
			if (error.message.includes('无效的状态值')) {
				return res.status(400).json({
					success: false,
					message: error.message
				});
			}
			next(error);
		}
	}

	async updateStatus(req, res, next) {
		try {
			const {
				id
			} = req.params;
			const {
				status
			} = req.body;

			// console.log('appointment.controller.js -> updateStatus -> id', id)

			const existingAppointment = await appointmentService.getAppointmentById(id);
			if (!existingAppointment) {
				return res.status(404).json({
					success: false,
					message: '预约不存在'
				});
			}

			const updatedAppointment = await appointmentService.updateAppointmentStatus(id, status);

			// // 推送WebSocket更新
			// webSocketServer.notifyAppointmentChange(id);

			res.json({
				success: true,
				message: '预约状态更新成功',
				data: updatedAppointment
			});
		} catch (error) {
			if (error.message.includes('无效的状态值')) {
				return res.status(400).json({
					success: false,
					message: error.message
				});
			}
			next(error);
		}
	}

	async getAll(req, res, next) {
		try {
			const {
				status,
				date,
				startDate,
				endDate
			} = req.query;
			const filters = {};

			if (status && status !== 'all') {
				filters.status = status;
			}

			// 处理日期范围查询
			if (startDate && endDate) {
				filters.appointment_date = {
					$gte: startDate,
					$lte: endDate
				};
			} else if (date) {
				// 保持原有的单日查询兼容性
				filters.appointment_date = date;
			}

			const appointments = await appointmentService.getAllAppointments(filters);
			// console.log('getAppointments->appointments', appointments)

			res.json({
				success: true,
				data: appointments
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
			const appointment = await appointmentService.getAppointmentById(id);

			if (!appointment) {
				return res.status(404).json({
					success: false,
					message: '预约不存在'
				});
			}

			res.json({
				success: true,
				data: appointment
			});
		} catch (error) {
			next(error);
		}
	}

	async getByNo(req, res, next) {
		try {
			const {
				doc_no
			} = req.params;
			const appointment = await appointmentService.getAppointmentByNo(doc_no);

			if (!appointment) {
				return res.status(404).json({
					success: false,
					message: '预约不存在'
				});
			}

			res.json({
				success: true,
				data: appointment
			});
		} catch (error) {
			next(error);
		}
	}

	async getToday(req, res, next) {
		try {
			const today = new Date().toISOString().split('T')[0];
			const appointments = await appointmentService.getAllAppointments({
				appointment_date: today
			});

			res.json({
				success: true,
				data: appointments
			});
		} catch (error) {
			next(error);
		}
	}

	async getNew(req, res, next) {
		try {
			const data = await appointmentService.getTodayNewAppointments();

			res.json({
				success: true,
				data
			});
		} catch (error) {
			next(error);
		}
	}

	async getTodayStats(req, res, next) {
		try {
			const today = new Date().toISOString().split('T')[0];
			const stats = await appointmentService.getTodayStats(today);

			res.json({
				success: true,
				data: stats
			});
		} catch (error) {
			next(error);
		}
	}
}