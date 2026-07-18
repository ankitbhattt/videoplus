export interface SubscriptionPlan {
  id: string;
  planId: string;
  name: string;
  duration: string;
  durationDays: number;
  price: number;
  popular?: boolean;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'daily',
    planId: '26801220000008003',
    name: 'VideoPLUS Daily',
    duration: 'Daily',
    durationDays: 1,
    price: 0.5,
    features: ['Unlimited Videos', 'HD Quality', 'Mobile Access', 'Ad-Free Experience'],
  },
  {
    id: '3days',
    planId: '26801220000008002',
    name: 'VideoPLUS 3 Days',
    duration: '3 Days',
    durationDays: 3,
    price: 1.5,
    features: ['Unlimited Videos', 'HD Quality', 'Mobile Access', 'Ad-Free Experience'],
  },
  {
    id: '5days',
    planId: '26801220000008001',
    name: 'VideoPLUS 5 Days',
    duration: '5 Days',
    durationDays: 5,
    price: 2.5,
    features: ['Unlimited Videos', 'HD Quality', 'Mobile & Desktop', 'Ad-Free Experience'],
  },
  {
    id: 'monthly',
    planId: '26801220000008000',
    name: 'VideoPLUS Monthly',
    duration: 'Monthly',
    durationDays: 30,
    price: 15,
    popular: true,
    features: [
      'Unlimited Videos',
      '4K Quality',
      'All Devices',
      'Ad-Free Experience',
      'Exclusive Content',
      'Priority Support',
    ],
  },
];

export const getPlanDurationDays = (planId: string): number => {
  const plan = SUBSCRIPTION_PLANS.find((item) => item.planId === planId);
  return plan?.durationDays ?? 1;
};

export const getPlanByPlanId = (planId: string): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find((item) => item.planId === planId);
};

export const formatPlanPrice = (price: number): string => {
  return Number.isInteger(price) ? price.toString() : price.toFixed(2);
};
