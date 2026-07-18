import { getPlanDurationDays } from '../config/subscriptionPlans';

const SESSION_KEY = 'videoplus_session';

export interface UserSession {
  msisdn: string;
  phoneNumber: string;
  isSubscribed: boolean;
  planId?: string;
  expiryTimestamp: number | null;
}

export const saveSession = (session: UserSession): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const loadSession = (): UserSession | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const isSessionActive = (session: UserSession | null): boolean => {
  if (!session) {
    return false;
  }

  if (!session.isSubscribed) {
    return true;
  }

  if (!session.expiryTimestamp) {
    return false;
  }

  return Date.now() < session.expiryTimestamp;
};

export const createOtpVerifiedSession = (
  msisdn: string,
  phoneNumber: string
): UserSession => ({
  msisdn,
  phoneNumber,
  isSubscribed: false,
  expiryTimestamp: null,
});

export const createSubscribedSession = (
  msisdn: string,
  phoneNumber: string,
  planId: string
): UserSession => {
  const durationDays = getPlanDurationDays(planId);
  const expiryTimestamp = Date.now() + durationDays * 24 * 60 * 60 * 1000;

  return {
    msisdn,
    phoneNumber,
    isSubscribed: true,
    planId,
    expiryTimestamp,
  };
};
