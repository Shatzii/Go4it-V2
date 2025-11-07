import { NextRequest, NextResponse } from 'next/server';
import { phoneComClient } from '@/lib/phone-com';
import { auth } from '@clerk/nextjs/server';

/**
 * POST /api/voip/sms - Send an SMS
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, message } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Phone number and message required' },
        { status: 400 }
      );
    }

    const result = await phoneComClient.sendSMS(to, message);

    return NextResponse.json({
      success: true,
      sms: result,
    });
  } catch (error) {
    console.error('[VoIP] SMS send error:', error);
    return NextResponse.json(
      { error: 'Failed to send SMS', details: (error as Error).message },
      { status: 500 }
    );
  }
}
