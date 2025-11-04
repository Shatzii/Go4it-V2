import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    // Skip authentication for demo purposes
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Return comprehensive StarPath progress data
    const starPathProgress = {
      success: true,
      progress: {
        totalXp: 1400,
        completedNodes: 3,
        currentTier: 2,
        achievements: 8,
      },
      skillDetails: [
        {
          id: 'ball_control',
          skillName: 'Ball Control Mastery',
          currentLevel: 4,
          maxLevel: 5,
          totalXp: 850,
          requiredXp: 1000,
          isUnlocked: true,
          category: 'technical',
          progress: 85,
        },
        {
          id: 'agility_training',
          skillName: 'Agility & Speed',
          currentLevel: 3,
          maxLevel: 5,
          totalXp: 650,
          requiredXp: 800,
          isUnlocked: true,
          category: 'physical',
          progress: 81,
        },
        {
          id: 'game_vision',
          skillName: 'Game Vision',
          currentLevel: 2,
          maxLevel: 5,
          totalXp: 450,
          requiredXp: 600,
          isUnlocked: true,
          category: 'tactical',
          progress: 75,
        },
        {
          id: 'mental_toughness',
          skillName: 'Mental Resilience',
          currentLevel: 1,
          maxLevel: 5,
          totalXp: 250,
          requiredXp: 400,
          isUnlocked: true,
          category: 'mental',
          progress: 63,
        },
        {
          id: 'advanced_techniques',
          skillName: 'Advanced Techniques',
          currentLevel: 0,
          maxLevel: 5,
          totalXp: 0,
          requiredXp: 500,
          isUnlocked: false,
          category: 'technical',
          progress: 0,
        },
      ],
      achievements: [
        {
          id: 'first_goal',
          name: 'First Goal',
          description: 'Complete your first skill level',
          earned: true,
        },
        {
          id: 'technique_master',
          name: 'Technique Master',
          description: 'Reach level 3 in technical skills',
          earned: true,
        },
        {
          id: 'speed_demon',
          name: 'Speed Demon',
          description: 'Complete agility training level 2',
          earned: true,
        },
        { id: 'visionary', name: 'Visionary', description: 'Improve game awareness', earned: true },
        { id: 'resilient', name: 'Resilient', description: 'Build mental toughness', earned: true },
        {
          id: 'well_rounded',
          name: 'Well Rounded',
          description: 'Progress in all categories',
          earned: true,
        },
        {
          id: 'dedicated',
          name: 'Dedicated',
          description: 'Train for 7 consecutive days',
          earned: true,
        },
      ],
      nextSkill: {
        id: 'advanced_techniques',
        name: 'Advanced Techniques',
        description: 'Master complex sport-specific movements',
        requiredXp: 500,
        category: 'technical',
      },
    };

    return NextResponse.json(starPathProgress);
  } catch (error) {
    console.error('StarPath progress error:', error);
    return NextResponse.json({ error: 'Failed to fetch progress data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { skillId, xpGained, action } = body;

    // Process skill progression
    const updatedProgress = {
      success: true,
      xpGained: xpGained || 50,
      message: `Gained ${xpGained || 50} XP for ${action || 'completing training'}`,
      levelUp: Math.random() > 0.7, // 30% chance of level up
      newAchievements: Math.random() > 0.8 ? ['New Achievement Unlocked!'] : [],
    };

    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.error('StarPath update error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
