import {
	AdminService
} from './admin.service.js';
import { JWTUtil, JWT_ADMIN_SECRET } from '../../core/utils/jwt.util.js';
import {
	adminValidation
} from './admin.validation.js';
import { BaseController } from '../base.controller.js';

const adminService = new AdminService();

export class AdminController extends BaseController {
	constructor() {
		super(adminValidation, 'services')
	}

	buildRouteMap() {
		return {
			...super.buildRouteMap(),
			'POST:/login': {
				handler: this.login?.bind(this),
				middlewares: [this.validateRequest(adminValidation.login)] // 需要认证
			},
			'POST:/password': {
				handler: this.changePassword?.bind(this),
				middlewares: [this.validateRequest(adminValidation.changePassword), this.authenticateAdminToken] // 需要认证
			},
			'GET:/check-token': {
				handler: this.checkToken?.bind(this),
				middlewares: [] // 需要认证
			},
			'GET:/stats': {
				handler: this.getStats?.bind(this),
				middlewares: [this.authenticateAdminToken] // 需要认证
			}
		}
	}

	async login(req, res, next) {
		try {
			const {
				username,
				password
			} = req.validatedData;
			const adminInfo = await adminService.login(username, password);

			res.json({
				success: true,
				message: '登录成功',
				data: adminInfo
			});
		} catch (error) {
			if (error.message.includes('用户名或密码错误')) {
				return res.status(401).json({
					success: false,
					message: error.message
				});
			}
			next(error);
		}
	}

	async checkToken(req, res, next) {
		try {
			const authHeader = req.headers.authorization;
			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				return res.status(401).json({
					success: false,
					message: '需要Token认证'
				});
			}
			const token = authHeader.slice(7);
			if (!token) {
				return res.status(401).json({
					success: false,
					message: 'Token不能为空'
				});
			}
			const payload = JWTUtil.verifyToken(token, JWT_ADMIN_SECRET);
			if (!payload) {
				return res.status(401).json({
					success: false,
					message: 'Token无效'
				});
			}
			res.json({
				success: true,
				message: 'Token有效',
				data: payload
			});
		} catch (error) {
			console.error('Token认证错误:', error);
			res.status(500).json({
				success: false,
				message: '服务器错误'
			});
		}
	}

	async getById(req, res, next) {
		try {
			const {
				id
			} = req.params;
			const profile = await adminService.getProfile(id);

			res.json({
				success: true,
				data: profile
			});
		} catch (error) {
			next(error);
		}
	}

	async changePassword(req, res, next) {
		try {
			const {
				currentPassword,
				newPassword
			} = req.body;
			const {
				id
			} = req.params;

			if (!currentPassword || !newPassword) {
				return res.status(400).json({
					success: false,
					message: '当前密码和新密码为必填项'
				});
			}

			await adminService.changePassword(id, currentPassword, newPassword);

			res.json({
				success: true,
				message: '密码修改成功'
			});
		} catch (error) {
			if (error.message.includes('当前密码错误') || error.message.includes('新密码长度')) {
				return res.status(400).json({
					success: false,
					message: error.message
				});
			}
			next(error);
		}
	}

	async getStats(req, res, next) {
		try {
			const stats = await adminService.getStats();

			res.json({
				success: true,
				data: stats
			});
		} catch (error) {
			next(error);
		}
	}
}