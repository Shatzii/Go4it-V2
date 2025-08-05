import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/twilio-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      paymentIntentId, 
      amount, 
      description, 
      customerPhone, 
      status,
      customerName 
    } = body;

    if (!customerPhone) {
      return NextResponse.json({
        success: false,
        error: 'Customer phone number required for SMS notification'
      }, { status: 400 });
    }

    let smsResult;

    switch (status) {
      case 'succeeded':
        smsResult = await smsService.sendPaymentConfirmation(
          customerPhone,
          amount / 100, // Convert from cents
          description
        );
        break;

      case 'failed':
        smsResult = await smsService.sendSMS({
          to: customerPhone,
          message: `❌ Payment failed: $${(amount / 100)} for ${description}. Please update your payment method at go4it.app/billing`
        });
        break;

      case 'requires_action':
        smsResult = await smsService.sendSMS({
          to: customerPhone,
          message: `⚠️ Payment requires verification: $${(amount / 100)} for ${description}. Complete at go4it.app/payments/${paymentIntentId}`
        });
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid payment status for SMS notification'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      smsStatus: smsResult.success,
      messageId: smsResult.messageId,
      message: 'Payment SMS notification processed'
    });

  } catch (error: any) {
    console.error('Payment SMS notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send payment SMS notification'
    }, { status: 500 });
  }
}