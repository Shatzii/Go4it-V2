import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createAIModelManager } from '@/lib/ai-models';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { sport, level, focus_areas } = await request.json();

    if (!sport || !level) {
      return NextResponse.json(
        { error: 'Sport and level are required' },
        { status: 400 }
      );
    }

    const aiManager = createAIModelManager();
    
    const prompt = `Generate personalized training skills and drills for a ${level} level ${sport} athlete. Consider neurodivergent-friendly approaches and ADHD-optimized learning. Focus areas: ${focus_areas?.join(', ') || 'general improvement'}.

    Generate 5-8 specific skills with:
    1. Clear, step-by-step instructions
    2. Difficulty progression
    3. Success metrics
    4. Motivation techniques
    5. Adaptive modifications

    Format as JSON with skills array containing: name, description, difficulty, duration, xp_reward, instructions, success_criteria, modifications_for_adhd.`;

    const response = await aiManager.generateResponse(prompt);
    
    // Generate structured skills data
    const skills = generateSkillsForSport(sport, level, focus_areas);

    return NextResponse.json({
      success: true,
      sport,
      level,
      skills,
      ai_recommendations: response.substring(0, 500) + '...',
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating AI coach skills:', error);
    return NextResponse.json(
      { error: 'Failed to generate skills' },
      { status: 500 }
    );
  }
}

function generateSkillsForSport(sport: string, level: string, focus_areas: string[] = []) {
  const sportSkills = {
    basketball: [
      {
        name: 'Dribbling Fundamentals',
        description: 'Master basic ball control and coordination',
        difficulty: 'beginner',
        duration: '15-20 minutes',
        xp_reward: 50,
        instructions: [
          'Start with stationary dribbling using dominant hand',
          'Practice crossover dribbles at walking pace',
          'Add head up drills while dribbling',
          'Progress to cone weaving exercises'
        ],
        success_criteria: 'Complete 10 consecutive crossovers without losing control',
        modifications_for_adhd: 'Use bright colored cones, set 5-minute timers, celebrate small wins'
      },
      {
        name: 'Shooting Form',
        description: 'Develop consistent shooting technique',
        difficulty: level === 'beginner' ? 'beginner' : 'intermediate',
        duration: '20-25 minutes',
        xp_reward: 75,
        instructions: [
          'Practice BEEF technique (Balance, Eyes, Elbow, Follow-through)',
          'Start close to basket (3-5 feet)',
          'Focus on arc and rotation',
          'Gradually increase distance'
        ],
        success_criteria: 'Make 7/10 shots from free throw line',
        modifications_for_adhd: 'Use verbal cues, break into 5-shot segments, immediate feedback'
      },
      {
        name: 'Defensive Stance',
        description: 'Build strong defensive fundamentals',
        difficulty: 'beginner',
        duration: '10-15 minutes',
        xp_reward: 40,
        instructions: [
          'Practice low athletic stance',
          'Work on lateral movement drills',
          'Practice staying in front of cones',
          'Add reaction time exercises'
        ],
        success_criteria: 'Maintain proper stance for 30 seconds of movement',
        modifications_for_adhd: 'Use mirror for self-checking, add music for rhythm'
      }
    ],
    soccer: [
      {
        name: 'First Touch Control',
        description: 'Master ball reception and control',
        difficulty: 'beginner',
        duration: '15-20 minutes',
        xp_reward: 50,
        instructions: [
          'Practice receiving with inside of foot',
          'Work on cushioning the ball',
          'Practice with both feet',
          'Add pressure situations'
        ],
        success_criteria: 'Control 8/10 passes within 2 touches',
        modifications_for_adhd: 'Use different colored balls, count touches aloud'
      },
      {
        name: 'Passing Accuracy',
        description: 'Develop precise passing technique',
        difficulty: level === 'beginner' ? 'beginner' : 'intermediate',
        duration: '20-25 minutes',
        xp_reward: 60,
        instructions: [
          'Practice short passes to targets',
          'Focus on using inside of foot',
          'Work on follow-through',
          'Add movement after passing'
        ],
        success_criteria: 'Hit 8/10 targets from 15 yards',
        modifications_for_adhd: 'Use target goals, immediate feedback, partner counting'
      }
    ],
    tennis: [
      {
        name: 'Forehand Technique',
        description: 'Master consistent forehand strokes',
        difficulty: 'beginner',
        duration: '20-25 minutes',
        xp_reward: 60,
        instructions: [
          'Practice proper grip and stance',
          'Work on backswing and follow-through',
          'Focus on contact point',
          'Add topspin progression'
        ],
        success_criteria: 'Hit 8/10 forehands in target area',
        modifications_for_adhd: 'Use colored targets, verbal counting, shorter sets'
      }
    ]
  };

  const defaultSkills = [
    {
      name: 'Agility Training',
      description: 'Improve speed and coordination',
      difficulty: 'beginner',
      duration: '15-20 minutes',
      xp_reward: 45,
      instructions: [
        'Set up cone ladder drills',
        'Practice lateral movements',
        'Work on acceleration and deceleration',
        'Add sport-specific movements'
      ],
      success_criteria: 'Complete agility course in target time',
      modifications_for_adhd: 'Use timer apps, celebrate improvement, vary patterns'
    }
  ];

  return sportSkills[sport] || defaultSkills;
}