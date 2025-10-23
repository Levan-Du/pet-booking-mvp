import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useLanguage } from '../../shared/i18n/LanguageContext';
import './date-range-picker.scss';

interface DateRangePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialStartDate = '',
  initialEndDate = ''
}) => {
  const { t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<string>(initialStartDate);
  const [selectedEndDate, setSelectedEndDate] = useState<string>(initialEndDate);
  const [selectingStart, setSelectingStart] = useState<boolean>(true);
  const scrollViewRef = useRef<any>(null);

  // 生成月份数据
  const generateMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // 获取月份的第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取第一天是星期几（0-周日，1-周一，...，6-周六）
    const firstDayOfWeek = firstDay.getDay();
    
    // 生成日期数组
    const days: Date[] = [];
    
    // 添加上个月的最后几天
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }
    
    // 添加当前月的所有日期
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // 添加下个月的前几天，凑齐6行
    const totalCells = 42; // 6行 * 7列
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  // 格式化日期为 YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 判断日期是否在范围内
  const isDateInRange = (date: Date): boolean => {
    if (!selectedStartDate || !selectedEndDate) return false;
    
    const currentDateStr = formatDate(date);
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const current = new Date(currentDateStr);
    
    return current >= start && current <= end;
  };

  // 处理日期点击
  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    
    if (selectingStart) {
      setSelectedStartDate(dateStr);
      setSelectedEndDate('');
      setSelectingStart(false);
    } else {
      // 如果点击的日期在开始日期之前，交换开始和结束日期
      if (new Date(dateStr) < new Date(selectedStartDate)) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(dateStr);
      } else {
        setSelectedEndDate(dateStr);
      }
      setSelectingStart(true);
    }
  };

  // 切换月份
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // 确认选择
  const handleConfirm = () => {
    if (selectedStartDate && selectedEndDate) {
      onConfirm(selectedStartDate, selectedEndDate);
      onClose();
    } else {
      Taro.showToast({
        title: t('management.selectDateRange'),
        icon: 'none'
      });
    }
  };

  // 清空选择
  const handleClear = () => {
    setSelectedStartDate('');
    setSelectedEndDate('');
    setSelectingStart(true);
  };

  if (!visible) return null;

  const monthData = generateMonthData(currentMonth);
  const weekDays = [t('common.sunday'), t('common.monday'), t('common.tuesday'), t('common.wednesday'), t('common.thursday'), t('common.friday'), t('common.saturday')];
  const monthNames = [t('common.january'), t('common.february'), t('common.march'), t('common.april'), t('common.may'), t('common.june'), t('common.july'), t('common.august'), t('common.september'), t('common.october'), t('common.november'), t('common.december')];

  return (
    <View className="date-range-picker-modal">
      <View className="date-range-picker-overlay" onClick={onClose} />
      <View className="date-range-picker-content">
        <View className="picker-header">
          <Text className="picker-title">{t('management.selectDateRange')}</Text>
          <View className="month-navigation">
            <Text className="nav-btn" onClick={goToPrevMonth}>‹</Text>
            <Text className="month-title">
              {currentMonth.getFullYear()}{t('common.year')}{monthNames[currentMonth.getMonth()]}
            </Text>
            <Text className="nav-btn" onClick={goToNextMonth}>›</Text>
          </View>
          
          <View className="selection-info">
            <Text className="info-text">
              {selectedStartDate && selectedEndDate 
                ? `${selectedStartDate} ${t('common.to')} ${selectedEndDate}`
                : selectingStart ? t('management.selectStartDate') : t('management.selectEndDate')
              }
            </Text>
          </View>
        </View>

        <View className="week-days">
          {weekDays.map(day => (
            <Text key={day} className="week-day">{day}</Text>
          ))}
        </View>

        <ScrollView 
          className="calendar-scroll"
          scrollX
          ref={scrollViewRef}
        >
          <View className="calendar-grid">
            {monthData.map((date, index) => {
              const dateStr = formatDate(date);
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isToday = dateStr === formatDate(new Date());
              const isSelectedStart = dateStr === selectedStartDate;
              const isSelectedEnd = dateStr === selectedEndDate;
              const isInRange = isDateInRange(date);
              
              return (
                <View 
                  key={index}
                  className={`date-cell ${isCurrentMonth ? 'current-month' : 'other-month'} ${
                    isToday ? 'today' : ''
                  } ${isSelectedStart ? 'selected-start' : ''} ${
                    isSelectedEnd ? 'selected-end' : ''
                  } ${isInRange ? 'in-range' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <Text className="date-text">{date.getDate()}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View className="picker-actions">
          <Button className="action-btn clear-btn" onClick={handleClear}>{t('management.clear')}</Button>
          <Button className="action-btn confirm-btn" onClick={handleConfirm}>{t('common.confirm')}</Button>
        </View>
      </View>
    </View>
  );
};

export default DateRangePicker;