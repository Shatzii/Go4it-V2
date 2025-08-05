import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

// AI Playbook Creator - Phase 2 Feature
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sport, gameType, teamLevel, ageGroup, formation, playstyle } = await request.json();

    // Generate comprehensive playbook using AI
    const playbook = await generateAIPlaybook({
      sport,
      gameType, // 5v5, 7v7, 9v9, 11v11
      teamLevel, // youth, high_school, college, adult
      ageGroup,
      formation,
      playstyle, // balanced, run_heavy, pass_heavy, defensive
      coachExperience: user.coachingLevel || 'intermediate'
    });

    return NextResponse.json({
      success: true,
      playbook,
      total_plays: playbook.plays.length,
      formations: playbook.formations,
      practice_plans: playbook.practicePlans,
      voice_coaching_url: generateVoiceCoachingUrl(playbook.id, user.id)
    });

  } catch (error) {
    console.error('Playbook generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate playbook' },
      { status: 500 }
    );
  }
}

async function generateAIPlaybook(config: any) {
  const { sport, gameType, teamLevel, ageGroup, formation, playstyle } = config;
  
  // Use OpenAI to generate comprehensive playbook
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: 'system',
          content: `You are an expert football coach creating a comprehensive playbook. 
                   Generate detailed plays, formations, and strategies for ${sport} ${gameType}.
                   Include play diagrams, personnel requirements, and coaching points.
                   Adapt complexity for ${teamLevel} level and ${ageGroup} age group.
                   Focus on ${playstyle} approach. Provide JSON response with plays, formations, and practice plans.`
        },
        {
          role: 'user',
          content: `Create a complete playbook for: Sport: ${sport}, Game Type: ${gameType}, 
                   Team Level: ${teamLevel}, Age Group: ${ageGroup}, Formation: ${formation}, 
                   Play Style: ${playstyle}. Include 15-20 plays minimum with detailed descriptions.`
        }
      ],
      max_tokens: 3000,
      temperature: 0.7,
      response_format: { type: "json_object" }
    })
  });

  const aiResponse = await response.json();
  const generatedPlaybook = JSON.parse(aiResponse.choices[0]?.message?.content || '{}');
  
  // Enhance with additional structure
  const playbook = {
    id: `playbook_${Date.now()}`,
    title: `${sport} ${gameType} Playbook - ${teamLevel}`,
    sport,
    gameType,
    teamLevel,
    ageGroup,
    formation,
    playstyle,
    created: new Date().toISOString(),
    
    // Core plays from AI generation
    plays: generatedPlaybook.plays || generateDefaultPlays(sport, gameType),
    
    // Formations
    formations: generatedPlaybook.formations || generateDefaultFormations(gameType),
    
    // Practice plans
    practicePlans: generatedPlaybook.practicePlans || generatePracticePlans(teamLevel, ageGroup),
    
    // Coaching points
    coachingPoints: generatedPlaybook.coachingPoints || [],
    
    // Special situations
    specialSituations: generatedPlaybook.specialSituations || generateSpecialSituations(sport),
    
    // Defensive concepts
    defensiveConcepts: generatedPlaybook.defensiveConcepts || [],
    
    // Conditioning drills
    conditioningDrills: generatedPlaybook.conditioningDrills || []
  };
  
  return playbook;
}

function generateDefaultPlays(sport: string, gameType: string) {
  const plays = [];
  
  if (sport === 'flag_football') {
    plays.push(
      {
        id: 'ff_001',
        name: 'Quick Slant Right',
        type: 'passing',
        formation: 'Spread',
        personnel: `${gameType} offense`,
        description: 'Quick 3-step slant route to the right side receiver.',
        diagram: 'QB drops back 3 steps, RWR runs 5-yard slant, timing route',
        coachingPoints: [
          'QB: Quick 3-step drop, get ball out fast',
          'WR: Hard cut at 5 yards, secure catch',
          'Line: Quick protection, no long sets'
        ],
        successRate: '85%',
        bestSituations: ['3rd and short', '2-minute drill', 'Quick score']
      },
      {
        id: 'ff_002', 
        name: 'Fade Route Left',
        type: 'passing',
        formation: 'Trips Right',
        personnel: `${gameType} offense`,
        description: 'Back shoulder fade to left side receiver in single coverage.',
        diagram: 'LWR runs fade route, QB leads receiver to back shoulder',
        coachingPoints: [
          'QB: High arc throw, back shoulder placement',
          'WR: Fight for position, hands ready',
          'Read coverage pre-snap'
        ],
        successRate: '65%',
        bestSituations: ['Red zone', 'Single coverage', 'End of half']
      },
      {
        id: 'ff_003',
        name: 'Screen Pass Right',
        type: 'passing',
        formation: 'I-Formation',
        personnel: `${gameType} offense`,
        description: 'Running back screen to the right side with blockers.',
        diagram: 'RB delays, QB throws behind line, blockers set up screen',
        coachingPoints: [
          'QB: Sell play-action, soft touch on throw',
          'RB: Patience, let blocks develop',
          'Blockers: Release and find defenders'
        ],
        successRate: '70%',
        bestSituations: ['Long yardage', 'Blitz situations', 'Change of pace']
      }
    );
  }
  
  // Add more default plays for different sports/game types
  
  return plays;
}

function generateDefaultFormations(gameType: string) {
  const formations = [];
  
  if (gameType === '7v7' || gameType === '5v5') {
    formations.push(
      {
        name: 'Spread',
        description: 'Wide receiver spread across the field',
        personnel: 'QB, RB, 3 WR',
        diagram: 'WR - WR - QB - RB - WR',
        strengths: ['Pass coverage', 'Speed in space', 'Multiple options'],
        weaknesses: ['Run blocking', 'Short yardage'],
        bestSituations: ['Passing downs', 'Open field', '2-minute drill']
      },
      {
        name: 'Trips Right',
        description: 'Three receivers bunched to the right side',
        personnel: 'QB, RB, 3 WR (3 right)',
        diagram: 'QB - RB - [WR WR WR]',
        strengths: ['Overload coverage', 'Pick plays', 'Rubs'],
        weaknesses: ['Left side vulnerable', 'Predictable'],
        bestSituations: ['Red zone', 'Short yardage', 'Bunch concepts']
      }
    );
  }
  
  return formations;
}

function generatePracticePlans(teamLevel: string, ageGroup: string) {
  const baseDuration = ageGroup === 'youth' ? 60 : ageGroup === 'high_school' ? 90 : 120;
  
  return [
    {
      week: 1,
      focus: 'Fundamentals',
      duration: baseDuration,
      segments: [
        { activity: 'Warm-up', duration: 10, description: 'Dynamic stretching and light jogging' },
        { activity: 'Position drills', duration: 20, description: 'Individual skill development' },
        { activity: 'Route running', duration: 15, description: 'Timing and precision' },
        { activity: 'Team plays', duration: 20, description: 'Install base plays' },
        { activity: 'Scrimmage', duration: 10, description: 'Live action practice' },
        { activity: 'Cool down', duration: 5, description: 'Stretching and review' }
      ]
    },
    {
      week: 2,
      focus: 'Team Concepts',
      duration: baseDuration,
      segments: [
        { activity: 'Warm-up', duration: 10, description: 'Movement prep' },
        { activity: 'Formation work', duration: 25, description: 'Alignment and spacing' },
        { activity: 'Passing concepts', duration: 20, description: 'Timing routes' },
        { activity: 'Red zone', duration: 15, description: 'Goal line situations' },
        { activity: 'Team scrimmage', duration: 15, description: 'Game simulation' },
        { activity: 'Cool down', duration: 5, description: 'Recovery and notes' }
      ]
    }
  ];
}

function generateSpecialSituations(sport: string) {
  return [
    {
      situation: 'Red Zone Offense',
      description: 'Scoring plays inside the 20-yard line',
      keyPlays: ['Fade routes', 'Quick slants', 'Pick plays'],
      tips: ['Use height advantage', 'Quick timing', 'Multiple options']
    },
    {
      situation: '2-Minute Drill',
      description: 'End of half/game scoring drive',
      keyPlays: ['Quick passes', 'Sideline routes', 'Screen passes'],
      tips: ['Clock management', 'Get out of bounds', 'Have timeouts ready']
    },
    {
      situation: '3rd and Long',
      description: 'Conversion plays on long yardage',
      keyPlays: ['Deep routes', 'Crossing patterns', 'Delayed screens'],
      tips: ['Attack coverage weakness', 'Multiple receiver levels', 'Protection schemes']
    }
  ];
}

function generateVoiceCoachingUrl(playbookId: string, userId: string) {
  const context = `Playbook coaching session for playbook ${playbookId}. Provide detailed explanations of plays, formations, and coaching points.`;
  return `https://elevenlabs.io/app/talk-to?agent_id=tb80F0KNyKEjO8IymYOU&context=${encodeURIComponent(context)}`;
}

// GET endpoint for retrieving existing playbooks
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const playbookId = searchParams.get('id');
    const sport = searchParams.get('sport');
    const gameType = searchParams.get('gameType');

    if (playbookId) {
      // Return specific playbook (would be stored in database in real implementation)
      const playbook = await getPlaybookById(playbookId, user.id);
      return NextResponse.json({
        success: true,
        playbook
      });
    }

    // Return available playbooks for user
    const playbooks = await getUserPlaybooks(user.id, sport, gameType);
    return NextResponse.json({
      success: true,
      playbooks,
      total: playbooks.length
    });

  } catch (error) {
    console.error('Playbook retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve playbooks' },
      { status: 500 }
    );
  }
}

async function getPlaybookById(playbookId: string, userId: string) {
  // In real implementation, this would query the database
  return {
    id: playbookId,
    userId,
    title: 'Sample Playbook',
    sport: 'flag_football',
    plays: [],
    created: new Date().toISOString()
  };
}

async function getUserPlaybooks(userId: string, sport?: string, gameType?: string) {
  // In real implementation, this would query the database with filters
  return [
    {
      id: 'pb_001',
      title: 'Youth Flag Football 7v7',
      sport: 'flag_football',
      gameType: '7v7',
      playCount: 18,
      created: new Date().toISOString()
    }
  ];
}