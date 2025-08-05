import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      classId, 
      className, 
      coach, 
      price, 
      userId,
      userEmail 
    } = data;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Convert to cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        classId,
        className,
        coach,
        userId: userId || 'anonymous',
        type: 'live_class_payment'
      },
      description: `Live class: ${className} with ${coach}`,
      ...(userEmail && { receipt_email: userEmail })
    });

    // In production, you would:
    // 1. Reserve the spot in the class
    // 2. Set up automatic refund if class is cancelled
    // 3. Send confirmation email with stream access details
    // 4. Calculate revenue sharing (85% to coach, 15% platform fee)

    const revenueSharing = {
      totalAmount: price,
      coachShare: price * 0.85,
      platformFee: price * 0.15
    };

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      revenueSharing,
      message: 'Payment intent created successfully'
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

// Handle successful payments and class enrollment
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    const { paymentIntentId, classId, userId } = data;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Add user to class attendee list
    // 2. Send class access details via email
    // 3. Update coach revenue tracking
    // 4. Create calendar event for user
    // 5. Set up stream access permissions

    const classAccess = {
      classId,
      userId,
      accessGranted: true,
      streamUrl: `${process.env.NEXT_PUBLIC_APP_URL}/stream/${classId}`,
      joinInstructions: 'You will receive an email with join instructions 15 minutes before class starts.',
      refundPolicy: 'Full refund available up to 2 hours before class start time.'
    };

    return NextResponse.json({
      success: true,
      enrollment: classAccess,
      message: 'Successfully enrolled in class'
    });

  } catch (error) {
    console.error('Error processing class enrollment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process enrollment' },
      { status: 500 }
    );
  }
}