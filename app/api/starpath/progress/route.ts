import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
import { starPathProgress } from '../../../../lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's StarPath progress
    const userProgress = await db
      .select()
      .from(starPathProgress)
      .where(eq(starPathProgress.userId, user.id));

    // Calculate overall progress metrics
    const totalXp = userProgress.reduce((sum, node) => sum + node.totalXp, 0);
    const completedNodes = userProgress.filter(node => node.isUnlocked && node.totalXp >= 1000).length;
    const currentTier = Math.floor(totalXp / 500) + 1;

    return NextResponse.json({
      progress: userProgress,
      stats: {
        totalXp,
        completedNodes,
        currentTier,
        activeNodes: userProgress.filter(node => node.isUnlocked).length
      }
    });

  } catch (error) {
    console.error('StarPath progress error:', error);
    return NextResponse.json(
      { error: 'Failed to load progress' },
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

    const { skillId, xpGained, activityType } = await request.json();

    if (!skillId || !xpGained) {
      return NextResponse.json(
        { error: 'Skill ID and XP amount required' },
        { status: 400 }
      );
    }

    // Update or create progress entry
    const [existingProgress] = await db
      .select()
      .from(starPathProgress)
      .where(eq(starPathProgress.userId, user.id))
      .where(eq(starPathProgress.skillId, skillId));

    let updatedProgress;
    
    if (existingProgress) {
      const newTotalXp = existingProgress.totalXp + xpGained;
      const newLevel = Math.floor(newTotalXp / 200) + 1; // 200 XP per level
      
      [updatedProgress] = await db
        .update(starPathProgress)
        .set({
          totalXp: newTotalXp,
          currentLevel: Math.min(newLevel, 5), // Max level 5
          lastUpdated: new Date()
        })
        .where(eq(starPathProgress.id, existingProgress.id))
        .returning();
    } else {
      [updatedProgress] = await db
        .insert(starPathProgress)
        .values({
          userId: user.id,
          skillId,
          skillName: skillId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          currentLevel: 1,
          totalXp: xpGained,
          isUnlocked: true
        })
        .returning();
    }

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
      xpGained,
      message: `Gained ${xpGained} XP in ${skillId}`
    });

  } catch (error) {
    console.error('StarPath update error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}