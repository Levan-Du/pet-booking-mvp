import express from 'express';
import { ServiceController } from './service.controller.js';
import { serviceValidation } from './service.validation.js';
import { validateRequest } from '../../core/middleware/validation.middleware.js';
import { authenticateAdminToken } from '../../core/middleware/auth.middleware.js';

const router = express.Router();
const serviceController = new ServiceController();

// router.use('/', serviceController.route.bind(serviceController))

router.post('/',
  authenticateAdminToken, serviceController.create.bind(serviceController))
router.delete('/:id',
  authenticateAdminToken, serviceController.delete.bind(serviceController))
router.put('/:id',
  authenticateAdminToken, serviceController.update.bind(serviceController))
router.get('/',
  authenticateAdminToken, serviceController.getAll.bind(serviceController))
router.get('/:id',
  authenticateAdminToken, serviceController.getById.bind(serviceController))

export default router;