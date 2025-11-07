import { NextRequest, NextResponse } from 'next/server';
import { phoneComClient, PHONE_COM_CONFIG } from '@/lib/phone-com';
import { auth } from '@clerk/nextjs/server';

/**
 * GET /api/voip/status - Get Phone.com account status
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if API token is configured
    if (!PHONE_COM_CONFIG.apiToken) {
      return NextResponse.json({
        configured: false,
        error: 'PHONE_COM_API_TOKEN not set in environment variables',
        accountInfo: {
          email: PHONE_COM_CONFIG.email,
          phoneNumber: PHONE_COM_CONFIG.displayNumber,
          voipId: PHONE_COM_CONFIG.voipId,
          accountId: PHONE_COM_CONFIG.accountId,
        },
      });
    }

    // Get account info from Phone.com
    const account = await phoneComClient.getAccount();
    const phoneNumbers = await phoneComClient.listPhoneNumbers();

    return NextResponse.json({
      configured: true,
      success: true,
      account,
      phoneNumbers,
      localConfig: {
        email: PHONE_COM_CONFIG.email,
        phoneNumber: PHONE_COM_CONFIG.displayNumber,
        features: PHONE_COM_CONFIG.features,
      },
    });
  } catch (error) {
    console.error('[VoIP] Status check error:', error);
    return NextResponse.json(
      {
        configured: true,
        error: 'Failed to get account status',
        details: (error as Error).message,
        localConfig: {
          email: PHONE_COM_CONFIG.email,
          phoneNumber: PHONE_COM_CONFIG.displayNumber,
        },
      },
      { status: 500 }
    );
  }
}
