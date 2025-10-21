import express from 'express'
import { JWTUtil } from '../core/utils/jwt.util.js'
import {
  authenticateUserToken
} from '../core/middleware/auth.middleware.js';
import { successResponse, errorResponse } from '../core/utils/response.util.js'
import {
  AppointmentController
} from '../modules/appointment/appointment.controller.js';

const router = express.Router()
const appointmentController = new AppointmentController();


// 生成用户token
router.post('/generate-token', async (req, res) => {
  try {
    const { phone, device_id } = req.body
    // console.log('/generate-token -> phone,device_id', phone, device_id)

    if (!phone || !device_id) {
      return res.status(400).json(errorResponse('手机号和设备ID不能为空'))
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return res.status(400).json(errorResponse('手机号格式不正确'))
    }

    // 生成用户token
    const payload = {
      id: phone,
      phone: phone,
      role: 'user'
    }

    const token = JWTUtil.generateAccessToken(payload, device_id)

    res.json(successResponse({
      token: token,
      expires_in: 24 * 60 * 60 // 24小时
    }, 'Token生成成功'))

  } catch (error) {
    console.error('生成用户token失败:', error)
    res.status(500).json(errorResponse('生成用户token失败'))
  }
})

// 验证用户token
router.post('/verify-token', async (req, res) => {
  try {
    const { token, device_id } = req.body

    if (!token) {
      return res.status(400).json(errorResponse('Token不能为空'))
    }

    const decoded = JWTUtil.verifyToken(token, device_id)

    if (!decoded) {
      return res.status(401).json(errorResponse('Token无效或已过期'))
    }

    res.json(successResponse({
      valid: true,
      user_info: {
        phone: decoded.phone,
        device_id: decoded.device_id,
        role: decoded.role
      }
    }, 'Token验证成功'))

  } catch (error) {
    // console.error('验证用户token失败:', error)
    res.status(500).json(errorResponse('验证用户token失败'))
  }
})

// 刷新用户token
router.post('/refresh-token', async (req, res) => {
  try {
    const { token, device_id } = req.body

    if (!token) {
      return res.status(400).json(errorResponse('Token不能为空'))
    }

    const decoded = JWTUtil.verifyToken(token, device_id)

    if (!decoded) {
      return res.status(401).json(errorResponse('原Token无效或已过期'))
    }

    // 生成新的token
    const newPayload = {
      id: decoded.phone,
      phone: decoded.phone,
      device_id: decoded.device_id,
      role: 'user'
    }

    const newToken = JWTUtil.generateAccessToken(newPayload, device_id)

    res.json(successResponse({
      token: newToken,
      expires_in: 24 * 60 * 60 // 24小时
    }, 'Token刷新成功'))

  } catch (error) {
    // console.error('刷新用户token失败:', error)
    res.status(500).json(errorResponse('刷新用户token失败'))
  }
})


router.get('/appointments', authenticateUserToken, appointmentController.getUserAppointments.bind(appointmentController));

export default router