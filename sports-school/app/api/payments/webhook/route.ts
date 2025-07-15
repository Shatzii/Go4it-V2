import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { storage } from '../../../../server/storage'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      
      // Update payment status in database
      await storage.updatePayment(paymentIntent.id, {
        status: 'completed',
        completedAt: new Date().toISOString()
      })

      // Send receipt email (implement email service)
      console.log('Payment succeeded:', paymentIntent.id)
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent
      
      await storage.updatePayment(failedPayment.id, {
        status: 'failed',
        failedAt: new Date().toISOString()
      })

      console.log('Payment failed:', failedPayment.id)
      break

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice
      
      // Handle subscription payment success
      console.log('Subscription payment succeeded:', invoice.id)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}