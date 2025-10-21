import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiRequest } from '../../utils/requestUtils'
import CustomNavbar from '../../components/custom-navbar/custom-navbar'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import { API_URLS } from '../../shared/constants'
import './operation-log.scss'

interface OperationLog {
  _id: string
  operation_type: string
  operator: string
  target_appointment_no?: string
  old_status?: string
  new_status?: string
  operation_time: string
  details?: string
}

const OperationLog: React.FC = () => {
  const { t } = useLanguage()
  const [logs, setLogs] = React.useState<OperationLog[]>([])
  const [loading, setLoading] = React.useState(false)

  const loadOperationLogs = async () => {
    setLoading(true)
    try {
      const response = await apiRequest({
        url: API_URLS.OPERATION_LOGS_URL,
        method: 'GET'
      })

      if (response.data.success) {
        setLogs(response.data.data.logs || [])
      }
    } catch (error) {
      Taro.showToast({
        title: t('operation_log.loadFailed'),
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const getOperationTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      'create_appointment': t('operation_log.create_appointment'),
      'update_status': t('operation_log.update_status'),
      'scan_signin': t('operation_log.scan_signin'),
      'manual_signin': t('operation_log.manual_signin'),
      'cancel_appointment': t('operation_log.cancel_appointment')
    }
    return typeMap[type] || type
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': t('appointment_status.pending'),
      'confirmed': t('appointment_status.confirmed'),
      'in_progress': t('appointment_status.in_progress'),
      'completed': t('appointment_status.completed'),
      'cancelled': t('appointment_status.cancelled'),
      'broken': t('appointment_status.broken')
    }
    return statusMap[status] || status
  }

  React.useEffect(() => {
    loadOperationLogs()
  }, [])

  return (
    <View className="layout page-log">
      <CustomNavbar title={t('operation_log.title')} />
      <View className='container'>
        <View className='content-container'>
          <ScrollView className='log-list' scrollY>
            {logs.map(log => (
              <View key={log._id} className='log-card card'>
                <View className='log-header'>
                  <Text className='log-type'>{getOperationTypeText(log.operation_type)}</Text>
                  <Text className='log-time'>{formatDateTime(log.operation_time)}</Text>
                </View>

                <View className='log-content'>
                  <View className='log-row'>
                    <Text className='label'>{t('operation_log.operator')}:</Text>
                    <Text className='value'>{log.operator}</Text>
                  </View>

                  {log.target_appointment_no && (
                    <View className='log-row'>
                      <Text className='label'>{t('operation_log.appointment_no')}:</Text>
                      <Text className='value'>#{log.target_appointment_no}</Text>
                    </View>
                  )}

                  {log.old_status && log.new_status && (
                    <View className='log-row'>
                      <Text className='label'>{t('operation_log.status_change')}:</Text>
                      <Text className='value'>{getStatusText(log.old_status)} → {getStatusText(log.new_status)}</Text>
                    </View>
                  )}

                  {log.details && (
                    <View className='log-row'>
                      <Text className='label'>{t('operation_log.details')}:</Text>
                      <Text className='value'>{log.details}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          {loading && (
            <View className='loading'>
              <Text>{t('common.loading')}</Text>
            </View>
          )}

          {!loading && logs.length === 0 && (
            <View className='empty'>
              <Text>{t('operation_log.noData')}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default OperationLog