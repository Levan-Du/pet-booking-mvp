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

  return function AuthWrapper(props: any) {
    const [authState, setAuthState] = useState({
      isAuthenticated: false,
      checking: true,
      error: null as string | null
    });

    useEffect(() => {
      let isMounted = true;

      const checkAuthentication = async () => {

        try {
          const token = authUtils.getToken();

          if (!token) {
            throw new Error('没有token');
          }

          // 验证 token 是否有效
          const response = await apiRequest({
            url: API_URLS.AUTH_CHECK_TOKEN_URL,
            method: 'GET'
          })

          if (response && response.data && response.data.success && isMounted) {
            setAuthState({
              isAuthenticated: true,
              checking: false,
              error: null
            });
          } else {
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
              let currentPath = '/pages/management/management';
              if (currentPages.length > 0) {
                const currentPage = currentPages[currentPages.length - 1];
                currentPath = `${currentPage.route}`;
              }

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