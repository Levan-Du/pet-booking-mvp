import express from 'express'
import { OperationLogController } from './operation-log.controller.js'

const router = express.Router()
const operationLogController = new OperationLogController()

router.use('/', operationLogController.route.bind(operationLogController))

export default router