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
    // Top 10 Global Sports
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
      },
      {
        name: 'Serve Technique',
        description: 'Develop powerful and accurate serving',
        difficulty: 'intermediate',
        duration: '25-30 minutes',
        xp_reward: 80,
        instructions: [
          'Practice proper toss height and placement',
          'Work on continental grip',
          'Focus on pronation and follow-through',
          'Add placement targeting'
        ],
        success_criteria: 'Land 6/10 serves in target box',
        modifications_for_adhd: 'Use target zones, break into serving segments, rhythm counting'
      }
    ],
    volleyball: [
      {
        name: 'Serving Fundamentals',
        description: 'Master consistent underhand and overhand serves',
        difficulty: 'beginner',
        duration: '20-25 minutes',
        xp_reward: 55,
        instructions: [
          'Practice underhand serve technique',
          'Work on overhand serve form',
          'Focus on consistent contact point',
          'Add target practice'
        ],
        success_criteria: 'Land 7/10 serves in target area',
        modifications_for_adhd: 'Use visual targets, count serves aloud, celebrate accuracy'
      },
      {
        name: 'Passing and Setting',
        description: 'Develop accurate passing and setting skills',
        difficulty: 'intermediate',
        duration: '25-30 minutes',
        xp_reward: 70,
        instructions: [
          'Practice platform passing technique',
          'Work on setting hand position',
          'Focus on ball control and placement',
          'Add movement drills'
        ],
        success_criteria: 'Complete 8/10 accurate passes to target',
        modifications_for_adhd: 'Use colored balls, partner feedback, shorter drill segments'
      }
    ],
    'table tennis': [
      {
        name: 'Forehand Drive',
        description: 'Master consistent forehand drive technique',
        difficulty: 'beginner',
        duration: '15-20 minutes',
        xp_reward: 45,
        instructions: [
          'Practice proper grip and stance',
          'Work on smooth stroke motion',
          'Focus on ball contact timing',
          'Add topspin progression'
        ],
        success_criteria: 'Hit 8/10 forehand drives on table',
        modifications_for_adhd: 'Use multiball training, count hits aloud, visual cues'
      },
      {
        name: 'Footwork Patterns',
        description: 'Develop quick and efficient movement',
        difficulty: 'intermediate',
        duration: '20-25 minutes',
        xp_reward: 60,
        instructions: [
          'Practice side-to-side movement',
          'Work on forehand-backhand transitions',
          'Focus on balance and recovery',
          'Add speed progressions'
        ],
        success_criteria: 'Complete footwork sequence in target time',
        modifications_for_adhd: 'Use rhythm patterns, visual markers, short intervals'
      }
    ],
    badminton: [
      {
        name: 'Clear Shot Technique',
        description: 'Master defensive and offensive clear shots',
        difficulty: 'beginner',
        duration: '20-25 minutes',
        xp_reward: 50,
        instructions: [
          'Practice overhead clear motion',
          'Work on proper grip and stance',
          'Focus on shuttle trajectory',
          'Add power and placement'
        ],
        success_criteria: 'Hit 7/10 clears to back court',
        modifications_for_adhd: 'Use target areas, count successful shots, immediate feedback'
      },
      {
        name: 'Net Play',
        description: 'Develop precise net shots and kills',
        difficulty: 'intermediate',
        duration: '25-30 minutes',
        xp_reward: 65,
        instructions: [
          'Practice net shot technique',
          'Work on kill shot timing',
          'Focus on shuttle control',
          'Add deception elements'
        ],
        success_criteria: 'Complete 8/10 net shots without errors',
        modifications_for_adhd: 'Use slower shuttles, partner drills, visual targets'
      }
    ],
    golf: [
      {
        name: 'Putting Fundamentals',
        description: 'Master consistent putting technique',
        difficulty: 'beginner',
        duration: '25-30 minutes',
        xp_reward: 55,
        instructions: [
          'Practice proper putting stance',
          'Work on pendulum stroke motion',
          'Focus on distance control',
          'Add breaking putts'
        ],
        success_criteria: 'Make 6/10 putts from 6 feet',
        modifications_for_adhd: 'Use alignment aids, count strokes, immediate feedback'
      },
      {
        name: 'Iron Shot Accuracy',
        description: 'Develop consistent iron play',
        difficulty: 'intermediate',
        duration: '30-35 minutes',
        xp_reward: 75,
        instructions: [
          'Practice proper setup and alignment',
          'Work on swing tempo',
          'Focus on ball-then-turf contact',
          'Add target practice'
        ],
        success_criteria: 'Hit 7/10 irons within target area',
        modifications_for_adhd: 'Use target flags, swing rhythm counting, pre-shot routine'
      }
    ],
    'field hockey': [
      {
        name: 'Stick Handling',
        description: 'Master basic stick control and dribbling',
        difficulty: 'beginner',
        duration: '20-25 minutes',
        xp_reward: 50,
        instructions: [
          'Practice proper grip and stance',
          'Work on basic dribbling',
          'Focus on ball control',
          'Add direction changes'
        ],
        success_criteria: 'Complete dribbling course without losing control',
        modifications_for_adhd: 'Use colored cones, count touches, celebrate control'
      },
      {
        name: 'Passing and Receiving',
        description: 'Develop accurate passing and receiving skills',
        difficulty: 'intermediate',
        duration: '25-30 minutes',
        xp_reward: 65,
        instructions: [
          'Practice push pass technique',
          'Work on receiving on both sides',
          'Focus on first touch control',
          'Add movement patterns'
        ],
        success_criteria: 'Complete 8/10 passes to target',
        modifications_for_adhd: 'Use target goals, partner feedback, shorter sequences'
      }
    ],
    cricket: [
      {
        name: 'Batting Fundamentals',
        description: 'Master basic batting stance and strokes',
        difficulty: 'beginner',
        duration: '25-30 minutes',
        xp_reward: 60,
        instructions: [
          'Practice proper batting stance',
          'Work on straight drive technique',
          'Focus on timing and placement',
          'Add defensive shots'
        ],
        success_criteria: 'Hit 7/10 balls cleanly off the bat',
        modifications_for_adhd: 'Use softer balls, count clean hits, immediate feedback'
      },
      {
        name: 'Bowling Accuracy',
        description: 'Develop consistent bowling technique',
        difficulty: 'intermediate',
        duration: '30-35 minutes',
        xp_reward: 70,
        instructions: [
          'Practice bowling action',
          'Work on line and length',
          'Focus on consistency',
          'Add variation practice'
        ],
        success_criteria: 'Bowl 6/10 deliveries in target area',
        modifications_for_adhd: 'Use target stumps, count accurate deliveries, rhythm focus'
      }
    ],
    rugby: [
      {
        name: 'Passing Technique',
        description: 'Master spiral pass and handling skills',
        difficulty: 'beginner',
        duration: '20-25 minutes',
        xp_reward: 55,
        instructions: [
          'Practice proper ball grip',
          'Work on spiral pass motion',
          'Focus on accuracy and timing',
          'Add movement patterns'
        ],
        success_criteria: 'Complete 8/10 accurate passes',
        modifications_for_adhd: 'Use colored balls, count successful passes, partner drills'
      },
      {
        name: 'Rucking and Mauling',
        description: 'Develop contact skills and body position',
        difficulty: 'intermediate',
        duration: '25-30 minutes',
        xp_reward: 75,
        instructions: [
          'Practice low body position',
          'Work on driving with legs',
          'Focus on ball security',
          'Add competitive elements'
        ],
        success_criteria: 'Maintain possession in 7/10 contact situations',
        modifications_for_adhd: 'Use visual cues, shorter contact periods, immediate feedback'
      }
    ],
    // Additional requested sports
    baseball: [
      {
        name: 'Hitting Fundamentals',
        description: 'Master proper batting stance and swing',
        difficulty: 'beginner',
        duration: '25-30 minutes',
        xp_reward: 65,
        instructions: [
          'Practice proper batting stance',
          'Work on swing mechanics',
          'Focus on contact point',
          'Add tee work and soft toss'
        ],
        success_criteria: 'Make solid contact on 7/10 swings',
        modifications_for_adhd: 'Use tee work, count solid contacts, immediate feedback'
      },
      {
        name: 'Fielding Technique',
        description: 'Develop proper fielding form and glove work',
        difficulty: 'intermediate',
        duration: '30-35 minutes',
        xp_reward: 70,
        instructions: [
          'Practice fielding position',
          'Work on glove presentation',
          'Focus on smooth transfers',
          'Add throwing accuracy'
        ],
        success_criteria: 'Field 8/10 ground balls cleanly',
        modifications_for_adhd: 'Use softer balls, count clean fields, partner feedback'
      },
      {
        name: 'Pitching Mechanics',
        description: 'Master basic pitching form and accuracy',
        difficulty: 'intermediate',
        duration: '35-40 minutes',
        xp_reward: 85,
        instructions: [
          'Practice pitching windup',
          'Work on stride and release',
          'Focus on strike zone control',
          'Add velocity progression'
        ],
        success_criteria: 'Throw 6/10 strikes in target zone',
        modifications_for_adhd: 'Use target zones, count strikes, rhythm focus'
      }
    ],
    football: [
      {
        name: 'Passing Accuracy',
        description: 'Master quarterback passing fundamentals',
        difficulty: 'beginner',
        duration: '25-30 minutes',
        xp_reward: 60,
        instructions: [
          'Practice proper throwing stance',
          'Work on spiral release',
          'Focus on accuracy and timing',
          'Add target practice'
        ],
        success_criteria: 'Hit 7/10 targets at 15 yards',
        modifications_for_adhd: 'Use colored targets, count completions, immediate feedback'
      },
      {
        name: 'Route Running',
        description: 'Develop precise route running and cuts',
        difficulty: 'intermediate',
        duration: '30-35 minutes',
        xp_reward: 70,
        instructions: [
          'Practice basic route patterns',
          'Work on sharp cuts',
          'Focus on timing and spacing',
          'Add defensive reads'
        ],
        success_criteria: 'Execute 8/10 routes with proper timing',
        modifications_for_adhd: 'Use cone markers, count successful routes, visual cues'
      },
      {
        name: 'Blocking Fundamentals',
        description: 'Master proper blocking technique and stance',
        difficulty: 'intermediate',
        duration: '25-30 minutes',
        xp_reward: 65,
        instructions: [
          'Practice proper blocking stance',
          'Work on hand placement',
          'Focus on leverage and drive',
          'Add pass protection'
        ],
        success_criteria: 'Maintain blocks for target duration',
        modifications_for_adhd: 'Use visual cues, shorter block periods, partner feedback'
      }
    ],
    'ski jumping': [
      {
        name: 'Takeoff Technique',
        description: 'Master proper takeoff form and timing',
        difficulty: 'intermediate',
        duration: '30-35 minutes',
        xp_reward: 80,
        instructions: [
          'Practice takeoff position',
          'Work on timing and rhythm',
          'Focus on forward lean',
          'Add progression jumps'
        ],
        success_criteria: 'Execute 7/10 takeoffs with proper form',
        modifications_for_adhd: 'Use video feedback, count successful takeoffs, rhythm training'
      },
      {
        name: 'In-Flight Position',
        description: 'Develop optimal aerodynamic position',
        difficulty: 'advanced',
        duration: '35-40 minutes',
        xp_reward: 90,
        instructions: [
          'Practice telemark position',
          'Work on ski parallel alignment',
          'Focus on body stability',
          'Add wind tunnel training'
        ],
        success_criteria: 'Maintain position for target flight time',
        modifications_for_adhd: 'Use position markers, shorter flight segments, visual feedback'
      },
      {
        name: 'Landing Technique',
        description: 'Master safe and controlled landing form',
        difficulty: 'advanced',
        duration: '30-35 minutes',
        xp_reward: 85,
        instructions: [
          'Practice landing preparation',
          'Work on balance and control',
          'Focus on smooth transitions',
          'Add stability training'
        ],
        success_criteria: 'Execute 8/10 landings with control',
        modifications_for_adhd: 'Use balance aids, count controlled landings, immediate feedback'
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