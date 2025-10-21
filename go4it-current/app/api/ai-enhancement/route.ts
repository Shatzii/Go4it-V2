import { NextRequest, NextResponse } from 'next/server';
import { aiEnhancer } from '@/lib/ai-enhancement';

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'analyze-content':
        const { content, userContext } = data;
        if (!content || !content.filePath) {
          return NextResponse.json({ error: 'Content with filePath is required' }, { status: 400 });
        }

        const analysis = await aiEnhancer.analyzeContent(content, userContext);
        return NextResponse.json({
          success: true,
          data: analysis,
          metadata: {
            modelUsed: content.sport ? `sports-${content.sport}-v2` : 'sports-general-v2',
            analysisType: 'enhanced',
            processingTime: analysis.processingTime || 0,
          },
        });

      case 'get-performance':
        const { sport } = data;
        const performance = aiEnhancer.getModelPerformance(sport);
        return NextResponse.json({
          success: true,
          data: performance,
        });

      case 'optimize-models':
        const optimizationResult = await aiEnhancer.optimizeModels();
        return NextResponse.json({
          success: true,
          data: optimizationResult,
        });

      case 'improve-tagging':
        const { originalAnalysis, userFeedback } = data;
        if (!originalAnalysis || !userFeedback) {
          return NextResponse.json(
            {
              error: 'Original analysis and user feedback are required',
            },
            { status: 400 },
          );
        }

        await aiEnhancer.improveTagging(originalAnalysis, userFeedback);
        return NextResponse.json({
          success: true,
          message: 'Model feedback recorded for improvement',
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Enhancement API error:', error);
    return NextResponse.json({ error: 'AI enhancement request failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport');
    const type = searchParams.get('type') || 'performance';

    switch (type) {
      case 'performance':
        const performance = aiEnhancer.getModelPerformance(sport || undefined);
        return NextResponse.json({
          success: true,
          data: performance,
        });

      case 'models':
        // Return available models information
        return NextResponse.json({
          success: true,
          data: {
            availableModels: [
              'sports-basketball-v2',
              'sports-football-v2',
              'sports-soccer-v2',
              'sports-baseball-v2',
              'sports-tennis-v2',
              'sports-golf-v2',
              'sports-track-v2',
              'sports-swimming-v2',
              'sports-volleyball-v2',
              'sports-gymnastics-v2',
              'sports-wrestling-v2',
              'sports-hockey-v2',
              'sports-general-v2',
            ],
            modelStatus: 'operational',
            supportedSports: [
              'basketball',
              'football',
              'soccer',
              'baseball',
              'tennis',
              'golf',
              'track',
              'swimming',
              'volleyball',
              'gymnastics',
              'wrestling',
              'hockey',
            ],
          },
        });

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Enhancement API GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch AI enhancement data' }, { status: 500 });
  }
}
