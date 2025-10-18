import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import SimpleBarChart from '../../components/simple-bar-chart/simple-bar-chart'
import SimplePieChart from '../../components/simple-pie-chart/simple-pie-chart'
import CustomNavbar from '../../components/custom-navbar'
import './reports.scss'

const Reports: React.FC = () => {
  const [todayAppointments] = React.useState(0)
  const [todayBreakedAppointments] = React.useState(0)
  const [todayCancelAppointments] = React.useState(0)
  const [completedAndBrokonAppointments] = React.useState({ completed: 0, broken: 0 })
  const [servicesAppointments] = React.useState([])

  const [chartData] = React.useState([
    { name: "一月", value: 120 },
    { name: "二月", value: 200 },
    { name: "三月", value: 150 },
    { name: "四月", value: 80 },
    { name: "五月", value: 170 },
    { name: "六月", value: 110 }
  ])

  return (
    <View className='layout'>
      <CustomNavbar title="报表看板" />
      <View className='container'>
        <View className='content-container'>
          <View className='charts-box card'>
            <SimplePieChart title='完成数/爽约数饼状图' data={chartData} />
          </View>
          <View className='charts-box card'>
            <SimpleBarChart title='各服务预约数柱状图' data={chartData} />
          </View>
        </View>
      </View>

      <View className='custom-toolbar'>
        <View className="toolbar-item">一二</View>
        <View className="toolbar-item">三四</View>
        <View className="toolbar-item">五六</View>
        <View className="toolbar-item">七八</View>
      </View>
    </View>
  )
}

export default Reports