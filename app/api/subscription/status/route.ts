import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Default free plan
    let subscriptionStatus = {
      plan: 'free',
      status: 'active',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      features: {
        profileCreation: true,
        videoUploads: 5, // limit for free
        coachContact: true,
        basicAnalytics: true,
        aiCoaching: false,
        garAnalysis: false,
        academyAccess: false,
        prioritySupport: false
      }
    }

    // Check if user has a Stripe subscription
    if (user.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
        limit: 1
      })

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0]
        const plan = subscription.metadata?.planType || 'starter'
        
        subscriptionStatus = {
          plan,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          features: getPlanFeatures(plan)
        }
      }
    }

    return NextResponse.json(subscriptionStatus)
  } catch (error: any) {
    console.error('Subscription status error:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    )
  }
}

function getPlanFeatures(plan: string) {
  const features = {
    profileCreation: true,
    videoUploads: 5, // Free plan limit
    coachContact: true,
    basicAnalytics: true,
    aiCoaching: false,
    starPath: false,
    garAnalysis: false,
    academyAccess: false,
    prioritySupport: false,
    recruitingTools: false,
    performancePredictions: false,
    personalCoaching: false,
    ncaaCompliance: false
  }

  switch (plan) {
    case 'starter':
      features.videoUploads = Infinity
      features.aiCoaching = true
      features.starPath = true
      features.prioritySupport = true
      features.recruitingTools = true
      break
    case 'pro':
      features.videoUploads = Infinity
      features.aiCoaching = true
      features.starPath = true
      features.prioritySupport = true
      features.recruitingTools = true
      features.garAnalysis = true
      features.performancePredictions = true
      break
    case 'elite':
      features.videoUploads = Infinity
      features.aiCoaching = true
      features.starPath = true
      features.prioritySupport = true
      features.recruitingTools = true
      features.garAnalysis = true
      features.performancePredictions = true
      features.academyAccess = true
      features.personalCoaching = true
      features.ncaaCompliance = true
      break
  }

  return features
}