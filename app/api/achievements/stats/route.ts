import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { achievements } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's achievements
    const userAchievements = await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, user.id));

    const totalAchievements = userAchievements.length;
    const recentAchievements = userAchievements
      .sort((a, b) => new Date(b.earned_date || new Date()).getTime() - new Date(a.earned_date || new Date()).getTime())
      .slice(0, 3);

    return NextResponse.json({
      count: totalAchievements,
      recent: recentAchievements.map(achievement => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        iconType: achievement.icon_type,
        earnedAt: achievement.earned_date
      }))
    });

  } catch (error) {
    console.error('Achievements stats error:', error);
    return NextResponse.json(
      { error: 'Failed to load achievements' },
      { status: 500 }
    );
  }
}