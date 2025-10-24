import bcrypt from 'bcryptjs';
import {
	getDBType
} from '../../core/database/database.config.js';
import {
	getPostgresPool
} from '../../core/database/postgres.config.js';
import {
	getMongoDB
} from '../../core/database/mongodb.config.js';

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

		const dbType = getDBType();
		let admin = null;

		if (dbType === 'postgres') {
			const pool = getPostgresPool();
			const result = await pool.query(
				'SELECT * FROM admins WHERE username = $1',
				[username]
			);
			admin = result.rows[0];
		} else {
			const db = getMongoDB();
			admin = await db.collection('admins').findOne({
				username
			});
		}

		if (!admin) {
			return res.status(401).json({
				success: false,
				message: '用户名或密码错误'
			});
		}

		const isValidPassword = await bcrypt.compare(password, admin.password_hash);
		if (!isValidPassword) {
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