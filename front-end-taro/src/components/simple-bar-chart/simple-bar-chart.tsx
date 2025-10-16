import React from 'react'
import { View, Text } from '@tarojs/components'
import './simple-bar-chart.scss'

interface ChartDataItem {
  name: string
  value: number
}

interface SimpleBarChartProps {
  title: string
  data: ChartDataItem[]
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ title, data }) => {
  const getBarHeight = (value: number) => {
    const maxValue = Math.max(...data.map(item => item.value)) || 100
    return (value / maxValue) * 160
  }

  const getColor = (index: number) => {
    const colors = ["#4cd964", "#007aff", "#ff3b30", "#ffcc00", "#8e8e93", "#ff9500"]
    return colors[index % colors.length]
  }

  return (
    <View className='chart-container'>
      <View className='chart-header'>
        <Text className='chart-title'>{title}</Text>
      </View>

      <View className='chart-wrapper'>
        <View className='bars-container'>
          {data.map((item, index) => (
            <View key={index} className='bar-item'>
              <View className='bar-wrapper'>
                <Text className='bar-value'>{item.value}</Text>
                <View 
                  className='bar' 
                  style={{ 
                    height: `${getBarHeight(item.value)}rpx`, 
                    backgroundColor: getColor(index) 
                  }}
                />
              </View>
              <Text className='bar-label'>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default SimpleBarChart