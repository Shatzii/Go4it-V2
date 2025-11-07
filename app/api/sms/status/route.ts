import { NextResponse } from 'next/server';
import { getSmsProviderStatus } from '@/lib/sms-router';
import { getPhoneComStatus } from '@/lib/phonecom-client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/sms/status - Get current SMS provider configuration
 */
export async function GET() {
  try {
    const routerStatus = getSmsProviderStatus();
    const phoneComStatus = getPhoneComStatus();

    return NextResponse.json({
      success: true,
      router: routerStatus,
      phoneCom: phoneComStatus,
      message: routerStatus.primary === 'phonecom' 
        ? 'Phone.com is active as primary provider'
        : routerStatus.primary === 'email-to-sms'
        ? 'Using free email-to-SMS (Phone.com not configured)'
        : 'No SMS provider configured',
    });
  } catch (error) {
    console.error('[SMS Status] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get SMS status' },
      { status: 500 }
    );
  }
}
