import React from 'react'
import { View, Canvas } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './simple-pie-chart.scss'

interface ChartDataItem {
  name: string
  value: number
}

interface SimplePieChartProps {
  title: string
  data: ChartDataItem[]
  width?: number
  height?: number
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({ title, data, width = 300, height = 400 }) => {
  const dpr = Taro.getSystemInfoSync().pixelRatio || 2
  const [dimensions, setDimensions] = React.useState({
    width: 360 * dpr,
    height: 250 * dpr
  })

  const drawChart = async () => {
    try {
      if (!data.length) return
      const { width, height } = dimensions
      const chartWidth = width
      const chartHeight = height

      const ctx = Taro.createCanvasContext('pieChart', this)
      // ctx.scale(dpr, dpr); // 适配高清屏幕;
      ctx.clearRect(0, 0, chartWidth, chartHeight)

      const total = data.reduce((sum, item) => sum + item.value, 0)
      if (total === 0) return

      const fontSize = width * 0.05
      const titleLineWidth = title.length * fontSize
      const centerX = chartHeight / 2
      const centerY = chartHeight / 2 + fontSize
      const radius = Math.min(centerX, centerY) - fontSize

      console.log(width, fontSize)

      let startAngle = 0
      const colors = ["#4cd964", "#007aff", "#e62020ff", "#ffcc00", "#8e8e93", "#ff9500"]

      data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI
        const color = colors[index % colors.length]

        // 绘制扇形
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
        ctx.closePath()
        ctx.setFillStyle(color)
        ctx.fill()

        // 绘制边框
        ctx.setStrokeStyle('#fff')
        ctx.setLineWidth(3)
        ctx.stroke()

        // 计算标签位置 - 修改为扇形内部
        const midAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 0.6
        const labelX = centerX + Math.cos(midAngle) * labelRadius - 20
        const labelY = centerY + Math.sin(midAngle) * labelRadius
        const percentage = ((item.value / total) * 100).toFixed(1)

        // 设置标签样式
        const textColor = getContrastColor(color)
        ctx.setFillStyle(textColor)
        // ctx.setFontSize(fontSize) // 修复字体大小设置
        ctx.setTextAlign('center')
        ctx.setTextBaseline('middle')

        // 如果扇形太小，不显示标签
        if (sliceAngle > 0.3) {
          ctx.fillText(`${percentage}%`, labelX, labelY)
        }

        startAngle += sliceAngle
      })

      // 绘制标题 - 修复字体设置
      ctx.setFillStyle('#000')
      ctx.setFontSize(fontSize) // 修复字体大小设置
      ctx.setTextAlign('center')
      ctx.fillText(title, width / 2 - titleLineWidth / 2, fontSize / 2) // 调整位置避免被裁剪

      // 绘制图例
      drawLegend(ctx, data, total, colors, chartWidth, chartHeight)

      ctx.draw()

    } catch (error) {
      console.error('绘制饼图失败:', error)
    }
  }

  // 辅助函数：根据背景色获取对比色
  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#333333' : '#ffffff'
  }

  // 绘制图例
  const drawLegend = (ctx, data, total, colors, width, height) => {
    const legendY = 50
    const fontSize = width * 0.04
    const fontLineWidth = Math.max(...data.map(item => item.name.length)) * fontSize
    const legendX = width - fontLineWidth - fontSize - 10

    data.forEach((item, index) => {
      const y = legendY + index * fontSize
      const color = colors[index % colors.length]
      const percentage = ((item.value / total) * 100).toFixed(1)

      // 绘制颜色方块
      ctx.setFillStyle(color)
      ctx.fillRect(legendX, y, fontSize, fontSize)

      // 绘制图例文字
      ctx.setFillStyle('#333')
      ctx.setFontSize(fontSize)
      ctx.setTextAlign('left')

      let displayText = `${item.name} (${percentage}%)`
      if (displayText.length > 15) {
        displayText = item.name.substring(0, 8) + '...' + `(${percentage}%)`
      }

      ctx.fillText(displayText, width - fontLineWidth, y + fontSize / 2)
    })
  }

  React.useEffect(() => {
    setTimeout(() => {
      drawChart()
    }, 100)
  }, [data, title])

  return (
    <View className='chart-container'>
      <Canvas
        id="pieChart"
        canvasId='pieChart'
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

export default SimplePieChart