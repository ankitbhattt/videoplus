import { API_ENDPOINTS } from '../config/api';

export interface SendOtpResponse {
  ok: boolean;
  statusCode: string;
  statusMessage: string;
  transactionId?: string;
  data?: {
    status: string;
  };
  clientCorrelator?: string;
  errorMessage?: string | null;
  devMode?: boolean;
  devOtp?: string;
}

export const buildMsisdn = (phoneDigits: string): string => {
  return `268${phoneDigits}`;
};

export interface VerifyOtpResponse {
  ok: boolean;
  verified: boolean;
  errorMessage: string | null;
}

export const sendOtp = async (msisdn: string): Promise<SendOtpResponse> => {
  const response = await fetch(API_ENDPOINTS.SEND_OTP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ msisdn }),
  });

  if (!response.ok) {
    throw new Error('Network error');
  }

  return response.json();
};

export const verifyOtp = async (msisdn: string, otp: string): Promise<VerifyOtpResponse> => {
  const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ msisdn, otp }),
  });

  if (!response.ok) {
    throw new Error('Network error');
  }

  return response.json();
};
