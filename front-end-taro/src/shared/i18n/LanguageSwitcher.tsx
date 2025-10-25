import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLanguage } from './LanguageContext'
import './LanguageSwitcher.scss'

interface LanguageSwitcherProps {
  className?: string
}

// 获取tabBar文本
const getTabBarTexts = (locale: string) => {
  if (locale === 'en-US') {
    return {
      management: 'Appointment Management',
      databoard: 'Data Board',
      reports: 'Reports'
    }
  }
  return {
    management: '预约管理',
    databoard: '数据看板',
    reports: '报表'
  }
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { locale, setLocale, availableLocales, t } = useLanguage()

  const handleLanguageSelect = (code: string) => {
    setLocale(code as any)

    // 更新tabBar文本
    const tabBarTexts = getTabBarTexts(code)

    // 更新management tabBar
    Taro.setTabBarItem({
      index: 0,
      text: tabBarTexts.management
    })

    // 更新databoard tabBar
    Taro.setTabBarItem({
      index: 1,
      text: tabBarTexts.databoard
    })

    // 更新reports tabBar
    Taro.setTabBarItem({
      index: 2,
      text: tabBarTexts.reports
    })
  }

  const getFlagIcon = (code: string) => {
    switch (code) {
      case 'zh-CN':
        return '🇨🇳'
      case 'en-US':
        return '🇺🇸'
      default:
        return '🌐'
    }
  }

  return (
    <View className={`language-switcher ${className}`}>
      <View className="language-modal">
        <Text className="language-title">{t('language.select_language')}</Text>
        <View className="language-list">
          {availableLocales.map((lang) => (
            <Button
              key={lang.code}
              className={`language-item ${locale === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <Text className="language-flag">{getFlagIcon(lang.code)}</Text>
              <Text className="language-name">{lang.name}</Text>
            </Button>
          ))}
        </View>
      </View>
    </View>
  )
}

export default LanguageSwitcher