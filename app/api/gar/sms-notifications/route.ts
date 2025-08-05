import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/twilio-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId,
      athletePhone, 
      parentPhone,
      garScore, 
      analysisType,
      improvements,
      athleteName,
      videoTitle 
    } = body;

    if (!athletePhone && !parentPhone) {
      return NextResponse.json({
        success: false,
        error: 'At least one phone number (athlete or parent) required'
      }, { status: 400 });
    }

    const improvementText = improvements?.length > 0 
      ? improvements.join(', ') 
      : 'Keep up the great work!';

    const results = [];

    // Send to athlete
    if (athletePhone) {
      const athleteResult = await smsService.sendGARScoreUpdate(
        athletePhone,
        garScore,
        improvementText
      );
      results.push({ recipient: 'athlete', phone: athletePhone, ...athleteResult });
    }

    // Send to parent (if different and provided)
    if (parentPhone && parentPhone !== athletePhone) {
      const parentMessage = `🏆 ${athleteName}'s GAR Analysis Complete! Score: ${garScore}/100 for "${videoTitle}". ${improvementText} View full report: go4it.app/parent-dashboard`;
      
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
      results,
      message: `GAR score notifications sent to ${successCount} recipients`
    });

  } catch (error: any) {
    console.error('GAR SMS notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send GAR SMS notifications'
    }, { status: 500 });
  }
}