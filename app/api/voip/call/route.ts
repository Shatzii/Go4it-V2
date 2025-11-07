import { NextRequest, NextResponse } from 'next/server';
import { phoneComClient, PHONE_COM_CONFIG } from '@/lib/phone-com';
import { auth } from '@clerk/nextjs/server';

/**
 * POST /api/voip/call - Make an outbound call
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, from } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    const call = await phoneComClient.makeCall(to, from);

    return NextResponse.json({
      success: true,
      call,
      from: from || PHONE_COM_CONFIG.displayNumber,
    });
  } catch (error) {
    console.error('[VoIP] Call error:', error);
    return NextResponse.json(
      { error: 'Failed to make call', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voip/call - Get call history
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');

    const calls = await phoneComClient.getCallHistory({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      limit: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({
      success: true,
      calls,
      phoneNumber: PHONE_COM_CONFIG.displayNumber,
    });
  } catch (error) {
    console.error('[VoIP] Get call history error:', error);
    return NextResponse.json(
      { error: 'Failed to get call history', details: (error as Error).message },
      { status: 500 }
    );
  }
}
