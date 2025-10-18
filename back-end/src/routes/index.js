import express from 'express';
import serviceRoutes from '../modules/service/service.routes.js';
import appointmentRoutes from '../modules/appointment/appointment.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import enumRoutes from './enums.js';

const router = express.Router();

router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/enums', enumRoutes);

export default router;