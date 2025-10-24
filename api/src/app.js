import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';

import {
	connectDatabase
} from './core/database/database.config.js';
import routes from './routes/index.js';
import {
	errorHandler,
	notFoundHandler
} from './core/middleware/error.middleware.js';
import {
	loggingMiddleware
} from './core/middleware/logging.middleware.js';
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use(loggingMiddleware);

// API 路由
app.use('/api', routes);

// 错误处理
app.use(notFoundHandler);
app.use(errorHandler);

// 启动服务器
async function startServer() {
	try {
		console.log('🔗 正在连接数据库...');
		await connectDatabase();

		// initWebsocketServer()

		server.listen(PORT, () => {
			console.log(`🚀 服务器运行在端口 ${PORT}`);
			console.log(`📊 使用数据库: ${process.env.DB_TYPE || 'mongodb'}`);
			console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
			// console.log(`📍 健康检查: http://localhost:${PORT}/health`);
		});
	} catch (error) {
		console.error('❌ 服务器启动失败:', error);
		process.exit(1);
	}
}

// Vercel 无服务器函数入口
let isDatabaseConnected = false;

export default async function handler(req, res) {
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