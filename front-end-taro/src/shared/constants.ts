// API配置常量
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://levan-pet-booking.vercel.app/api'
  : 'http://localhost:3000/api';

// 具体的API URL常量
export const API_URLS = {
  ENUMS_URL: `${BASE_URL}/enums`,
  USERS_GENERATE_TOKEN_URL: `${BASE_URL}/users/generate-token`,
  USERS_VERIFY_TOKEN_URL: `${BASE_URL}/users/verify-token`,
  USERS_APPOINTMENTS_URL: `${BASE_URL}/users/appointments`,
  USERS_ENUMS_URL: `${BASE_URL}/users/enums`,
  USERS_SERVICES_URL: `${BASE_URL}/users/services`,
  USERS_AVAILABLE_SLOTS_URL: `${BASE_URL}/users/available-slots`,
  ADMIN_LOGIN_URL: `${BASE_URL}/admin/login`,
  ADMIN_CHECK_TOKEN_URL: `${BASE_URL}/admin/check-token`,
  APPOINTMENTS_URL: `${BASE_URL}/appointments`,
  APPOINTMENTS_UPDATE_STATUS_URL: `${BASE_URL}/appointments/:id/status`,
  AVAILABLE_SLOTS_URL: `${BASE_URL}/appointments/available-slots`,
  APPOINTMENT_BY_NO_URL: `${BASE_URL}/appointments/doc/:doc_no`,
  APPOINTMENT_STATS_TODAY_URL: `${BASE_URL}/appointments/stats/today`,
  APPOINTMENT_TODAY_URL: `${BASE_URL}/appointments/today`,
  APPOINTMENT_TODAY_NEW_URL: `${BASE_URL}/appointments/new`,
  SERVICES_URL: `${BASE_URL}/services`,
  OPERATION_LOGS_URL: `${BASE_URL}/operation-logs`,
  REPORTS_DAILY_URL: `${BASE_URL}/reports/daily`,
  REPORTS_MONTHLY_URL: `${BASE_URL}/reports/monthly`,
  REPORTS_YEARLY_URL: `${BASE_URL}/reports/yearly`,
  REPORTS_BASE_URL: `${BASE_URL}/reports/`,
  WEBSOCKET_URL: 'ws://localhost:3000/ws/databoard',
} as const;

// 应用配置
export const APP_CONFIG = {
  PORT: 3000,
  ENV: process.env.NODE_ENV || 'development'
} as const;