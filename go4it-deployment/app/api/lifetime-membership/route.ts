import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { membershipType, amount, eventId } = await request.json();

    if (membershipType !== 'verified100' || amount !== 100) {
      return NextResponse.json({ error: 'Invalid membership parameters' }, { status: 400 });
    }

    // Create Stripe checkout session for lifetime membership
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'The Verified 100 - Lifetime Membership',
              description:
                'Lifetime access to GAR Score testing, AI coaching, and all future features. Limited to first 100 athletes.',
              images: ['https://go4itsports.org/verified-100-badge.png'],
            },
            unit_amount: 10000, // $100 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/verified-success?membership=lifetime&event=${eventId}`,
      cancel_url: `${request.nextUrl.origin}/lifetime?checkout=cancelled`,
      metadata: {
        userId: user.id.toString(),
        membershipType: 'verified100',
        eventId: eventId || 'vienna-july-2025',
        membershipTier: 'lifetime',
        grantedAt: new Date().toISOString(),
      },
      customer_email: user.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Lifetime membership creation error:', error);
    return NextResponse.json({ error: 'Failed to create lifetime membership' }, { status: 500 });
  }
}
