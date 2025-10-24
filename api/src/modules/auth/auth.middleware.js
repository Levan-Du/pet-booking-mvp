import {
	AuthService
} from './auth.service.js';

const authService = new AuthService();

export const authenticateAdmin = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Basic ')) {
			return res.status(401).json({
				success: false,
				message: '需要管理员认证'
			});
		}

		const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
		const [username, password] = credentials.split(':');

		if (!username || !password) {
			return res.status(401).json({
				success: false,
				message: '认证信息不完整'
			});
		}

		const {
			isValid,
			admin
		} = await authService.validateAdminCredentials(username, password);

		if (!isValid || !admin) {
			return res.status(401).json({
				success: false,
				message: '用户名或密码错误'
			});
		}

		req.admin = {
			id: admin._id || admin.id,
			username: admin.username
		};

		next();
	} catch (error) {
		console.error('认证错误:', error);
		res.status(500).json({
			success: false,
			message: '服务器错误'
		});
	}
};

// JWT Token 认证中间件（如果需要）
export const authenticateToken = async (req, res, next) => {
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

		const {
			isValid,
			admin,
			error
		} = await authService.validateSession(token);

		if (!isValid) {
			return res.status(401).json({
				success: false,
				message: error || 'Token无效'
			});
		}

		req.admin = admin;
		next();
	} catch (error) {
		console.error('Token认证错误:', error);
		res.status(500).json({
			success: false,
			message: '服务器错误'
		});
	}
};

// 可选的管理员角色检查中间件
export const requireAdminRole = (req, res, next) => {
	// 这里可以根据需要实现角色检查逻辑
	// 比如检查管理员权限等级等
	next();
};