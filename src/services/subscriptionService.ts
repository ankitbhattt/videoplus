import { API_ENDPOINTS } from '../config/api';

export interface SubscribeResponse {
  ok: boolean;
  statusCode?: string;
  statusMessage?: string;
  amountCharged?: string;
  transactionId?: string;
  subscriptionMisdnId?: string;
  data?: Record<string, unknown>;
  errorMessage?: string | null;
}

export const subscribe = async (
  msisdn: string,
  planId: string
): Promise<SubscribeResponse> => {
  const response = await fetch(API_ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ msisdn, plan_id: planId }),
  });

  if (!response.ok) {
    throw new Error('Network error');
  }

  return response.json();
};
