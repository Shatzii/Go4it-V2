import { NextRequest, NextResponse } from 'next/server';
import { stripeIntegration } from '@/lib/stripe-integration';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// GET - Get user subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    const subscriptionInfo = await stripeIntegration.getUserSubscription(userId);

    return NextResponse.json({
      success: true,
      data: {
        hasSubscription: !!subscriptionInfo.subscription,
        isActive: subscriptionInfo.isActive,
        tier: subscriptionInfo.tier,
        daysUntilRenewal: subscriptionInfo.daysUntilRenewal,
        subscription: subscriptionInfo.subscription
          ? {
              id: subscriptionInfo.subscription.id,
              status: subscriptionInfo.subscription.status,
              tier: subscriptionInfo.subscription.tier,
              currentPeriodStart: subscriptionInfo.subscription.currentPeriodStart,
              currentPeriodEnd: subscriptionInfo.subscription.currentPeriodEnd,
              cancelAtPeriodEnd: subscriptionInfo.subscription.cancelAtPeriodEnd,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get subscription status' },
      { status: 500 },
    );
  }
}

// POST - Update subscription (upgrade/downgrade)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, newTier } = body;

    if (!userId || !newTier) {
      return NextResponse.json(
        { success: false, message: 'User ID and new tier are required' },
        { status: 400 },
      );
    }

    await stripeIntegration.updateSubscriptionTier(userId, newTier);

    return NextResponse.json({
      success: true,
      message: `Subscription updated to ${newTier} tier`,
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update subscription', error: error.message },
      { status: 500 },
    );
  }
}

// DELETE - Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const immediate = searchParams.get('immediate') === 'true';

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    await stripeIntegration.cancelSubscription(userId, immediate);

    return NextResponse.json({
      success: true,
      message: immediate
        ? 'Subscription canceled immediately'
        : 'Subscription will be canceled at the end of the current period',
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel subscription', error: error.message },
      { status: 500 },
    );
  }
}
