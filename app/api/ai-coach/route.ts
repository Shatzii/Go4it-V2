import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { go4itAI } from '@/lib/openai-integration'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sport, currentLevel, goals, weaknesses, strengths, sessionType } = await request.json()

    // Create comprehensive AI coach prompt
    const prompt = `You are an elite AI athletic coach specializing in ${sport}. You're working with a student athlete who needs personalized training recommendations.

ATHLETE PROFILE:
- Sport: ${sport}
- Current Level: ${currentLevel}
- Goals: ${goals}
- Strengths: ${strengths}
- Areas for Improvement: ${weaknesses}
- Session Type: ${sessionType}

COACHING REQUIREMENTS:
1. Provide 5-8 specific skills and drills tailored to their sport and level
2. Each drill should have:
   - Clear name and description
   - Step-by-step instructions
   - Equipment needed
   - Difficulty level (Beginner/Intermediate/Advanced)
   - Duration/repetitions
   - Key coaching points
   - Success metrics
   - Connection to StarPath progression

3. Prioritize drills that address their weaknesses while building on strengths
4. Include both technical skills and mental training components
5. Ensure drills are progressive and measurable for StarPath advancement

RESPONSE FORMAT:
Return a JSON object with:
- sessionSummary: Brief overview of the training focus
- drills: Array of drill objects with all required fields
- starPathProgress: How these drills contribute to advancement
- nextSteps: Recommendations for continued development

Focus on practical, actionable advice that a student athlete can implement immediately.`

    // Use OpenAI GPT-4o for authentic AI coaching
    let aiResponse;
    try {
      const analysisRequest = {
        sport,
        analysisType: 'coaching' as const,
        context: {
          currentLevel,
          goals,
          weaknesses,
          strengths,
          sessionType,
          userId: user.id
        }
      };
      
      aiResponse = await go4itAI.generateCoachingAdvice(analysisRequest);
    } catch (aiError) {
      console.log('OpenAI service error:', aiError);
      
      // Fallback coaching system with sport-specific drills
      aiResponse = JSON.stringify({
        sessionSummary: `Personalized ${sport} training session focusing on ${goals}. This session targets your identified areas for improvement while building on your strengths.`,
        drills: generateSportSpecificDrills(sport, currentLevel, goals, weaknesses, strengths),
        starPathProgress: `This training session will help you advance in your ${sport} skills. Complete the drills to earn XP and unlock new abilities in your athletic development journey.`,
        nextSteps: `After completing these drills, focus on consistency and form. Track your progress and repeat drills where you scored below 80% accuracy. Schedule your next session in 2-3 days.`
      });
    }
    
    // Try to parse JSON response, fallback to structured format if needed
    let coachingData;
    try {
      coachingData = JSON.parse(aiResponse);
    } catch (error) {
      // If AI didn't return valid JSON, structure the response
      coachingData = {
        sessionSummary: "AI Coach generated personalized training session",
        drills: [],
        starPathProgress: "Training session designed to advance athletic development",
        nextSteps: "Continue with recommended drills and track progress",
        rawResponse: aiResponse
      };
    }

    // Save coaching session to database (mock implementation)
    const coachingSession = {
      id: Date.now().toString(),
      userId: user.id,
      sport,
      currentLevel,
      goals,
      sessionType,
      coachingData,
      timestamp: new Date().toISOString(),
      completed: false
    };

    return NextResponse.json({ 
      success: true,
      session: coachingSession,
      aiCoach: coachingData
    });

  } catch (error) {
    console.error('AI Coach error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate coaching session',
      details: error.message 
    }, { status: 500 });
  }
}

// Fallback coaching system for when AI service is unavailable
function generateSportSpecificDrills(sport: string, level: string, goals: string, weaknesses: string, strengths: string) {
  const drillTemplates = {
    Basketball: [
      {
        name: 'Form Shooting',
        description: 'Focus on proper shooting mechanics and consistency',
        instructions: [
          'Start 5 feet from the basket',
          'Use proper shooting form (BEEF - Balance, Eyes, Elbow, Follow-through)',
          'Take 50 shots, focusing on arc and rotation',
          'Move back 2 feet after making 8 out of 10 shots'
        ],
        equipment: ['Basketball', 'Hoop'],
        difficulty: level === 'Beginner' ? 'Beginner' : level === 'Advanced' ? 'Advanced' : 'Intermediate',
        duration: '15-20 minutes',
        repetitions: '50 shots per distance',
        keyPoints: ['Consistent release point', 'Proper arc (45-50 degrees)', 'Soft touch on rim'],
        successMetrics: ['80% accuracy at each distance', 'Consistent form on all shots'],
        xpReward: 30
      },
      {
        name: 'Ball Handling Circuit',
        description: 'Improve dribbling speed and control',
        instructions: [
          'Stationary dribbling - 30 seconds each hand',
          'Figure 8 dribbling around legs - 20 reps',
          'Crossover dribbling - 20 reps each direction',
          'Behind-the-back dribbling - 15 reps each direction'
        ],
        equipment: ['Basketball'],
        difficulty: level === 'Beginner' ? 'Beginner' : level === 'Advanced' ? 'Advanced' : 'Intermediate',
        duration: '10-15 minutes',
        repetitions: '3 sets of complete circuit',
        keyPoints: ['Keep head up', 'Use fingertips, not palms', 'Control at game speed'],
        successMetrics: ['No ball fumbles', 'Smooth transitions between moves'],
        xpReward: 25
      },
      {
        name: 'Defensive Stance Practice',
        description: 'Develop proper defensive positioning and movement',
        instructions: [
          'Start in athletic stance (feet shoulder-width apart)',
          'Slide step laterally - 10 steps each direction',
          'Backpedal while maintaining stance - 15 steps',
          'Close out drill - sprint to cone, then defensive slide'
        ],
        equipment: ['Cones or markers'],
        difficulty: level === 'Beginner' ? 'Beginner' : level === 'Advanced' ? 'Advanced' : 'Intermediate',
        duration: '10-12 minutes',
        repetitions: '4 sets of complete sequence',
        keyPoints: ['Stay low', 'Quick feet', 'Maintain balance'],
        successMetrics: ['Proper stance maintained', 'Quick defensive reactions'],
        xpReward: 20
      }
    ],
    Soccer: [
      {
        name: 'Passing Accuracy',
        description: 'Improve passing precision and technique',
        instructions: [
          'Set up cones 10 yards apart',
          'Use inside of foot for short passes',
          'Focus on weight and accuracy of pass',
          'Progress to longer distances'
        ],
        equipment: ['Soccer ball', 'Cones'],
        difficulty: level === 'Beginner' ? 'Beginner' : level === 'Advanced' ? 'Advanced' : 'Intermediate',
        duration: '15 minutes',
        repetitions: '20 passes per distance',
        keyPoints: ['Plant foot placement', 'Follow through', 'Target accuracy'],
        successMetrics: ['85% accuracy rate', 'Consistent ball weight'],
        xpReward: 25
      }
    ],
    Tennis: [
      {
        name: 'Forehand Technique',
        description: 'Master forehand stroke mechanics',
        instructions: [
          'Start with shadow swings - no ball',
          'Focus on proper grip and stance',
          'Practice with slow-fed balls',
          'Gradually increase pace'
        ],
        equipment: ['Tennis racket', 'Tennis balls'],
        difficulty: level === 'Beginner' ? 'Beginner' : level === 'Advanced' ? 'Advanced' : 'Intermediate',
        duration: '20 minutes',
        repetitions: '50 forehands',
        keyPoints: ['Proper grip', 'Unit turn', 'Contact point'],
        successMetrics: ['Consistent contact point', 'Good follow-through'],
        xpReward: 30
      }
    ]
  };

  const baseDrills = drillTemplates[sport] || drillTemplates.Basketball;
  
  return baseDrills.map((drill, index) => ({
    ...drill,
    id: `${sport.toLowerCase()}-drill-${index + 1}`,
    completed: false
  }));
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock previous coaching sessions
    const sessions = [
      {
        id: "1",
        userId: user.id,
        sport: user.sport || "Basketball",
        sessionType: "Skill Development",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        completed: true,
        drillsCompleted: 6,
        totalDrills: 8,
        starPathXP: 150
      },
      {
        id: "2",
        userId: user.id,
        sport: user.sport || "Basketball",
        sessionType: "Strength Training",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        completed: true,
        drillsCompleted: 5,
        totalDrills: 5,
        starPathXP: 200
      }
    ];

    return NextResponse.json({ 
      sessions,
      totalSessions: sessions.length,
      totalXP: sessions.reduce((sum, s) => sum + s.starPathXP, 0),
      completionRate: sessions.filter(s => s.completed).length / sessions.length
    });

  } catch (error) {
    console.error('Error fetching coaching sessions:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch coaching sessions' 
    }, { status: 500 });
  }
}