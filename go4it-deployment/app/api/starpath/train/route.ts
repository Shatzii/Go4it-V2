import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { starPathProgress } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { nodeId, activity } = await request.json();

    if (!nodeId || !activity) {
      return NextResponse.json({ error: 'Node ID and activity type required' }, { status: 400 });
    }

    // Calculate XP based on activity type
    const activityXpMap = {
      practice_drill: 50,
      video_upload: 100,
      skill_assessment: 75,
      game_application: 125,
      coach_feedback: 80,
    };

    const xpGained = activityXpMap[activity] || 50;

    // Check if user has existing progress for this skill
    const [existingProgress] = await db
      .select()
      .from(starPathProgress)
      .where(and(eq(starPathProgress.userId, user.id), eq(starPathProgress.skillId, nodeId)));

    let updatedProgress;

    if (existingProgress) {
      const newTotalXp = existingProgress.totalXp + xpGained;
      const newLevel = Math.floor(newTotalXp / 200) + 1; // 200 XP per level

      [updatedProgress] = await db
        .update(starPathProgress)
        .set({
          totalXp: newTotalXp,
          currentLevel: Math.min(newLevel, 5), // Max level 5
          lastUpdated: new Date(),
        })
        .where(eq(starPathProgress.id, existingProgress.id))
        .returning();
    } else {
      // Create new progress entry
      const skillName = nodeId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

      [updatedProgress] = await db
        .insert(starPathProgress)
        .values({
          userId: user.id,
          skillId: nodeId,
          skillName: skillName,
          currentLevel: 1,
          totalXp: xpGained,
          isUnlocked: true,
        })
        .returning();
    }

    // Check for level up and achievements
    const leveledUp = updatedProgress.currentLevel > (existingProgress?.currentLevel || 0);
    const achievements = [];

    if (leveledUp) {
      achievements.push({
        type: 'level_up',
        skill: updatedProgress.skillName,
        level: updatedProgress.currentLevel,
      });
    }

    // Check for milestone achievements
    if (updatedProgress.totalXp >= 500 && (!existingProgress || existingProgress.totalXp < 500)) {
      achievements.push({
        type: 'milestone',
        description: 'Skill Dedication - 500 XP earned',
        skill: updatedProgress.skillName,
      });
    }

    if (updatedProgress.totalXp >= 1000 && (!existingProgress || existingProgress.totalXp < 1000)) {
      achievements.push({
        type: 'mastery',
        description: 'Skill Mastery - 1000 XP earned',
        skill: updatedProgress.skillName,
      });
    }

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
      xpGained,
      achievements,
      leveledUp,
      message: `Training complete! Gained ${xpGained} XP in ${updatedProgress.skillName}`,
    });
  } catch (error) {
    console.error('Training error:', error);
    return NextResponse.json({ error: 'Training failed. Please try again.' }, { status: 500 });
  }
}
