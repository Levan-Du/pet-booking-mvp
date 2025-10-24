import express from 'express'
import {
  UserController
} from '../modules/user/user.controller.js';

const router = express.Router()
const userController = new UserController();

router.use('/', userController.route.bind(userController))

export default router