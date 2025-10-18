import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import SimpleBarChart from '../../components/simple-bar-chart/simple-bar-chart'
import SimplePieChart from '../../components/simple-pie-chart/simple-pie-chart'
import './reports.scss'

const Reports: React.FC = () => {
  const [todayAppointments] = useState(0)
  const [todayBreakedAppointments] = useState(0)
  const [todayCancelAppointments] = useState(0)
  const [completedAndBrokonAppointments] = useState({ completed: 0, broken: 0 })
  const [servicesAppointments] = useState([])

  const [chartData] = useState([
    { name: "一月", value: 120 },
    { name: "二月", value: 200 },
    { name: "三月", value: 150 },
    { name: "四月", value: 80 },
    { name: "五月", value: 170 },
    { name: "六月", value: 110 }
  ])

  return (
    <View className='layout'>
      <View className='custom-navbar'>
        <Text className='navbar-title'>报表看板</Text>
      </View>
      <View className='container'>
        <View className='data-row card'>
          <View className='card'>
            <Text className='title'>今日预约数:</Text>
            <Text className='value'>{todayAppointments}</Text>
          </View>
          <View className='data-row card'>
            <Text className='title'>爽约数:</Text>
            <Text className='value'>{todayBreakedAppointments}</Text>
          </View>
          <View className='data-row card'>
            <Text className='title'>取消数:</Text>
            <Text className='value'>{todayCancelAppointments}</Text>
          </View>
        </View>
        <View className='charts'>
          <View className='charts-box card'>
            {/* <SimplePieChart title='完成数/爽约数饼状图' data={chartData} width={360} height={300} /> */}
          </View>
          <View className='charts-box card'>
            <SimpleBarChart title='各服务预约数柱状图' data={chartData} />
          </View>
        </View>
      </View>
    </View>
  )
}

export default Reports