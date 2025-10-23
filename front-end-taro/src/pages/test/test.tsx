import React from 'react'
import { View, Text, Button, Picker, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { withAuth } from '../../shared/withAuth/withAuth'


const TestPage: React.FC = () => {
  const title = '测试页'
  return (
    <View className="layout">
      <View style='font-size:40rpx;'>I am a test Page</View>
      <View style='font-size:40rpx;'>{title}</View>
    </View>
  )
}

export default withAuth(TestPage)