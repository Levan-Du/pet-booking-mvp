import express from 'express';
import {
	AdminController
} from './admin.controller.js';

const router = express.Router();
const adminController = new AdminController();

router.use('/', adminController.route.bind(adminController))
// router.use('/', (req, res, next) => {
// 	console.log('admin.routes.js -> req.path', req.path)
// })

export default router;