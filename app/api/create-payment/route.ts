import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serviceId, amount } = await request.json()

    if (!serviceId || !amount) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Create Stripe checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: getServiceName(serviceId),
              description: getServiceDescription(serviceId),
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/dashboard?payment=success&service=${serviceId}`,
      cancel_url: `${request.nextUrl.origin}/pricing?payment=cancelled`,
      metadata: {
        userId: user.id.toString(),
        serviceId,
        serviceType: 'one-time'
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

function getServiceName(serviceId: string): string {
  switch (serviceId) {
    case 'gar-analysis':
      return 'GAR Analysis Report'
    default:
      return 'Go4It Service'
  }
}

function getServiceDescription(serviceId: string): string {
  switch (serviceId) {
    case 'gar-analysis':
      return 'Comprehensive Growth and Ability Rating analysis with detailed performance report'
    default:
      return 'Professional athletic development service'
  }
}