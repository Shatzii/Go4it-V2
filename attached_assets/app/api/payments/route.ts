import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { storage } from '../../../server/storage'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

const mockStripe = {
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return {
      id: `pi_${Date.now()}`,
      amount: amount * 100, // Convert to cents
      currency,
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
    }
  },
  
  async confirmPayment(paymentIntentId: string) {
    return {
      id: paymentIntentId,
      status: 'succeeded',
      amount: 5000, // $50.00
      currency: 'usd'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      action, 
      amount, 
      currency = 'usd', 
      paymentIntentId, 
      userId, 
      studentId, 
      schoolId, 
      courseId, 
      description, 
      paymentType 
    } = body

    // Handle legacy payment creation format
    if (!action && amount && (studentId || userId)) {
      const finalStudentId = studentId || userId
      
      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        description,
        metadata: {
          studentId: finalStudentId,
          paymentType: paymentType || 'general',
          schoolId,
          platform: 'Universal One School'
        }
      })

      // Store payment record
      await storage.createPayment({
        studentId: finalStudentId,
        amount: Math.round(amount * 100),
        currency,
        status: 'pending',
        paymentType: paymentType || 'general',
        schoolId,
        description,
        stripePaymentIntentId: paymentIntent.id,
        metadata: {
          platform: 'Universal One School'
        }
      })

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })
    }

    // Handle action-based requests
    switch (action) {
      case 'create-payment-intent':
        if (!amount || !userId) {
          return NextResponse.json({ error: 'Amount and user ID required' }, { status: 400 })
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: currency || 'usd',
          description: description || 'Universal One School Payment',
          metadata: {
            userId,
            schoolId,
            courseId,
            platform: 'Universal One School'
          }
        })
        
        // Store payment intent in database
        await storage.createPayment({
          studentId: userId,
          amount: Math.round(amount * 100),
          currency: currency || 'usd',
          status: 'pending',
          paymentType: paymentType || 'enrollment',
          schoolId,
          description: description || 'Universal One School Payment',
          stripePaymentIntentId: paymentIntent.id,
          metadata: {
            courseId,
            platform: 'Universal One School'
          }
        })

        return NextResponse.json({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id
        })

      case 'confirm-payment':
        if (!paymentIntentId) {
          return NextResponse.json({ error: 'Payment intent ID required' }, { status: 400 })
        }

        // Retrieve payment intent from Stripe
        const retrievedPayment = await stripe.paymentIntents.retrieve(paymentIntentId)
        
        // Update payment status in database
        await storage.updatePaymentStatus(paymentIntentId, retrievedPayment.status)
        
        // If payment is for course enrollment, enroll the student
        if (retrievedPayment.status === 'succeeded' && courseId) {
          await storage.enrollStudent(userId, courseId)
        }

        return NextResponse.json({
          status: retrievedPayment.status,
          message: 'Payment confirmed successfully'
        })

      case 'get-payment-history':
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        const paymentHistory = await storage.getPaymentHistory(userId)
        return NextResponse.json(paymentHistory)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const schoolId = searchParams.get('schoolId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's payment history and enrollment status
    const paymentHistory = await storage.getPaymentHistory(userId)
    const enrollments = await storage.getUserEnrollments(userId, schoolId)
    
    return NextResponse.json({
      paymentHistory,
      enrollments,
      subscriptionStatus: 'active' // This would be dynamic based on actual payments
    })
  } catch (error) {
    console.error('Error fetching payment data:', error)
    return NextResponse.json({ error: 'Failed to fetch payment data' }, { status: 500 })
  }
}