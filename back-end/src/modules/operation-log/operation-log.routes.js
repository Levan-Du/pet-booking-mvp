import express from 'express'
import { OperationLogController } from './operation-log.controller.js'

const router = express.Router()
const operationLogController = new OperationLogController()

// 创建操作日志
router.post('/', operationLogController.createOperationLog.bind(operationLogController))

// 获取所有操作日志（分页）
router.get('/', operationLogController.getOperationLogs.bind(operationLogController))

// 根据预约ID获取操作日志
router.get('/appointment/:appointmentId', operationLogController.getLogsByAppointmentId.bind(operationLogController))

// 根据操作员获取操作日志（分页）
router.get('/operator/:operator', operationLogController.getLogsByOperator.bind(operationLogController))

export default router