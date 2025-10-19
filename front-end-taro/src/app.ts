import React from 'react'
import Taro from '@tarojs/taro'
import { LanguageProvider } from './shared/i18n/LanguageContext'
import './app.scss'

function App({ children }: any) {
  Taro.useLaunch(() => {
    console.log('App launched.')
  })

  return React.createElement(LanguageProvider, null, children)
}

export default App