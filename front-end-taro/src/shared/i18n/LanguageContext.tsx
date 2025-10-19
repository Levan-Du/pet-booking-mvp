import React from 'react'
import Taro from '@tarojs/taro'
import { Locale, i18n } from './index'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  availableLocales: { code: Locale; name: string }[]
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [locale, setLocale] = React.useState<Locale>(() => {
    // 从本地存储获取语言设置，默认为中文
    const saved = Taro?.getStorageSync?.('app_locale')
    return (saved as Locale) || 'zh-CN'
  })

  React.useEffect(() => {
    // 保存语言设置到本地存储
    Taro?.setStorageSync?.('app_locale', locale)
  }, [locale])

  const t = (key: string) => i18n.t(key, locale)

  const value: LanguageContextType = {
    locale,
    setLocale,
    t,
    availableLocales: i18n.getAvailableLocales()
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext