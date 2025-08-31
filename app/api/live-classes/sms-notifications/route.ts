import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/twilio-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      classId,
      className,
      coachName,
      startTime,
      enrolledStudents, // Array of { phone, name }
      notificationType, // 'enrollment', 'reminder', 'starting', 'cancelled'
      additionalInfo,
    } = body;

    if (!className || !enrolledStudents || !Array.isArray(enrolledStudents)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required class information for SMS notifications',
        },
        { status: 400 },
      );
    }

    let messageTemplate = '';
    const formattedTime = new Date(startTime).toLocaleString();

    switch (notificationType) {
      case 'enrollment':
        messageTemplate = `✅ Enrolled in "${className}" with ${coachName} on ${formattedTime}. Get ready to dominate! Access: go4it.app/live-classes/${classId}`;
        break;

      case 'reminder':
        messageTemplate = `⏰ Reminder: "${className}" with ${coachName} starts in 30 minutes (${formattedTime}). Join at: go4it.app/live-classes/${classId}`;
        break;

      case 'starting':
        messageTemplate = `🔴 LIVE NOW: "${className}" with ${coachName} is starting! Join immediately: go4it.app/live-classes/${classId}`;
        break;

      case 'cancelled':
        messageTemplate = `❌ Class Update: "${className}" scheduled for ${formattedTime} has been cancelled. ${additionalInfo || 'We apologize for any inconvenience.'} Reschedule: go4it.app/live-classes`;
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

    // Send bulk SMS to all enrolled students
    const recipients = enrolledStudents.map((student) => ({
      phone: student.phone,
      message: messageTemplate,
    }));

    const bulkResult = await smsService.sendBulkSMS(recipients);

    return NextResponse.json({
      success: true,
      totalSent: bulkResult.totalSent,
      totalFailed: bulkResult.totalFailed,
      notificationType,
      className,
      results: bulkResult.results,
      message: `Live class ${notificationType} notifications sent to ${bulkResult.totalSent} students`,
    });
  } catch (error: any) {
    console.error('Live class SMS notification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send live class SMS notifications',
      },
      { status: 500 },
    );
  }
}
