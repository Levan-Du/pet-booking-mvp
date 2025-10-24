import express from 'express';
import {
	ServiceController
} from './service.controller.js';

const router = express.Router();
const serviceController = new ServiceController();

router.use('/', serviceController.route.bind(serviceController))

export default router;