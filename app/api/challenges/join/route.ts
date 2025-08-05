import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { userChallenges, challenges } from '@/shared/enhanced-schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { challengeId } = await request.json();

    if (!challengeId) {
      return NextResponse.json({ error: 'Challenge ID required' }, { status: 400 });
    }

    // Check if challenge exists and is active
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(and(
        eq(challenges.id, parseInt(challengeId)),
        eq(challenges.isActive, true)
      ));

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found or inactive' }, { status: 404 });
    }

    // Check if user already joined this challenge
    const [existingUserChallenge] = await db
      .select()
      .from(userChallenges)
      .where(and(
        eq(userChallenges.userId, user.id),
        eq(userChallenges.challengeId, parseInt(challengeId))
      ));

    if (existingUserChallenge) {
      return NextResponse.json({ error: 'Already joined this challenge' }, { status: 400 });
    }

    // Join the challenge
    const [newUserChallenge] = await db
      .insert(userChallenges)
      .values({
        userId: user.id,
        challengeId: parseInt(challengeId),
        status: 'active',
        progress: 0,
        maxProgress: 100, // Will be updated based on challenge requirements
      })
      .returning();

    return NextResponse.json({
      success: true,
      userChallenge: newUserChallenge,
      message: 'Successfully joined challenge!'
    });

  } catch (error) {
    console.error('Challenge join error:', error);
    return NextResponse.json(
      { error: 'Failed to join challenge' },
      { status: 500 }
    );
  }
}