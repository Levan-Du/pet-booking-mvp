import express from 'express';
import { authenticateAdminToken } from '../core/middleware/auth.middleware.js';
import { ReportsController } from '../modules/reports/reports.controller.js';

const router = express.Router();
const reportsController = new ReportsController();

// 获取日报表数据 - 最近10日
router.get('/daily', authenticateAdminToken, reportsController.getDailyStats.bind(reportsController));

// 获取月报表数据 - 今年到目前为止
router.get('/monthly', authenticateAdminToken, reportsController.getMonthlyStats.bind(reportsController));

// 获取年报表数据 - 最近6年
router.get('/yearly', authenticateAdminToken, reportsController.getYearlyStats.bind(reportsController));

export default router;