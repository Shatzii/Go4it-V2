import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/twilio-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      alertType, // 'weather', 'facility', 'safety', 'cancellation'
      message,
      affectedUsers, // Array of { phone, name, role }
      severity, // 'low', 'medium', 'high', 'critical'
      eventId,
      additionalInfo 
    } = body;

    if (!alertType || !message || !affectedUsers || !Array.isArray(affectedUsers)) {
      return NextResponse.json({
        success: false,
        error: 'Missing required alert information'
      }, { status: 400 });
    }

    const severityEmoji = {
      low: '🔔',
      medium: '⚠️',
      high: '🚨',
      critical: '🆘'
    };

    const emoji = severityEmoji[severity as keyof typeof severityEmoji] || '🔔';
    const formattedMessage = `${emoji} ALERT: ${alertType.toUpperCase()} - ${message}. ${additionalInfo || ''} Check go4it.app for updates.`;

    // Send emergency SMS to all affected users
    const recipients = affectedUsers.map(user => ({
      phone: user.phone,
      message: formattedMessage
    }));

    const bulkResult = await smsService.sendBulkSMS(recipients);

    // Log emergency alert for compliance and tracking
    console.log(`Emergency alert sent: ${alertType} - ${severity} severity to ${bulkResult.totalSent} recipients`);

    return NextResponse.json({
      success: true,
      alertType,
      severity,
      totalSent: bulkResult.totalSent,
      totalFailed: bulkResult.totalFailed,
      results: bulkResult.results,
      message: `Emergency alert sent to ${bulkResult.totalSent} users`
    });

  } catch (error: any) {
    console.error('Emergency SMS alert error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send emergency SMS alert'
    }, { status: 500 });
  }
}