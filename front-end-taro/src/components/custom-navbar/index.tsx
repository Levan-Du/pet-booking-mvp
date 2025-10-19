import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import NavbarMenu from '../navbar-menu'
import './custom-navbar.scss'

interface CustomNavbarProps {
  title: string
  showBack?: boolean
  backText?: string
  rightButton?: {
    text: string
    onClick: () => void
  }
  showLanguageSwitcher?: boolean
  showScanButton?: boolean
  showMenu?: boolean
  onScanClick?: () => void
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({
  title,
  showBack = true,
  backText = '返回',
  rightButton,
  showLanguageSwitcher = true,
  showScanButton = false,
  showMenu = true,
  onScanClick
}) => {
  const { t } = useLanguage()
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
      <View className='navbar-right'>
        {showMenu && <NavbarMenu
          showScanButton={showScanButton}
          onScanClick={onScanClick}
          showLanguageSwitcher={showLanguageSwitcher}
        />}
        {rightButton && (
          <View className='right-button-container' onClick={rightButton.onClick}>
            <Text className='right-button'>{rightButton.text}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default CustomNavbar