import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
import { aiCoachingProfiles } from '@/shared/enhanced-schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { videoAnalysis, performanceData, sessionNotes } = await request.json();

    // Analyze emotional state from video and performance data
    const emotionalAnalysis = await analyzeEmotionalState(videoAnalysis, performanceData, sessionNotes);

    // Update or create AI coaching profile
    const existingProfile = await db
      .select()
      .from(aiCoachingProfiles)
      .where(eq(aiCoachingProfiles.userId, user.id))
      .limit(1);

    if (existingProfile.length > 0) {
      const [updatedProfile] = await db
        .update(aiCoachingProfiles)
        .set({
          emotionalState: emotionalAnalysis.state,
          frustrationLevel: emotionalAnalysis.frustrationLevel,
          adaptations: emotionalAnalysis.adaptations,
          lastInteraction: new Date()
        })
        .where(eq(aiCoachingProfiles.userId, user.id))
        .returning();

      return NextResponse.json({
        profile: updatedProfile,
        recommendations: emotionalAnalysis.recommendations
      });
    } else {
      const [newProfile] = await db
        .insert(aiCoachingProfiles)
        .values({
          userId: user.id,
          emotionalState: emotionalAnalysis.state,
          frustrationLevel: emotionalAnalysis.frustrationLevel,
          preferredTone: 'encouraging',
          adhd: { needsBreaks: true, focusTime: 20 },
          adaptations: emotionalAnalysis.adaptations
        })
        .returning();

      return NextResponse.json({
        profile: newProfile,
        recommendations: emotionalAnalysis.recommendations
      });
    }

  } catch (error) {
    console.error('Emotional analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze emotional state' },
      { status: 500 }
    );
  }
}

async function analyzeEmotionalState(videoAnalysis: any, performanceData: any, sessionNotes: string) {
  // Advanced emotional intelligence analysis
  let frustrationLevel = 0;
  let state = 'neutral';
  const adaptations = [];
  const recommendations = [];

  // Analyze performance patterns for frustration indicators
  if (performanceData?.attempts > 5 && performanceData?.successRate < 0.3) {
    frustrationLevel += 30;
    state = 'frustrated';
    adaptations.push('Reduce complexity');
    recommendations.push('Take a 5-minute break and try a simpler variation');
  }

  // Analyze video for body language cues
  if (videoAnalysis?.bodyLanguage?.tension > 0.7) {
    frustrationLevel += 20;
    adaptations.push('Add relaxation techniques');
    recommendations.push('Practice deep breathing before next attempt');
  }

  // Analyze session notes for keywords
  if (sessionNotes?.toLowerCase().includes('frustrated') || 
      sessionNotes?.toLowerCase().includes('angry')) {
    frustrationLevel += 25;
    state = 'frustrated';
    adaptations.push('Switch to positive reinforcement');
    recommendations.push('Focus on what you did well today');
  }

  // ADHD-specific adaptations
  if (sessionNotes?.toLowerCase().includes('distracted') || 
      performanceData?.focusTime < 10) {
    adaptations.push('Shorten session length');
    adaptations.push('Add movement breaks');
    recommendations.push('Try 10-minute focused sessions with 2-minute breaks');
  }

  // Positive state detection
  if (performanceData?.improvement > 0.1) {
    state = 'motivated';
    frustrationLevel = Math.max(0, frustrationLevel - 15);
    recommendations.push('Great progress! You\'re ready for the next challenge');
  }

  return {
    state,
    frustrationLevel: Math.min(100, frustrationLevel),
    adaptations,
    recommendations
  };
}