import bcrypt from 'bcryptjs';
import {
	AdminModel
} from './admin.model.js';

export class AdminService {
	constructor() {
		this.adminModel = new AdminModel();
	}

	async login(username, password) {
		const admin = await this.adminModel.findByUsername(username);

		if (!admin) {
			throw new Error('用户名或密码错误');
		}

		const isValidPassword = await bcrypt.compare(password, admin.password_hash);
		if (!isValidPassword) {
			throw new Error('用户名或密码错误');
		}

		return {
			id: admin._id || admin.id,
			username: admin.username
		};
	}

	async getProfile(adminId) {
		const admin = await this.adminModel.findById(adminId);

		if (!admin) {
			throw new Error('管理员不存在');
		}

		return admin;
	}

	async changePassword(adminId, currentPassword, newPassword) {
		if (newPassword.length < 6) {
			throw new Error('新密码长度不能少于6位');
		}

		// 获取当前管理员信息（包含密码哈希）
		const admin = await this.adminModel.findByUsername(
			await this.getAdminUsernameById(adminId)
		);

		if (!admin) {
			throw new Error('管理员不存在');
		}

		// 验证当前密码
		const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash);
		if (!isValidPassword) {
			throw new Error('当前密码错误');
		}

		// 更新密码
		const newPasswordHash = await bcrypt.hash(newPassword, 10);
		const success = await this.adminModel.updatePassword(adminId, newPasswordHash);

		if (!success) {
			throw new Error('密码更新失败');
		}

		return true;
	}

	async getStats() {
		return await this.adminModel.getStats();
	}

	async createAdmin(adminData) {
		const {
			username,
			password
		} = adminData;

		// 检查用户名是否已存在
		const existingAdmin = await this.adminModel.findByUsername(username);
		if (existingAdmin) {
			throw new Error('用户名已存在');
		}

		const passwordHash = await bcrypt.hash(password, 10);
		return await this.adminModel.create({
			username,
			password_hash: passwordHash
		});
	}

	// 辅助方法：根据ID获取用户名
	async getAdminUsernameById(adminId) {
		const admin = await this.adminModel.findById(adminId);
		return admin?.username;
	}
}