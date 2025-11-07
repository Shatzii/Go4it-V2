import { NextRequest, NextResponse } from 'next/server';
import { phoneComClient } from '@/lib/phone-com';
import { auth } from '@clerk/nextjs/server';

/**
 * GET /api/voip/voicemail - Get voicemail list
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const voicemails = await phoneComClient.getVoicemails();

    return NextResponse.json({
      success: true,
      voicemails,
    });
  } catch (error) {
    console.error('[VoIP] Get voicemails error:', error);
    return NextResponse.json(
      { error: 'Failed to get voicemails', details: (error as Error).message },
      { status: 500 }
    );
  }
}
