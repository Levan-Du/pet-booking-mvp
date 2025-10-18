import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './custom-navbar.scss'

interface CustomNavbarProps {
  title: string
  showBack?: boolean
  backText?: string
  rightButton?: {
    text: string
    onClick: () => void
  }
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ 
  title, 
  showBack = true,
  backText = '返回',
  rightButton
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
      {rightButton && (
        <View className='navbar-right' onClick={rightButton.onClick}>
          <Text className='right-button'>{rightButton.text}</Text>
        </View>
      )}
    </View>
  )
}

export default CustomNavbar