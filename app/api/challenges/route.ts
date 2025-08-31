import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Return sample challenges for demo
    const challenges = [
      {
        id: 'speed_burst',
        title: '40-Yard Dash Challenge',
        description: 'Sprint 40 yards as fast as possible with perfect form',
        category: 'speed',
        difficulty: 'intermediate',
        duration: 10,
        xpReward: 150,
        requirements: ['Basic running form', 'Proper warm-up'],
        completed: true,
        locked: false,
        bestScore: 4.8,
        currentAttempt: 3,
        totalAttempts: 5,
      },
      {
        id: 'agility_cone',
        title: 'Cone Weave Mastery',
        description: 'Navigate through 10 cones with perfect technique and speed',
        category: 'agility',
        difficulty: 'beginner',
        duration: 8,
        xpReward: 100,
        requirements: ['Basic footwork'],
        completed: true,
        locked: false,
        bestScore: 12.3,
        currentAttempt: 1,
        totalAttempts: 3,
      },
      {
        id: 'accuracy_target',
        title: 'Precision Passing',
        description: 'Hit 8 out of 10 targets from various distances',
        category: 'accuracy',
        difficulty: 'intermediate',
        duration: 15,
        xpReward: 200,
        requirements: ['Basic throwing mechanics', 'Target practice level 1'],
        completed: false,
        locked: false,
        currentAttempt: 0,
        totalAttempts: 0,
      },
      {
        id: 'endurance_circuit',
        title: 'Stamina Circuit',
        description: 'Complete 5-station circuit maintaining intensity',
        category: 'endurance',
        difficulty: 'advanced',
        duration: 20,
        xpReward: 300,
        requirements: ['Intermediate fitness level', 'Circuit training basics'],
        completed: false,
        locked: false,
        currentAttempt: 0,
        totalAttempts: 0,
      },
      {
        id: 'technique_form',
        title: 'Form Perfect Challenge',
        description: 'Demonstrate perfect technique across 5 key movements',
        category: 'technique',
        difficulty: 'advanced',
        duration: 25,
        xpReward: 350,
        requirements: ['Advanced technical skills', 'Form analysis completion'],
        completed: false,
        locked: true,
        currentAttempt: 0,
        totalAttempts: 0,
      },
      {
        id: 'game_awareness',
        title: 'Field Vision Test',
        description: 'Make correct decisions in 10 game scenarios',
        category: 'game_awareness',
        difficulty: 'elite',
        duration: 30,
        xpReward: 500,
        requirements: ['Advanced game knowledge', 'Situational awareness training'],
        completed: false,
        locked: true,
        currentAttempt: 0,
        totalAttempts: 0,
      },
    ];

    return NextResponse.json({
      success: true,
      challenges,
      totalXpEarned: challenges.filter((c) => c.completed).reduce((sum, c) => sum + c.xpReward, 0),
    });
  } catch (error) {
    console.error('Challenges fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeId, userId } = body;

    return NextResponse.json({
      success: true,
      message: 'Challenge started successfully!',
      challengeId,
      userId,
    });
  } catch (error) {
    console.error('Challenge start error:', error);
    return NextResponse.json({ error: 'Failed to start challenge' }, { status: 500 });
  }
}
