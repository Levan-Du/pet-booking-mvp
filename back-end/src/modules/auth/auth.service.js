import bcrypt from 'bcryptjs';
import { getAuthModel } from '../model.factory.js';

export class AuthService {
	constructor() {
		this.authModel = getAuthModel();
	}

	async validateAdminCredentials(username, password) {
		const admin = await this.authModel.validateAdminCredentials(username, password);
		return {
			isValid: !!admin,
			admin
		};
	}

	async createSession(adminId, tokenData = {}) {
		const {
			token,
			expiresIn = '7d'
		} = tokenData;

		// 计算过期时间
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // 默认7天过期

		return await this.authModel.createSession(adminId, token, expiresAt);
	}

	async validateSession(token) {
		const session = await this.authModel.getSessionByToken(token);

		if (!session) {
			return {
				isValid: false,
				error: '会话无效或已过期'
			};
		}

		return {
			isValid: true,
			session,
			admin: {
				id: session.admin_id || session.admin_id?.toString(),
				username: session.username
			}
		};
	}

	async logout(token) {
		return await this.authModel.deleteSession(token);
	}

	async cleanupExpiredSessions() {
		return await this.authModel.cleanupExpiredSessions();
	}

	async getAdminProfile(adminId) {
		return await this.authModel.getAdminById(adminId);
	}
}