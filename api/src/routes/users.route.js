import express from 'express'
import { UserController } from '../modules/user/user.controller.js';
import { appointmentValidation } from '../modules/appointment/appointment.validation.js';
import { validateRequest } from '../core/middleware/validation.middleware.js';
import { authenticateUserToken, authenticateAdminToken } from '../core/middleware/auth.middleware.js';

const router = express.Router()
const userController = new UserController();

// router.use('/', userController.route.bind(userController))

router.post('/profile',
  authenticateAdminToken, userController.create.bind(userController))
router.delete('/profile/:id',
  authenticateAdminToken, userController.delete.bind(userController))
router.put('/profile/:id',
  authenticateAdminToken, userController.update.bind(userController))
router.get('/profile',
  authenticateAdminToken, userController.getAll.bind(userController))
router.get('/profile/:id',
  authenticateAdminToken, userController.getById.bind(userController))


router.get('/verify-token', userController.verifyToken?.bind(userController))

router.post('/refresh-token',
  authenticateUserToken, userController.refreshToken?.bind(userController))

router.post('/appointments',
  validateRequest(appointmentValidation.create),
  userController.createAppointment?.bind(userController))

router.get('/appointments',
  authenticateUserToken, userController.getAppointments?.bind(userController))

router.get('/appointments/:id',
  authenticateUserToken, userController.getAppointmentById?.bind(userController))

router.get('/appointments/stats/today',
  authenticateUserToken, userController.getTodayStats?.bind(userController))

router.post('/generate-token', userController.generateToken?.bind(userController))

router.get('/services', userController.getServices?.bind(userController))

router.get('/available-slots', userController.getAvailableSlots?.bind(userController))

export default router