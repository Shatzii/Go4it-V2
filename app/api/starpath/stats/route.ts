import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { starPathProgress } from '@/lib/schema';
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

    const totalXp = userProgress.reduce((sum, node) => sum + node.totalXp, 0);
    const completedNodes = userProgress.filter((node) => node.currentLevel >= 5).length;
    const activeNodes = userProgress.filter(
      (node) => node.isUnlocked && node.currentLevel < 5,
    ).length;
    const overallProgress =
      totalXp > 0 ? Math.round((totalXp / (userProgress.length * 1000)) * 100) : 0;

    return NextResponse.json({
      progress: Math.min(overallProgress, 100),
      totalXp,
      completedNodes,
      activeNodes,
      skillBreakdown: userProgress.map((node) => ({
        skillName: node.skillName,
        currentLevel: node.currentLevel,
        totalXp: node.totalXp,
        isUnlocked: node.isUnlocked,
      })),
    });
  } catch (error) {
    console.error('StarPath stats error:', error);
    return NextResponse.json({ error: 'Failed to load StarPath statistics' }, { status: 500 });
  }
}
