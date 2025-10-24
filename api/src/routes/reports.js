import express from 'express';
import { ReportsController } from '../modules/reports/reports.controller.js';

const router = express.Router();
const reportsController = new ReportsController();

// 获取日报表数据 - 最近10日
router.use('/', reportsController.route.bind(reportsController));

export default router;