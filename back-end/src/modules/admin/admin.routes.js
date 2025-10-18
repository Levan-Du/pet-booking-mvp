import express from 'express';
import {
	AdminController
} from './admin.controller.js';
import {
	adminValidation
} from './admin.validation.js';
import {
	validateRequest
} from '../../core/middleware/validation.middleware.js';
import {
	authenticateAdminToken
} from '../../core/middleware/auth.middleware.js';

const router = express.Router();
const adminController = new AdminController();

// 公开路由 - 登录
router.post(
	'/login',
	validateRequest(adminValidation.login),
	adminController.login.bind(adminController)
);

// 需要认证的路由
router.get('/profile', authenticateAdminToken, adminController.getProfile.bind(adminController));
router.get('/stats', authenticateAdminToken, adminController.getStats.bind(adminController));
router.put(
	'/change-password',
	authenticateAdminToken,
	validateRequest(adminValidation.changePassword),
	adminController.changePassword.bind(adminController)
);

export default router;