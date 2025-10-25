import express from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateAdminToken } from '../../core/middleware/auth.middleware.js';
import { adminValidation } from '../admin/admin.validation.js';
import { validateRequest } from '../../core/middleware/validation.middleware.js';
import { AdminController } from '../admin/admin.controller.js';

const router = express.Router();
const authController = new AuthController();
const adminController = new AdminController();

// router.use('/', authController.route.bind(authController))


router.post('/login',
	validateRequest(adminValidation.login), adminController.login.bind(adminController))

router.get('/check-token',
	adminController.checkToken.bind(adminController))

router.post('/password',
	authenticateAdminToken, validateRequest(adminValidation.changePassword), adminController.changePassword.bind(adminController))

router.get('/verify', authenticateAdminToken,
	authController.verifyToken?.bind(authController))

router.get('/logout', authenticateAdminToken,
	authController.logout?.bind(authController))

router.get('/sessions/cleanup', authenticateAdminToken,
	authController.cleanupSessions?.bind(authController))

export default router;