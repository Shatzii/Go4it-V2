import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    // Return StarPath skill nodes data
    const starpathData = {
      success: true,
      skillNodes: [
        {
          id: 'ball_control',
          name: 'Ball Control Mastery',
          description: 'Master fundamental ball handling and control techniques',
          currentLevel: 3,
          maxLevel: 5,
          totalXp: 750,
          requiredXp: 1000,
          isUnlocked: true,
          category: 'technical',
          prerequisites: [],
          rewards: ['First Touch Badge', '+10 Technical Rating'],
        },
        {
          id: 'agility_training',
          name: 'Agility & Speed',
          description: 'Develop explosive movement and directional changes',
          currentLevel: 2,
          maxLevel: 5,
          totalXp: 450,
          requiredXp: 600,
          isUnlocked: true,
          category: 'physical',
          prerequisites: [],
          rewards: ['Speed Demon Badge', '+8 Athleticism Rating'],
        },
        {
          id: 'game_vision',
          name: 'Game Vision',
          description: 'Enhance field awareness and decision-making',
          currentLevel: 1,
          maxLevel: 5,
          totalXp: 200,
          requiredXp: 400,
          isUnlocked: true,
          category: 'tactical',
          prerequisites: [],
          rewards: ['Visionary Badge', '+12 Game Awareness'],
        },
        {
          id: 'mental_toughness',
          name: 'Mental Resilience',
          description: 'Build confidence and focus under pressure',
          currentLevel: 0,
          maxLevel: 5,
          totalXp: 0,
          requiredXp: 300,
          isUnlocked: false,
          category: 'mental',
          prerequisites: ['game_vision'],
          rewards: ['Unshakeable Badge', '+15 Consistency'],
        },
        {
          id: 'advanced_techniques',
          name: 'Advanced Techniques',
          description: 'Master elite-level skills and movements',
          currentLevel: 0,
          maxLevel: 5,
          totalXp: 0,
          requiredXp: 800,
          isUnlocked: false,
          category: 'technical',
          prerequisites: ['ball_control'],
          rewards: ['Elite Technician Badge', '+20 Technical Rating'],
        },
        {
          id: 'leadership',
          name: 'Team Leadership',
          description: 'Develop communication and leadership skills',
          currentLevel: 0,
          maxLevel: 5,
          totalXp: 0,
          requiredXp: 500,
          isUnlocked: false,
          category: 'mental',
          prerequisites: ['mental_toughness', 'game_vision'],
          rewards: ['Captain Badge', '+25 Leadership Rating'],
        },
      ],
    };

    return NextResponse.json(starpathData);
  } catch (error) {
    console.error('Error fetching StarPath data:', error);
    return NextResponse.json({ error: 'Failed to fetch StarPath data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { action, skillId, xpAmount } = body;

    switch (action) {
      case 'complete_skill':
        // Award XP for completing a skill
        return NextResponse.json({
          success: true,
          message: `Skill completed! +${xpAmount || 50} XP earned`,
          newXP: 800, // Example
          levelUp: false,
        });

      case 'unlock_achievement':
        return NextResponse.json({
          success: true,
          message: 'New achievement unlocked!',
          achievement: 'Consistent Performer',
          xpBonus: 100,
        });

      default:
        return NextResponse.json(
          {
            error: 'Invalid action',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Error updating StarPath progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
