/**
 * 枚举API路由
 * 提供前端获取枚举数据的接口
 */

import express from 'express';
import { BaseController } from '../modules/base.controller.js';

const baseController = new BaseController(null, '')

const router = express.Router();

// router.use('/', baseController.route.bind(baseController));


router.get('/', baseController.getAllEnums?.bind(baseController))
router.get('/pet-types', baseController.getPetTypes?.bind(baseController))
router.get('/pet-sizes', baseController.getPetSize?.bind(baseController))
router.get('/appointment-status', baseController.getAppointmentStatus?.bind(baseController))

export default router;