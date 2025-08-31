import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return available AI models for Go4It platform
    const models = {
      success: true,
      models: {
        aiCoach: {
          name: 'Go4It AI Coach',
          type: 'coaching',
          status: 'active',
          capabilities: ['performance analysis', 'skill recommendations', 'training plans'],
        },
        garAnalysis: {
          name: 'GAR Analysis Engine',
          type: 'video_analysis',
          status: 'active',
          capabilities: ['gait analysis', 'agility assessment', 'reaction time measurement'],
        },
        performancePredictor: {
          name: 'Performance Predictor',
          type: 'analytics',
          status: 'active',
          capabilities: ['performance prediction', 'improvement suggestions', 'injury prevention'],
        },
        contentAnalyzer: {
          name: 'Content Analyzer',
          type: 'content',
          status: 'active',
          capabilities: ['automatic tagging', 'content classification', 'quality assessment'],
        },
      },
      totalModels: 4,
      activeModels: 4,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching AI models:', error);
    return NextResponse.json({ error: 'Failed to fetch AI models' }, { status: 500 });
  }
}
