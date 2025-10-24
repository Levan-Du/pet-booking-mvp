import {
	AuthService
} from './auth.service.js';

const authService = new AuthService();

export class AuthController {
	async verifyToken(req, res, next) {
		try {
			res.json({
				success: true,
				message: 'Token 有效',
				data: req.admin
			});
		} catch (error) {
			next(error);
		}
	}

	async logout(req, res, next) {
		try {
			const token = req.headers.authorization?.slice(7); // Bearer token

			if (token) {
				await authService.logout(token);
			}

			res.json({
				success: true,
				message: '退出登录成功'
			});
		} catch (error) {
			next(error);
		}
	}

	async getProfile(req, res, next) {
		try {
			const {
				id
			} = req.admin;
			const profile = await authService.getAdminProfile(id);

			res.json({
				success: true,
				data: profile
			});
		} catch (error) {
			next(error);
		}
	}

	async cleanupSessions(req, res, next) {
		try {
			const cleanedCount = await authService.cleanupExpiredSessions();

			res.json({
				success: true,
				message: `已清理 ${cleanedCount} 个过期会话`,
				data: {
					cleanedCount
				}
			});
		} catch (error) {
			next(error);
		}
	}
}