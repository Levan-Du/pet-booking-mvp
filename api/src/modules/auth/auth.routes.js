import express from 'express';
import {
	AuthController
} from './auth.controller.js';
import {
	authenticateAdminToken
} from '../../core/middleware/auth.middleware.js';

const router = express.Router();
const authController = new AuthController();

// Token 验证
router.get('/verify', authenticateAdminToken, authController.verifyToken.bind(authController));

// 管理员信息
router.get('/profile', authenticateAdminToken, authController.getProfile.bind(authController));

// 退出登录
router.post('/logout', authenticateAdminToken, authController.logout.bind(authController));

// 清理过期会话（管理员权限）
router.delete('/sessions/cleanup', authenticateAdminToken, authController.cleanupSessions.bind(authController));

export default router;