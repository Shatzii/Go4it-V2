import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiTutorProgress } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { logger } from '@/lib/logger';

// GET /api/ai-tutor/progress - Fetch learning progress
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const subject = searchParams.get('subject');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    let progress;

    if (subject) {
      // Get progress for specific subject
      progress = await db
        .select()
        .from(aiTutorProgress)
        .where(and(
          eq(aiTutorProgress.userId, userId),
          eq(aiTutorProgress.subject, subject)
        ))
        .orderBy(desc(aiTutorProgress.masteryLevel));
    } else {
      // Get all progress for user
      progress = await db
        .select()
        .from(aiTutorProgress)
        .where(eq(aiTutorProgress.userId, userId))
        .orderBy(desc(aiTutorProgress.lastPracticed));
    }

    // Calculate overall stats
    const stats = {
      totalTopics: progress.length,
      averageMastery: progress.length > 0
        ? progress.reduce((sum, p) => sum + Number(p.masteryLevel || 0), 0) / progress.length
        : 0,
      topicsInProgress: progress.filter(p => Number(p.masteryLevel) > 0 && Number(p.masteryLevel) < 80).length,
      topicsMastered: progress.filter(p => Number(p.masteryLevel) >= 80).length,
      totalPracticeTime: progress.reduce((sum, p) => 
        sum + (Number(p.attemptsCount) * Number(p.averageTimePerQuestion) / 60), 0
      ), // in minutes
    };

    return NextResponse.json({
      success: true,
      data: progress,
      stats,
    });
  } catch (error) {
    logger.error('Failed to fetch progress', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch progress',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/ai-tutor/progress - Update learning progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      subject,
      topic,
      correct,
      timeSpent, // in seconds
      difficulty,
      strengths,
      weaknesses,
    } = body;

    if (!userId || !subject || !topic) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if progress record exists
    const existing = await db
      .select()
      .from(aiTutorProgress)
      .where(and(
        eq(aiTutorProgress.userId, userId),
        eq(aiTutorProgress.subject, subject),
        eq(aiTutorProgress.topic, topic)
      ))
      .limit(1);

    let progressRecord;

    if (existing.length > 0) {
      // Update existing record
      const existingRecord = existing[0];
      const newAttemptsCount = Number(existingRecord.attemptsCount) + 1;
      const newCorrectCount = Number(existingRecord.correctCount) + (correct ? 1 : 0);
      const accuracyRate = (newCorrectCount / newAttemptsCount) * 100;
      
      // Calculate new mastery level (weighted average of accuracy and attempts)
      const attemptBonus = Math.min(newAttemptsCount * 2, 20); // Max 20 points from attempts
      const newMasteryLevel = Math.min(100, (accuracyRate * 0.8) + attemptBonus);

      // Update average time
      const totalTime = Number(existingRecord.averageTimePerQuestion) * Number(existingRecord.attemptsCount);
      const newAverageTime = (totalTime + timeSpent) / newAttemptsCount;

      progressRecord = await db
        .update(aiTutorProgress)
        .set({
          attemptsCount: newAttemptsCount.toString(),
          correctCount: newCorrectCount.toString(),
          masteryLevel: newMasteryLevel.toString(),
          averageTimePerQuestion: newAverageTime.toString(),
          lastPracticed: new Date(),
          strengths: strengths ? JSON.stringify(strengths) : existingRecord.strengths,
          weaknesses: weaknesses ? JSON.stringify(weaknesses) : existingRecord.weaknesses,
          updatedAt: new Date(),
        })
        .where(eq(aiTutorProgress.id, existingRecord.id))
        .returning();
    } else {
      // Create new record
      const initialMastery = correct ? 50 : 30; // Start at 50% if correct, 30% if not

      progressRecord = await db
        .insert(aiTutorProgress)
        .values({
          userId,
          subject,
          topic,
          masteryLevel: initialMastery.toString(),
          attemptsCount: '1',
          correctCount: correct ? '1' : '0',
          averageTimePerQuestion: timeSpent.toString(),
          lastPracticed: new Date(),
          strengths: strengths ? JSON.stringify(strengths) : null,
          weaknesses: weaknesses ? JSON.stringify(weaknesses) : null,
          recommendations: JSON.stringify([
            'Keep practicing regularly',
            'Try different problem types',
            'Review related concepts',
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }

    logger.info('Updated tutor progress', {
      userId,
      subject,
      topic,
      correct,
      masteryLevel: progressRecord[0].masteryLevel,
    });

    return NextResponse.json({
      success: true,
      data: progressRecord[0],
    });
  } catch (error) {
    logger.error('Failed to update progress', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update progress',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/ai-tutor/progress - Bulk update progress (for AI analysis)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, analysisResults } = body;

    if (!userId || !analysisResults || !Array.isArray(analysisResults)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updates = [];

    for (const result of analysisResults) {
      const { subject, topic, strengths, weaknesses, recommendations } = result;

      // Update existing records with AI analysis
      const updated = await db
        .update(aiTutorProgress)
        .set({
          strengths: strengths ? JSON.stringify(strengths) : undefined,
          weaknesses: weaknesses ? JSON.stringify(weaknesses) : undefined,
          recommendations: recommendations ? JSON.stringify(recommendations) : undefined,
          updatedAt: new Date(),
        })
        .where(and(
          eq(aiTutorProgress.userId, userId),
          eq(aiTutorProgress.subject, subject),
          eq(aiTutorProgress.topic, topic)
        ))
        .returning();

      if (updated.length > 0) {
        updates.push(updated[0]);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Progress updated with AI analysis',
      updatedCount: updates.length,
      data: updates,
    });
  } catch (error) {
    logger.error('Failed to bulk update progress', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to bulk update progress',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
