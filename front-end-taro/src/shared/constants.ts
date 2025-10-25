// API配置常量
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://levan-pet-booking-service.vercel.app/api'  // ✅ 修正：添加 /api
  : 'http://localhost:3000/api';

// 具体的API URL常量
export const API_URLS = {
  // 枚举相关
  ENUMS_URL: `${BASE_URL}/enums`,
  USERS_ENUMS_URL: `${BASE_URL}/users/enums`,

  // 用户认证相关
  USERS_GENERATE_TOKEN_URL: `${BASE_URL}/users/generate-token`,
  USERS_VERIFY_TOKEN_URL: `${BASE_URL}/users/verify-token`,

  // 用户预约相关
  USERS_APPOINTMENTS_URL: `${BASE_URL}/users/appointments`,
  USERS_SERVICES_URL: `${BASE_URL}/users/services`,
  USERS_AVAILABLE_SLOTS_URL: `${BASE_URL}/users/available-slots`,

  // 管理员相关
  AUTH_LOGIN_URL: `${BASE_URL}/auth/login`,
  AUTH_CHECK_TOKEN_URL: `${BASE_URL}/auth/check-token`,

  // 预约管理相关
  APPOINTMENTS_URL: `${BASE_URL}/appointments`,
  APPOINTMENTS_UPDATE_STATUS_URL: `${BASE_URL}/appointments/:id/status`,
  AVAILABLE_SLOTS_URL: `${BASE_URL}/appointments/available-slots`,
  APPOINTMENT_BY_NO_URL: `${BASE_URL}/appointments/doc/:doc_no`,
  APPOINTMENT_STATS_TODAY_URL: `${BASE_URL}/appointments/stats/today`,
  APPOINTMENT_TODAY_URL: `${BASE_URL}/appointments/today`,
  APPOINTMENT_TODAY_NEW_URL: `${BASE_URL}/appointments/new/today`,

  // 服务相关
  SERVICES_URL: `${BASE_URL}/services`,

  // 操作日志
  OPERATION_LOGS_URL: `${BASE_URL}/operation-logs`,

  // 报表相关
  REPORTS_DAILY_URL: `${BASE_URL}/reports/daily`,
  REPORTS_MONTHLY_URL: `${BASE_URL}/reports/monthly`,
  REPORTS_YEARLY_URL: `${BASE_URL}/reports/yearly`,
  REPORTS_BASE_URL: `${BASE_URL}/reports/`,

  // WebSocket (生产环境禁用)
  WEBSOCKET_URL: process.env.NODE_ENV === 'production'
    ? null
    : 'ws://localhost:3000/ws/databoard',
} as const;

// 应用配置
export const APP_CONFIG = {
  PORT: 3000,
  ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
} as const;