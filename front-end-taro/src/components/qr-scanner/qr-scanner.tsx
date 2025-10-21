import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import './qr-scanner.scss'

interface QRScannerProps {
  onScanSuccess: (result: string) => void
  onClose: () => void
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose }) => {
  const { t } = useLanguage()

  const handleScan = async () => {
    try {
      const res = await Taro.scanCode({
        scanType: ['qrCode'],
        onlyFromCamera: true
      })

      if (res.result) {
        onScanSuccess(res.result)
      }
    } catch (error) {
      Taro.showToast({
        title: t('common.scanFailed') || '扫码失败',
        icon: 'error'
      })
    }
  }

  return (
    <View className="qr-scanner">
      <View className="scanner-overlay">
        <View className="scanner-content">
          <Text className="scanner-title">{t('management.scan_qr') || '扫码签到'}</Text>
          <Text className="scanner-desc">请对准客户的预约二维码进行扫描</Text>

          <Button
            className="scan-button"
            onClick={handleScan}
          >
            {t('management.scan_qr') || '开始扫码'}
          </Button>

          <Button
            className="close-button"
            onClick={onClose}
          >
            {t('common.close') || '关闭'}
          </Button>
        </View>
      </View>
    </View>
  )
}

export default QRScanner