import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// Service pricing configuration
const SERVICE_PRICES = {
  'gar-analysis': { price: 49, name: 'GAR Analysis' },
  'college-recruitment-report': { price: 79, name: 'College Recruitment Report' },
  'highlight-reel-creation': { price: 99, name: 'Professional Highlight Reel' },
  'performance-benchmarking': { price: 69, name: 'Performance Benchmarking Report' },
  'mental-performance-profile': { price: 79, name: 'Mental Performance Profile' },
  'injury-risk-assessment': { price: 59, name: 'Injury Risk Assessment' },
  'personalized-training-program': { price: 99, name: 'Personalized Training Program' },
  'scholarship-application-package': { price: 89, name: 'Scholarship Application Package' },
  'ncaa-compliance-audit': { price: 39, name: 'NCAA Compliance Audit' }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serviceId, amount } = await request.json()

    // Validate service and amount
    const serviceConfig = SERVICE_PRICES[serviceId as keyof typeof SERVICE_PRICES]
    if (!serviceConfig || amount !== serviceConfig.price) {
      return NextResponse.json({ error: 'Invalid service or amount' }, { status: 400 })
    }

    // Get or create Stripe customer
    let customer
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId)
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        metadata: {
          userId: user.id.toString()
        }
      })
      
      // Save stripe customer ID to user (you'll need to implement this in your storage)
      // await storage.updateUserStripeCustomerId(user.id, customer.id)
    }

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceConfig.name,
              description: `One-time ${serviceConfig.name} service for athletic development`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/dashboard?payment=success&service=${serviceId}`,
      cancel_url: `${request.nextUrl.origin}/pricing?payment=cancelled`,
      metadata: {
        userId: user.id.toString(),
        serviceId: serviceId,
        serviceType: 'one_time'
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}