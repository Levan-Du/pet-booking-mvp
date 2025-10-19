import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import { useLanguage } from './LanguageContext'
import './LanguageSwitcher.scss'

interface LanguageSwitcherProps {
  className?: string
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { locale, setLocale, availableLocales, t } = useLanguage()

  const handleLanguageSelect = (code: string) => {
    setLocale(code as any)
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