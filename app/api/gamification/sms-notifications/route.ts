import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/twilio-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      athletePhone,
      athleteName,
      notificationType, // 'achievement', 'daily_challenge', 'leaderboard', 'streak', 'level_up'
      achievementName,
      challengeName,
      rewardXP,
      position,
      category,
      streakDays,
      newLevel,
      additionalInfo 
    } = body;

    if (!athletePhone) {
      return NextResponse.json({
        success: false,
        error: 'Athlete phone number required'
      }, { status: 400 });
    }

    let messageTemplate = '';

    switch (notificationType) {
      case 'achievement':
        messageTemplate = `🏆 ACHIEVEMENT UNLOCKED: ${achievementName}! ${additionalInfo || 'Amazing work!'} View your progress: go4it.app/achievements`;
        break;

      case 'daily_challenge':
        messageTemplate = `⚡ Today's Challenge: ${challengeName}. Complete for ${rewardXP} XP! ${additionalInfo || 'You got this!'} Start now: go4it.app/challenges`;
        break;

      case 'leaderboard':
        messageTemplate = `🏅 You're now #${position} in ${category}! ${additionalInfo || 'Keep climbing!'} See rankings: go4it.app/leaderboard`;
        break;

      case 'streak':
        messageTemplate = `🔥 ${streakDays}-day streak! ${additionalInfo || 'Consistency is key to greatness!'} Keep it going: go4it.app/challenges`;
        break;

      case 'level_up':
        messageTemplate = `📈 LEVEL UP! Welcome to Level ${newLevel}! ${additionalInfo || 'New challenges await!'} Explore: go4it.app/starpath`;
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid notification type'
        }, { status: 400 });
    }

    const smsResult = await smsService.sendSMS({
      to: athletePhone,
      message: messageTemplate
    });

    return NextResponse.json({
      success: true,
      smsStatus: smsResult.success,
      messageId: smsResult.messageId,
      notificationType,
      athleteName,
      message: `Gamification ${notificationType} SMS sent successfully`
    });

  } catch (error: any) {
    console.error('Gamification SMS notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send gamification SMS notification'
    }, { status: 500 });
  }
}