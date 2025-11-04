import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, drillId, completed, performance, notes } = await request.json();

    // Mock progress tracking
    const progress = {
      sessionId,
      drillId,
      userId: user.id,
      completed,
      performance: performance || {},
      notes,
      timestamp: new Date().toISOString(),
      starPathXP: completed ? 25 : 0,
    };

    // Calculate StarPath advancement
    const starPathUpdate = {
      currentLevel: 'Intermediate',
      xpGained: progress.starPathXP,
      totalXP: 1250,
      nextLevelXP: 1500,
      skillsUnlocked: completed ? ['Advanced Ball Handling'] : [],
      achievementsEarned: completed ? ['Drill Master'] : [],
    };

    return NextResponse.json({
      success: true,
      progress,
      starPathUpdate,
    });
  } catch (error) {
    console.error('Progress tracking error:', error);
    return NextResponse.json(
      {
        error: 'Failed to track progress',
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    // Mock progress data
    const progressData = {
      sessionId,
      userId: user.id,
      overallProgress: {
        completedDrills: 12,
        totalDrills: 15,
        completionRate: 0.8,
        avgPerformance: 85,
        totalXP: 1250,
        currentLevel: 'Intermediate',
      },
      drillProgress: [
        {
          drillId: '1',
          name: 'Ball Handling Basics',
          completed: true,
          performance: { accuracy: 90, speed: 85, consistency: 88 },
          xpEarned: 25,
          completedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          drillId: '2',
          name: 'Shooting Form',
          completed: true,
          performance: { accuracy: 78, form: 85, consistency: 82 },
          xpEarned: 25,
          completedAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          drillId: '3',
          name: 'Defensive Stance',
          completed: false,
          performance: null,
          xpEarned: 0,
          completedAt: null,
        },
      ],
      starPathStatus: {
        currentLevel: 'Intermediate',
        totalXP: 1250,
        nextLevelXP: 1500,
        progress: 0.83,
        unlockedSkills: ['Basic Dribbling', 'Shooting Form', 'Defensive Basics'],
        nextSkill: 'Advanced Ball Handling',
        achievements: ['First Drill', 'Consistent Performer', 'Skill Builder'],
      },
    };

    return NextResponse.json(progressData);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch progress',
      },
      { status: 500 },
    );
  }
}
