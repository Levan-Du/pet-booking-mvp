// API配置常量
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.yourdomain.com'
  : 'http://localhost:3000';

// 具体的API URL常量
export const API_URLS = {
  GENERATE_TOKEN_URL: `${BASE_URL}/api/users/generate-token`,
  VERIFY_TOKEN_URL: `${BASE_URL}/api/users/verify-token`,
  ADMIN_LOGIN_URL: `${BASE_URL}/api/admin/login`,
  ADMIN_CHECK_TOKEN_URL: `${BASE_URL}/api/admin/checktoken`,
  APPOINTMENTS_URL: `${BASE_URL}/api/appointments`,
  APPOINTMENTS_UPDATE_STATUS_URL: `${BASE_URL}/api/appointments/:id/status`,
  ENUMS_URL: `${BASE_URL}/api/enums`,
  SERVICES_URL: `${BASE_URL}/api/services`,
  AVAILABLE_SLOTS_URL: `${BASE_URL}/api/appointments/available-slots`,
  APPOINTMENT_BY_NO_URL: `${BASE_URL}/api/appointments/by-no`,
  OPERATION_LOGS_URL: `${BASE_URL}/api/operation-logs`,
  REPORTS_TODAY_URL: `${BASE_URL}/api/reports/today`,
  REPORTS_BASE_URL: `${BASE_URL}/api/reports/`,
  WEBSOCKET_URL: 'ws://localhost:3000/ws/databoard',
  USER_APPOINTMENTS_URL: `${BASE_URL}/api/users/appointments`,
} as const;

// 应用配置
export const APP_CONFIG = {
  PORT: 3000,
  ENV: process.env.NODE_ENV || 'development'
} as const;