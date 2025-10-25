import express from 'express';
import { AppointmentController } from './appointment.controller.js';
import { appointmentValidation } from './appointment.validation.js';
import { validateRequest } from '../../core/middleware/validation.middleware.js';
import { authenticateAdminToken } from '../../core/middleware/auth.middleware.js';

const router = express.Router();
const appointmentController = new AppointmentController();

// router.use('/', appointmentController.route.bind(appointmentController))

router.post('/',
	authenticateAdminToken, appointmentController.create.bind(appointmentController))
router.delete('/:id',
	authenticateAdminToken, appointmentController.delete.bind(appointmentController))
router.put('/:id',
	authenticateAdminToken, appointmentController.update.bind(appointmentController))
router.get('/',
	authenticateAdminToken, appointmentController.getAll.bind(appointmentController))
router.get('/:id',
	authenticateAdminToken, appointmentController.getById.bind(appointmentController))

router.get('/available-slots',
	appointmentController.getAvailableSlots?.bind(appointmentController))

router.get('/:/today',
	authenticateAdminToken,
	appointmentController.getToday?.bind(appointmentController))

router.get('/stats/today',
	authenticateAdminToken,
	appointmentController.getTodayStats?.bind(appointmentController))

router.get('/new/today',
	authenticateAdminToken,
	appointmentController.getNew?.bind(appointmentController))

router.put('/:id/status',
	authenticateAdminToken,
	validateRequest(appointmentValidation.updateStatus),
	appointmentController.updateStatus?.bind(appointmentController))

export default router;