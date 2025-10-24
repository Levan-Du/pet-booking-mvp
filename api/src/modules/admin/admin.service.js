import bcrypt from 'bcryptjs';
import { getAdminModel } from '../model.factory.js';
import { JWTUtil, JWT_ADMIN_SECRET } from '../../core/utils/jwt.util.js';

export class AdminService {
	constructor() {
		this.adminModel = getAdminModel();
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

		let payload = {
			id: admin._id || admin.id,
			username: admin.username,
			role: 'pet-admin'
		}
		let accessToken = JWTUtil.generateAccessToken(payload, JWT_ADMIN_SECRET);
		this.saveAccessToken(admin._id || admin.id, accessToken);

		return { ...payload, accessToken };
	}

	saveAccessToken(adminId, token) {
		// 这里可以实现将 token 存储到数据库或缓存中，以便后续验证
		// 例如，更新管理员记录中的 token 字段
		return this.adminModel.updateAccessToken(adminId, token);
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