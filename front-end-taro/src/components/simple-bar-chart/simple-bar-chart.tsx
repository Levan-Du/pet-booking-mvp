import React from 'react'
import { View, Canvas } from '@tarojs/components'
import Taro, { useReady } from '@tarojs/taro'
import './simple-bar-chart.scss'
import { Button } from '@tarojs/components'

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

  const [dimensions, setDimensions] = React.useState({
    width: 360 * dpr,
    height: 250 * dpr
  })

  const drawChart = async () => {
    try {
      if (!data.length) return

      const { width, height } = dimensions

      const padding = width * 0.05
      const titleHeight = padding
      const titleMarginBottom = padding * 0.5
      const titleFontSize = titleHeight * 0.9
      const titleY = padding
      const labelFontSize = titleFontSize * 0.8
      const labelHeight = titleFontSize
      const chartWidth = width - 2 * padding
      const chartHeight = height - titleHeight - titleMarginBottom - 2 * padding
      const barWidth = chartWidth / data.length * 0.7
      const barSpacing = chartWidth / data.length * 0.3

      const maxValue = Math.max(...data.map(item => item.value)) || 100

      const yAxis_start_x = padding
      const yAxis_start_y = height - padding
      const yAxis_end_x = padding
      const yAxis_end_y = titleHeight + padding + titleMarginBottom

      const xAxis_end_x = width - barSpacing / 2
      const xAxis_end_y = height - padding

      console.log('simple-bar-chart -> drawChart -> padding, yAxis_start_x, yAxis_start_y', padding, yAxis_start_x, yAxis_start_y)

      const ctx = Taro.createCanvasContext('barChart')

      // ctx.width = width
      // ctx.height = height
      // ctx.scale(dpr, dpr); // 根据设备像素比进行缩放

      // 清空画布
      ctx.clearRect(0, 0, chartWidth, chartHeight)

      // 绘制坐标轴
      ctx.setStrokeStyle('#333')
      ctx.setLineWidth(1)
      ctx.beginPath()
      ctx.moveTo(yAxis_end_x, yAxis_end_y)
      ctx.lineTo(yAxis_start_x, yAxis_start_y)
      ctx.lineTo(xAxis_end_x, xAxis_end_y)
      ctx.stroke()

      const rate = (chartHeight / maxValue)
      // 绘制柱状图
      data.forEach((item, index) => {
        const x = padding + index * (barWidth + barSpacing) + barSpacing / 2
        const barHeight = rate * item.value
        const y = height - padding - barHeight

        const colors = ["#4cd964", "#007aff", "#e62020ff", "#ffcc00", "#8e8e93", "#ff9500"]
        const color = colors[index % colors.length]

        // 绘制柱子
        ctx.setFillStyle(color)
        ctx.fillRect(x, y, barWidth, barHeight)

        // 绘制数值
        ctx.setFillStyle('#000')
        // ctx.setFontSize(labelFontSize)
        ctx.setTextAlign('center')
        ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5)

        // 绘制标签
        ctx.fillText(item.name, x + barWidth / 2, height - padding + labelHeight)
      })

      // 绘制标题
      ctx.setFillStyle(`#000 bold`)
      ctx.setFontSize(titleFontSize)
      ctx.setTextAlign('center')
      ctx.fillText(title, chartWidth / 2, titleY)

      ctx.draw()

    } catch (error) {
      console.error('绘制柱状图失败:', error)
    }
  }

  useReady(() => {
    if (dimensions.width > 0 && data.length > 0) {
      setTimeout(() => {
        drawChart()
      }, 100)
    }
  }, [data, title, dimensions])

  // const drawClick = () => {
  //   drawChart()
  // }

  return (
    <View className='chart-container'>
      {/* <View>
        <Button onClick={drawClick}>画柱状图</Button>
      </View> */}
      <Canvas
        id='barChart'
        canvasId='barChart'
        width={dimensions.width}
        height={dimensions.height}
        style={{
          width: '100%', height: 'auto',
          aspectRatio: dimensions.width / dimensions.height
        }}
      />
    </View>
  )
}

export default SimpleBarChart