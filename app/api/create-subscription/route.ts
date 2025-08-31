import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Price IDs for different subscription tiers
const PRICE_IDS = {
  starter: {
    monthly: 'price_starter_monthly',
    annual: 'price_starter_annual',
  },
  pro: {
    monthly: 'price_pro_monthly',
    annual: 'price_pro_annual',
  },
  elite: {
    monthly: 'price_elite_monthly',
    annual: 'price_elite_annual',
  },
};

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, isAnnual } = await request.json();

    if (!priceId || !PRICE_IDS[priceId as keyof typeof PRICE_IDS]) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
    }

    // Get or create Stripe customer
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        metadata: {
          userId: user.id.toString(),
        },
      });

      // Save stripe customer ID to user (you'll need to implement this in your storage)
      // await storage.updateUserStripeCustomerId(user.id, customer.id)
    }

    // Create checkout session
    const priceIdKey = isAnnual ? 'annual' : 'monthly';
    const selectedPriceId = PRICE_IDS[priceId as keyof typeof PRICE_IDS][priceIdKey];

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/dashboard?subscription=success`,
      cancel_url: `${request.nextUrl.origin}/pricing?subscription=cancelled`,
      metadata: {
        userId: user.id.toString(),
        planType: priceId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Subscription creation error:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
