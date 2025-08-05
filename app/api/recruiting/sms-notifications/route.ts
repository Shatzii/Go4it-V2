import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/twilio-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      athletePhone,
      parentPhone,
      notificationType, // 'scout_interest', 'scholarship_opportunity', 'ncaa_deadline', 'profile_view'
      schoolName,
      coachName,
      amount,
      deadline,
      requirement,
      athleteName,
      additionalInfo 
    } = body;

    if (!athletePhone && !parentPhone) {
      return NextResponse.json({
        success: false,
        error: 'At least one phone number required'
      }, { status: 400 });
    }

    let messageTemplate = '';
    const results = [];

    switch (notificationType) {
      case 'scout_interest':
        messageTemplate = `🎓 SCOUT ALERT: ${coachName} from ${schoolName} viewed your profile! Update your highlights: go4it.app/recruiting`;
        break;

      case 'scholarship_opportunity':
        messageTemplate = `💰 SCHOLARSHIP OPPORTUNITY: ${schoolName} - Up to ${amount}. Application deadline approaching: go4it.app/scholarships`;
        break;

      case 'ncaa_deadline':
        messageTemplate = `📅 NCAA REMINDER: ${requirement} due by ${deadline}. Complete now: go4it.app/ncaa-eligibility`;
        break;

      case 'profile_view':
        messageTemplate = `👀 Profile Update: ${schoolName} viewed your recruiting profile. Keep your content fresh: go4it.app/profile`;
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid notification type'
        }, { status: 400 });
    }

    // Send to athlete
    if (athletePhone) {
      const athleteResult = await smsService.sendSMS({
        to: athletePhone,
        message: messageTemplate
      });
      results.push({ recipient: 'athlete', phone: athletePhone, ...athleteResult });
    }

    // Send to parent (if different and provided)
    if (parentPhone && parentPhone !== athletePhone) {
      const parentMessage = `🏆 ${athleteName} Update: ${messageTemplate.replace('your', `${athleteName}'s`)}`;
      
      const parentResult = await smsService.sendSMS({
        to: parentPhone,
        message: parentMessage
      });
      results.push({ recipient: 'parent', phone: parentPhone, ...parentResult });
    }

    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      notificationsSent: successCount,
      notificationType,
      results,
      message: `Recruiting notification sent to ${successCount} recipients`
    });

  } catch (error: any) {
    console.error('Recruiting SMS notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send recruiting SMS notification'
    }, { status: 500 });
  }
}