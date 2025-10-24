/**
 * 枚举API路由
 * 提供前端获取枚举数据的接口
 */

import express from 'express';
import { BaseController } from '../modules/base.controller.js';

const baseController = new BaseController(null, 'enums')

const router = express.Router();

router.use('/', baseController.route.bind(baseController));

export default router;