import React from 'react'
import { View, Text, Button, Input, Textarea, Image, ScrollView } from '@tarojs/components'
import Taro, { useReady } from '@tarojs/taro'
import { jwtDecode } from 'jwt-decode'
import { authUtils } from '../../utils/authUtils'
import { apiRequest } from '../../utils/requestUtils'
import CustomNavbar from '../../components/custom-navbar'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import './index.scss'

interface Service {
  _id?: string
  id?: string
  name: string
  price: number
  duration: number
  description: string
}

interface TimeSlot {
  start_time: string
  end_time: string
  available_slots: number
}

interface FormData {
  customer_name: string
  customer_phone: string
  pet_type: string
  pet_breed: string
  pet_size: string
  special_notes: string
}

const Index: React.FC = () => {
  const { t } = useLanguage()
  const [services, setServices] = React.useState<Service[]>([])
  const [selectedService, setSelectedService] = React.useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = React.useState('')
  const [timeSlots, setTimeSlots] = React.useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = React.useState<TimeSlot | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [adminInfo, setAdminInfo] = React.useState<any>(null)
  const [petTypes, setPetTypes] = React.useState<any[]>([])
  const [sizeOptions, setSizeOptions] = React.useState<any[]>([])

  const [formData, setFormData] = React.useState<FormData>({
    customer_name: '',
    customer_phone: '',
    pet_type: 'dog',
    pet_breed: '',
    pet_size: '',
    special_notes: ''
  })



  const timePeriods = [
    { type: 'morning', title: t('booking.morning'), start: 8, end: 12 },
    { type: 'afternoon', title: t('booking.afternoon'), start: 12, end: 18 },
    { type: 'evening', title: t('booking.evening'), start: 18, end: 22 }
  ]

  // 计算属性
  const isFormValid = selectedService && selectedDate && selectedTime &&
    formData.customer_name.trim() && formData.customer_phone.trim() && formData.pet_size

  const [dateList, setDateList] = React.useState<Array<{ date: string, month: number, day: number, week: string }>>([])

  React.useEffect(() => {
    generateDateList()
  }, [])

  const generateDateList = () => {
    const dates = []
    const today = new Date()
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekDay = date.getDay()

      let weekText = ''
      if (i === 0) {
        weekText = t('booking.today')
      } else if (i === 1) {
        weekText = t('booking.tomorrow')
      } else {
        weekText = `周${weekDays[weekDay]}`
      }

      dates.push({
        date: `${date.getFullYear()}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        month: month,
        day: day,
        week: weekText
      })
    }

    setDateList(dates)
  }

  // 方法
  const loadEnums = async () => {
    try {
      const response = await apiRequest({
        url: 'http://localhost:3000/api/enums',
        method: 'GET'
      })

      if (response.data.success) {
        setPetTypes(response.data.data.petTypes)
        setSizeOptions(response.data.data.petSizes)
      }
    } catch (error) {
      console.error('加载枚举数据失败:', error)
      // 如果后端API不可用，使用默认值
      setPetTypes([
        { value: 'dog', label: '狗狗', icon: '/static/images/dog.png' },
        { value: 'cat', label: '猫咪', icon: '/static/images/cat.png' },
        { value: 'other', label: '其他', icon: '/static/images/other.png' }
      ])
      setSizeOptions([
        { value: 'small', label: '小型' },
        { value: 'medium', label: '中型' },
        { value: 'large', label: '大型' }
      ])
    }
  }

  const loadServices = async () => {
    setLoading(true)
    try {
      const response = await apiRequest({
        url: 'http://localhost:3000/api/services',
        method: 'GET'
      })

      if (response.data.success) {
        setServices(response.data.data)
      }
    } catch (error) {
      console.error('加载服务失败:', error)
      Taro.showToast({
        title: t('errors.networkError'),
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useReady(() => {
    console.log('Page loaded.')
  })

  const selectService = (service: Service) => {
    setSelectedService(service)
    setSelectedDate('')
    setSelectedTime(null)
    setTimeSlots([])
  }

  const selectDate = async (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null)
    if (selectedService) {
      await loadTimeSlots(date)
    }
  }

  const selectTime = (slot: TimeSlot) => {
    setSelectedTime(slot)
  }

  const loadTimeSlots = async (date: string) => {
    if (!selectedService) return

    setLoading(true)
    try {
      const serviceId = selectedService._id || selectedService.id

      const response = await apiRequest({
        url: 'http://localhost:3000/api/appointments/available-slots',
        method: 'GET',
        data: {
          date: date,
          serviceId: serviceId
        }
      })

      if (response.data.success) {
        setTimeSlots(response.data.data.map((slot: any) => ({
          ...slot,
          available_slots: Math.floor(Math.random() * 10) + 1
        })))
      }
    } catch (error) {
      console.error('加载时间段失败:', error)
      Taro.showToast({
        title: t('errors.networkError'),
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const getTimeSlotsByPeriod = (periodType: string) => {
    const period = timePeriods.find(p => p.type === periodType)
    if (!period) return []

    return timeSlots.filter(slot => {
      const hour = parseInt(slot.start_time.split(':')[0])
      return hour >= period.start && hour < period.end
    })
  }

  const submitBooking = async () => {
    if (!isFormValid) {
      Taro.showToast({
        title: t('booking.completeInfo'),
        icon: 'error'
      })
      return
    }

    setLoading(true)
    try {
      const serviceId = selectedService!._id || selectedService!.id

      const bookingData = {
        ...formData,
        service_id: serviceId,
        appointment_date: selectedDate,
        appointment_time: selectedTime!.start_time
      }

      const response = await apiRequest({
        url: 'http://localhost:3000/api/appointments',
        method: 'POST',
        data: bookingData
      })

      if (response.data.success) {
        Taro.showToast({
          title: t('booking.bookingSuccess'),
          icon: 'success'
        })

        resetForm()
      } else {
        Taro.showToast({
          title: response.data.message || t('booking.bookingFailed'),
          icon: 'error'
        })
      }
    } catch (error) {
      console.error('预约失败:', error)
      Taro.showToast({
        title: t('errors.networkError'),
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedService(null)
    setSelectedDate('')
    setSelectedTime(null)
    setTimeSlots([])

    setFormData({
      customer_name: '',
      customer_phone: '',
      pet_type: 'dog',
      pet_breed: '',
      pet_size: '',
      special_notes: ''
    })
  }

  const goToAdmin = () => {
    Taro.navigateTo({ url: '/pages/dashboard/dashboard' })
  }

  const goToReports = () => {
    Taro.navigateTo({ url: '/pages/reports/reports' })
  }

  const goToStore = () => {
    Taro.navigateTo({ url: '/pages/store/store' })
  }

  const getPetTypeText = (type: string) => {
    return t(`petTypes.${type}`) || type
  }

  const getSizeText = (size: string) => {
    return t(`sizes.${size}`) || size
  }

  // 生命周期
  React.useEffect(() => {
    const token = authUtils.getToken()
    if (token) {
      try {
        setAdminInfo(jwtDecode(token))
      } catch (error) {
        console.error('解析token失败:', error)
      }
    }
    loadEnums()
    loadServices()
  }, [])

  return (
    <View className='layout'>
      {/* 自定义导航栏 */}
      <CustomNavbar
        title={t('booking.title')}
        showBack={false}
        rightButton={{
          text: t('nav.store'),
          onClick: goToStore
        }}
      />
      <View className='container index'>
        <View className='content-container index'>
          {adminInfo?.role === 'pet-admin' && (
            <>
              <View className='header'>
                <Button className='btn btn-primary' onClick={goToAdmin}>{t('nav.dashboard')}</Button>
              </View>
            </>
          )}

          {/* 服务选择 */}
          <View className='card'>
            <Text className='card-title'>{t('booking.selectService')}</Text>
            <View className='service-row'>
              {services.map(service => (
                <View
                  key={service._id || service.id}
                  className={`service-card ${selectedService?._id === service._id ? 'active' : ''}`}
                  onClick={() => selectService(service)}
                >
                  <Text className='service-name'>{service.name}</Text>
                </View>
              ))}
            </View>

            {/* 选中服务信息 */}
            {selectedService && (
              <View className='service-detail'>
                <View className='detail-header'>
                  <Text className='detail-name'>{selectedService.name}</Text>
                  <Text className='detail-price'>¥{selectedService.price}</Text>
                </View>
                <View className='detail-info'>
                  <Text className='detail-duration'>{t('booking.duration')}: {selectedService.duration}{t('booking.minutes')}</Text>
                  <Text className='detail-desc'>{selectedService.description}</Text>
                </View>
              </View>
            )}
          </View>

          {/* 日期选择 */}
          <View className='card'>
            <Text className='card-title'>{t('booking.selectDate')}</Text>
            <ScrollView className='date-scroll' scrollX>
              <View className='date-row'>
                {dateList.map(date => (
                  <View
                    key={date.date}
                    className={`date-card ${selectedDate === date.date ? 'active' : ''}`}
                    onClick={() => selectDate(date.date)}
                  >
                    <Text className='date-week'>{date.week}</Text>
                    <Text className='date-date'>{date.month}月{date.day}日</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* 时间选择 */}
          {timeSlots.length > 0 && (
            <View className='card'>
              <Text className='card-title'>{t('booking.selectTime')}</Text>
              {timePeriods.map(period => {
                const periodSlots = getTimeSlotsByPeriod(period.type)
                if (periodSlots.length === 0) return null

                return (
                  <View key={period.type} className='time-section'>
                    <Text className='period-title'>{period.title}</Text>
                    <View className='time-grid'>
                      {periodSlots.map(slot => (
                        <View
                          key={slot.start_time}
                          className={`time-card ${selectedTime?.start_time === slot.start_time ? 'active' : ''}`}
                          onClick={() => selectTime(slot)}
                        >
                          <Text className='time-range'>{slot.start_time} - {slot.end_time}</Text>
                          <Text className='slots-available'>{slot.available_slots}{t('booking.availableSlots')}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )
              })}
            </View>
          )}

          {/* 宠物信息表单 */}
          <View className='card'>
            <Text className='card-title'>{t('booking.fillInfo')}</Text>
            <View className='form'>
              <View className='form-group'>
                <Text className='label'>{t('booking.customerName')}</Text>
                <Input
                  value={formData.customer_name}
                  placeholder={t('booking.customerName')}
                  className='input'
                  onInput={(e) => setFormData({ ...formData, customer_name: e.detail.value })}
                />
              </View>

              <View className='form-group'>
                <Text className='label'>{t('booking.customerPhone')}</Text>
                <Input
                  value={formData.customer_phone}
                  placeholder={t('booking.customerPhone')}
                  type='number'
                  maxlength={11}
                  className='input'
                  onInput={(e) => setFormData({ ...formData, customer_phone: e.detail.value })}
                />
              </View>

              <View className='form-group'>
                <Text className='label'>{t('booking.petType')}</Text>
                <View className='pet-type-grid'>
                  {petTypes.map(type => (
                    <View
                      key={type.value}
                      className={`pet-type-card ${formData.pet_type === type.value ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, pet_type: type.value })}
                      style={` background-image: url(${type.icon}); background-repeat: no-repeat; background-size: cover; background-position: center`}
                    >
                      <Image src={type.icon} className='pet-icon' mode='aspectFit' />
                      <Text className='pet-type-name'>{getPetTypeText(type.value)}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className='form-group'>
                <Text className='label'>{t('booking.petBreed')}</Text>
                <Input
                  value={formData.pet_breed}
                  placeholder={t('booking.petBreed')}
                  className='input'
                  onInput={(e) => setFormData({ ...formData, pet_breed: e.detail.value })}
                />
              </View>

              <View className='form-group'>
                <Text className='label'>{t('booking.petSize')}</Text>
                <View className='size-grid'>
                  {sizeOptions.map(size => (
                    <Button
                      key={size.value}
                      className={`size-card ${formData.pet_size === size.value ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, pet_size: size.value })}
                    >
                      <Text className='size-label'>{getSizeText(size.value)}</Text>
                    </Button>
                  ))}
                </View>
              </View>

              <View className='form-group end'>
                <Text className='label'>{t('booking.specialNotes')}</Text>
                <Textarea
                  id='special_notes'
                  value={formData.special_notes}
                  placeholder={t('booking.specialNotes')}
                  className='textarea'
                  onInput={(e) => setFormData({ ...formData, special_notes: e.detail.value })}
                />
              </View>
            </View>
          </View>
        </View>
      </View>


      {/* 提交按钮 */}
      <View className='footer'>
        <Button
          onClick={submitBooking}
          disabled={!isFormValid}
          className='submit-btn'
        >
          {loading ? t('booking.submitting') : t('booking.submitBooking')}
        </Button>
      </View>

      {/* 加载状态 */}
      {loading && (
        <View className='loading-mask'>
          <View className='loading-content'>
            <Text>{t('common.loading')}</Text>
          </View>
        </View>
      )}

    </View>
  )
}

export default Index