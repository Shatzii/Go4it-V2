import { NextRequest, NextResponse } from 'next/server';
import { stripeIntegration } from '@/lib/stripe-integration';

// POST - Handle Stripe webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    await stripeIntegration.handleWebhook(body, signature);
    return NextResponse.json({ received: true });
  } catch (error: any) {
    if (error?.message === 'Invalid signature') {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
