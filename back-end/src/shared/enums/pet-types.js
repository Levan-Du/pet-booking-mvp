/**
 * 宠物类型枚举
 * 前后端共享的宠物类型定义
 */

export const PET_TYPES = {
  DOG: 'dog',
  CAT: 'cat',
  OTHER: 'other'
};

// 宠物类型显示文本映射
export const PET_TYPES_TEXT = {
  [PET_TYPES.DOG]: '狗狗',
  [PET_TYPES.CAT]: '猫咪',
  [PET_TYPES.OTHER]: '其他'
};

// 宠物类型图标映射
export const PET_TYPES_ICON = {
  [PET_TYPES.DOG]: '/static/images/dog.png',
  [PET_TYPES.CAT]: '/static/images/cat.png',
  [PET_TYPES.OTHER]: '/static/images/other.png'
};

// 有效宠物类型列表
export const VALID_PET_TYPES = Object.values(PET_TYPES);

export default {
  PET_TYPES,
  PET_TYPES_TEXT,
  PET_TYPES_ICON,
  VALID_PET_TYPES
};