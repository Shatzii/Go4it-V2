import { NextRequest, NextResponse } from 'next/server';
import { stripeIntegration } from '@/lib/stripe-integration';

// POST - Create Stripe subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, tier, name } = body;

    if (!userId || !email || !tier) {
      return NextResponse.json(
        { success: false, message: 'User ID, email, and tier are required' },
        { status: 400 },
      );
    }

    const validTiers = ['starter', 'pro', 'elite'];
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { success: false, message: 'Invalid subscription tier' },
        { status: 400 },
      );
    }

    const result = await stripeIntegration.createSubscription(userId, email, tier, name);

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      data: {
        subscriptionId: result.subscriptionId,
        clientSecret: result.clientSecret,
        customerId: result.customerId,
        tier,
        requiresPayment: true,
      },
    });
  } catch (error) {
    console.error('Error creating subscription:', error);

    if (error.message === 'User already has an active subscription') {
      return NextResponse.json(
        { success: false, message: 'User already has an active subscription' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create subscription', error: error.message },
      { status: 500 },
    );
  }
}

// GET - Get subscription tiers and pricing
export async function GET() {
  try {
    const tiers = stripeIntegration.constructor.getSubscriptionTiers();

    return NextResponse.json({
      success: true,
      data: {
        tiers,
        features: {
          starter: {
            socialAccounts: 3,
            garAnalysis: 'basic',
            support: 'community',
            analytics: 'basic',
          },
          pro: {
            socialAccounts: 'unlimited',
            garAnalysis: 'advanced',
            support: 'priority',
            analytics: 'advanced',
            aiCoaching: true,
            prospectTools: true,
          },
          elite: {
            socialAccounts: 'unlimited',
            garAnalysis: 'advanced',
            support: 'dedicated',
            analytics: 'advanced',
            aiCoaching: true,
            prospectTools: true,
            teamManagement: true,
            whiteLabel: true,
            strategySessions: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error getting subscription tiers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get subscription information' },
      { status: 500 },
    );
  }
}
