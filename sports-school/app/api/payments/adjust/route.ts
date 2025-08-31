import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function PATCH(request: NextRequest) {
  try {
    const { paymentId, amount, description, dueDate, status } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    // Get existing payment
    const existingPayment = await storage.getPaymentById(paymentId);
    if (!existingPayment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // If amount is being changed and payment has a Stripe intent, update it
    if (amount && existingPayment.stripePaymentIntentId) {
      try {
        await stripe.paymentIntents.update(existingPayment.stripePaymentIntentId, {
          amount: Math.round(amount * 100), // Convert to cents
          description: description || existingPayment.description,
        });
      } catch (error) {
        console.error('Error updating Stripe payment intent:', error);
      }
    }

    // Update the payment in our database
    const updatedPayment = await storage.updatePayment(paymentId, {
      amount: amount ? Math.round(amount * 100) : existingPayment.amount,
      description: description || existingPayment.description,
      status: status || existingPayment.status,
      dueDate: dueDate || existingPayment.dueDate,
      metadata: {
        ...existingPayment.metadata,
        lastModified: new Date().toISOString(),
        adjustedBy: 'admin',
      },
    });

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: 'Payment updated successfully',
    });
  } catch (error) {
    console.error('Error adjusting payment:', error);
    return NextResponse.json({ error: 'Failed to adjust payment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    // Get existing payment
    const existingPayment = await storage.getPaymentById(paymentId);
    if (!existingPayment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Cancel Stripe payment intent if it exists and is still pending
    if (existingPayment.stripePaymentIntentId && existingPayment.status === 'pending') {
      try {
        await stripe.paymentIntents.cancel(existingPayment.stripePaymentIntentId);
      } catch (error) {
        console.error('Error canceling Stripe payment intent:', error);
      }
    }

    // Update payment status to cancelled instead of deleting
    const cancelledPayment = await storage.updatePayment(paymentId, {
      status: 'cancelled',
      metadata: {
        ...existingPayment.metadata,
        cancelledAt: new Date().toISOString(),
        cancelledBy: 'admin',
      },
    });

    return NextResponse.json({
      success: true,
      payment: cancelledPayment,
      message: 'Payment cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling payment:', error);
    return NextResponse.json({ error: 'Failed to cancel payment' }, { status: 500 });
  }
}
