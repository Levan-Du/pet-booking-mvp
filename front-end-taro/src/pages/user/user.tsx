import React from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro, { useReady } from '@tarojs/taro'
import CustomNavbar from '../../components/custom-navbar/custom-navbar'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import { getUserToken, clearUserToken, getDeviceId } from '../../utils/tokenUtils'
import { apiRequestUser } from '../../utils/requestUtils'
import { API_URLS } from '../../shared/constants'
import './user.scss'

const User: React.FC = () => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = React.useState<'profile' | 'appointment' | 'store' | 'services' | 'pets' | 'history'>('profile')
  const [userInfo, setUserInfo] = React.useState<any>(null)
  const [appointments, setAppointments] = React.useState<any[]>([])

  // 检查token并解析用户信息
  React.useEffect(() => {
    const token = getUserToken()
    if (token) {
      // 这里应该调用后端API验证token并获取用户信息
      // 暂时模拟用户信息
      setUserInfo({
        phone: '138****8888',
        registerTime: '2024-01-01'
      })
    }

  }, [])

  const loadAppointments = async () => {
    const response = await apiRequestUser({
      url: API_URLS.USERS_APPOINTMENTS_URL,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      setAppointments(response.data.data)
    }
  }

  useReady(() => {
    // 加载用户预约记录
    loadAppointments()
  })

  // 根据URL参数设置默认tab
  React.useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params
    console.log('user.tsx -> params', params)
    if (params?.tab) {
      setActiveTab(params.tab as string)
    }
  }, [])

  const handleLogout = () => {
    clearUserToken()
    Taro.redirectTo({ url: '/pages/index/index' })
  }

  const goToStore = () => {
    Taro.navigateTo({ url: '/pages/store/store' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': t('appointment_status.pending'),
      'confirmed': t('appointment_status.confirmed'),
      'in_progress': t('appointment_status.in_progress'),
      'completed': t('appointment_status.completed'),
      'cancelled': t('appointment_status.cancelled'),
      'broken': t('appointment_status.broken')
    }
    return statusMap[status] || status
  }
  const appointmentClick = (tab) => {
    setActiveTab(tab)
    if (tab === 'appointment') {
      loadAppointments()
    }
  }

  return (
    <View className="layout page-user">
      <CustomNavbar title={t('user.title')} showLanguageSwitcher={true} showScanButton={false} showLog={false} showReports={false} />
      <View className='container'>
        <View className='content-container'>
          {/* 顶部用户信息 */}
          {userInfo && (
            <View className='user-info card'>
              <View className='avatar'>
                <Text className='avatar-text'>👤</Text>
              </View>
              <View className='user-details'>
                <Text className='phone'>{userInfo.phone}</Text>
                <Text className='register-time'>{t('user.register_time')}: {formatDate(userInfo.registerTime)}</Text>
              </View>
            </View>
          )}

          {/* Tab导航 */}
          <View className='tab-bar'>
            <View
              className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <Text>{t('user.profile')}</Text>
            </View>
            <View
              className={`tab-item ${activeTab === 'appointment' ? 'active' : ''}`}
              onClick={() => appointmentClick('appointment')}
            >
              <Text>{t('user.appointment')}</Text>
            </View>
            <View
              className={`tab-item ${activeTab === 'store' ? 'active' : ''}`}
              onClick={() => setActiveTab('store')}
            >
              <Text>{t('user.store')}</Text>
            </View>
            <View
              className={`tab-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              <Text>{t('user.services')}</Text>
            </View>
            <View
              className={`tab-item ${activeTab === 'pets' ? 'active' : ''}`}
              onClick={() => setActiveTab('pets')}
            >
              <Text>{t('user.pets')}</Text>
            </View>
            <View
              className={`tab-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <Text>{t('user.history')}</Text>
            </View>
          </View>

          {/* Tab内容 */}
          <ScrollView className='tab-content' scrollY>
            {activeTab === 'profile' && (
              <View className='tab-panel'>
                <View className='profile-section card'>
                  <Text className='section-title'>{t('user.personal_info')}</Text>
                  <View className='info-item'>
                    <Text className='label'>{t('user.phone_number')}:</Text>
                    <Text className='value'>{userInfo?.phone || t('user.not_logged_in')}</Text>
                  </View>
                  <View className='info-item'>
                    <Text className='label'>{t('user.register_time')}:</Text>
                    <Text className='value'>{userInfo ? formatDate(userInfo.registerTime) : t('user.not_registered')}</Text>
                  </View>
                  <View className='info-item'>
                    <Text className='label'>{t('user.appointment_count')}:</Text>
                    <Text className='value'>{appointments.length}{t('user.times')}</Text>
                  </View>
                </View>

                <View className='actions-section card'>
                  <Text className='section-title'>{t('user.actions')}</Text>
                  <Button className='action-btn' onClick={() => Taro.navigateTo({ url: '/pages/index/index?action=add' })}>
                    {t('user.new_appointment')}
                  </Button>
                  <Button className='action-btn logout' onClick={handleLogout}>
                    {t('user.logout')}
                  </Button>
                </View>
              </View>
            )}

            {activeTab === 'appointment' && (
              <View className='tab-panel'>
                {appointments.length === 0 ? (
                  <View className='empty-state card'>
                    <Text className='empty-text'>{t('user.no_appointments')}</Text>
                    <Button className='book-btn' onClick={() => Taro.navigateTo({ url: '/pages/index/index' })}>
                      {t('user.book_now')}
                    </Button>
                  </View>
                ) : (
                  <View className='appointments-list'>
                    {appointments.map((appointment, index) => (
                      <View key={index} className='appointment-card card'
                        onClick={() => Taro.navigateTo({ url: `/pages/appointment-detail/appointment-detail?id=${appointment._id}` })}>
                        <View className='card-header'>
                          <Text className='appointment-no'>#{appointment.appointment_no}</Text>
                          <View className={`status-badge ${appointment.status}`}>
                            {getStatusText(appointment.status)}
                          </View>
                        </View>
                        <View className='card-content'>
                          <View className='info-row'>
                            <Text className='label'>{t('user.service')}:</Text>
                            <Text className='value'>{appointment.service_name}</Text>
                          </View>
                          <View className='info-row'>
                            <Text className='label'>{t('user.time')}:</Text>
                            <Text className='value'>{formatDate(appointment.appointment_date)} {appointment.appointment_time}</Text>
                          </View>
                          <View className='info-row'>
                            <Text className='label'>{t('user.pet')}:</Text>
                            <Text className='value'>{appointment.pet_type} · {appointment.pet_breed}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {activeTab === 'store' && (
              <View className='tab-panel'>
                <View className='store-preview card'>
                  <Text className='section-title'>{t('user.store')}</Text>
                  <Text className='store-name'>{t('user.store_name')}</Text>
                  <Text className='store-address'>{t('user.store_address')}</Text>
                  <Text className='store-phone'>{t('user.store_phone')}</Text>
                  <Text className='store-hours'>{t('user.store_hours')}</Text>

                  <Button className='view-detail-btn' onClick={goToStore}>
                    {t('user.view_details')}
                  </Button>
                </View>
              </View>
            )}

            {activeTab === 'services' && (
              <View className='tab-panel'>
                <View className='services-section card'>
                  <Text className='section-title'>{t('user.services_title')}</Text>
                  <View className='service-item'>
                    <Text className='service-name'>{t('user.grooming')}</Text>
                    <Text className='service-price'>{t('user.grooming_price')}</Text>
                    <Text className='service-desc'>{t('user.grooming_desc')}</Text>
                  </View>
                  <View className='service-item'>
                    <Text className='service-name'>{t('user.health_care')}</Text>
                    <Text className='service-price'>{t('user.health_care_price')}</Text>
                    <Text className='service-desc'>{t('user.health_care_desc')}</Text>
                  </View>
                  <View className='service-item'>
                    <Text className='service-name'>{t('user.boarding')}</Text>
                    <Text className='service-price'>{t('user.boarding_price')}</Text>
                    <Text className='service-desc'>{t('user.boarding_desc')}</Text>
                  </View>
                  <View className='service-item'>
                    <Text className='service-name'>{t('user.training')}</Text>
                    <Text className='service-price'>{t('user.training_price')}</Text>
                    <Text className='service-desc'>{t('user.training_desc')}</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'pets' && (
              <View className='tab-panel'>
                <View className='pets-section card'>
                  <Text className='section-title'>{t('user.pets')}</Text>
                  <View className='empty-state'>
                    <Text className='empty-text'>{t('user.no_pets')}</Text>
                    <Button className='add-pet-btn' onClick={() => Taro.showToast({ title: t('user.add_pet_developing') })}>
                      {t('user.add_pet')}
                    </Button>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'history' && (
              <View className='tab-panel'>
                <View className='history-section card'>
                  <Text className='section-title'>{t('user.consumption_history')}</Text>
                  <View className='history-stats'>
                    <View className='stat-item'>
                      <Text className='stat-value'>{appointments.filter(a => a.status === 'completed').length}</Text>
                      <Text className='stat-label'>{t('user.completed')}</Text>
                    </View>
                    <View className='stat-item'>
                      <Text className='stat-value'>{appointments.filter(a => a.status === 'cancelled').length}</Text>
                      <Text className='stat-label'>{t('user.cancelled')}</Text>
                    </View>
                    <View className='stat-item'>
                      <Text className='stat-value'>{appointments.filter(a => a.status === 'broken').length}</Text>
                      <Text className='stat-label'>{t('user.broken')}</Text>
                    </View>
                  </View>

                  <View className='recent-appointments'>
                    <Text className='section-subtitle'>{t('user.recent_consumption')}</Text>
                    {appointments.slice(0, 5).map((appointment, index) => (
                      <View key={index} className='history-item'>
                        <Text className='service-name'>{appointment.service_name}</Text>
                        <Text className='appointment-date'>{formatDate(appointment.appointment_date)}</Text>
                        <View className={`status-tag ${appointment.status}`}>
                          {getStatusText(appointment.status)}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

export default User