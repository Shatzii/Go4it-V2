import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createAIModelManager } from '@/lib/ai-models';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { skill_name, sport, level, weaknesses = [] } = await request.json();

    if (!skill_name || !sport) {
      return NextResponse.json({ error: 'Skill name and sport are required' }, { status: 400 });
    }

    const aiManager = createAIModelManager();

    const prompt = `Create specific training drills for improving "${skill_name}" in ${sport} for a ${level || 'intermediate'} athlete. Address weaknesses: ${weaknesses.join(', ')}. 

    Generate ADHD-friendly drills with:
    1. Clear step-by-step instructions
    2. Short duration (5-15 minutes)
    3. Immediate feedback mechanisms
    4. Progress tracking
    5. Motivational elements

    Format as structured drill descriptions.`;

    const response = await aiManager.generateResponse(prompt);

    // Generate structured drills
    const drills = generateDrillsForSkill(skill_name, sport, level, weaknesses);

    return NextResponse.json({
      success: true,
      skill_name,
      sport,
      level,
      drills,
      ai_description: response.substring(0, 300) + '...',
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating drills:', error);
    return NextResponse.json({ error: 'Failed to generate drills' }, { status: 500 });
  }
}

function generateDrillsForSkill(
  skillName: string,
  sport: string,
  level: string,
  weaknesses: string[],
) {
  const drillTemplates = {
    basketball: {
      'Dribbling Fundamentals': [
        {
          name: 'Stationary Dribbling',
          duration: '5 minutes',
          instructions: [
            'Start with ball at waist height',
            'Dribble with fingertips, not palm',
            'Keep eyes up, not looking at ball',
            'Alternate between right and left hand',
          ],
          success_metric: 'Complete 50 dribbles without losing control',
          equipment: ['Basketball', 'Flat surface'],
          modifications: 'Use softer ball for beginners, add music for rhythm',
        },
        {
          name: 'Cone Weaving',
          duration: '10 minutes',
          instructions: [
            'Set up 5 cones in a straight line, 3 feet apart',
            'Dribble through cones using crossover moves',
            'Focus on keeping ball low and controlled',
            'Complete course, then return using opposite hand',
          ],
          success_metric: 'Complete course 3 times without hitting cones',
          equipment: ['Basketball', '5 cones'],
          modifications: 'Wider spacing for beginners, add time challenges for advanced',
        },
      ],
      'Shooting Form': [
        {
          name: 'Wall Shooting',
          duration: '8 minutes',
          instructions: [
            'Stand 5 feet from wall',
            'Practice shooting motion against wall',
            'Focus on proper follow-through',
            'Ball should come back to you with good arc',
          ],
          success_metric: 'Ball returns to chest level 8/10 times',
          equipment: ['Basketball', 'Wall'],
          modifications: 'Use chalk mark on wall as target',
        },
      ],
    },
    soccer: {
      'First Touch Control': [
        {
          name: 'Wall Pass Reception',
          duration: '10 minutes',
          instructions: [
            'Stand 8 feet from wall',
            'Pass ball to wall and receive with inside of foot',
            'Control ball within 2 touches',
            'Alternate between left and right foot',
          ],
          success_metric: 'Control 8/10 passes within 2 touches',
          equipment: ['Soccer ball', 'Wall'],
          modifications: 'Use softer ball, closer distance for beginners',
        },
      ],
    },
  };

  const defaultDrills = [
    {
      name: 'Skill Practice',
      duration: '10 minutes',
      instructions: [
        'Practice the fundamental movement',
        'Focus on proper form over speed',
        'Repeat movement 20-30 times',
        'Rest and repeat 2-3 sets',
      ],
      success_metric: 'Complete all repetitions with good form',
      equipment: ['Sport-specific equipment'],
      modifications: 'Adjust based on individual needs',
    },
  ];

  return drillTemplates[sport]?.[skillName] || defaultDrills;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport') || 'basketball';

    // Return available drill categories for the sport
    const drillCategories = getDrillCategories(sport);

    return NextResponse.json({
      success: true,
      sport,
      categories: drillCategories,
      total: drillCategories.reduce((sum, cat) => sum + cat.drills.length, 0),
    });
  } catch (error) {
    console.error('Error fetching drill categories:', error);
    return NextResponse.json({ error: 'Failed to fetch drill categories' }, { status: 500 });
  }
}

function getDrillCategories(sport: string) {
  const categories = {
    basketball: [
      {
        name: 'Ball Handling',
        drills: ['Stationary Dribbling', 'Cone Weaving', 'Two-Ball Dribbling', 'Speed Dribbling'],
      },
      {
        name: 'Shooting',
        drills: ['Form Shooting', 'Free Throws', 'Spot Shooting', 'Game Shots'],
      },
      {
        name: 'Defense',
        drills: ['Stance Work', 'Lateral Movement', 'Closeouts', 'Rebounding'],
      },
    ],
    soccer: [
      {
        name: 'Ball Control',
        drills: ['First Touch', 'Juggling', 'Receiving', 'Turning'],
      },
      {
        name: 'Passing',
        drills: ['Short Passes', 'Long Passes', 'Through Balls', 'Crossing'],
      },
      {
        name: 'Shooting',
        drills: ['Finishing', 'Volleys', 'Headers', 'Penalties'],
      },
    ],
    tennis: [
      {
        name: 'Groundstrokes',
        drills: ['Forehand', 'Backhand', 'Crosscourt', 'Down the Line'],
      },
      {
        name: 'Serving',
        drills: ['Serve Technique', 'Placement', 'Power', 'Spin'],
      },
    ],
  };

  return (
    categories[sport] || [
      {
        name: 'Fundamentals',
        drills: ['Basic Skills', 'Conditioning', 'Agility', 'Coordination'],
      },
    ]
  );
}
