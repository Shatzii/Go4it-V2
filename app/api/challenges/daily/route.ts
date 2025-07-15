import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { challenges, userChallenges } from '@/shared/enhanced-schema';
import { eq, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get daily challenges
    const dailyChallenges = await db
      .select()
      .from(challenges)
      .where(and(
        eq(challenges.type, 'daily'),
        eq(challenges.isActive, true),
        gte(challenges.startDate, today)
      ));

    // Get user's progress on these challenges
    const userProgress = await db
      .select()
      .from(userChallenges)
      .where(eq(userChallenges.userId, user.id));

    const challengesWithProgress = dailyChallenges.map(challenge => {
      const progress = userProgress.find(p => p.challengeId === challenge.id);
      return {
        ...challenge,
        userProgress: progress?.progress || 0,
        completed: progress?.completed || false,
        reward: progress?.reward || null
      };
    });

    return NextResponse.json(challengesWithProgress);

  } catch (error) {
    console.error('Daily challenges error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily challenges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { challengeId, progressIncrement } = await request.json();

    // Update user challenge progress
    const existingProgress = await db
      .select()
      .from(userChallenges)
      .where(and(
        eq(userChallenges.userId, user.id),
        eq(userChallenges.challengeId, challengeId)
      ))
      .limit(1);

    if (existingProgress.length > 0) {
      const newProgress = existingProgress[0].progress + progressIncrement;
      const challenge = await db
        .select()
        .from(challenges)
        .where(eq(challenges.id, challengeId))
        .limit(1);

      const isCompleted = newProgress >= (challenge[0]?.requirements as any)?.target || 100;

      const [updated] = await db
        .update(userChallenges)
        .set({
          progress: newProgress,
          completed: isCompleted,
          completedAt: isCompleted ? new Date() : null,
          reward: isCompleted ? generateReward(challenge[0]) : null
        })
        .where(and(
          eq(userChallenges.userId, user.id),
          eq(userChallenges.challengeId, challengeId)
        ))
        .returning();

      return NextResponse.json(updated);
    } else {
      const [newProgress] = await db
        .insert(userChallenges)
        .values({
          userId: user.id,
          challengeId,
          progress: progressIncrement,
          completed: false
        })
        .returning();

      return NextResponse.json(newProgress);
    }

  } catch (error) {
    console.error('Challenge progress update error:', error);
    return NextResponse.json(
      { error: 'Failed to update challenge progress' },
      { status: 500 }
    );
  }
}

function generateReward(challenge: any): string {
  const rewards = [
    'XP Boost +50',
    'Skill Point +1',
    'Badge: Daily Achiever',
    'Training Unlock',
    'Performance Insight'
  ];
  return rewards[Math.floor(Math.random() * rewards.length)];
}