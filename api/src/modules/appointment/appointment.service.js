import { getAppointmentModel, getServiceModel } from '../model.factory.js';
import { APPOINTMENT_STATUS, VALID_STATUSES } from '../../shared/enums/appointment-status.js';
import orderIdGenerator from '../../core/utils/orderid-generator.util.js'
import { ObjectId } from 'mongodb';

export class AppointmentService {
	constructor() {
		this.appointmentModel = getAppointmentModel();
		this.serviceModel = getServiceModel();
	}

	async getUserAppointments(filters = {}) {
		const appointments = await this.appointmentModel.find(filters);
		// console.log('appointments.service.js -> getUserAppointments -> appointments:', appointments);
		// 确保返回的数据包含appointment_no字段
		return appointments.map(apt => ({
			...apt,
			appointment_no: apt.appointment_no || apt.appointment_no // 确保字段存在
		}));
	}

	async getAllAppointments(filters = {}) {
		const appointments = await this.appointmentModel.find(filters);
		// 确保返回的数据包含appointment_no字段
		return appointments.map(apt => ({
			...apt,
			appointment_no: apt.appointment_no || apt.appointment_no // 确保字段存在
		}));
	}

	async getAppointmentById(id) {
		const appointment = await this.appointmentModel.findById(id);
		if (appointment) {
			return {
				...appointment,
				appointment_no: appointment.appointment_no || appointment.appointment_no // 确保字段存在
			};
		}
		return null;
	}

	async getAppointmentByNo(docno) {
		const appointment = await this.appointmentModel.findByNo(id);
		if (appointment) {
			return {
				...appointment,
				appointment_no: appointment.appointment_no || appointment.appointment_no // 确保字段存在
			};
		}
		return null;
	}

	async createAppointment(appointmentData) {
		const {
			appointment_date,
			appointment_time,
			service_id
		} = appointmentData;

		console.log('appointment.service.js -> createAppointment -> appointmentData', appointmentData)

		// 获取服务信息
		const service = await this.serviceModel.findById(service_id);
		if (!service) {
			throw new Error('服务不存在');
		}

		// 计算结束时间并检查冲突
		const duration = service.duration;
		const [hours, minutes] = appointment_time.split(':').map(Number);
		const totalMinutes = hours * 60 + minutes + duration;
		const endHours = Math.floor(totalMinutes / 60);
		const endMinutes = totalMinutes % 60;
		const end_time = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

		const hasConflict = await this.appointmentModel.checkTimeConflict(
			appointment_date,
			appointment_time,
			end_time
		);

		if (hasConflict) {
			throw new Error('该时段已被预约，请选择其他时间');
		}

		const apmNo = orderIdGenerator.generate('apm')

		const createdAppointment = await this.appointmentModel.create({
			appointment_no: apmNo,
			...appointmentData,
			service_id: new ObjectId(appointmentData.service_id),
			end_time
		});
		// 确保返回的数据包含appointment_no字段
		return {
			...createdAppointment,
			appointment_no: createdAppointment.appointment_no || apmNo
		};
	}

	async updateAppointmentStatus(id, status) {
		if (!VALID_STATUSES.includes(status)) {
			throw new Error('无效的状态值');
		}

		return await this.appointmentModel.update(id, {
			status
		});
	}

	async getAvailableSlots(date, serviceId) {
		const service = await this.serviceModel.findById(serviceId);
		if (!service) {
			throw new Error('服务不存在');
		}

		const appointments = await this.appointmentModel.find({
			appointment_date: date,
			status: {
				$ne: 'cancelled'
			}
		});

		const slots = this.generateTimeSlots(date, service.duration, appointments);

		// 为每个时间段计算可用空位
		return slots.map(slot => ({
			...slot,
			available_slots: this.calculateAvailableSlots(slot, appointments, service)
		}));
	}

	calculateAvailableSlots(slot, appointments, service) {
		// 模拟计算可用空位
		// 实际业务中可以根据员工数量、服务能力等计算
		const baseCapacity = 5; // 基础容量
		const conflictingAppointments = appointments.filter(apt => {
			return !(apt.end_time <= slot.start_time || apt.appointment_time >= slot.end_time);
		});

		return Math.max(0, baseCapacity - conflictingAppointments.length);
	}


	generateTimeSlots(date, duration, appointments) {
		const slots = [];
		const startHour = 9;
		const endHour = 18;
		const interval = 30;

		for (let hour = startHour; hour < endHour; hour++) {
			for (let minute = 0; minute < 60; minute += interval) {
				const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

				const totalMinutes = hour * 60 + minute + duration;
				const endHourValue = Math.floor(totalMinutes / 60);
				const endMinuteValue = totalMinutes % 60;
				const endTime = `${endHourValue.toString().padStart(2, '0')}:${endMinuteValue.toString().padStart(2, '0')}`;

				if (endHourValue <= endHour) {
					const hasConflict = appointments.some(apt => {
						return !(apt.end_time <= startTime || apt.appointment_time >= endTime);
					});

					if (!hasConflict) {
						slots.push({
							start_time: startTime,
							end_time: endTime
						});
					}
				}
			}
		}

		return slots;
	}

	async getTodayNewAppointments() {
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const appointments = await this.appointmentModel.getCollection().find({
			created_at: {
				$gte: today  // 或者 $gte: today，根据你的需求
			}
		}).toArray();
		// 确保返回的数据包含appointment_no字段
		return appointments.map(apt => ({
			...apt,
			appointment_no: apt.appointment_no || apt.appointment_no // 确保字段存在
		}));
	}

	async getTodayStats(date) {
		const appointments = await this.getAllAppointments({
			appointment_date: date
		});

		const stats = {
			total: appointments.length,
			pending: 0,
			confirmed: 0,
			in_progress: 0,
			completed: 0,
			cancelled: 0,
			broken: 0
		};

		appointments.forEach(appointment => {
			switch (appointment.status) {
				case APPOINTMENT_STATUS.PENDING:
					stats.pending++;
					break;
				case APPOINTMENT_STATUS.CONFIRMED:
					stats.confirmed++;
					break;
				case APPOINTMENT_STATUS.IN_PROGRESS:
					stats.in_progress++;
					break;
				case APPOINTMENT_STATUS.COMPLETED:
					stats.completed++;
					break;
				case APPOINTMENT_STATUS.CANCELLED:
					stats.cancelled++;
					break;
				case APPOINTMENT_STATUS.BROKEN:
					stats.broken++;
					break;
			}
		});

		return stats;
	}
}