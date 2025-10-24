import {
	AuthService
} from './auth.service.js';
import { BaseController } from '../base.controller.js';

const authService = new AuthService();

export class AuthController extends BaseController {
	constructor() {
		super(null, 'auth')
	}

	buildRouteMap() {
		return {
			...super.buildRouteMap(),
			'GET:/verify': {
				handler: this.verifyToken?.bind(this),
				middlewares: [this.authenticateAdminToken] // 需要认证
			},
			'POST:/logout': {
				handler: this.logout?.bind(this),
				middlewares: [this.authenticateAdminToken] // 需要认证
			},
			'DELETE:/sessions/cleanup': {
				handler: this.cleanupSessions?.bind(this),
				middlewares: [this.authenticateAdminToken] // 需要认证
			}
		}
	}

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

	async getById(req, res, next) {
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