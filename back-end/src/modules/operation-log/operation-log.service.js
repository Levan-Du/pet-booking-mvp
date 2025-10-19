import OperationLogModel from './operation-log.model.js'

export class OperationLogService {
  constructor() {
    this.operationLogModel = new OperationLogModel()
  }

  async createOperationLog(operationData) {
    try {
      const result = await this.operationLogModel.create(operationData)
      return {
        success: true,
        data: result,
        message: '操作日志创建成功'
      }
    } catch (error) {
      console.error('创建操作日志失败:', error)
      return {
        success: false,
        message: '创建操作日志失败'
      }
    }
  }

  async getOperationLogs(page = 1, limit = 20) {
    try {
      const result = await this.operationLogModel.findAll(page, limit)
      return {
        success: true,
        data: result,
        message: '获取操作日志成功'
      }
    } catch (error) {
      console.error('获取操作日志失败:', error)
      return {
        success: false,
        message: '获取操作日志失败'
      }
    }
  }

  async getLogsByAppointmentId(appointmentId) {
    try {
      const logs = await this.operationLogModel.findByAppointmentId(appointmentId)
      return {
        success: true,
        data: logs,
        message: '获取预约操作日志成功'
      }
    } catch (error) {
      console.error('获取预约操作日志失败:', error)
      return {
        success: false,
        message: '获取预约操作日志失败'
      }
    }
  }

  async getLogsByOperator(operator, page = 1, limit = 20) {
    try {
      const result = await this.operationLogModel.findByOperator(operator, page, limit)
      return {
        success: true,
        data: result,
        message: '获取操作员日志成功'
      }
    } catch (error) {
      console.error('获取操作员日志失败:', error)
      return {
        success: false,
        message: '获取操作员日志失败'
      }
    }
  }
}

export default OperationLogService