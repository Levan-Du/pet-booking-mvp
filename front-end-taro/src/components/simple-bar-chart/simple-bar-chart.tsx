import React from 'react'
import { View, Canvas } from '@tarojs/components'
import Taro from '@tarojs/taro'
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
  const dpr = Taro.getSystemInfoSync().pixelRatio || 1
  // const dpr = 1
  const [dimensions, setDimensions] = React.useState({
    width: 360 * dpr,
    height: 250 * dpr
  })

  React.useEffect(() => {
    // const systemInfo = Taro.getSystemInfoSync()
    // setDimensions({
    //   width: systemInfo.screenWidth * 0.9,
    //   height: 250
    // })
  }, [])

  const drawChart = async () => {
    try {
      if (!data.length) return

      const { width: chartWidth, height: chartHeight } = dimensions
      const padding = 40
      const barSpacing = 15
      const barWidth = (chartWidth - padding - data.length * barSpacing) / data.length
      console.log('drawChart -> barWidth', barWidth, 'chartWidth', chartWidth, 'dpr', dpr)
      const chartAreaHeight = chartHeight - 2 * padding
      const maxValue = Math.max(...data.map(item => item.value)) || 100

      const ctx = Taro.createCanvasContext('barChart', this)
      // 清空画布
      ctx.clearRect(0, 0, chartWidth, chartHeight)

      const linePadding = 5
      // 绘制坐标轴
      ctx.setStrokeStyle('#ccc')
      ctx.setLineWidth(1)
      ctx.beginPath()
      ctx.moveTo(linePadding, linePadding)
      ctx.lineTo(linePadding, chartHeight - linePadding)
      ctx.lineTo(chartWidth - linePadding, chartHeight - linePadding)
      ctx.stroke()

      // 绘制柱状图
      data.forEach((item, index) => {
        const x = linePadding + index * (barWidth + barSpacing)
        const barHeight = (item.value / maxValue) * chartAreaHeight
        const y = chartHeight - padding - barHeight

        const colors = ["#4cd964", "#007aff", "#e62020ff", "#ffcc00", "#8e8e93", "#ff9500"]
        const color = colors[index % colors.length]

        // 绘制柱子
        ctx.setFillStyle(color)
        ctx.fillRect(x, y, barWidth, barHeight)

        // 绘制数值
        ctx.setFillStyle('#000')
        ctx.setFontSize(70)
        console.log('drawChart -> ctx.fontStyle', ctx.font)
        ctx.setTextAlign('center')
        ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5)

        // 绘制标签
        ctx.fillText(item.name, x + barWidth / 2, chartHeight - padding + 15)
      })

      // 绘制标题
      ctx.setFillStyle('#333')
      ctx.setFontSize(14)
      ctx.setTextAlign('center')
      ctx.fillText(title, chartWidth / 2, padding - 10)

      ctx.draw()
      // ctx.scale(1 / dpr, 1 / dpr); // 恢复缩放

    } catch (error) {
      console.error('绘制柱状图失败:', error)
    }
  }

  React.useEffect(() => {
    if (dimensions.width > 0 && data.length > 0) {
      drawChart()
    }
  }, [data, title, dimensions])

  return (
    <View className='chart-container'>
      <Canvas
        id='barChart'
        canvasId='barChart'
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`
        }}
      />
    </View>
  )
}

export default SimpleBarChart