import express from 'express';
import serviceRoutes from '../modules/service/service.routes.js';
import appointmentRoutes from '../modules/appointment/appointment.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import operationLogRoutes from '../modules/operation-log/operation-log.routes.js';
import enumRoutes from './enums.js';
import reportsRoutes from './reports.js';
import usersRoutes from './users.js';

const router = express.Router();

router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/operation-logs', operationLogRoutes);
router.use('/enums', enumRoutes);
router.use('/reports', reportsRoutes);
router.use('/users', usersRoutes);

export default router;