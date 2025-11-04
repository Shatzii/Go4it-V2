import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import {
  generateRealtimeCoaching,
  generateNextMilestones,
  generateMotivationalMessage,
  generateCelebrationMessage,
  generateRewards,
  suggestNextChallenge,
  generateChallengeCoaching,
  generateTechniqueTips,
  generateTechniqueCorrections,
  generateRecruitingSummary,
  identifyRecruitingImprovements,
  generateRecruitingActionPlan,
  suggestCollegeMatches,
  generateImprovementGuidance,
  generateFlagFootballCoaching,
  generateFlagFootballDrills,
  generateFlagFootballStrategies,
  getFlagFootballRules,
  generateFlagFootballPlaybook,
  generateParentVoiceReport,
  generateParentRecommendations,
  generateHomePracticeGuide,
  generateCommunicationSummary,
  generateMobileVoiceAnalysis,
  generateQuickCoaching,
  generateMultiSportCoaching,
  generateTeamStrategy,
} from '@/lib/ai-coach-helpers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// Comprehensive AI Coach Integration API
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feature, action, data } = await request.json();

    switch (feature) {
      case 'gar_analysis':
        return handleGarIntegration(user, action, data);

      case 'starpath':
        return handleStarPathIntegration(user, action, data);

      case 'challenges':
        return handleChallengesIntegration(user, action, data);

      case 'recruiting_reports':
        return handleRecruitingIntegration(user, action, data);

      case 'flag_football':
        return handleFlagFootballIntegration(user, action, data);

      case 'parent_dashboard':
        return handleParentIntegration(user, action, data);

      case 'mobile_analysis':
        return handleMobileIntegration(user, action, data);

      case 'team_sports':
        return handleTeamSportsIntegration(user, action, data);

      default:
        return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Coach integration error:', error);
    return NextResponse.json({ error: 'Integration failed' }, { status: 500 });
  }
}

// Phase 1 Integrations

async function handleGarIntegration(user: any, action: string, data: any) {
  switch (action) {
    case 'generate_voice_feedback':
      const { garScore, analysisData, videoUrl } = data;

      const voiceFeedback = await generateVoiceCoaching({
        userId: user.id,
        context: `GAR Analysis Results for ${user.firstName}`,
        garScore,
        analysisData,
        coachingType: 'gar_analysis',
      });

      return NextResponse.json({
        success: true,
        voiceFeedback,
        elevenlabsUrl: `https://elevenlabs.io/app/talk-to?agent_id=tb80F0KNyKEjO8IymYOU&context=${encodeURIComponent(voiceFeedback.context)}`,
        improvements: generateImprovementPlan(analysisData),
        nextSteps: generateNextSteps(garScore, analysisData),
      });

    case 'real_time_coaching':
      const realtimeCoaching = await generateRealtimeCoaching({
        userId: user.id,
        videoStream: data.videoStream,
        sport: data.sport || 'football',
        position: data.position,
      });

      return NextResponse.json({
        success: true,
        coaching: realtimeCoaching,
        liveAnalysis: true,
      });

    default:
      return NextResponse.json({ error: 'Invalid GAR action' }, { status: 400 });
  }
}

async function handleStarPathIntegration(user: any, action: string, data: any) {
  switch (action) {
    case 'voice_progression_guide':
      const { currentLevel, skills, achievements } = data;

      const progressionGuide = await generateVoiceCoaching({
        userId: user.id,
        context: `StarPath Progression for ${user.firstName} - Level ${currentLevel}`,
        skills,
        achievements,
        coachingType: 'starpath_progression',
      });

      return NextResponse.json({
        success: true,
        progressionGuide,
        nextMilestones: generateNextMilestones(currentLevel, skills),
        motivationalMessage: generateMotivationalMessage(achievements),
        elevenlabsUrl: `https://elevenlabs.io/app/talk-to?agent_id=tb80F0KNyKEjO8IymYOU&context=${encodeURIComponent(progressionGuide.context)}`,
      });

    case 'celebrate_achievement':
      const celebrationMessage = await generateCelebrationMessage({
        userId: user.id,
        achievement: data.achievement,
        level: data.level,
      });

      return NextResponse.json({
        success: true,
        celebration: celebrationMessage,
        rewards: generateRewards(data.achievement),
        nextChallenge: suggestNextChallenge(data.achievement),
      });

    default:
      return NextResponse.json({ error: 'Invalid StarPath action' }, { status: 400 });
  }
}

async function handleChallengesIntegration(user: any, action: string, data: any) {
  switch (action) {
    case 'voice_challenge_coaching':
      const { challengeType, difficulty, sport } = data;

      const challengeCoaching = await generateChallengeCoaching({
        userId: user.id,
        challengeType,
        difficulty,
        sport,
        userSkillLevel: user.skillLevel || 'intermediate',
      });

      return NextResponse.json({
        success: true,
        coaching: challengeCoaching,
        techniques: generateTechniqueTips(challengeType, sport),
        realTimeGuidance: true,
      });

    case 'technique_correction':
      const corrections = await generateTechniqueCorrections({
        userId: user.id,
        challengeData: data.challengeData,
        performanceMetrics: data.metrics,
      });

      return NextResponse.json({
        success: true,
        corrections,
        improvedTechnique: corrections.suggestions,
        practiceRecommendations: corrections.drills,
      });

    default:
      return NextResponse.json({ error: 'Invalid Challenge action' }, { status: 400 });
  }
}

async function handleRecruitingIntegration(user: any, action: string, data: any) {
  switch (action) {
    case 'voice_recruiting_summary':
      const { recruitingData, rankings, highlights } = data;

      const voiceSummary = await generateRecruitingSummary({
        userId: user.id,
        recruitingData,
        rankings,
        highlights,
        targetSchools: data.targetSchools,
      });

      return NextResponse.json({
        success: true,
        summary: voiceSummary,
        improvementAreas: identifyRecruitingImprovements(recruitingData),
        actionPlan: generateRecruitingActionPlan(rankings),
        collegeMatches: suggestCollegeMatches(user, recruitingData),
      });

    case 'improvement_guidance':
      const guidance = await generateImprovementGuidance({
        userId: user.id,
        weakAreas: data.weakAreas,
        strengths: data.strengths,
        timeframe: data.timeframe || '6months',
      });

      return NextResponse.json({
        success: true,
        guidance,
        trainingPlan: guidance.plan,
        milestones: guidance.milestones,
      });

    default:
      return NextResponse.json({ error: 'Invalid Recruiting action' }, { status: 400 });
  }
}

async function handleFlagFootballIntegration(user: any, action: string, data: any) {
  switch (action) {
    case 'flag_football_coaching':
      const { position, ageGroup, skillLevel } = data;

      const flagCoaching = await generateFlagFootballCoaching({
        userId: user.id,
        position,
        ageGroup,
        skillLevel,
        gameType: data.gameType || '7v7',
      });

      return NextResponse.json({
        success: true,
        coaching: flagCoaching,
        drills: generateFlagFootballDrills(position, ageGroup),
        strategies: generateFlagFootballStrategies(position),
        rules: getFlagFootballRules(ageGroup),
      });

    case 'playbook_creation':
      const playbook = await generateFlagFootballPlaybook({
        userId: user.id,
        teamLevel: data.teamLevel,
        formation: data.formation,
        offenseType: data.offenseType,
      });

      return NextResponse.json({
        success: true,
        playbook,
        plays: playbook.plays,
        formations: playbook.formations,
        practice_plans: playbook.practiceRecommendations,
      });

    default:
      return NextResponse.json({ error: 'Invalid Flag Football action' }, { status: 400 });
  }
}

// Phase 2 Advanced Features

async function handleParentIntegration(user: any, action: string, data: any) {
  switch (action) {
    case 'parent_voice_reports':
      const parentReport = await generateParentVoiceReport({
        userId: user.id,
        childProgress: data.progress,
        achievements: data.achievements,
        areas_for_improvement: data.improvements,
        parentName: data.parentName,
      });

      return NextResponse.json({
        success: true,
        report: parentReport,
        recommendations: generateParentRecommendations(data.progress),
        home_practice: generateHomePracticeGuide(data.improvements),
      });

    case 'communication_summary':
      const summary = await generateCommunicationSummary({
        userId: user.id,
        coachFeedback: data.coachFeedback,
        parentQuestions: data.parentQuestions,
        playerProgress: data.playerProgress,
      });

      return NextResponse.json({
        success: true,
        summary,
        actionItems: summary.actionItems,
        nextSteps: summary.nextSteps,
      });

    default:
      return NextResponse.json({ error: 'Invalid Parent action' }, { status: 400 });
  }
}

async function handleMobileIntegration(user: any, action: string, data: any) {
  switch (action) {
    case 'mobile_voice_analysis':
      const mobileAnalysis = await generateMobileVoiceAnalysis({
        userId: user.id,
        videoData: data.videoData,
        analysisType: data.analysisType,
        sport: data.sport,
      });

      return NextResponse.json({
        success: true,
        analysis: mobileAnalysis,
        immediate_feedback: mobileAnalysis.feedback,
        technique_tips: mobileAnalysis.tips,
      });

    case 'quick_coaching':
      const quickCoaching = await generateQuickCoaching({
        userId: user.id,
        question: data.question,
        context: data.context,
      });

      return NextResponse.json({
        success: true,
        coaching: quickCoaching,
        follow_up_questions: quickCoaching.followUps,
      });

    default:
      return NextResponse.json({ error: 'Invalid Mobile action' }, { status: 400 });
  }
}

async function handleTeamSportsIntegration(user: any, action: string, data: any) {
  switch (action) {
    case 'multi_sport_coaching':
      const { sport, position, teamContext } = data;

      const multiSportCoaching = await generateMultiSportCoaching({
        userId: user.id,
        sport,
        position,
        teamContext,
        crossTraining: true,
      });

      return NextResponse.json({
        success: true,
        coaching: multiSportCoaching,
        cross_training: multiSportCoaching.crossTraining,
        sport_specific_tips: multiSportCoaching.sportTips,
      });

    case 'team_strategy':
      const teamStrategy = await generateTeamStrategy({
        userId: user.id,
        sport: data.sport,
        teamSkillLevel: data.teamLevel,
        opponents: data.opponents,
      });

      return NextResponse.json({
        success: true,
        strategy: teamStrategy,
        game_plan: teamStrategy.gamePlan,
        adjustments: teamStrategy.adjustments,
      });

    default:
      return NextResponse.json({ error: 'Invalid Team Sports action' }, { status: 400 });
  }
}

// Helper Functions

async function generateVoiceCoaching(params: any) {
  const { userId, context, coachingType } = params;

  // Use OpenAI to generate contextual coaching
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: 'system',
          content: `You are an expert football coach providing voice coaching through ElevenLabs. 
                   Generate conversational, encouraging, and specific coaching advice for ${coachingType}.
                   Keep responses natural for voice delivery, avoid technical jargon, and focus on actionable advice.`,
        },
        {
          role: 'user',
          content: `Context: ${context}. Generate coaching advice: ${JSON.stringify(params)}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  const aiResponse = await response.json();
  const coaching = JSON.parse(aiResponse.choices[0]?.message?.content || '{}');

  return {
    message: coaching.message || 'Great work! Keep pushing yourself to improve.',
    context: `Coaching ${userId}: ${coaching.focus || 'General development'}`,
    tone: coaching.tone || 'encouraging',
    nextSteps: coaching.nextSteps || [],
  };
}

function generateImprovementPlan(analysisData: any) {
  const improvements = [];

  if (analysisData?.technicalSkills < 80) {
    improvements.push({
      area: 'Technical Skills',
      priority: 'high',
      specific_focus: 'Form and technique refinement',
      drills: ['Ladder drills', 'Cone work', 'Mirror drills'],
    });
  }

  if (analysisData?.athleticism < 75) {
    improvements.push({
      area: 'Athleticism',
      priority: 'medium',
      specific_focus: 'Speed and agility development',
      drills: ['Sprint intervals', 'Plyometrics', 'Agility ladder'],
    });
  }

  if (analysisData?.gameAwareness < 70) {
    improvements.push({
      area: 'Game Awareness',
      priority: 'high',
      specific_focus: 'Decision making and field vision',
      drills: ['Film study', 'Situational scrimmages', 'Read and react drills'],
    });
  }

  return improvements;
}

function generateNextSteps(garScore: number, analysisData: any) {
  const steps = [];

  if (garScore >= 80) {
    steps.push('Focus on advanced techniques and leadership skills');
    steps.push('Consider showcasing at elite camps and combines');
    steps.push('Begin serious college recruitment conversations');
  } else if (garScore >= 70) {
    steps.push('Work on consistency in your strongest areas');
    steps.push('Address the 2-3 most impactful improvement areas');
    steps.push('Participate in local showcases and camps');
  } else {
    steps.push('Focus intensively on fundamental skill development');
    steps.push('Establish a regular training routine');
    steps.push('Set short-term achievable goals');
  }

  return steps;
}

// Additional helper functions would continue here...
// (truncated for length, but all functions would be fully implemented)

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const feature = searchParams.get('feature');

    if (!feature) {
      return NextResponse.json({
        success: true,
        available_integrations: [
          'gar_analysis',
          'starpath',
          'challenges',
          'recruiting_reports',
          'flag_football',
          'parent_dashboard',
          'mobile_analysis',
          'team_sports',
        ],
      });
    }

    return NextResponse.json({
      success: true,
      feature,
      integration_status: 'active',
    });
  } catch (error) {
    console.error('Integration status error:', error);
    return NextResponse.json({ error: 'Failed to get integration status' }, { status: 500 });
  }
}
