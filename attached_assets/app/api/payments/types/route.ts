import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Default payment types for Universal One School
const DEFAULT_PAYMENT_TYPES = [
  {
    id: 'tuition',
    name: 'Monthly Tuition',
    description: 'Monthly tuition payment for enrolled students',
    defaultAmount: 450,
    category: 'tuition',
    recurring: true,
    required: true
  },
  {
    id: 'enrollment',
    name: 'Enrollment Fee',
    description: 'One-time enrollment fee for new students',
    defaultAmount: 125,
    category: 'enrollment',
    recurring: false,
    required: true
  },
  {
    id: 'activity',
    name: 'Activity Fee',
    description: 'Sports and extracurricular activity fees',
    defaultAmount: 75,
    category: 'activity',
    recurring: false,
    required: false
  },
  {
    id: 'materials',
    name: 'Materials Fee',
    description: 'Educational supplies and materials',
    defaultAmount: 35,
    category: 'materials',
    recurring: false,
    required: false
  },
  {
    id: 'field_trip',
    name: 'Field Trip Fee',
    description: 'Educational field trip and excursion fees',
    defaultAmount: 25,
    category: 'activity',
    recurring: false,
    required: false
  },
  {
    id: 'graduation',
    name: 'Graduation Fee',
    description: 'Graduation ceremony and diploma fees',
    defaultAmount: 50,
    category: 'ceremony',
    recurring: false,
    required: false
  },
  {
    id: 'technology',
    name: 'Technology Fee',
    description: 'Technology support and device usage fees',
    defaultAmount: 40,
    category: 'technology',
    recurring: true,
    required: false
  },
  {
    id: 'library',
    name: 'Library Fee',
    description: 'Library services and book rental fees',
    defaultAmount: 15,
    category: 'materials',
    recurring: true,
    required: false
  }
]

export async function GET() {
  try {
    // In a real application, you might fetch custom payment types from the database
    // For now, we'll return the default types
    return NextResponse.json({
      success: true,
      paymentTypes: DEFAULT_PAYMENT_TYPES,
      message: 'Payment types retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching payment types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, defaultAmount, category, recurring, required } = await request.json()

    if (!name || !description || !defaultAmount || !category) {
      return NextResponse.json(
        { error: 'Name, description, default amount, and category are required' },
        { status: 400 }
      )
    }

    // Create new payment type
    const newPaymentType = {
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name,
      description,
      defaultAmount: Number(defaultAmount),
      category,
      recurring: Boolean(recurring),
      required: Boolean(required),
      custom: true,
      createdAt: new Date().toISOString()
    }

    // In a real application, you would save this to the database
    // For now, we'll just return the new payment type
    return NextResponse.json({
      success: true,
      paymentType: newPaymentType,
      message: 'Payment type created successfully'
    })

  } catch (error) {
    console.error('Error creating payment type:', error)
    return NextResponse.json(
      { error: 'Failed to create payment type' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, defaultAmount, category, recurring, required } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Payment type ID is required' }, { status: 400 })
    }

    // Update existing payment type
    const updatedPaymentType = {
      id,
      name,
      description,
      defaultAmount: Number(defaultAmount),
      category,
      recurring: Boolean(recurring),
      required: Boolean(required),
      updatedAt: new Date().toISOString()
    }

    // In a real application, you would update this in the database
    return NextResponse.json({
      success: true,
      paymentType: updatedPaymentType,
      message: 'Payment type updated successfully'
    })

  } catch (error) {
    console.error('Error updating payment type:', error)
    return NextResponse.json(
      { error: 'Failed to update payment type' },
      { status: 500 }
    )
  }
}