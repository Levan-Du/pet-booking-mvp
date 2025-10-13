import express from 'express';
import {
	AuthController
} from './auth.controller.js';
import {
	authenticateAdmin,
	authenticateToken
} from './auth.middleware.js';

const router = express.Router();
const authController = new AuthController();

// Token 验证
router.get('/verify', authenticateToken, authController.verifyToken.bind(authController));

// 管理员信息
router.get('/profile', authenticateAdmin, authController.getProfile.bind(authController));

// 退出登录
router.post('/logout', authenticateToken, authController.logout.bind(authController));

// 清理过期会话（管理员权限）
router.delete('/sessions/cleanup', authenticateAdmin, authController.cleanupSessions.bind(authController));

export default router;