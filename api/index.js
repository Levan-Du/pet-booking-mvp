import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDatabase } from './src/core/database/database.config.js';
import {
	errorHandler,
	notFoundHandler
} from './src/core/middleware/error.middleware.js';
import serviceRoutes from './src/modules/service/service.routes.js';
import appointmentRoutes from './src/modules/appointment/appointment.routes.js';
import adminRoutes from './src/modules/admin/admin.routes.js';
import authRoutes from './src/modules/auth/auth.routes.js';
import operationLogRoutes from './src/modules/operation-log/operation-log.routes.js';
import enumRoutes from './src/routes/enums.route.js';
import reportsRoutes from './src/routes/reports.route.js';
import usersRoutes from './src/routes/users.route.js';


dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));


// 挂载所有路由
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/operation-logs', operationLogRoutes);
app.use('/api/enums', enumRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);


// 错误处理
app.use(notFoundHandler);
app.use(errorHandler);

console.log('🚀 API 入口文件开始执行');
// Vercel 无服务器函数入口
let isDatabaseConnected = false;

export default async function handler(req, res) {
	// 添加详细的调试日志
	console.log('🚀 开始连接数据库');
	console.log('🔧 环境变量 MONGODB_URI 存在:', !!process.env.MONGODB_URI);
	console.log('🔧 环境变量 MONGODB_DB_NAME 存在:', !!process.env.MONGODB_DB_NAME);
	console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
	if (!isDatabaseConnected) {
		try {
			await connectDatabase();
			isDatabaseConnected = true;
		} catch (error) {
			return res.status(500).json({ error: 'Database connection failed' });
		}
	}

	return app(req, res);
}