import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Gap Year Elite Program',
              description:
                plan === 'monthly'
                  ? 'Monthly subscription for athletic reclassification and elite training'
                  : 'Annual subscription with exclusive benefits and savings',
              images: ['https://go4itsports.com/gap-year-hero.jpg'],
            },
            unit_amount: plan === 'monthly' ? 99995 : 999900, // $999.95 or $9999.00 in cents
            recurring:
              plan === 'monthly'
                ? {
                    interval: 'month',
                  }
                : undefined,
          },
          quantity: 1,
        },
      ],
      mode: plan === 'monthly' ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/gap-year/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/gap-year`,
      metadata: {
        plan: plan,
        program: 'gap_year_elite',
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: `Failed to create checkout session: ${error.message}` },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Gap Year Checkout API' });
}
