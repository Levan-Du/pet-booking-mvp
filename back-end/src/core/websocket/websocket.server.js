import { WebSocketServer } from 'ws';

class WSSServer {
    constructor() {
        this.wss = null;
        this.clients = new Set();
        this.messageHandlers = new Map();
    }

    init(server) {
        this.wss = new WebSocketServer({
            server,
            path: '/ws/databoard'
        });

        this.wss.on('connection', (ws, req) => {
            console.log('📡 WebSocket客户端连接成功');
            this.clients.add(ws);

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    console.log('📨 收到WebSocket消息:', data);

                    // 处理消息
                    this.handleMessage(ws, data);
                } catch (error) {
                    console.error('❌ WebSocket消息解析错误:', error);
                }
            });

            ws.on('close', () => {
                console.log('📡 WebSocket客户端断开连接');
                this.clients.delete(ws);
            });

            ws.on('error', (error) => {
                console.error('❌ WebSocket连接错误:', error);
                this.clients.delete(ws);
            });
        });

        console.log('✅ WebSocket服务器初始化完成');
    }

    // 注册消息处理器
    registerMessageHandler(messageType, handler) {
        this.messageHandlers.set(messageType, handler);
    }

    // 处理消息
    async handleMessage(ws, data) {
        const handler = this.messageHandlers.get(data.type);
        if (handler) {
            try {
                await handler(ws, data);
            } catch (error) {
                console.error(`❌ 处理消息 ${data.type} 错误:`, error);
                this.sendMessage(ws, {
                    type: 'error',
                    message: '处理消息失败',
                    timestamp: new Date().toISOString()
                });
            }
        } else {
            console.warn(`⚠️ 未注册的消息类型: ${data.type}`);
            this.sendMessage(ws, {
                type: 'error',
                message: `未知的消息类型: ${data.type}`,
                timestamp: new Date().toISOString()
            });
        }
    }

    // 发送消息给指定客户端
    sendMessage(ws, message) {
        if (ws.readyState === 1) { // WebSocket.OPEN === 1
            ws.send(JSON.stringify(message));
        }
    }

    // 广播消息给所有客户端
    broadcast(message) {
        this.clients.forEach(client => {
            if (client.readyState === 1) { // WebSocket.OPEN === 1
                client.send(JSON.stringify(message));
            }
        });
    }

    // 推送预约更新
    notifyAppointmentChange(appointmentId) {
        const message = {
            type: 'appointment_updated',
            appointmentId: appointmentId,
            timestamp: new Date().toISOString()
        };
        this.broadcast(message);
        console.log(`📢 推送预约更新: ${appointmentId}`);
    }

    // 推送统计数据更新
    notifyStatsUpdate(stats) {
        const message = {
            type: 'stats_updated',
            data: stats,
            timestamp: new Date().toISOString()
        };
        this.broadcast(message);
        console.log('📊 推送统计数据更新');
    }

    close() {
        this.clients.forEach(client => {
            client.close();
        });

        if (this.wss) {
            this.wss.close();
        }

        console.log('🔴 WebSocket服务器已关闭');
    }

    // 获取连接客户端数量
    getClientCount() {
        return this.clients.size;
    }
}

export default new WSSServer();