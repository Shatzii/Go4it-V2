import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { challenges, userChallenges } from '@/shared/enhanced-schema';
import { eq, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all active challenges
    const allChallenges = await db
      .select()
      .from(challenges)
      .where(and(
        eq(challenges.isActive, true),
        gte(challenges.endDate, new Date())
      ));

    // Get user's challenge progress
    const userChallengeProgress = await db
      .select()
      .from(userChallenges)
      .where(eq(userChallenges.userId, user.id));

    // Combine challenges with user progress
    const challengesWithProgress = allChallenges.map(challenge => {
      const userProgress = userChallengeProgress.find(
        uc => uc.challengeId === challenge.id
      );

      return {
        ...challenge,
        status: userProgress?.status || 'available',
        progress: userProgress?.progress || 0,
        maxProgress: userProgress?.maxProgress || 100,
        xpEarned: userProgress?.xpEarned || 0,
        completedAt: userProgress?.completedAt,
        timeRemaining: getTimeRemaining(challenge.endDate)
      };
    });

    return NextResponse.json({
      success: true,
      challenges: challengesWithProgress,
      totalXpEarned: userChallengeProgress
        .filter(uc => uc.status === 'completed')
        .reduce((sum, uc) => sum + (uc.xpEarned || 0), 0)
    });

  } catch (error) {
    console.error('Challenges fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, type, sport, difficulty, xpReward, requirements, endDate } = await request.json();

    // Create new challenge (admin only in real implementation)
    const [newChallenge] = await db
      .insert(challenges)
      .values({
        title,
        description,
        type,
        sport: sport || 'all',
        difficulty: difficulty || 'medium',
        xpReward: xpReward || 100,
        requirements: requirements || {},
        isActive: true,
        startDate: new Date(),
        endDate: new Date(endDate),
      })
      .returning();

    return NextResponse.json({
      success: true,
      challenge: newChallenge,
      message: 'Challenge created successfully!'
    });

  } catch (error) {
    console.error('Challenge creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
}

function getTimeRemaining(endDate: Date): string {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return 'Less than 1 hour';
}