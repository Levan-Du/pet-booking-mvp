import React from 'react'
import { View, Text, Button, Picker, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { apiRequest } from '../../utils/requestUtils'
import { formatDate } from '../../utils/time.util'
import CustomNavbar from '../../components/custom-navbar/custom-navbar'
import QRScanner from '../../components/qr-scanner/qr-scanner'
import DateRangePicker from '../../components/date-range-picker/date-range-picker'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import { API_URLS } from '../../shared/constants'
import './management.scss'
import { withAuth } from '../../shared/withAuth/withAuth'

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

const Management: React.FC = () => {
  const { t } = useLanguage()

  const statusOptions = [
    { value: 'all', label: t('management.allStatus'), active: true },
    { value: 'pending', label: t('management.pending'), active: true },
    { value: 'confirmed', label: t('management.confirmed'), active: true },
    { value: 'in_progress', label: t('management.in_progress'), active: true },
    { value: 'completed', label: t('management.completed'), active: true },
    { value: 'cancelled', label: t('management.cancelled'), active: true },
    { value: 'broken', label: t('management.broken'), active: true }
  ]
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [loading, setLoading] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState(statusOptions[0])
  const [selectedStatusIndex, setSelectedStatusIndex] = React.useState(0)
  const [selectedDateRange, setSelectedDateRange] = React.useState({ startDate: '', endDate: '' })
  const [showDateRangePicker, setShowDateRangePicker] = React.useState(false)
  const [showQRScanner, setShowQRScanner] = React.useState(false)
  const [showSignInModal, setShowSignInModal] = React.useState(false)
  const [manualAppointmentNo, setManualAppointmentNo] = React.useState('')

  React.useEffect(() => {
    loadAppointments()
  }, [])


  // 监听筛选条件变化
  React.useEffect(() => {
    loadAppointments()
  }, [selectedStatusIndex, selectedDateRange])


  const loadAppointments = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (selectedStatus.value !== 'all') {
        params.status = selectedStatus.value
      }
      if (selectedDateRange.startDate && selectedDateRange.endDate) {
        params.startDate = selectedDateRange.startDate
        params.endDate = selectedDateRange.endDate
      }

      const response = await apiRequest({
        url: API_URLS.APPOINTMENTS_URL,
        method: 'GET',
        data: params
      })


      if (response.data.success) {
        const data = response.data.data
        console.log('management.trs -> loadAppointments -> data', data)
        data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setAppointments(data)
      }
    } catch (error) {
      Taro.showToast({
        title: t('management.loadFailed'),
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (appointmentId: string, newStatus: string, operationType: string = 'update_status') => {
    try {
      const response = await apiRequest({
        url: `${API_URLS.APPOINTMENTS_UPDATE_STATUS_URL.replace(':id', appointmentId)}`,
        method: 'PUT',
        data: { status: newStatus }
      })

      if (response.data.success) {
        // 记录操作日志
        await apiRequest({
          url: API_URLS.OPERATION_LOGS_URL,
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
          title: t('management.updateSuccess'),
          icon: 'success'
        })
        loadAppointments()
      } else {
        Taro.showToast({
          title: response.data.message || t('management.updateFailed'),
          icon: 'error'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: t('management.networkError'),
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
        url: `${API_URLS.APPOINTMENT_BY_NO_URL}/${manualAppointmentNo.trim()}`,
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
      pending: t('management.pending'),
      confirmed: t('management.confirmed'),
      in_progress: t('management.in_progress'),
      completed: t('management.completed'),
      cancelled: t('management.cancelled'),
      broken: t('management.broken')
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

  const handleDateRangeSelect = () => {
    setShowDateRangePicker(true)
  }

  const handleDateRangeConfirm = (startDate: string, endDate: string) => {
    setSelectedDateRange({ startDate, endDate })
  }

  const clearDateFilter = () => {
    setSelectedDateRange({ startDate: '', endDate: '' })
  }

  const getDateRangeDisplayText = () => {
    if (selectedDateRange.startDate && selectedDateRange.endDate) {
      return `${selectedDateRange.startDate} 至 ${selectedDateRange.endDate}`
    }
    return t('management.selectDate')
  }

  return (
    <View className="layout page-management">
      {/* 手动添加导航栏 */}
      <CustomNavbar
        title={t('management.title')}
        showScanButton={true}
        onScanClick={handleScanClick}
      />
      <View className='container'>
        <View className='content-container'>
          <View className='header'>
            <View className='filter-section'>
              <View className='date-filter-container'>
                <View className='filter-picker' onClick={handleDateRangeSelect}>
                  <View className='picker-value'>
                    {getDateRangeDisplayText()}
                  </View>
                </View>
                {(selectedDateRange.startDate && selectedDateRange.endDate) && (
                  <View className='clear-date-btn' onClick={clearDateFilter}>
                    <Text className='clear-date-text'>×</Text>
                  </View>
                )}
              </View>
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
                    <Text className='label'>{t('management.customer')}:</Text>
                    <Text className='value'>{appointment.customer_name}</Text>
                  </View>
                  <View className='info-row'>
                    <Text className='label'>{t('management.phone')}:</Text>
                    <Text className='value'>{appointment.customer_phone}</Text>
                  </View>
                  <View className='info-row'>
                    <Text className='label'>{t('management.pet')}:</Text>
                    <Text className='value'>
                      {getPetTypeText(appointment.pet_type)} ·
                      {appointment.pet_breed || t('common.unknown')} ·
                      {appointment.pet_size}
                    </Text>
                  </View>
                  <View className='info-row'>
                    <Text className='label'>{t('management.time')}:</Text>
                    <Text className='value'>
                      {formatDate(new Date(appointment.appointment_date))} {appointment.appointment_time}
                    </Text>
                  </View>
                  {appointment.special_notes && (
                    <View className='info-row'>
                      <Text className='label'>{t('management.notes')}:</Text>
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
                      {t('management.confirm')}
                    </Button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <>
                      <Button
                        onClick={() => updateStatus(appointment._id, 'in_progress')}
                        className='action-btn start-service'
                      >
                        {t('management.start_service')}
                      </Button>
                      <Button
                        onClick={() => updateStatus(appointment._id, 'broken')}
                        className='action-btn no-show'
                      >
                        {t('management.mark_broken')}
                      </Button>
                    </>
                  )}
                  {appointment.status === 'in_progress' && (
                    <Button
                      onClick={() => updateStatus(appointment._id, 'completed')}
                      className='action-btn complete'
                    >
                      {t('management.complete')}
                    </Button>
                  )}
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.status !== 'broken' && (
                    <Button
                      onClick={() => updateStatus(appointment._id, 'cancelled')}
                      className='action-btn cancel'
                    >
                      {t('management.cancel')}
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
              <Text>{t('management.noData')}</Text>
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


      {/* 日期范围选择器 */}
      <DateRangePicker
        visible={showDateRangePicker}
        onClose={() => setShowDateRangePicker(false)}
        onConfirm={handleDateRangeConfirm}
        initialStartDate={selectedDateRange.startDate}
        initialEndDate={selectedDateRange.endDate}
      />
    </View>
  )
}

export default withAuth(Management)