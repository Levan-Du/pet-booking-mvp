import OperationLogService from './operation-log.service.js'
import { BaseController } from '../base.controller.js';

export class OperationLogController extends BaseController {
  constructor() {
    super(null, 'operation-logs')
    this.operationLogService = new OperationLogService()
  }

  buildRouteMap() {
    return {
      ...super.buildRouteMap(),
      '/appointment/:appointmentId': {
        handler: this.getLogsByAppointmentId?.bind(this),
        middlewares: [this.authenticateAdminToken] // 需要认证
      },
      '/operator/:operator': {
        handler: this.getLogsByOperator?.bind(this),
        middlewares: [this.authenticateAdminToken] // 需要认证
      },
    }
  }

  async create(req, res, next) {
    try {
      const operationData = req.body

      // 验证必需字段
      if (!operationData.operation_type || !operationData.operator) {
        return res.status(400).json({
          success: false,
          message: '操作类型和操作员为必填字段'
        })
      }

      const result = await this.operationLogService.createOperationLog(operationData)

      if (result.success) {
        res.status(201).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      console.error('创建操作日志控制器错误:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 20

      const result = await this.operationLogService.getOperationLogs(page, limit)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      console.error('获取操作日志控制器错误:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  async getLogsByAppointmentId(req, res) {
    try {
      const { appointmentId } = req.params

      if (!appointmentId) {
        return res.status(400).json({
          success: false,
          message: '预约ID为必填参数'
        })
      }

      const result = await this.operationLogService.getLogsByAppointmentId(appointmentId)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      console.error('获取预约操作日志控制器错误:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  async getLogsByOperator(req, res) {
    try {
      const { operator } = req.params
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 20

      if (!operator) {
        return res.status(400).json({
          success: false,
          message: '操作员为必填参数'
        })
      }

      const result = await this.operationLogService.getLogsByOperator(operator, page, limit)

      if (result.success) {
        res.status(200).json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error) {
      console.error('获取操作员日志控制器错误:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }
}