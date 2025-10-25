import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';

import { connectDatabase } from './core/database/database.config.js';
import { errorHandler, notFoundHandler } from './core/middleware/error.middleware.js';
import { loggingMiddleware } from './core/middleware/logging.middleware.js';
import webSocketServer from './core/websocket/websocket.server.js';
import { DataBoardWebSocketHandler } from './core/websocket/handlers/databoard.handler.js';
import serviceRoutes from '../src/modules/service/service.routes.js';
import appointmentRoutes from '../src/modules/appointment/appointment.routes.js';
import adminRoutes from '../src/modules/admin/admin.routes.js';
import authRoutes from '../src/modules/auth/auth.routes.js';
import operationLogRoutes from '../src/modules/operation-log/operation-log.routes.js';
import enumRoutes from '../src/routes/enums.route.js';
import reportsRoutes from '../src/routes/reports.route.js';
import usersRoutes from '../src/routes/users.route.js';

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

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Pet Booking API is running',
    database: process.env.DB_TYPE || 'mongodb',
    timestamp: new Date().toISOString()
  });
});

// 挂载所有路由
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/operation-logs', operationLogRoutes);
app.use('/api/enums', enumRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);

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
      console.log(`📍 健康检查: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

// const initWebsocketServer = () => {
//   // 初始化WebSocket服务器
//   webSocketServer.init(server);

//   console.log(`📡 WebSocket服务: ws://localhost:${PORT}/ws/databoard`);

//   // 设置WebSocket处理器
//   const databoardHandler = new DataBoardWebSocketHandler();
//   databoardHandler.setWebSocketServer(webSocketServer);
//   databoardHandler.registerHandlers();

//   // 每分钟推送一次数据更新
//   setInterval(() => {
//     databoardHandler.pushStatsUpdate();
//   }, 60000); // 60秒
// }

startServer();

export default app;
