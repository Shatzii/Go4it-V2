import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/twilio-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      parentPhone,
      childName,
      campName,
      campDate,
      notificationType, // 'registration', 'reminder', 'checkin', 'pickup', 'update'
      location,
      time,
      additionalInfo,
    } = body;

    if (!parentPhone || !childName || !campName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required camp information',
        },
        { status: 400 },
      );
    }

    let messageTemplate = '';

    switch (notificationType) {
      case 'registration':
        messageTemplate = `✅ ${childName} registered for ${campName} on ${campDate}. We can't wait to see them dominate! Details: go4it.app/camps`;
        break;

      case 'reminder':
        messageTemplate = `⏰ Reminder: ${childName}'s ${campName} is tomorrow at ${time}${location ? ` at ${location}` : ''}. Get ready to go4it! Info: go4it.app/camps`;
        break;

      case 'checkin':
        messageTemplate = `📍 Check-in reminder: ${childName}'s ${campName} check-in starts in 30 minutes${location ? ` at ${location}` : ''}. See you soon!`;
        break;

      case 'pickup':
        messageTemplate = `🏁 ${campName} is ending soon! ${childName} had an amazing day. Pickup starts in 15 minutes${location ? ` at ${location}` : ''}.`;
        break;

      case 'update':
        messageTemplate = `📢 ${campName} Update: ${additionalInfo || 'Please check the camp information.'} Contact us if you have questions.`;
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid notification type',
          },
          { status: 400 },
        );
    }

    const smsResult = await smsService.sendSMS({
      to: parentPhone,
      message: messageTemplate,
    });

    return NextResponse.json({
      success: true,
      smsStatus: smsResult.success,
      messageId: smsResult.messageId,
      notificationType,
      childName,
      campName,
      message: `Camp ${notificationType} SMS sent successfully`,
    });
  } catch (error: any) {
    console.error('Camp SMS notification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send camp SMS notification',
      },
      { status: 500 },
    );
  }
}
