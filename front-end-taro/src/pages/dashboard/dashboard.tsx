import React, { useState, useEffect } from 'react'
import { View, Text, Button, Picker, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiRequest } from '../../utils/requestUtils'
import { formatDate } from '../../utils/time.util'
import './dashboard.scss'

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

const Dashboard: React.FC = () => {
  const statusOptions = [
    { value: 'all', label: '全部状态', active: true },
    { value: 'pending', label: '待确认', active: true },
    { value: 'confirmed', label: '已确认', active: true },
    { value: 'completed', label: '已完成', active: true },
    { value: 'cancelled', label: '已取消', active: true }
  ]
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0])
  const [selectedStatusIndex, setSelectedStatusIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState('')

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
        title: '加载数据失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await apiRequest({
        url: `http://localhost:3000/api/appointments/${appointmentId}`,
        method: 'PUT',
        data: { status: newStatus }
      })

      if (response.data.success) {
        Taro.showToast({
          title: '状态更新成功',
          icon: 'success'
        })
        loadAppointments()
      } else {
        Taro.showToast({
          title: response.data.message || '更新失败',
          icon: 'error'
        })
      }
    } catch (error) {
      console.error('更新状态失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'error'
      })
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待确认',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消'
    }
    return statusMap[status] || status
  }

  const getPetTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      dog: '狗狗',
      cat: '猫咪',
      other: '其他'
    }
    return typeMap[type] || type
  }

  const onStatusChange = (item: any, index: number) => {
    setSelectedStatus(item)
    setSelectedStatusIndex(index)
  }

  const onFilterDateChange = (e: any) => {
    setSelectedDate(e.detail.value)
  }

  // 监听筛选条件变化
  useEffect(() => {
    loadAppointments()
  }, [selectedStatusIndex, selectedDate])

  useEffect(() => {
    loadAppointments()
  }, [])

  return (
    <View className="layout">
      {/* 手动添加导航栏 */}
      <View className='custom-navbar'>
        <Text className='navbar-title'>预约管理</Text>
      </View>
      <View className='container'>
        <View className='content-container'>
          <View className='title-row card'>
            {/* <Text className='title'>预约管理</Text> */}
            <Text className='data-link' onClick={() => Taro.navigateTo({ url: '/pages/databoard/databoard' })}>数据看板</Text>
          </View>
          <View className='header'>
            <View className='filter-section'>
              <Picker
                mode='date'
                value={selectedDate}
                onChange={onFilterDateChange}
                className='filter-picker'
              >
                <View className='picker-value'>
                  {selectedDate || '选择日期'}
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
                  <Text className='service-name'>{appointment.service_name}</Text>
                  <View className={`status-badge ${appointment.status}`}>
                    {getStatusText(appointment.status)}
                  </View>
                </View>

                <View className='card-content'>
                  <View className='info-row'>
                    <Text className='label'>客户:</Text>
                    <Text className='value'>{appointment.customer_name}</Text>
                  </View>
                  <View className='info-row'>
                    <Text className='label'>电话:</Text>
                    <Text className='value'>{appointment.customer_phone}</Text>
                  </View>
                  <View className='info-row'>
                    <Text className='label'>宠物:</Text>
                    <Text className='value'>
                      {getPetTypeText(appointment.pet_type)} ·
                      {appointment.pet_breed || '未知品种'} ·
                      {appointment.pet_size}
                    </Text>
                  </View>
                  <View className='info-row'>
                    <Text className='label'>时间:</Text>
                    <Text className='value'>
                      {formatDate(new Date(appointment.appointment_date))} {appointment.appointment_time}
                    </Text>
                  </View>
                  {appointment.special_notes && (
                    <View className='info-row'>
                      <Text className='label'>备注:</Text>
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
                      确认
                    </Button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <Button
                      onClick={() => updateStatus(appointment._id, 'completed')}
                      className='action-btn complete'
                    >
                      完成
                    </Button>
                  )}
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <Button
                      onClick={() => updateStatus(appointment._id, 'cancelled')}
                      className='action-btn cancel'
                    >
                      取消
                    </Button>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          {loading && (
            <View className='loading'>
              <Text>加载中...</Text>
            </View>
          )}

          {!loading && appointments.length === 0 && (
            <View className='empty'>
              <Text>暂无预约数据</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default Dashboard