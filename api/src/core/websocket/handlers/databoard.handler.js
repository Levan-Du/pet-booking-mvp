import { getAppointmentModel } from '../../../modules/model.factory.js';
import { getDBType } from '../../database/database.config.js';

class DataBoardWebSocketHandler {
    constructor() {
        this.webSocketServer = null;
    }

    setWebSocketServer(server) {
        this.webSocketServer = server;
    }

    // 处理订阅消息
    async handleSubscribe(ws, data) {
        try {
            const stats = await this.getTodayStats();
            this.webSocketServer.sendMessage(ws, {
                type: 'today_stats',
                data: stats,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('❌ 处理订阅消息错误:', error);
            this.webSocketServer.sendMessage(ws, {
                type: 'error',
                message: '获取统计数据失败',
                timestamp: new Date().toISOString()
            });
        }
    }

    // 获取今日统计数据
    async getTodayStats() {
        try {
            const dbType = getDBType();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const appointmentModel = getAppointmentModel();

            if (dbType === 'mongodb') {
                // MongoDB查询逻辑
                const stats = await appointmentModel.getCollection().aggregate([
                    {
                        $match: {
                            created_at: {
                                $gte: today,
                                $lt: tomorrow
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 }
                        }
                    }
                ]).toArray();

                console.log('databoard.handler.js -> stats', stats)

                // 转换为前端需要的格式
                const result = {
                    pending: 0,
                    confirmed: 0,
                    in_progress: 0,
                    completed: 0,
                    cancelled: 0,
                    broken: 0,
                    total: 0
                };

                stats.forEach(stat => {
                    console.log('databoard.handler.js -> stat._id,stat.count', stat._id, stat.count)
                    const status = stat._id;
                    const count = stat.count;
                    result[status] = count;
                    result.total += count;
                });

                // 获取最新的预约列表（最近10条）
                const latestAppointments = await appointmentModel.getCollection().find({
                    created_at: { $gte: today, $lt: tomorrow }
                }, {
                    projection: {
                        id: 1,
                        appointment_no: 1,
                        customer_Name: 1,
                        service_name: 1,
                        status: 1,
                        created_at: 1
                    }
                })
                    .sort({ created_at: -1 })
                    .limit(10)
                    .toArray();

                return {
                    stats: result,
                    latestAppointments: latestAppointments.map(apt => ({
                        id: apt._id,
                        appointment_no: apt.appointment_no,
                        customer_Name: apt.customer_Name,
                        service_name: apt.service_name,
                        status: apt.status,
                        created_at: apt.created_at
                    }))
                };
            } else {
                // PostgreSQL查询逻辑 - 使用数据库连接直接查询
                const appointmentModel = getAppointmentModel();
                const pool = appointmentModel.getPool();

                // 获取今日预约统计数据
                const statsQuery = `
                    SELECT status, COUNT(*) as count 
                    FROM appointments 
                    WHERE DATE(created_at) = CURRENT_DATE 
                    GROUP BY status
                `;

                const statsResult = await pool.query(statsQuery);

                // 转换为前端需要的格式
                const result = {
                    pending: 0,
                    confirmed: 0,
                    in_progress: 0,
                    completed: 0,
                    cancelled: 0,
                    broken: 0,
                    total: 0
                };

                statsResult.rows.forEach(row => {
                    const status = row.status;
                    const count = parseInt(row.count);
                    result[status] = count;
                    result.total += count;
                });

                // 获取最新的预约列表（最近10条）
                const appointmentsQuery = `
                    SELECT a.id, a.appointment_no, a.customer_name, s.name as service_name, a.status, a.created_at
                    FROM appointments a
                    LEFT JOIN services s ON a.service_id = s.id
                    WHERE DATE(a.created_at) = CURRENT_DATE 
                    ORDER BY a.created_at DESC 
                    LIMIT 10
                `;

                const appointmentsResult = await pool.query(appointmentsQuery);

                return {
                    stats: result,
                    latestAppointments: appointmentsResult.rows.map(row => ({
                        id: row.id,
                        appointment_no: row.appointment_no,
                        customer_name: row.customer_name,
                        service_name: row.service_name,
                        status: row.status,
                        created_at: row.created_at
                    }))
                };
            }
        } catch (error) {
            console.error('❌ 获取今日统计数据错误:', error);
            return {
                stats: {
                    pending: 0,
                    confirmed: 0,
                    in_progress: 0,
                    completed: 0,
                    cancelled: 0,
                    broken: 0,
                    total: 0
                },
                latestAppointments: []
            };
        }
    }

    // 注册消息处理器
    registerHandlers() {
        this.webSocketServer.registerMessageHandler('subscribe', this.handleSubscribe.bind(this));
    }

    // 推送统计数据更新
    async pushStatsUpdate() {
        try {
            const stats = await this.getTodayStats();
            this.webSocketServer.notifyStatsUpdate(stats);
        } catch (error) {
            console.error('❌ 推送统计数据更新错误:', error);
        }
    }
}

export { DataBoardWebSocketHandler };