import express from 'express';
import { AdminController } from './admin.controller.js';
import { authenticateAdminToken } from '../../core/middleware/auth.middleware.js';

const router = express.Router();
const adminController = new AdminController();

// router.use('/', adminController.route.bind(adminController))

router.post('/',
	authenticateAdminToken, adminController.create.bind(adminController))
router.delete('/:id',
	authenticateAdminToken, adminController.delete.bind(adminController))
router.put('/:id',
	authenticateAdminToken, adminController.update.bind(adminController))
router.get('/',
	authenticateAdminToken, adminController.getAll.bind(adminController))
router.get('/:id',
	authenticateAdminToken, adminController.getById.bind(adminController))

router.get('/stats',
	authenticateAdminToken, adminController.getStats.bind(adminController))


export default router;