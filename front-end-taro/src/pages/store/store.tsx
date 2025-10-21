import React from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import CustomNavbar from '../../components/custom-navbar/custom-navbar'
import { useLanguage } from '../../shared/i18n/LanguageContext'
import './store.scss'

const Store: React.FC = () => {
  const { t } = useLanguage()
  const storeInfo = {
    name: t('store.name'),
    address: t('store.address'),
    phone: t('store.phone'),
    businessHours: t('store.businessHours'),
    services: [
      { name: t('store.services.grooming.name'), price: t('store.services.grooming.price'), desc: t('store.services.grooming.desc') },
      { name: t('store.services.health.name'), price: t('store.services.health.price'), desc: t('store.services.health.desc') },
      { name: t('store.services.boarding.name'), price: t('store.services.boarding.price'), desc: t('store.services.boarding.desc') },
      { name: t('store.services.supplies.name'), price: t('store.services.supplies.price'), desc: t('store.services.supplies.desc') }
    ]
  }

  const handleCall = () => {
    Taro.makePhoneCall({
      phoneNumber: storeInfo.phone
    })
  }

  const handleNavigate = () => {
    Taro.openLocation({
      latitude: 39.9042,
      longitude: 116.4074,
      name: storeInfo.name,
      address: storeInfo.address
    })
  }

  return (
    <View className='store-page'>
      <CustomNavbar title={t('store.title')} showBack={true} />
      <ScrollView className='store-content' scrollY>
        {/* 店铺招牌 */}
        <View className='store-banner'>
          <Image 
            className='store-logo' 
            src='https://via.placeholder.com/200x200/007AFF/ffffff?text=宠物店'
            mode='aspectFit'
          />
          <Text className='store-name'>{storeInfo.name}</Text>
        </View>

        {/* 店铺信息 */}
        <View className='info-section'>
          <Text className='section-title'>{t('store.store_info')}</Text>
          <View className='info-item'>
            <Text className='info-label'>{t('store.address_label')}</Text>
            <Text className='info-value' onClick={handleNavigate}>{storeInfo.address}</Text>
          </View>
          <View className='info-item'>
            <Text className='info-label'>{t('store.phone_label')}</Text>
            <Text className='info-value phone' onClick={handleCall}>{storeInfo.phone}</Text>
          </View>
          <View className='info-item'>
            <Text className='info-label'>{t('store.hours_label')}</Text>
            <Text className='info-value'>{storeInfo.businessHours}</Text>
          </View>
        </View>

        {/* 服务项目 */}
        <View className='services-section'>
          <Text className='section-title'>{t('store.services_title')}</Text>
          {storeInfo.services.map((service, index) => (
            <View key={index} className='service-item'>
              <View className='service-header'>
                <Text className='service-name'>{service.name}</Text>
                <Text className='service-price'>{service.price}</Text>
              </View>
              <Text className='service-desc'>{service.desc}</Text>
            </View>
          ))}
        </View>

        {/* 店铺特色 */}
        <View className='features-section'>
          <Text className='section-title'>{t('store.features_title')}</Text>
          <View className='features-list'>
            <Text className='feature'>✓ 专业宠物美容师团队</Text>
            <Text className='feature'>✓ 进口宠物护理产品</Text>
            <Text className='feature'>✓ 舒适安全的寄养环境</Text>
            <Text className='feature'>✓ 24小时在线咨询服务</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Store