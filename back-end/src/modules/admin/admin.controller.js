import {
	AdminService
} from './admin.service.js';

const adminService = new AdminService();

export class AdminController {
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

	async getProfile(req, res, next) {
		try {
			const {
				id
			} = req.admin;
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
			} = req.admin;

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