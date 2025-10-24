// API配置常量
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://levan-pet-booking.vercel.app/api'
  : 'http://localhost:3000/api';

// 具体的API URL常量
export const API_URLS = {
  GENERATE_TOKEN_URL: `${BASE_URL}/users/generate-token`,
  VERIFY_TOKEN_URL: `${BASE_URL}/users/verify-token`,
  ADMIN_LOGIN_URL: `${BASE_URL}/admin/login`,
  ADMIN_CHECK_TOKEN_URL: `${BASE_URL}/admin/checktoken`,
  APPOINTMENTS_URL: `${BASE_URL}/appointments`,
  APPOINTMENTS_UPDATE_STATUS_URL: `${BASE_URL}/appointments/:id/status`,
  ENUMS_URL: `${BASE_URL}/enums`,
  SERVICES_URL: `${BASE_URL}/services`,
  AVAILABLE_SLOTS_URL: `${BASE_URL}/appointments/available-slots`,
  APPOINTMENT_BY_NO_URL: `${BASE_URL}/appointments/by-no`,
  APPOINTMENT_STATS_TODAY_URL: `${BASE_URL}/appointments/stats/today`,
  APPOINTMENT_TODAY_URL: `${BASE_URL}/appointments/today`,
  APPOINTMENT_TODAY_NEW_URL: `${BASE_URL}/appointments/today/new`,
  OPERATION_LOGS_URL: `${BASE_URL}/operation-logs`,
  REPORTS_DAILY_URL: `${BASE_URL}/reports/daily`,
  REPORTS_MONTHLY_URL: `${BASE_URL}/reports/monthly`,
  REPORTS_YEARLY_URL: `${BASE_URL}/reports/yearly`,
  REPORTS_BASE_URL: `${BASE_URL}/reports/`,
  WEBSOCKET_URL: 'ws://localhost:3000/ws/databoard',
  USER_APPOINTMENTS_URL: `${BASE_URL}/users/appointments`,
} as const;

// 应用配置
export const APP_CONFIG = {
  PORT: 3000,
  ENV: process.env.NODE_ENV || 'development'
} as const;