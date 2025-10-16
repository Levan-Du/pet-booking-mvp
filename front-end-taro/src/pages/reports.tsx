import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import SimpleBarChart from '../components/simple-bar-chart/simple-bar-chart'
import './reports.scss'

const Reports: React.FC = () => {
  const [todayAppointments] = useState(0)
  const [todayBreakedAppointments] = useState(0)
  const [todayCancelAppointments] = useState(0)

  const [chartData] = useState([
    { name: "一月", value: 120 },
    { name: "二月", value: 200 },
    { name: "三月", value: 150 },
    { name: "四月", value: 80 },
    { name: "五月", value: 170 },
    { name: "六月", value: 110 }
  ])

  return (
    <View className='container'>
      <View className='reports'>
        <View className='card'>
          <View className='summary-row'>
            <Text>今日预约数:</Text>
            <Text className='value'>{todayAppointments}</Text>
          </View>
          <View className='summary-row'>
            <Text>爽约数:</Text>
            <Text className='value'>{todayBreakedAppointments}</Text>
          </View>
          <View className='summary-row'>
            <Text>取消数:</Text>
            <Text className='value'>{todayCancelAppointments}</Text>
          </View>
        </View>
        <View className='charts-box card'>
          <SimpleBarChart title='今日完成预约数' data={chartData} />
        </View>
        <View className='charts-box card'>
          <SimpleBarChart title='今日爽约数' data={chartData} />
        </View>
      </View>
    </View>
  )
}

export default Reports