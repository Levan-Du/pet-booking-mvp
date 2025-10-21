import React from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { authUtils } from '../../utils/authUtils'
import { apiRequest } from '../../utils/requestUtils'
import CustomNavbar from '../../components/custom-navbar/custom-navbar'
import { API_URLS } from '../../shared/constants'
import './login.scss'

const Login: React.FC = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  React.useEffect(() => {
    // checkToken()
  }, [])

  const checkToken = async () => {
    // try {
    //   const response = await apiRequest({
    //     url: 'http://localhost:3000/api/admin/checkToken',
    //     method: 'POST',
    //     data: {
    //       username: username,
    //       password: password
    //     }
    //   })

    //   if (response.data.success) {
    //     Taro.navigateTo({
    //       url: '/pages/dashboard/dashboard'
    //     })
    //   }
    // } catch (error) {
    //   // Token检查失败，继续显示登录页面
    // }
  }

  const handleLogin = async () => {
    if (!username || !password) {
      Taro.showToast({
        title: '请输入用户名和密码',
        icon: 'error'
      })
      return
    }

    try {
      const response = await Taro.request({
        url: API_URLS.ADMIN_LOGIN_URL,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          username: username,
          password: password
        }
      })

      if (response.data.success) {
        // 存储访问令牌（accessToken）而不是刷新令牌
        const accessToken = response.data.data.accessToken
        authUtils.setToken(accessToken)

        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })

        Taro.navigateTo({
          url: '/pages/management/management'
        })
      } else {
        Taro.showToast({
          title: response.data.message || '登录失败',
          icon: 'error'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'error'
      })
    }
  }

  return (
    <View className='layout page-login'>
      <CustomNavbar title="管理员登录" showBack={false} showMenu={false} />
      <View className='container'>
        <View className="content-container">
          <View className='login-form'>
            <Text className='title'>管理员登录</Text>

            <View className='form-item'>
              <Text className='label'>用户名</Text>
              <Input
                value={username}
                placeholder='请输入用户名'
                className='input'
                onInput={(e) => setUsername(e.detail.value)}
              />
            </View>

            <View className='form-item'>
              <Text className='label'>密码</Text>
              <Input
                value={password}
                placeholder='请输入密码'
                type='password'
                className='input'
                onInput={(e) => setPassword(e.detail.value)}
              />
            </View>

            <Button onClick={handleLogin} className='login-btn'>
              登录
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Login