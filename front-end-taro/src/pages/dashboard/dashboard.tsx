import React from 'react'
import { View, Text, Button, Picker, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiRequest } from '../../utils/requestUtils'
import { formatDate } from '../../utils/time.util'
import CustomNavbar from '../../components/custom-navbar'
import QRScanner from '../../components/qr-scanner'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import './dashboard.scss'

interface Appointment {
  _id: string
  appointment_no: string
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

const Dashboard: React.FC = () => {
  const { t } = useLanguage()

  const statusOptions = [
    { value: 'all', label: t('dashboard.allStatus'), active: true },
    { value: 'pending', label: t('dashboard.pending'), active: true },
    { value: 'confirmed', label: t('dashboard.confirmed'), active: true },
    { value: 'in_progress', label: t('dashboard.in_progress'), active: true },
    { value: 'completed', label: t('dashboard.completed'), active: true },
    { value: 'cancelled', label: t('dashboard.cancelled'), active: true },
    { value: 'no_show', label: t('dashboard.no_show'), active: true }
  ]
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [loading, setLoading] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState(statusOptions[0])
  const [selectedStatusIndex, setSelectedStatusIndex] = React.useState(0)
  const [selectedDate, setSelectedDate] = React.useState('')
  const [showQRScanner, setShowQRScanner] = React.useState(false)
  const [showSignInModal, setShowSignInModal] = React.useState(false)
  const [manualAppointmentNo, setManualAppointmentNo] = React.useState('')

  const loadAppointments = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (selectedStatus.value !== 'all') {
        params.status = selectedStatus.value
      }
      if (selectedDate) {
        params.date = selectedDate
      }

      const response = await apiRequest({
        url: 'http://localhost:3000/api/appointments',
        method: 'GET',
        data: params
      })

      if (response.data.success) {
        setAppointments(response.data.data)
      }
    } catch (error) {
      console.error('加载预约失败:', error)
      Taro.showToast({
        title: t('dashboard.loadFailed'),
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (appointmentId: string, newStatus: string, operationType: string = 'update_status') => {
    try {
      const response = await apiRequest({
        url: `http://localhost:3000/api/appointments/${appointmentId}`,
        method: 'PUT',
        data: { status: newStatus }
      })

      if (response.data.success) {
        // 记录操作日志
        await apiRequest({
          url: 'http://localhost:3000/api/operation-logs',
          method: 'POST',
          data: {
            operation_type: operationType,
            operator: 'admin', // 实际应该从登录信息获取
            target_appointment_id: appointmentId,
            new_status: newStatus,
            details: `更新预约状态为: ${newStatus}`
          }
        })

        Taro.showToast({
          title: t('dashboard.updateSuccess'),
          icon: 'success'
        })
        loadAppointments()
      } else {
        Taro.showToast({
          title: response.data.message || t('dashboard.updateFailed'),
          icon: 'error'
        })
      }
    } catch (error) {
      console.error('更新状态失败:', error)
      Taro.showToast({
        title: t('dashboard.networkError'),
        icon: 'error'
      })
    }
  }

  const handleQRScanSuccess = async (qrResult: string) => {
    try {
      // 解析二维码内容，格式为 "appointment:{appointmentId}"
      const match = qrResult.match(/^appointment:([a-f\d]{24})$/)
      if (!match) {
        Taro.showToast({
          title: '无效的二维码',
          icon: 'error'
        })
        return
      }

      const appointmentId = match[1]

      // 更新预约状态为进行中
      await updateStatus(appointmentId, 'in_progress', 'scan_signin')
      setShowQRScanner(false)
      setShowSignInModal(false)
    } catch (error) {
      console.error('处理扫码结果失败:', error)
      Taro.showToast({
        title: '处理扫码结果失败',
        icon: 'error'
      })
    }
  }

  const handleManualSignIn = async () => {
    if (!manualAppointmentNo.trim()) {
      Taro.showToast({
        title: '请输入预约单号',
        icon: 'error'
      })
      return
    }

    try {
      // 根据预约单号查找预约
      const response = await apiRequest({
        url: `http://localhost:3000/api/appointments/by-no/${manualAppointmentNo.trim()}`,
        method: 'GET'
      })

      if (response.data.success && response.data.data) {
        await updateStatus(response.data.data._id, 'in_progress', 'manual_signin')
        setManualAppointmentNo('')
        setShowSignInModal(false)
      } else {
        Taro.showToast({
          title: '未找到对应的预约',
          icon: 'error'
        })
      }
    } catch (error) {
      console.error('手动签到失败:', error)
      Taro.showToast({
        title: '签到失败',
        icon: 'error'
      })
    }
  }

  const handleScanClick = () => {
    setShowSignInModal(true)
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t('dashboard.pending'),
      confirmed: t('dashboard.confirmed'),
      in_progress: t('dashboard.in_progress'),
      completed: t('dashboard.completed'),
      cancelled: t('dashboard.cancelled'),
      no_show: t('dashboard.no_show')
    }
    return statusMap[status] || status
  }

  const getPetTypeText = (type: string) => {
    return t(`petTypes.${type}`) || type
  }

  const onStatusChange = (item: any, index: number) => {
    setSelectedStatus(item)
    setSelectedStatusIndex(index)
  }

  const onFilterDateChange = (e: any) => {
    setSelectedDate(e.detail.value)
  }

  // 监听筛选条件变化
  React.useEffect(() => {
    loadAppointments()
  }, [selectedStatusIndex, selectedDate])

  React.useEffect(() => {
    loadAppointments()
  }, [])

  return (
    <View className="layout">
      {/* 手动添加导航栏 */}
      <CustomNavbar
        title={t('dashboard.title')}
        showScanButton={true}
        onScanClick={handleScanClick}
      />
      <View className='container dashboard'>
        <View className='content-container dashboard'>
          {/* <View className='title-row card'>
            <Text className='data-link' onClick={() => Taro.navigateTo({ url: '/pages/databoard/databoard' })}>{t('nav.databoard')}</Text>
          </View> */}


          <View className='header'>
            <View className='filter-section'>
              <Picker
                mode='date'
                value={selectedDate}
                onChange={onFilterDateChange}
                className='filter-picker'
              >
                <View className='picker-value'>
                  {selectedDate || t('dashboard.selectDate')}
                </View>
              </Picker>
              <View className='filter-status-bar'>
                {statusOptions.map((item, index) => (
                  <View
                    key={item.value}
                    className={`status-item card ${selectedStatusIndex === index ? 'active' : ''}`}
                    onClick={() => onStatusChange(item, index)}
                  >
                    <Text className='status-text'>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <ScrollView className='appointment-list' scrollY>
            {appointments.map(appointment => (
              <View key={appointment._id} className='appointment-card card'>
                <View className='card-header'>
                  <View className='header-top'>
                    <Text className='appointment-no'>#{appointment.appointment_no}</Text>
                    <View className={`status-badge ${appointment.status}`}>
                      {getStatusText(appointment.status)}
                    </View>
                  </View>
                  <Text className='service-name'>{appointment.service_name}</Text>
                </View>

                <View className='card-content'>
                  <View className='info-row'>
                    <Text className='label'>{t('dashboard.customer')}:</Text>
                    <Text className='value'>{appointment.customer_name}</Text>
                  </View>
                  <View className='info-row'>
                    <Text className='label'>{t('dashboard.phone')}:</Text>
                    <Text className='value'>{appointment.customer_phone}</Text>
                  </View>
                  <View className='info-row'>
                    <Text className='label'>{t('dashboard.pet')}:</Text>
                    <Text className='value'>
                      {getPetTypeText(appointment.pet_type)} ·
                      {appointment.pet_breed || t('common.unknown')} ·
                      {appointment.pet_size}
                    </Text>
                  </View>
                  <View className='info-row'>
                    <Text className='label'>{t('dashboard.time')}:</Text>
                    <Text className='value'>
                      {formatDate(new Date(appointment.appointment_date))} {appointment.appointment_time}
                    </Text>
                  </View>
                  {appointment.special_notes && (
                    <View className='info-row'>
                      <Text className='label'>{t('dashboard.notes')}:</Text>
                      <Text className='value notes'>{appointment.special_notes}</Text>
                    </View>
                  )}
                </View>

                <View className='card-actions'>
                  {appointment.status === 'pending' && (
                    <Button
                      onClick={() => updateStatus(appointment._id, 'confirmed')}
                      className='action-btn confirm'
                    >
                      {t('dashboard.confirm')}
                    </Button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <>
                      <Button
                        onClick={() => updateStatus(appointment._id, 'in_progress')}
                        className='action-btn start-service'
                      >
                        {t('dashboard.start_service')}
                      </Button>
                      <Button
                        onClick={() => updateStatus(appointment._id, 'no_show')}
                        className='action-btn no-show'
                      >
                        {t('dashboard.mark_no_show')}
                      </Button>
                    </>
                  )}
                  {appointment.status === 'in_progress' && (
                    <Button
                      onClick={() => updateStatus(appointment._id, 'completed')}
                      className='action-btn complete'
                    >
                      {t('dashboard.complete')}
                    </Button>
                  )}
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.status !== 'no_show' && (
                    <Button
                      onClick={() => updateStatus(appointment._id, 'cancelled')}
                      className='action-btn cancel'
                    >
                      {t('dashboard.cancel')}
                    </Button>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          {loading && (
            <View className='loading'>
              <Text>{t('common.loading')}</Text>
            </View>
          )}

          {!loading && appointments.length === 0 && (
            <View className='empty'>
              <Text>{t('dashboard.noData')}</Text>
            </View>
          )}
        </View>
      </View>

      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleQRScanSuccess}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {showSignInModal && (
        <View className='modal-overlay'>
          <View className='modal-content'>
            <Text className='modal-title'>签到方式</Text>
            <View className='modal-actions'>
              <Button
                className='modal-btn scan-btn'
                onClick={() => {
                  setShowSignInModal(false)
                  setShowQRScanner(true)
                }}
              >
                📷 扫码签到
              </Button>
              <Button
                className='modal-btn manual-btn'
                onClick={handleManualSignIn}
              >
                🔢 单号签到
              </Button>
              <Button
                className='modal-btn cancel-btn'
                onClick={() => setShowSignInModal(false)}
              >
                取消
              </Button>
            </View>
            <View className='manual-input-section'>
              <Text className='input-label'>预约单号：</Text>
              <input
                type='text'
                className='manual-input'
                value={manualAppointmentNo}
                onChange={(e) => setManualAppointmentNo(e.target.value)}
                placeholder='请输入预约单号'
              />
            </View>
          </View>
        </View>
      )}

    </View>
  )
}

export default Dashboard