import express from 'express'
import { OperationLogController } from './operation-log.controller.js'
import { authenticateAdminToken } from '../../core/middleware/auth.middleware.js';

const router = express.Router()
const operationLogController = new OperationLogController()

// router.use('/', operationLogController.route.bind(operationLogController))

router.post('/',
  authenticateAdminToken, operationLogController.create.bind(operationLogController))
router.delete('/:id',
  authenticateAdminToken, operationLogController.delete.bind(operationLogController))
router.put('/:id',
  authenticateAdminToken, operationLogController.update.bind(operationLogController))
router.get('/',
  authenticateAdminToken, operationLogController.getAll.bind(operationLogController))
router.get('/:id',
  authenticateAdminToken, operationLogController.getById.bind(operationLogController))

router.get('/appointment/:appointmentId',
  authenticateAdminToken,
  operationLogController.getLogsByAppointmentId?.bind(operationLogController))

router.get('/operator/:operator',
  authenticateAdminToken,
  operationLogController.getLogsByOperator?.bind(operationLogController))

export default router