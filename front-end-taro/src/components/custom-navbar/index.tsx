import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './custom-navbar.scss'

interface CustomNavbarProps {
  title: string
  showBack?: boolean
  backText?: string
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ 
  title, 
  showBack = true,
  backText = '返回'
}) => {
  const handleBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className='custom-navbar'>
      {showBack && (
        <View className='navbar-left' onClick={handleBack}>
          <Text className='back-icon'>←</Text>
          <Text className='back-text'>{backText}</Text>
        </View>
      )}
      <Text className='navbar-title'>{title}</Text>
    </View>
  )
}

export default CustomNavbar