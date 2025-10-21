import { getAppointmentModel } from '../model.factory.js';
import { getDBType } from '../../core/database/database.config.js';

export class ReportsController {
  // 获取日报表数据 - 最近10日
  async getDailyStats(req, res) {
    try {
      const appointmentModel = getAppointmentModel();
      const dbType = getDBType();

      if (dbType === 'mongodb') {
        // MongoDB查询逻辑
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 9); // 最近10天

        const stats = await appointmentModel.getCollection().aggregate([
          {
            $match: {
              created_at: {
                $gte: startDate,
                $lte: endDate
              }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$created_at'
                }
              },
              completed: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
                }
              },
              broken: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'broken'] }, 1, 0]
                }
              },
              canceled: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'canceled'] }, 1, 0]
                }
              },
              total: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ]).toArray();

        // 填充缺失的日期
        const result = this.fillMissingDates(stats, startDate, endDate, 'day');
        res.json({ success: true, data: result });
      } else {
        // PostgreSQL查询逻辑 - 使用数据库连接池
        const pool = appointmentModel.getPool();
        const query = `
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as total,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = 'broken' THEN 1 ELSE 0 END) as broken,
            SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END) as canceled
          FROM appointments 
          WHERE created_at >= CURRENT_DATE - INTERVAL '9 days'
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        `;

        const result = await pool.query(query);
        const filledData = this.fillMissingDates(result.rows, new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), new Date(), 'day');
        res.json({ success: true, data: filledData });
      }
    } catch (error) {
      console.error('❌ 获取日报表数据错误:', error);
      res.status(500).json({ success: false, message: '获取日报表数据失败' });
    }
  }

  // 获取月报表数据 - 今年到目前为止
  async getMonthlyStats(req, res) {
    try {
      const appointmentModel = getAppointmentModel();
      const dbType = getDBType();
      const currentYear = new Date().getFullYear();

      if (dbType === 'mongodb') {
        const stats = await appointmentModel.getCollection().aggregate([
          {
            $match: {
              created_at: {
                $gte: new Date(`${currentYear}-01-01`),
                $lte: new Date()
              }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m',
                  date: '$created_at'
                }
              },
              completed: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
                }
              },
              broken: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'broken'] }, 1, 0]
                }
              },
              total: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ]).toArray();

        const result = this.fillMissingMonths(stats, currentYear);
        res.json({ success: true, data: result });
      } else {
        // PostgreSQL查询逻辑 - 使用数据库连接池
        const pool = appointmentModel.getPool();
        const query = `
          SELECT 
            TO_CHAR(created_at, 'YYYY-MM') as month,
            COUNT(*) as total,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = 'broken' THEN 1 ELSE 0 END) as broken
          FROM appointments 
          WHERE EXTRACT(YEAR FROM created_at) = $1
          GROUP BY TO_CHAR(created_at, 'YYYY-MM')
          ORDER BY month ASC
        `;

        const result = await pool.query(query, [currentYear]);
        const filledData = this.fillMissingMonths(result.rows, currentYear);
        res.json({ success: true, data: filledData });
      }
    } catch (error) {
      console.error('❌ 获取月报表数据错误:', error);
      res.status(500).json({ success: false, message: '获取月报表数据失败' });
    }
  }

  // 获取年报表数据 - 最近6年
  async getYearlyStats(req, res) {
    try {
      const appointmentModel = getAppointmentModel();
      const dbType = getDBType();
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 5;

      if (dbType === 'mongodb') {
        const stats = await appointmentModel.getCollection().aggregate([
          {
            $match: {
              created_at: {
                $gte: new Date(`${startYear}-01-01`),
                $lte: new Date()
              }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y',
                  date: '$created_at'
                }
              },
              completed: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
                }
              },
              broken: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'broken'] }, 1, 0]
                }
              },
              total: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ]).toArray();

        const result = this.fillMissingYears(stats, startYear, currentYear);
        res.json({ success: true, data: result });
      } else {
        // PostgreSQL查询逻辑 - 使用数据库连接池
        const pool = appointmentModel.getPool();
        const query = `
          SELECT 
            EXTRACT(YEAR FROM created_at) as year,
            COUNT(*) as total,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = 'broken' THEN 1 ELSE 0 END) as broken
          FROM appointments 
          WHERE EXTRACT(YEAR FROM created_at) BETWEEN $1 AND $2
          GROUP BY EXTRACT(YEAR FROM created_at)
          ORDER BY year ASC
        `;

        const result = await pool.query(query, [startYear, currentYear]);
        const filledData = this.fillMissingYears(result.rows, startYear, currentYear);
        res.json({ success: true, data: filledData });
      }
    } catch (error) {
      console.error('❌ 获取年报表数据错误:', error);
      res.status(500).json({ success: false, message: '获取年报表数据失败' });
    }
  }

  // 填充缺失的日期
  fillMissingDates(data, startDate, endDate, type) {
    const result = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      const monthStr = current.toISOString().substring(0, 7);
      const yearStr = current.getFullYear().toString();

      let found = null;
      if (type === 'day') {
        found = data.find(item => item._id === dateStr || item.date === dateStr);
      } else if (type === 'month') {
        found = data.find(item => item._id === monthStr || item.month === monthStr);
      } else if (type === 'year') {
        found = data.find(item => item._id === yearStr || item.year == yearStr);
      }

      if (found) {
        result.push({
          date: type === 'day' ? dateStr : (type === 'month' ? monthStr : yearStr),
          total: found.total || 0,
          completed: found.completed || 0,
          broken: found.broken || 0,
          canceled: found.canceled || 0
        });
      } else {
        result.push({
          date: type === 'day' ? dateStr : (type === 'month' ? monthStr : yearStr),
          total: 0,
          completed: 0,
          broken: 0,
          canceled: 0
        });
      }

      if (type === 'day') {
        current.setDate(current.getDate() + 1);
      } else if (type === 'month') {
        current.setMonth(current.getMonth() + 1);
      } else {
        current.setFullYear(current.getFullYear() + 1);
      }
    }

    return result;
  }

  // 填充缺失的月份
  fillMissingMonths(data, year) {
    const result = [];
    for (let month = 1; month <= 12; month++) {
      const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
      const found = data.find(item => item._id === monthStr || item.month === monthStr);

      if (found) {
        result.push({
          month: monthStr,
          total: found.total || 0,
          completed: found.completed || 0,
          broken: found.broken || 0,
          canceled: found.canceled || 0
        });
      } else {
        result.push({
          month: monthStr,
          total: 0,
          completed: 0,
          broken: 0,
          canceled: 0
        });
      }
    }
    return result;
  }

  // 填充缺失的年份
  fillMissingYears(data, startYear, endYear) {
    const result = [];
    for (let year = startYear; year <= endYear; year++) {
      const found = data.find(item => item._id === year.toString() || item.year == year);

      if (found) {
        result.push({
          year: year.toString(),
          total: found.total || 0,
          completed: found.completed || 0,
          broken: found.broken || 0,
          canceled: found.canceled || 0
        });
      } else {
        result.push({
          year: year.toString(),
          total: 0,
          completed: 0,
          broken: 0,
          canceled: 0
        });
      }
    }
    return result;
  }
}