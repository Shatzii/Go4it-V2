import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const subscriptionPlans = {
  'player-basic': {
    name: 'Player Coach',
    price: 895, // $8.95 in cents
    description: 'AI Football Coaching for Players',
    features: [
      'Voice conversations with AI Football Coach',
      'Personalized training advice',
      'Technique analysis through chat',
      'Position-specific guidance',
      'Basic performance tracking',
      '50 AI conversations per month'
    ]
  },
  'coach-premium': {
    name: 'Coach & Parent Pro',
    price: 1295, // $12.95 in cents
    description: 'Advanced AI Coaching for Coaches and Parents',
    features: [
      'Everything in Player Coach',
      'Team management tools', 
      'Parent communication features',
      'Advanced analytics dashboard',
      'Video analysis integration',
      'Unlimited AI conversations',
      'Custom training plan generation',
      'Multi-player coaching sessions'
    ]
  },
  'elite-package': {
    name: 'Elite Integration',
    price: 2495, // $24.95 in cents
    description: 'Complete AI Football Coaching Ecosystem',
    features: [
      'Everything in Coach & Parent Pro',
      'Visual GAR analysis integration',
      'Real-time video coaching',
      'AI-powered recruiting reports',
      'Advanced biomechanical analysis',
      'Custom drill library creation',
      'Priority support',
      'Beta feature access'
    ]
  }
};

export async function POST(request: NextRequest) {
  try {
    const { tierId } = await request.json();

    if (!tierId || !subscriptionPlans[tierId]) {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }

    const plan = subscriptionPlans[tierId];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
              metadata: {
                plan_id: tierId,
                features: JSON.stringify(plan.features)
              }
            },
            unit_amount: plan.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/ai-football-coach/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/ai-football-coach?canceled=true`,
      metadata: {
        plan_id: tierId,
        plan_name: plan.name
      },
      subscription_data: {
        metadata: {
          plan_id: tierId,
          plan_name: plan.name
        }
      },
      // Add trial period
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          plan_id: tierId,
          plan_name: plan.name
        }
      }
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Stripe subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return available subscription plans
    return NextResponse.json({
      success: true,
      plans: subscriptionPlans
    });

  } catch (error) {
    console.error('Plans fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}