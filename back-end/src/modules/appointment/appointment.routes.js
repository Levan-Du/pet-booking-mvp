import express from 'express';
import {
	AppointmentController
} from './appointment.controller.js';
import {
	appointmentValidation
} from './appointment.validation.js';
import {
	validateRequest
} from '../../core/middleware/validation.middleware.js';
import {
	authenticateAdmin
} from '../auth/auth.middleware.js';

const router = express.Router();
const appointmentController = new AppointmentController();

// 公开路由
router.get('/available-slots', appointmentController.getAvailableSlots.bind(appointmentController));
router.post(
	'/',
	validateRequest(appointmentValidation.create),
	appointmentController.createAppointment.bind(appointmentController)
);

// 需要管理员认证的路由
router.get('/', authenticateAdmin, appointmentController.getAppointments.bind(appointmentController));
router.get('/today', authenticateAdmin, appointmentController.getTodayAppointments.bind(appointmentController));
router.get('/:id', authenticateAdmin, appointmentController.getAppointmentById.bind(appointmentController));
router.put(
	'/:id/status',
	authenticateAdmin,
	validateRequest(appointmentValidation.updateStatus),
	appointmentController.updateAppointmentStatus.bind(appointmentController)
);

export default router;