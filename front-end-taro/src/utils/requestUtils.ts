import Taro from '@tarojs/taro'
import { authUtils } from './authUtils'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: any
}

// 请求工具类
export const apiRequest = async (options: RequestOptions) => {
  try {
    // 获取存储的token
    const token = authUtils.getToken()

    const requestOptions = {
      ...options,
      header: { 
        ...(options.header ? options.header : {}), 
        'Content-Type': 'application/json',
        authorization: token ? `Bearer ${token}` : ''
      },
      timeout: 10000
    }

    const response = await Taro.request(requestOptions)

    return response
  } catch (error) {
    console.error('API请求失败:', error)
    throw error
  }
}