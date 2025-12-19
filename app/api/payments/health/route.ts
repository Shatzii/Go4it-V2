import { NextResponse } from 'next/server';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription-tiers';
import priceMapRaw from '@/content/oer/price-map.json';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
  const webhookConfigured = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return NextResponse.json({
    success: true,
    stripeConfigured,
    webhookConfigured,
    appUrl,
    subscriptionTiers: Object.values(SUBSCRIPTION_TIERS).map((tier) => ({
      id: tier.id,
      name: tier.name,
      price: tier.price,
      interval: tier.interval,
      stripePriceId: tier.stripePriceId,
    })),
    oneTimePrices: priceMapRaw,
  });
}
