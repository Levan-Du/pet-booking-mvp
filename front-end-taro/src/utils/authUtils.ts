import Taro from '@tarojs/taro'

// Token管理工具
export const authUtils = {
  // 存储token
  setToken(token: string): boolean {
    try {
      Taro.setStorageSync('admin_token', token)
      return true
    } catch (error) {
      console.error('存储token失败:', error)
      return false
    }
  },

  // 获取token
  getToken(): string | null {
    try {
      return Taro.getStorageSync('admin_token')
    } catch (error) {
      console.error('获取token失败:', error)
      return null
    }
  },

  // 清除token
  clearToken(): boolean {
    try {
      Taro.removeStorageSync('admin_token')
      return true
    } catch (error) {
      console.error('清除token失败:', error)
      return false
    }
  },

  isLoggedIn(): boolean {
    try {
      return !!this.getToken()
    } catch (error) {
      console.error('清除token失败:', error)
      return false
    }
  }
}

