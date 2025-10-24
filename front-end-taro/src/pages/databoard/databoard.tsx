import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import './databoard.scss'
import Taro, { useLoad, useReady, useDidShow, useDidHide } from '@tarojs/taro'
import CustomNavbar from '../../components/custom-navbar/custom-navbar'
import { apiRequest } from '../../utils/requestUtils'
import { useLanguage } from '../../shared/i18n/LanguageContext'
// import { DataBoardWebSocketManager } from '../../utils/websocket'
import { API_URLS } from '../../shared/constants'
import { withAuth } from '../../shared/withAuth/withAuth'

interface Appointment {
  _id: string
  appointmentNo: string
  customerName: string
  customerPhone: string
  serviceType: string
  appointmentTime: string
  status: string
}

const DataBoard: React.FC = () => {
  const { t } = useLanguage()
  const [todayStats, setTodayStats] = React.useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    broken: 0
  })
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  // const [dataBoardWebSocket] = React.useState(() => new DataBoardWebSocketManager())

  // // WebSocket消息处理
  // const handleWebSocketMessage = (stats: any) => {
  //   console.log('databoard.tsx -> handleWebSocketMessage -> stats', stats)
  //   setTodayStats(stats)
  // }

  // const handleNewAppointmentMessage = (appointment) => {
  //   console.log('databoard.tsx -> handleNewAppointmentMessage -> appointment', appointment)
  //   setAppointments((prev => [appointment, ...prev]))
  // }

  // 传统的HTTP请求作为备用方案
  const loadTodayStats = async () => {
    try {
      const response = await apiRequest({
        url: API_URLS.APPOINTMENT_STATS_TODAY_URL,
        method: 'GET'
      })
      console.log('databoard.tsx -> loadTodayStats -> response', response.data)

      if (response.data.success) {
        setTodayStats(response.data.data)
      }
    } catch (error) {
      console.error('加载今日统计数据失败:', error)
    }
  }
  const loadTodayNewAppointments = async () => {
    try {
      const response = await apiRequest({
        url: API_URLS.APPOINTMENT_TODAY_NEW_URL,
        method: 'GET'
      })
      console.log('databoard.tsx -> loadTodayNewAppointments -> response', response.data)

      if (response.data.success) {
        setAppointments(response.data.data)
      }
    } catch (error) {
      console.error('加载今日统计数据失败:', error)
    }
  }

  React.useEffect(() => {
    // // 配置WebSocket消息处理器
    // dataBoardWebSocket.setOnTodayStatsCallback(handleWebSocketMessage)
    // dataBoardWebSocket.setOnTodayNewAppointmentsCallback(handleNewAppointmentMessage)

    // // 页面显示时重新连接WebSocket
    // if (!dataBoardWebSocket.getConnectionStatus()) {
    //   dataBoardWebSocket.connect()
    //   dataBoardWebSocket.subscribe()
    // }

    loadTodayStats()
    loadTodayNewAppointments()

    // 备用方案：每分钟通过HTTP请求更新数据
    const interval = setInterval(loadTodayNewAppointments, 60000)

    return () => {

      clearInterval(interval)
      // dataBoardWebSocket.close()
    }
  }, [])

  return (
    <View className='layout page-databoard'>
      <CustomNavbar title={t('nav.databoard')} />
      <View className='container'>
        <View className='content-container'>
          <View className='data-row card'>
            <View className="data-row-title card">
              <Text>{t('databoard.today_data')}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.total')}</Text>
              <Text className='value'>{todayStats.total}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.pending')}</Text>
              <Text className='value pending'>{todayStats.pending}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.confirmed')}</Text>
              <Text className='value confirmed'>{todayStats.confirmed}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.in_progress')}</Text>
              <Text className='value in-progress'>{todayStats.in_progress}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.completed')}</Text>
              <Text className='value completed'>{todayStats.completed}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.broken')}</Text>
              <Text className='value broken'>{todayStats.broken}</Text>
            </View>
            <View className='card'>
              <Text className='title'>{t('databoard.cancelled')}</Text>
              <Text className='value cancelled'>{todayStats.cancelled}</Text>
            </View>
          </View>
          <View className='appointment-list databoard'>
            <View className="appointment-list-title">
              <Text>{t('databoard.recent_appointments')}</Text>
            </View>
            {appointments.length === 0 ? (
              <View className='no-appointments'>
                <Text>{t('databoard.no_recent_appointments')}</Text>
              </View>
            ) : (
              <ScrollView className='appointment-scroll' scrollY>
                {appointments.map((appointment) => (
                  <View key={appointment._id} className='appointment-item'>
                    <View className='appointment-header'>
                      <Text className='appointment-no'>#{appointment.appointment_no}</Text>
                      <Text className={`appointment-status ${appointment.status}`}>
                        {t(`appointment_status.${appointment.status}`)}
                      </Text>
                    </View>
                    <View className='appointment-info'>
                      <Text className='customer-name'>{appointment.customer_name}</Text>
                      <Text className='customer-phone'>{appointment.customer_phone}</Text>
                    </View>
                    <View className='appointment-details'>
                      <Text className='service-type'>{appointment.service_name}</Text>
                      <Text className='appointment-time'>{appointment.appointment_time}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>

    </View>
  )
}

export default withAuth(DataBoard)