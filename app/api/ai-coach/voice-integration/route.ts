import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// AI Coach Voice Integration API
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await request.json();

    switch (action) {
      case 'start_session':
        return handleStartSession(user, data);

      case 'process_gar_data':
        return handleGarDataProcessing(user, data);

      case 'generate_coaching_response':
        return handleCoachingResponse(user, data);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Coach integration error:', error);
    return NextResponse.json({ error: 'AI Coach integration failed' }, { status: 500 });
  }
}

async function handleStartSession(user: any, data: any) {
  // Initialize ElevenLabs voice session with user context
  const sessionData = {
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
    sport: user.sport || 'football',
    position: user.position || 'unknown',
    garScore: user.garScore || 0,
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startTime: new Date().toISOString(),

    // ElevenLabs agent configuration
    agentConfig: {
      agent_id: 'Ayif0LPWGdrZglfWInx0',
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.8,
        style: 0.5,
      },
      context: `You are coaching ${user.firstName}, a ${user.sport} player with a GAR score of ${user.garScore}. 
                Position: ${user.position}. Provide personalized football coaching advice.`,
    },
  };

  return NextResponse.json({
    success: true,
    session: sessionData,
    elevenlabs_url: `https://elevenlabs.io/app/talk-to?agent_id=Ayif0LPWGdrZglfWInx0&context=${encodeURIComponent(sessionData.agentConfig.context)}`,
  });
}

async function handleGarDataProcessing(user: any, data: any) {
  // Process GAR analysis data for voice coaching
  const { garScore, analysisData, videoUrl } = data;

  // Generate coaching insights based on GAR data
  const coachingInsights = {
    overall_score: garScore,
    strengths: [],
    improvements: [],
    voice_coaching_points: [],
  };

  // Analyze technical skills
  if (analysisData?.technicalSkills >= 80) {
    coachingInsights.strengths.push('Excellent technical execution');
    coachingInsights.voice_coaching_points.push(
      "Your form is looking great! Let's talk about maintaining that consistency under pressure.",
    );
  } else if (analysisData?.technicalSkills < 70) {
    coachingInsights.improvements.push('Technical skills need development');
    coachingInsights.voice_coaching_points.push(
      'I notice some areas where we can refine your technique. Want to work on specific drills?',
    );
  }

  // Analyze athleticism
  if (analysisData?.athleticism >= 80) {
    coachingInsights.strengths.push('Strong athletic performance');
    coachingInsights.voice_coaching_points.push(
      'Your athleticism is a real strength. How can we leverage that in game situations?',
    );
  } else if (analysisData?.athleticism < 70) {
    coachingInsights.improvements.push('Athletic conditioning needed');
    coachingInsights.voice_coaching_points.push(
      "Let's discuss a conditioning program to boost your athletic performance.",
    );
  }

  // Analyze game awareness
  if (analysisData?.gameAwareness >= 80) {
    coachingInsights.strengths.push('Excellent game intelligence');
    coachingInsights.voice_coaching_points.push(
      'Your game awareness is impressive. Tell me about your decision-making process.',
    );
  } else if (analysisData?.gameAwareness < 70) {
    coachingInsights.improvements.push('Game awareness development');
    coachingInsights.voice_coaching_points.push(
      'I want to help you read the game better. What situations challenge you most?',
    );
  }

  return NextResponse.json({
    success: true,
    insights: coachingInsights,
    coaching_context: `GAR Score: ${garScore}. Key areas to discuss: ${coachingInsights.voice_coaching_points.join(' ')}`,
  });
}

async function handleCoachingResponse(user: any, data: any) {
  // Generate contextual coaching responses for voice integration
  const { question, context, garData } = data;

  // Use OpenAI to generate coaching response
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API not configured' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert football coach speaking to ${user.firstName}, a ${user.sport} player. 
                     Their GAR score is ${user.garScore}. Provide specific, actionable coaching advice.
                     Keep responses conversational and encouraging, as this will be delivered via voice.`,
          },
          {
            role: 'user',
            content: `Player question: ${question}. Context: ${context}. GAR Data: ${JSON.stringify(garData)}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    const coachingResponse =
      aiResponse.choices[0]?.message?.content || 'I need more information to help you with that.';

    return NextResponse.json({
      success: true,
      coaching_response: coachingResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to generate coaching response' }, { status: 500 });
  }
}

// GET endpoint for retrieving session data
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Retrieve session data (in a real implementation, this would come from a database)
    const sessionData = {
      sessionId,
      userId: user.id,
      status: 'active',
      startTime: new Date().toISOString(),
      currentContext: `Coaching ${user.firstName} - Skill Level: ${user.skillLevel}`,
    };

    return NextResponse.json({
      success: true,
      session: sessionData,
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}
