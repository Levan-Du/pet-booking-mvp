/**
 * 枚举API路由
 * 提供前端获取枚举数据的接口
 */

import express from 'express';
const router = express.Router();
import {
  PET_TYPES,
  PET_TYPES_TEXT,
  PET_TYPES_ICON,
  PET_SIZES,
  PET_SIZES_TEXT,
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_TEXT
} from '../shared/enums/index.js';

// 获取所有枚举数据
router.get('/', (req, res) => {
  try {
    const enumData = {
      petTypes: Object.values(PET_TYPES).map(type => ({
        value: type,
        label: PET_TYPES_TEXT[type],
        icon: PET_TYPES_ICON[type]
      })),
      petSizes: Object.values(PET_SIZES).map(size => ({
        value: size,
        label: PET_SIZES_TEXT[size]
      })),
      appointmentStatus: Object.values(APPOINTMENT_STATUS).map(status => ({
        value: status,
        label: APPOINTMENT_STATUS_TEXT[status]
      }))
    };

    res.json({
      success: true,
      data: enumData
    });
  } catch (error) {
    console.error('获取枚举数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取枚举数据失败'
    });
  }
});

// 获取宠物类型枚举
router.get('/pet-types', (req, res) => {
  try {
    const petTypes = Object.values(PET_TYPES).map(type => ({
      value: type,
      label: PET_TYPES_TEXT[type],
      icon: PET_TYPES_ICON[type]
    }));

    res.json({
      success: true,
      data: petTypes
    });
  } catch (error) {
    console.error('获取宠物类型枚举失败:', error);
    res.status(500).json({
      success: false,
      message: '获取宠物类型枚举失败'
    });
  }
});

// 获取宠物体型枚举
router.get('/pet-sizes', (req, res) => {
  try {
    const petSizes = Object.values(PET_SIZES).map(size => ({
      value: size,
      label: PET_SIZES_TEXT[size]
    }));

    res.json({
      success: true,
      data: petSizes
    });
  } catch (error) {
    console.error('获取宠物体型枚举失败:', error);
    res.status(500).json({
      success: false,
      message: '获取宠物体型枚举失败'
    });
  }
});

// 获取预约状态枚举
router.get('/appointment-status', (req, res) => {
  try {
    const appointmentStatus = Object.values(APPOINTMENT_STATUS).map(status => ({
      value: status,
      label: APPOINTMENT_STATUS_TEXT[status]
    }));

    res.json({
      success: true,
      data: appointmentStatus
    });
  } catch (error) {
    console.error('获取预约状态枚举失败:', error);
    res.status(500).json({
      success: false,
      message: '获取预约状态枚举失败'
    });
  }
});

export default router;