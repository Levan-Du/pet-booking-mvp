import {
	JWTUtil, JWT_ADMIN_SECRET
} from '../utils/jwt.util.js';

// JWT Token 认证中间件（如果需要）
export const authenticateAdminToken = async (req, res, next) => {
	authenticateToken('pet-admin', JWT_ADMIN_SECRET, req, res, next)
};

// JWT Token 认证中间件（如果需要）
export const authenticateUserToken = async (req, res, next) => {
	authenticateToken('pet-user', req.headers.device_id, req, res, next)
};

const authenticateToken = (payloadHeader, JWT_SECRET, req, res, next) => {
	try {
		// console.log('auth.middleware.js -> authenticateToken -> authorization', req.headers.authorization)
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
		// console.log('auth.middleware.js -> authenticateToken -> 333333333333333', req.query)

		const payload = JWTUtil.verifyToken(token, JWT_SECRET)
		console.log('auth.middleware.js -> authenticateToken -> payload', payload)
		if (!payload) {
			return res.status(401).json({
				success: false,
				message: 'Token无效'
			});
		}

		req.headers[payloadHeader] = payload;
		next();
	} catch (error) {
		// console.error('Token认证错误:', error);
		res.status(500).json({
			success: false,
			message: '服务器错误'
		});
	}
}

// 可选的管理员角色检查中间件
export const requireAdminRole = (req, res, next) => {
	// 这里可以根据需要实现角色检查逻辑
	if (!req.headers['pet-admin']) {
		return res.status(401).json({
			success: false,
			message: '需要管理员权限'
		});
	}

	// 比如检查管理员权限等级等
	next();
};