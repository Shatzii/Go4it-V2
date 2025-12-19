export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}

// Stripe Price IDs for different subscription tiers
const STRIPE_PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter_monthly',
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
  elite: process.env.STRIPE_ELITE_PRICE_ID || 'price_elite_monthly',
};

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29.99,
    interval: 'month',
    stripePriceId: STRIPE_PRICE_IDS.starter,
    features: [
      'Basic GAR Analysis',
      'Social Media Integration (3 accounts)',
      'Basic Performance Tracking',
      'Community Access',
      'Mobile App Access',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 79.99,
    interval: 'month',
    stripePriceId: STRIPE_PRICE_IDS.pro,
    popular: true,
    features: [
      'Advanced GAR Analysis',
      'Unlimited Social Media Accounts',
      'AI Coaching & Recommendations',
      'StarPath Progression System',
      'Prospect Discovery Tools',
      'Advanced Analytics',
      'Priority Support',
    ],
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price: 149.99,
    interval: 'month',
    stripePriceId: STRIPE_PRICE_IDS.elite,
    features: [
      'Everything in Pro',
      'Personal AI Coach',
      'Advanced Recruitment Automation',
      'Custom Training Plans',
      'Team Management Tools',
      'White-label Options',
      'Dedicated Account Manager',
      '1-on-1 Strategy Sessions',
    ],
  },
};
