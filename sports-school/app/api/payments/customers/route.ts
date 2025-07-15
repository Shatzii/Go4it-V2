import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { storage } from '../../../../server/storage'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export async function POST(request: NextRequest) {
  try {
    const { email, name, studentId, schoolId } = await request.json()

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        studentId,
        schoolId,
        platform: 'Universal One School'
      }
    })

    // Store customer record
    await storage.createCustomer({
      email,
      name,
      studentId,
      schoolId,
      stripeCustomerId: customer.id
    })

    return NextResponse.json({
      customerId: customer.id,
      email: customer.email
    })

  } catch (error) {
    console.error('Customer creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
    }

    // Get customer by student ID
    const customer = await storage.getCustomerByStudent(studentId)

    return NextResponse.json({ customer })

  } catch (error) {
    console.error('Customer fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}