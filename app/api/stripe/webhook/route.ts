import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle payment events and send SMS notifications
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.requires_action':
        await handlePaymentRequiresAction(event.data.object as Stripe.PaymentIntent);
        break;

      case 'invoice.payment_succeeded':
        await handleSubscriptionPayment(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const customerPhone = paymentIntent.metadata?.customerPhone;
    const description = paymentIntent.description || 'Go4It Sports Service';

    if (customerPhone) {
      // Send SMS notification
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:5000'}/api/payments/sms-notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          description,
          customerPhone,
          status: 'succeeded'
        })
      });

      const result = await response.json();
      console.log('Payment success SMS sent:', result.success);
    }

    // Log payment success for analytics
    console.log(`Payment succeeded: ${paymentIntent.id} - $${paymentIntent.amount / 100}`);

  } catch (error) {
    console.error('Failed to handle payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const customerPhone = paymentIntent.metadata?.customerPhone;
    const description = paymentIntent.description || 'Go4It Sports Service';

    if (customerPhone) {
      // Send SMS notification
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:5000'}/api/payments/sms-notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          description,
          customerPhone,
          status: 'failed'
        })
      });

      const result = await response.json();
      console.log('Payment failed SMS sent:', result.success);
    }

    // Log payment failure for monitoring
    console.log(`Payment failed: ${paymentIntent.id} - $${paymentIntent.amount / 100}`);

  } catch (error) {
    console.error('Failed to handle payment failure:', error);
  }
}

async function handlePaymentRequiresAction(paymentIntent: Stripe.PaymentIntent) {
  try {
    const customerPhone = paymentIntent.metadata?.customerPhone;
    const description = paymentIntent.description || 'Go4It Sports Service';

    if (customerPhone) {
      // Send SMS notification
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:5000'}/api/payments/sms-notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          description,
          customerPhone,
          status: 'requires_action'
        })
      });

      const result = await response.json();
      console.log('Payment action required SMS sent:', result.success);
    }

  } catch (error) {
    console.error('Failed to handle payment action required:', error);
  }
}

async function handleSubscriptionPayment(invoice: Stripe.Invoice) {
  try {
    // Handle subscription renewal SMS notifications
    const customer = invoice.customer;
    const amount = invoice.amount_paid;
    // Get subscription ID from the lines array if available
    const subscriptionId = invoice.lines?.data?.[0]?.subscription || 'N/A';

    console.log(`Subscription payment succeeded: ${subscriptionId} - $${amount / 100}`);

    // TODO: Get customer phone number and send subscription renewal SMS
    // This would require looking up the customer in your database

  } catch (error) {
    console.error('Failed to handle subscription payment:', error);
  }
}