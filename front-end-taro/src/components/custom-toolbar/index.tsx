import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './custom-toolbar.scss'

interface CustomToolbarProps {
  currentPage?: string
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ currentPage = '' }) => {
  const handleNavigate = (page: string) => {
    switch (page) {
      case 'management':
        Taro.redirectTo({ url: '/pages/management/management' })
        break
      case 'databoard':
        Taro.redirectTo({ url: '/pages/databoard/databoard' })
        break
      case 'reports':
        Taro.redirectTo({ url: '/pages/reports/reports' })
        break
      default:
        break
    }
  }

  return (
    <View className='custom-toolbar'>
      <View 
        className={`toolbar-item ${currentPage === 'management' ? 'active' : ''}`}
        onClick={() => handleNavigate('management')}
      >
        <Text>管理主页</Text>
      </View>
      <View 
        className={`toolbar-item ${currentPage === 'databoard' ? 'active' : ''}`}
        onClick={() => handleNavigate('databoard')}
      >
        <Text>数据看板</Text>
      </View>
      <View 
        className={`toolbar-item ${currentPage === 'reports' ? 'active' : ''}`}
        onClick={() => handleNavigate('reports')}
      >
        <Text>数据统计</Text>
      </View>
    </View>
  )
}

export default CustomToolbar