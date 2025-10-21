import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import NavbarMenu from '../navbar-menu/navbar-menu'
import './custom-navbar.scss'

interface CustomNavbarProps {
  title: string
  showBack?: boolean
  backText?: string
  personalCenter?: {
    text: string
    onClick: () => void
  }
  showLanguageSwitcher?: boolean
  showScanButton?: boolean
  showReports?: boolean
  showLog?: boolean
  showMenu?: boolean
  onScanClick?: () => void
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({
  title,
  showBack = true,
  personalCenter = true,
  showLanguageSwitcher = true,
  showScanButton = false,
  showMenu = true,
  showReports = true,
  showLog = true,
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
          <Text className='back-icon iconfont icon-xiangzuo'></Text>
          {/* <Text className='back-text'>{backText}</Text> */}
        </View>
      )}
      <Text className='navbar-title'>{title}</Text>
      <View className='navbar-right'>
        {showMenu && <NavbarMenu
          showScanButton={showScanButton}
          onScanClick={onScanClick}
          showLanguageSwitcher={showLanguageSwitcher}
          showReports={showReports}
          showLog={showLog}
          showPersonal={personalCenter}
        />}
        {/* {personalCenter && (
          <View className='personal-center-container' onClick={personalCenter.onClick}>
            <Text className='personal-center'>{personalCenter.text}</Text>
          </View>
        )} */}
      </View>
    </View>
  )
}

export default CustomNavbar