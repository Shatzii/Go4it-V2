import { NextRequest, NextResponse } from 'next/server';
import { sendSmsKannel } from '@/lib/sendSmsKannel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Bulk: accept array of { to, text } or single { to, text }
    const recipients = Array.isArray(body)
      ? body
      : (body.recipients || [{ to: body.to, text: body.text }]);

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No recipients provided'
      }, { status: 400 });
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const results = await Promise.all(
      recipients.map(async ({ to, text }) => {
        if (!to || !text) {
          return { to, success: false, error: 'Phone number and text are required' };
        }
        if (!phoneRegex.test(to.replace(/\s/g, ''))) {
          return { to, success: false, error: 'Invalid phone number format' };
        }
        try {
          await sendSmsKannel({
            to,
            text,
            kannelUrl: process.env.KANNEL_URL!,
            username: process.env.KANNEL_USER!,
            password: process.env.KANNEL_PASS!,
          });
          console.log(`SMS sent successfully to ${to}`);
          return { to, success: true };
        } catch (e: any) {
          return { to, success: false, error: e.message };
        }
      })
    );
    const totalSent = results.filter(r => r.success).length;
    const totalFailed = results.length - totalSent;
    return NextResponse.json({
      success: totalFailed === 0,
      totalSent,
      totalFailed,
      results
    });
  } catch (error: any) {
    console.error('SMS API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send SMS'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Go4It Sports SMS API',
    capabilities: {
      singleSMS: true,
      bulkSMS: true,
      scheduledSMS: false, // Add later if needed
      mediaSMS: false,
      templates: true
    },
    templates: [
      'payment_confirmation',
      'gar_score_update',
      'coach_reminder',
      'emergency_alert',
      'parent_update'
    ]
  });
}
