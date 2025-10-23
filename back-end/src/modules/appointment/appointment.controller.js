import {
	AppointmentService
} from './appointment.service.js';
import webSocketServer from '../../core/websocket/websocket.server.js';
import { ObjectId } from 'mongodb';

const appointmentService = new AppointmentService();

export class AppointmentController {
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

	async createAppointment(req, res, next) {
		try {
			const appointmentData = req.validatedData;
			const newAppointment = await appointmentService.createAppointment(appointmentData);

			// 推送WebSocket更新
			webSocketServer.notifyAppointmentChange(newAppointment._id);

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

	async getUserAppointments(req, res, next) {
		try {
			const filters = this.convertFilter(req.query, req.params, req.headers['pet-user']);

			const appointments = await appointmentService.getUserAppointments(filters);

			res.json({
				success: true,
				data: appointments
			});
		} catch (error) {
			next(error);
		}
	}

	convertFilter(query, params, user) {
		console.log('appointment.controller.js -> convertFilter -> query,params', query, params)
		const filterItems = { phone: 'customer_phone', id: '_id' }
		const filters = { customer_phone: user.phone }
		Object.keys(query).forEach(q => filters[filterItems[q]] = query[q])
		Object.keys(params).forEach(q => filters[filterItems[q]] = q === 'id' ? new ObjectId(params[q]) : params[q])
		console.log('appointment.controller.js -> convertFilter -> filters', filters)
		return filters
	}

	async getAppointments(req, res, next) {
		try {
			const {
				status,
				date
			} = req.query;
			const filters = {};

			if (status && status !== 'all') {
				filters.status = status;
			}
			if (date) {
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

	async getAppointmentById(req, res, next) {
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

	async updateAppointmentStatus(req, res, next) {
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

	async getTodayAppointments(req, res, next) {
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