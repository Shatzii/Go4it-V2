import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/twilio-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      athletePhone,
      coachName,
      sessionDate,
      sessionTime,
      sessionType,
      notificationType, // 'confirmation', 'reminder', 'cancellation', 'rescheduled'
      additionalInfo,
    } = body;

    if (!athletePhone || !coachName || !sessionDate || !sessionTime) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required session information for SMS notification',
        },
        { status: 400 },
      );
    }

    let smsResult;
    const formattedDate = new Date(sessionDate).toLocaleDateString();

    switch (notificationType) {
      case 'confirmation':
        smsResult = await smsService.sendSMS({
          to: athletePhone,
          message: `✅ Session confirmed with ${coachName} on ${formattedDate} at ${sessionTime}. Prepare to dominate! Details: go4it.app/sessions/${sessionId}`,
        });
        break;

      case 'reminder':
        smsResult = await smsService.sendCoachReminder(
          athletePhone,
          coachName,
          sessionTime,
          sessionType,
        );
        break;

      case 'cancellation':
        smsResult = await smsService.sendSMS({
          to: athletePhone,
          message: `❌ Session with ${coachName} on ${formattedDate} at ${sessionTime} has been cancelled. ${additionalInfo || 'We apologize for any inconvenience.'} Reschedule: go4it.app/coaches-corner`,
        });
        break;

      case 'rescheduled':
        smsResult = await smsService.sendSMS({
          to: athletePhone,
          message: `📅 Session with ${coachName} rescheduled to ${formattedDate} at ${sessionTime}. ${additionalInfo || 'Looking forward to seeing you!'} Details: go4it.app/sessions/${sessionId}`,
        });
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

    return NextResponse.json({
      success: true,
      smsStatus: smsResult.success,
      messageId: smsResult.messageId,
      notificationType,
      message: `Coach session ${notificationType} SMS sent successfully`,
    });
  } catch (error: any) {
    console.error('Coach session SMS notification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send coach session SMS notification',
      },
      { status: 500 },
    );
  }
}
