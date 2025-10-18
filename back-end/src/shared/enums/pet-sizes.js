/**
 * 宠物体型枚举
 * 前后端共享的宠物体型定义
 */

export const PET_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

// 宠物体型显示文本映射
export const PET_SIZES_TEXT = {
  [PET_SIZES.SMALL]: '小型',
  [PET_SIZES.MEDIUM]: '中型',
  [PET_SIZES.LARGE]: '大型'
};

// 有效宠物体型列表
export const VALID_PET_SIZES = Object.values(PET_SIZES);

export default {
  PET_SIZES,
  PET_SIZES_TEXT,
  VALID_PET_SIZES
};