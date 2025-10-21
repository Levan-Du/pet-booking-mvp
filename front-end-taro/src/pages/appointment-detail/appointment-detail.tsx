import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import { apiRequest } from '../../utils/requestUtils'
import { formatDate } from '../../utils/time.util'
import CustomNavbar from '../../components/custom-navbar/custom-navbar'
import CustomToolbar from '../../components/custom-toolbar'
import { API_URLS } from '../../shared/constants'
import './appointment-detail.scss'

interface Appointment {
  _id: string
  service_name: string
  customer_name: string
  customer_phone: string
  pet_type: string
  pet_breed: string
  pet_size: string
  appointment_date: string
  appointment_time: string
  status: string
  special_notes?: string
}

const AppointmentDetail: React.FC = () => {
  const { t } = useLanguage()
  const [appointment, setAppointment] = React.useState<Appointment | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('')
  const [loading, setLoading] = React.useState(true)

  const getAppointmentId = () => {
    const params = Taro.getCurrentInstance().router?.params
    return params?.id || ''
  }

  const loadAppointment = async () => {
    const appointmentId = getAppointmentId()
    if (!appointmentId) {
      Taro.showToast({
        title: '预约ID无效',
        icon: 'error'
      })
      Taro.navigateBack()
      return
    }

    setLoading(true)
    try {
      const response = await apiRequest({
        url: `${API_URLS.APPOINTMENTS_URL}/${appointmentId}`,
        method: 'GET'
      })

      if (response.data.success) {
        setAppointment(response.data.data)
        // 生成二维码URL（实际项目中应该由后端生成）
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=appointment:${appointmentId}`)
      }
    } catch (error) {
      Taro.showToast({
        title: t('management.loadFailed') || '加载失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const getPetTypeText = (type: string) => {
    return t(`petTypes.${type}`) || type
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t('management.pending'),
      confirmed: t('management.confirmed'),
      in_progress: t('management.in_progress'),
      completed: t('management.completed'),
      cancelled: t('management.cancelled'),
      broken: t('management.broken')
    }
    return statusMap[status] || status
  }

  React.useEffect(() => {
    loadAppointment()
  }, [])

  if (loading) {
    return (
      <View className="layout page-apm-detail">
        <CustomNavbar title={t('nav.booking') || '预约详情'} />
        <View className="loading">
          <Text>{t('common.loading') || '加载中...'}</Text>
        </View>
      </View>
    )
  }

  if (!appointment) {
    return (
      <View className="layout page-apm-detail">
        <CustomNavbar title={t('nav.booking') || '预约详情'} />
        <View className="error">
          <Text>预约信息不存在</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="layout page-apm-detail">
      <CustomNavbar title={t('nav.booking') || '预约详情'} />
      <View className="container">
        <View className="content-container">
          {/* 预约信息卡片 */}
          <View className="info-card card">
            <View className="card-header">
              <Text className="service-name">{appointment.service_name}</Text>
              <View className={`status-badge ${appointment.status}`}>
                {getStatusText(appointment.status)}
              </View>
            </View>

            <View className="card-content">
              <View className="info-row">
                <Text className="label">{t('management.customer') || '客户'}:</Text>
                <Text className="value">{appointment.customer_name}</Text>
              </View>
              <View className="info-row">
                <Text className="label">{t('management.phone') || '电话'}:</Text>
                <Text className="value">{appointment.customer_phone}</Text>
              </View>
              <View className="info-row">
                <Text className="label">{t('management.pet') || '宠物'}:</Text>
                <Text className="value">
                  {getPetTypeText(appointment.pet_type)} ·
                  {appointment.pet_breed || t('common.unknown') || '未知'} ·
                  {appointment.pet_size}
                </Text>
              </View>
              <View className="info-row">
                <Text className="label">{t('management.time') || '时间'}:</Text>
                <Text className="value">
                  {formatDate(new Date(appointment.appointment_date))} {appointment.appointment_time}
                </Text>
              </View>
              {appointment.special_notes && (
                <View className="info-row">
                  <Text className="label">{t('management.notes') || '备注'}:</Text>
                  <Text className="value notes">{appointment.special_notes}</Text>
                </View>
              )}
            </View>
          </View>

          {/* 二维码区域 */}
          <View className="qr-card card">
            <Text className="qr-title">预约二维码</Text>
            <Text className="qr-desc">到店后请向商家出示此二维码进行签到</Text>

            {qrCodeUrl && (
              <View className="qr-code-container">
                <Image src={qrCodeUrl} className="qr-code" mode="aspectFit" />
              </View>
            )}

            <Text className="qr-tip">商家扫描二维码后，预约状态将更新为"进行中"</Text>
          </View>
        </View>
      </View>
      <CustomToolbar currentPage="appointment-detail" />
    </View>
  )
}

export default AppointmentDetail