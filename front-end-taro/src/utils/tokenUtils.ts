import Taro from '@tarojs/taro'
import { API_URLS } from '../shared/constants'


// 生成设备ID
const generateDeviceId = (): string => {
  return 'device_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
}

// 获取设备ID
export const getDeviceId = (): string => {
  let deviceId = Taro.getStorageSync('device_id')
  if (!deviceId) {
    deviceId = generateDeviceId()
    Taro.setStorageSync('device_id', deviceId)
  }
  return deviceId
}

// 生成用户token
export const generateUserToken = async (phone: string): Promise<string | null> => {
  try {
    const deviceId = getDeviceId()

    const response = await Taro.request({
      url: API_URLS.GENERATE_TOKEN_URL,
      method: 'POST',
      data: {
        phone: phone,
        device_id: deviceId
      }
    })

    if (response.statusCode === 200 && response.data.success) {
      const token = response.data.data.token
      setUserToken(token)
      return token
    } else {
      console.error('生成token失败:', response.data.message)
      return null
    }
  } catch (error) {
    console.error('生成token请求失败:', error)
    return null
  }
}

// 验证用户token
export const verifyUserToken = async (token: string): Promise<boolean> => {
  try {
    const response = await Taro.request({
      url: API_URLS.VERIFY_TOKEN_URL,
      method: 'POST',
      data: {
        token: token
      }
    })

    return response.statusCode === 200 && response.data.success
  } catch (error) {
    console.error('验证token请求失败:', error)
    return false
  }
}

// 获取当前用户token
export const getUserToken = (): string | null => {
  return Taro.getStorageSync('user_token') || null
}

// 设置用户token
export const setUserToken = (token: string): void => {
  Taro.setStorageSync('user_token', token)
}

// 清除用户token
export const clearUserToken = (): void => {
  Taro.removeStorageSync('user_token')
}

// 检查用户是否有预约单
export const hasAppointment = (): boolean => {
  const appointments = Taro.getStorageSync('user_appointments') || []
  return appointments.length > 0
}

// 保存用户预约单
export const saveUserAppointment = (appointment: any): void => {
  const appointments = Taro.getStorageSync('user_appointments') || []
  appointments.push(appointment)
  Taro.setStorageSync('user_appointments', appointments)
}

// 获取用户预约单
export const getUserAppointments = (): any[] => {
  return Taro.getStorageSync('user_appointments') || []
}

// 检查用户登录状态和预约状态
export const checkUserStatus = (): { hasToken: boolean; hasAppointment: boolean } => {
  const token = getUserToken()
  const appointment = hasAppointment()
  return { hasToken: !!token, hasAppointment: appointment }
}