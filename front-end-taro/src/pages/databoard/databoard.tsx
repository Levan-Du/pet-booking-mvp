import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import './databoard.scss'
import Taro, { useReady } from '@tarojs/taro'
import CustomNavbar from '../../components/custom-navbar'
import { apiRequest } from '../../utils/requestUtils'
import { useLanguage } from '../../shared/i18n/LanguageContext'

const DataBoard: React.FC = () => {
  const { t } = useLanguage()
  const [todayStats, setTodayStats] = React.useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0
  })

  const loadTodayStats = async () => {
    try {
      const response = await apiRequest({
        url: 'http://localhost:3000/api/reports/today',
        method: 'GET'
      })

      if (response.data.success) {
        setTodayStats(response.data.data)
      }
    } catch (error) {
      console.error('加载今日统计数据失败:', error)
    }
  }

  useReady(() => {
    loadTodayStats()

    // 每分钟查询一次数据
    const interval = setInterval(loadTodayStats, 60000)

    return () => clearInterval(interval)
  })

  return (
    <View className='layout'>
      <CustomNavbar title={t('nav.databoard')} />
      <View className='container databoard'>
        <View className='content-container databoard'>
          <View className='data-row card'>
            <View className="data-row-title card">
              <Text>{t('databoard.today_data')}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.total_appointments')}:</Text>
              <Text className='value'>{todayStats.total}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.pending')}:</Text>
              <Text className='value pending'>{todayStats.pending}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.confirmed')}:</Text>
              <Text className='value confirmed'>{todayStats.confirmed}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.in_progress')}:</Text>
              <Text className='value in-progress'>{todayStats.in_progress}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.completed')}:</Text>
              <Text className='value completed'>{todayStats.completed}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.no_show')}:</Text>
              <Text className='value no-show'>{todayStats.no_show}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.cancelled')}:</Text>
              <Text className='value cancelled'>{todayStats.cancelled}</Text>
            </View>
          </View>
        </View>
      </View>

    </View>
  )
}

export default DataBoard