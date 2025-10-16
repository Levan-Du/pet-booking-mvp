import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// 生成随机密钥（生产环境应该从环境变量读取）
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export class JWTUtil {
	/**
	 * 生成访问 token
	 * @param {Object} payload - 用户信息
	 * @returns {string} JWT token
	 */
	static generateAccessToken(payload) {
		return jwt.sign({
				...payload,
				type: 'access'
			},
			JWT_SECRET, {
				expiresIn: JWT_EXPIRES_IN,
				issuer: 'pet-booking-api',
				subject: payload.id.toString()
			}
		);
	}

	/**
	 * 生成刷新 token
	 * @param {Object} payload - 用户信息
	 * @returns {string} JWT refresh token
	 */
	static generateRefreshToken(payload) {
		return jwt.sign({
				...payload,
				type: 'refresh'
			},
			JWT_SECRET, {
				expiresIn: JWT_REFRESH_EXPIRES_IN,
				issuer: 'pet-booking-api',
				subject: payload.id.toString()
			}
		);
	}

	/**
	 * 验证 token
	 * @param {string} token - JWT token
	 * @returns {Object} 解码后的 payload 或 null
	 */
	static verifyToken(token) {
		try {
			return jwt.verify(token, JWT_SECRET);
		} catch (error) {
			console.error('Token 验证失败:', error.message);
			return null;
		}
	}

	/**
	 * 解码 token（不验证签名）
	 * @param {string} token - JWT token
	 * @returns {Object} 解码后的 payload 或 null
	 */
	static decodeToken(token) {
		try {
			return jwt.decode(token);
		} catch (error) {
			console.error('Token 解码失败:', error.message);
			return null;
		}
	}

	/**
	 * 检查 token 是否即将过期（30分钟内）
	 * @param {string} token - JWT token
	 * @returns {boolean}
	 */
	static isTokenExpiringSoon(token) {
		const decoded = this.decodeToken(token);
		if (!decoded || !decoded.exp) return true;

		const now = Math.floor(Date.now() / 1000);
		const timeUntilExpiry = decoded.exp - now;

		// 如果30分钟内过期，返回 true
		return timeUntilExpiry < 30 * 60;
	}

	/**
	 * 获取 token 剩余有效时间（秒）
	 * @param {string} token - JWT token
	 * @returns {number} 剩余秒数，-1 表示已过期或无效
	 */
	static getTokenRemainingTime(token) {
		const decoded = this.decodeToken(token);
		if (!decoded || !decoded.exp) return -1;

		const now = Math.floor(Date.now() / 1000);
		return Math.max(0, decoded.exp - now);
	}
}