import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import LanguageSwitcher from '../../shared/i18n/LanguageSwitcher'
import { apiRequest } from '../../utils/requestUtils'
import './navbar-menu.scss'

interface NavbarMenuProps {
  showScanButton?: boolean
  showLanguageSwitcher?: boolean
  onScanClick?: () => void
}

const NavbarMenu: React.FC<NavbarMenuProps> = ({
  showScanButton = false,
  showLanguageSwitcher = true,
  onScanClick
}) => {
  const { t } = useLanguage()
  const [showMenu, setShowMenu] = React.useState(false)
  const [showLanguageModal, setShowLanguageModal] = React.useState(false)

  const handleMenuClick = () => {
    setShowMenu(!showMenu)
  }

  const handleScanClick = () => {
    setShowMenu(false)
    onScanClick?.()
  }

  const handleLanguageClick = () => {
    setShowMenu(false)
    setShowLanguageModal(true)
  }

  const handleOperationLogClick = async () => {
    setShowMenu(false)

    // 记录查看操作日志的操作
    try {
      await apiRequest({
        url: 'http://localhost:3000/api/operation-logs',
        method: 'POST',
        data: {
          operation_type: 'view_operation_log',
          operator: 'admin', // 实际应该从登录信息获取
          details: '查看操作日志页面'
        }
      })
    } catch (error) {
      console.error('记录操作日志失败:', error)
    }

    Taro.navigateTo({ url: '/pages/operation-log/operation-log' })
  }

  const handleDataReportClick = () => {
    setShowMenu(false)
    Taro.navigateTo({ url: '/pages/reports/reports' })
  }



  return (
    <View className='navbar-menu'>
      <View className='menu-button' onClick={handleMenuClick}>
        <Text className='menu-icon'>☰</Text>
      </View>

      {showMenu && (
        <View className='menu-dropdown'>
          {showScanButton && (
            <View className='menu-item' onClick={handleScanClick}>
              <Text className='menu-icon'>📷</Text>
              <Text className='menu-text'>{t('navbar.scan_signin')}</Text>
            </View>
          )}

          {showLanguageSwitcher && (
            <View className='menu-item' onClick={handleLanguageClick}>
              <Text className='menu-icon'>🌐</Text>
              <Text className='menu-text'>{t('navbar.switch_language')}</Text>
            </View>
          )}

          <View className='menu-item' onClick={handleOperationLogClick}>
            <Text className='menu-icon'>📋</Text>
            <Text className='menu-text'>{t('navbar.operation_log')}</Text>
          </View>

          <View className='menu-item' onClick={handleDataReportClick}>
            <Text className='menu-icon'>📊</Text>
            <Text className='menu-text'>{t('navbar.data_report')}</Text>
          </View>
        </View>
      )}

      {showLanguageModal && (
        <View className='modal-overlay' onClick={() => setShowLanguageModal(false)}>
          <View className='modal-content' onClick={(e) => e.stopPropagation()}>
            <LanguageSwitcher />
          </View>
        </View>
      )}
    </View>
  )
}

export default NavbarMenu