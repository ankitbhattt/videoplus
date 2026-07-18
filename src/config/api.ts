export const API_BASE_URL = 'https://apiunisol.com/videoplus_backend/api/v1';

export const API_ENDPOINTS = {
  SEND_OTP: `${API_BASE_URL}/mtn/otp/send`,
  VERIFY_OTP: `${API_BASE_URL}/mtn/otp/verify`,
  SUBSCRIBE: `${API_BASE_URL}/mtn/subscribe`,
} as const;

export const COUNTRY_CODE = '+268';
export const PHONE_DIGIT_LENGTH = 8;
