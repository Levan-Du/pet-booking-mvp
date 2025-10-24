import express from 'express';
import {
	AppointmentController
} from './appointment.controller.js';

const router = express.Router();
const appointmentController = new AppointmentController();

router.use('/', appointmentController.route.bind(appointmentController))

export default router;