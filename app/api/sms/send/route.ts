import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/twilio-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, type, templateData, mediaUrl, scheduleTime } = body;

    if (!to || !message) {
      return NextResponse.json({
        success: false,
        error: 'Phone number and message are required'
      }, { status: 400 });
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to.replace(/\s/g, ''))) {
      return NextResponse.json({
        success: false,
        error: 'Invalid phone number format'
      }, { status: 400 });
    }

    const result = await smsService.sendSMS({
      to,
      message,
      mediaUrl,
      scheduleTime: scheduleTime ? new Date(scheduleTime) : undefined
    });

    if (result.success) {
      // Log SMS activity for analytics
      console.log(`SMS sent successfully: ${type || 'manual'} message to ${to}`);
      
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        status: result.status,
        message: 'SMS sent successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

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
      scheduledSMS: true,
      mediaSMS: true,
      templates: true
    },
    templates: [
      'payment_confirmation',
      'gar_score_update',
      'coach_reminder',
      'emergency_alert',
      'parent_update',
      'scout_interest',
      'live_class_alert',
      'achievement_unlock'
    ]
  });
}