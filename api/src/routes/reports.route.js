import express from 'express';
import { ReportsController } from '../modules/reports/reports.controller.js';
import { authenticateAdminToken } from '../core/middleware/auth.middleware.js';

const router = express.Router();
const reportsController = new ReportsController();

// 获取日报表数据 - 最近10日
// router.use('/', reportsController.route.bind(reportsController));

router.post('/',
  authenticateAdminToken, reportsController.getDailyStats.bind(reportsController))

router.get('/daily',
  authenticateAdminToken, reportsController.getDailyStats.bind(reportsController))

router.get('/monthly',
  authenticateAdminToken, reportsController.getMonthlyStats.bind(reportsController))

router.get('/yearly',
  authenticateAdminToken, reportsController.getYearlyStats.bind(reportsController))

export default router;