import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import './databoard.scss'
import Taro from '@tarojs/taro'

const DataBoard: React.FC = () => {
  const [todayAppointments] = useState(0)
  const [todayBreakedAppointments] = useState(0)
  const [todayCancelAppointments] = useState(0)
  const [completedAndBrokonAppointments] = useState({ completed: 0, broken: 0 })
  const [servicesAppointments] = useState([])

  const gotoReport = () => {
    Taro.navigateTo({
      url: '/pages/reports/reports'
    })
  }

  const goBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className='layout'>
      <View className='custom-navbar'>
        <Text className='navbar-title'>数据看板</Text>
      </View>
      <View className='container'>
        <View className='content-container'>
          <View className='data-row card'>
            <View className="data-row-title card"><Text>今日数据</Text></View>
            <View className='card'>
              <Text className='title'>预约数:</Text>
              <Text className='value'>{todayAppointments}</Text>
            </View>
            <View className='card'>
              <Text className='title'>完成数:</Text>
              <Text className='value completed'>{todayBreakedAppointments}</Text>
            </View>
            <View className='card'>
              <Text className='title'>确认数:</Text>
              <Text className='value comfirmed'>{todayBreakedAppointments}</Text>
            </View>
            <View className='card'>
              <Text className='title'>爽约数:</Text>
              <Text className='value broken'>{todayBreakedAppointments}</Text>
            </View>
            <View className='card'>
              <Text className='title'>取消数:</Text>
              <Text className='value cancel'>{todayCancelAppointments}</Text>
            </View>
          </View>
          <View className='tool-row card'>
            <View className="card" onClick={gotoReport}><Text>数据图表</Text></View>
            <View className="card btn-card" onClick={goBack}><Text>返回</Text></View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default DataBoard