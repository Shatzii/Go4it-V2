import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { storage } from '../../../../server/storage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { customerId, priceId, studentId, schoolId } = await request.json();

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata: {
        studentId,
        schoolId,
        platform: 'Universal One School',
      },
    });

    // Store subscription record
    await storage.createSubscription({
      studentId,
      schoolId,
      customerId,
      priceId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      metadata: {
        platform: 'Universal One School',
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    // Get student subscriptions
    const subscriptions = await storage.getSubscriptionsByStudent(studentId);

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}
