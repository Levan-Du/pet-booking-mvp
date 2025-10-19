import express from 'express';
import { authenticateAdminToken } from '../core/middleware/auth.middleware.js';
import { AppointmentController } from '../modules/appointment/appointment.controller.js';

const router = express.Router();
const appointmentController = new AppointmentController();

// 获取今日预约统计数据
router.get('/today', authenticateAdminToken, appointmentController.getTodayStats.bind(appointmentController));

export default router;