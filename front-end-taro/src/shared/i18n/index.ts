import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

export type Locale = 'zh-CN' | 'en-US'

export const locales = {
  'zh-CN': zhCN,
  'en-US': enUS
}

export type TranslationKey = keyof typeof zhCN

export const i18n = {
  t(key: string, locale: Locale = 'zh-CN'): string {
    const keys = key.split('.')
    let value: any = locales[locale]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // 返回原key作为fallback
      }
    }

    return typeof value === 'string' ? value : key
  },

  getAvailableLocales(): { code: Locale; name: string }[] {
    return [
      { code: 'zh-CN', name: '中文' },
      { code: 'en-US', name: 'English' }
    ]
  }
}

export default i18n