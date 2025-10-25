import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import SimpleBarChart from '../../components/simple-bar-chart/simple-bar-chart'
import SimplePieChart from '../../components/simple-pie-chart/simple-pie-chart'
import CustomNavbar from '../../components/custom-navbar/custom-navbar'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import { authUtils } from '../../utils/authUtils'
import { API_URLS } from '../../shared/constants'
import { withAuth } from '../../shared/withAuth/withAuth'
import './reports.scss'

const Reports: React.FC = () => {
  const { t } = useLanguage()
  const [selectedFilter, setSelectedFilter] = React.useState('day')
  const [pieChartData, setPieChartData] = React.useState([])
  const [barChartData, setBarChartData] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  // 获取报表数据
  const fetchReportData = async (filterType: string) => {
    setLoading(true)
    setError('')

    try {
      let endpoint = ''
      switch (filterType) {
        case 'day':
          endpoint = 'daily'
          break
        case 'month':
          endpoint = 'monthly'
          break
        case 'year':
          endpoint = 'yearly'
          break
        default:
          endpoint = 'daily'
      }

      const token = authUtils.getToken()
      if (!token) {
        setError(t('common.networkError') || '请先登录')
        return
      }

      const response = await Taro.request({
        url: API_URLS.REPORTS_BASE_URL + endpoint,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data.success) {
        const data = response.data.data
        processChartData(data, filterType)
      } else {
        setError(t('reports.error') || '加载失败')
      }
    } catch (err) {
      setError(t('reports.error') || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理图表数据
  const processChartData = (data: any[], filterType: string) => {
    // 饼图数据 - 显示完成和爽约的对比
    const pieData = [
      { name: t('reports.completed'), value: data.reduce((sum, item) => sum + (item.completed || 0), 0) },
      { name: t('reports.broken'), value: data.reduce((sum, item) => sum + (item.broken || 0), 0) },
      { name: t('reports.canceled'), value: data.reduce((sum, item) => sum + (item.canceled || 0), 0) }
    ]
    setPieChartData(pieData)
    console.log('reports.tsx -> processChartData -> pieChartData', t('reports.completed'))

    // 柱状图数据 - 显示各时间段的总预约数
    const barData = data.map(item => {
      let name = ''
      switch (filterType) {
        case 'day':
          // name = item.date.split('-').slice(1).join('/') // 显示月-日
          name = item.date.split('-').slice(1)[1] // 显示月-日
          break
        case 'month':
          name = getMonthName(item.month.split('-')[1])
          break
        case 'year':
          name = item.year
          break
        default:
          name = item.date
      }
      return {
        name,
        value: item.total || 0
      }
    })

    const dBarData = filterType === 'month' ? barData.filter(d => parseInt(d.name) <= new Date().getMonth() + 1) : barData
    setBarChartData(dBarData)
  }

  // 获取月份名称
  const getMonthName = (month: string) => {
    const months = [
      t('reports.january'), t('reports.february'), t('reports.march'),
      t('reports.april'), t('reports.may'), t('reports.june'),
      t('reports.july'), t('reports.august'), t('reports.september'),
      t('reports.october'), t('reports.november'), t('reports.december')
    ]
    return months[parseInt(month) - 1] || month
    // return month
  }

  // 切换筛选类型
  const handleFilterChange = (filterType: string) => {
    setSelectedFilter(filterType)
    // fetchReportData(filterType)
  }

  // 初始化加载数据
  React.useEffect(() => {
    fetchReportData(selectedFilter)
  }, [selectedFilter])

  // 获取图表标题
  const getChartTitle = () => {
    switch (selectedFilter) {
      case 'day':
        return t('reports.dailyStats')
      case 'month':
        return t('reports.monthlyStats')
      case 'year':
        return new Date().toLocaleString('default', { year: 'numeric' }) + ' ' + t('reports.yearlyStats')
      default:
        return t('reports.barChartTitle')
    }
  }

  return (
    <View className='layout page-reports'>
      <CustomNavbar title={t('reports.title')} />
      <View className='container'>
        <View className='content-container'>

          {/* 加载状态 */}
          {loading && (
            <View className='loading-container'>
              <Text className='loading-text'>{t('reports.loading')}</Text>
            </View>
          )}

          {/* 错误状态 */}
          {error && !loading && (
            <View className='error-container'>
              <Text className='error-text'>{error}</Text>
            </View>
          )}

          {/* 图表区域 */}
          {!loading && !error && (
            <>
              <View className='charts-box card'>
                <SimplePieChart
                  title={t('reports.pieChartTitle')}
                  data={pieChartData.length > 0 ? pieChartData : [
                    { name: t('reports.completed'), value: 0 },
                    { name: t('reports.broken'), value: 0 }
                  ]}
                />
              </View>
              <View className='charts-box card'>
                <SimpleBarChart
                  title={getChartTitle()}
                  data={barChartData}
                  type={selectedFilter}
                />
              </View>
            </>
          )}

          {/* 筛选栏 */}
          <View className='filter-bar'>
            <View className="filter-item-box card">
              <View
                className={`filter-item day ${selectedFilter === 'day' ? 'active' : ''}`}
                onClick={() => handleFilterChange('day')}
              >
                {t('reports.day')}
              </View>
              <View className="filter-item-divide"></View>
              <View
                className={`filter-item month ${selectedFilter === 'month' ? 'active' : ''}`}
                onClick={() => handleFilterChange('month')}
              >
                {t('reports.month')}
              </View>
              <View className="filter-item-divide"></View>
              <View
                className={`filter-item year ${selectedFilter === 'year' ? 'active' : ''}`}
                onClick={() => handleFilterChange('year')}
              >
                {t('reports.year')}
              </View>
            </View>
          </View>

          {/* 无数据状态 */}
          {!loading && !error && pieChartData.length === 0 && barChartData.length === 0 && (
            <View className='no-data-container'>
              <Text className='no-data-text'>{t('reports.noData')}</Text>
            </View>
          )}

        </View>
      </View>
    </View>
  )
}

export default withAuth(Reports)