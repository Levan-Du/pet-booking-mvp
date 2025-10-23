// shared/withAuth/withAuth.tsx - 修复版本
import { View, Text } from '@tarojs/components'
import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { authUtils } from '../../utils/authUtils'
import { apiRequest } from '../../utils/requestUtils'
import { API_URLS } from '../../shared/constants'

export interface navOptions {
  redirectTo?: string
}

//WrappedComponent: React.ComponentType<any>
export const withAuth = (WrappedComponent: React.FC, options: navOptions = {}) => {
  const { redirectTo = '/pages/admin/login' } = options;

  console.log('withAuth.tsx -> 高阶组件初始化')

  return function AuthWrapper(props: any) {
    const [authState, setAuthState] = useState({
      isAuthenticated: false,
      checking: true,
      error: null as string | null
    });

    useEffect(() => {
      console.log('withAuth.tsx -> useEffect 执行')

      let isMounted = true;

      const checkAuthentication = async () => {
        console.log('withAuth.tsx -> 开始认证检查')

        try {
          const token = authUtils.getToken();
          console.log('withAuth.tsx -> 获取到的token:', token ? '有token' : '无token')

          if (!token) {
            console.log('withAuth.tsx -> 没有token，跳转登录')
            throw new Error('没有token');
          }

          // 验证 token 是否有效
          console.log('withAuth.tsx -> 开始API验证')
          const response = await apiRequest({
            url: API_URLS.ADMIN_CHECK_TOKEN_URL,
            method: 'GET'
          })

          console.log('withAuth.tsx -> API验证结果:', response)

          if (response && response.data && response.data.success && isMounted) {
            console.log('withAuth.tsx -> 认证成功')
            setAuthState({
              isAuthenticated: true,
              checking: false,
              error: null
            });
          } else {
            console.log('withAuth.tsx -> 认证失败，response:', response)
            throw new Error('Token无效或响应格式错误');
          }
        } catch (error: any) {
          console.error('withAuth.tsx -> 认证过程出错:', error)

          if (isMounted) {
            setAuthState({
              isAuthenticated: false,
              checking: false,
              error: error.message
            });
          }

          // 延迟跳转，确保组件已经渲染
          setTimeout(() => {
            try {
              const currentPages = Taro.getCurrentPages();
              console.log('withAuth.tsx -> 当前页面栈:', currentPages)

              let currentPath = '/pages/management/management';
              if (currentPages.length > 0) {
                const currentPage = currentPages[currentPages.length - 1];
                currentPath = `${currentPage.route}`;
              }

              console.log('withAuth.tsx -> 跳转到登录页，来源:', currentPath)

              Taro.redirectTo({
                url: `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
              });
            } catch (redirectError) {
              console.error('withAuth.tsx -> 跳转失败:', redirectError)
              // 如果跳转失败，尝试基本跳转
              Taro.redirectTo({
                url: redirectTo
              });
            }
          }, 100);
        }
      };

      checkAuthentication();

      return () => {
        isMounted = false;
      };
    }, []);

    console.log('withAuth.tsx -> 渲染状态:', authState)

    // 验证中显示加载状态
    if (authState.checking) {
      return (
        <View style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200rpx'
        }}>
          <Text>验证登录状态中...</Text>
        </View>
      );
    }

    // 验证通过，渲染原组件
    if (authState.isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    // 验证失败，显示错误信息（跳转会在setTimeout中执行）
    return (
      <View style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200rpx'
      }}>
        <Text>认证失败: {authState.error}</Text>
        <Text>正在跳转到登录页...</Text>
      </View>
    );
  };
};