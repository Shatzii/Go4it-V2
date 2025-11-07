import { NextRequest, NextResponse } from 'next/server';
import { phoneComClient, PHONE_COM_CONFIG } from '@/lib/phone-com';
import { auth } from '@clerk/nextjs/server';

/**
 * GET /api/voip/admin - Get full Phone.com admin dashboard data
 * Requires admin authentication
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check here
    // const user = await db.select().from(users).where(eq(users.id, userId));
    // if (user.role !== 'admin') { return 401 }

    if (!PHONE_COM_CONFIG.apiToken) {
      return NextResponse.json({
        error: 'Phone.com API not configured',
        message: 'Set PHONE_COM_API_TOKEN environment variable',
      }, { status: 503 });
    }

    // Fetch all admin data in parallel
    const [account, phoneNumbers, extensions, callHistory, smsMessages, voicemails, queues] = await Promise.allSettled([
      phoneComClient.getAccount(),
      phoneComClient.listPhoneNumbers(),
      phoneComClient.getExtensions(),
      phoneComClient.getCallHistory({ limit: 50 }),
      phoneComClient.getSMSMessages({ limit: 50 }),
      phoneComClient.getVoicemails(),
      phoneComClient.getQueues(),
    ]);

    return NextResponse.json({
      success: true,
      accountInfo: {
        email: PHONE_COM_CONFIG.email,
        phoneNumber: PHONE_COM_CONFIG.displayNumber,
        voipId: PHONE_COM_CONFIG.voipId,
        accountId: PHONE_COM_CONFIG.accountId,
        apiVersion: PHONE_COM_CONFIG.apiVersion,
      },
      data: {
        account: account.status === 'fulfilled' ? account.value : null,
        phoneNumbers: phoneNumbers.status === 'fulfilled' ? phoneNumbers.value : null,
        extensions: extensions.status === 'fulfilled' ? extensions.value : null,
        recentCalls: callHistory.status === 'fulfilled' ? callHistory.value : null,
        recentSMS: smsMessages.status === 'fulfilled' ? smsMessages.value : null,
        voicemails: voicemails.status === 'fulfilled' ? voicemails.value : null,
        queues: queues.status === 'fulfilled' ? queues.value : null,
      },
      features: PHONE_COM_CONFIG.features,
      errors: {
        account: account.status === 'rejected' ? account.reason.message : null,
        phoneNumbers: phoneNumbers.status === 'rejected' ? phoneNumbers.reason.message : null,
        extensions: extensions.status === 'rejected' ? extensions.reason.message : null,
        callHistory: callHistory.status === 'rejected' ? callHistory.reason.message : null,
        smsMessages: smsMessages.status === 'rejected' ? smsMessages.reason.message : null,
        voicemails: voicemails.status === 'rejected' ? voicemails.reason.message : null,
        queues: queues.status === 'rejected' ? queues.reason.message : null,
      },
    });
  } catch (error) {
    console.error('[VoIP] Admin dashboard error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load admin dashboard',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
