import express from 'express';
import {
	ServiceController
} from './service.controller.js';
import {
	serviceValidation
} from './service.validation.js';
import {
	validateRequest
} from '../../core/middleware/validation.middleware.js';
import {
	authenticateAdmin
} from '../auth/auth.middleware.js';

const router = express.Router();
const serviceController = new ServiceController();

// 公开路由
router.get('/', serviceController.getServices.bind(serviceController));
router.get('/:id', serviceController.getServiceById.bind(serviceController));

// 需要管理员认证的路由
router.post(
	'/',
	authenticateAdmin,
	validateRequest(serviceValidation.create),
	serviceController.createService.bind(serviceController)
);

router.put(
	'/:id',
	authenticateAdmin,
	validateRequest(serviceValidation.update),
	serviceController.updateService.bind(serviceController)
);

router.delete(
	'/:id',
	authenticateAdmin,
	serviceController.deleteService.bind(serviceController)
);

export default router;