import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Generate sample video analysis history
    const history = [
      {
        id: '1',
        videoName: 'Sprint Training Session.mp4',
        garScore: 8.5,
        analysisDate: new Date('2025-01-15'),
        status: 'completed',
        sport: 'Track & Field',
        duration: 120,
        improvements: [
          { category: 'Starting Form', score: 8.2, improvement: '+0.8' },
          { category: 'Acceleration', score: 8.9, improvement: '+0.3' },
          { category: 'Top Speed', score: 8.1, improvement: '+0.5' },
        ],
      },
      {
        id: '2',
        videoName: 'Basketball Scrimmage.mp4',
        garScore: 7.8,
        analysisDate: new Date('2025-01-12'),
        status: 'completed',
        sport: 'Basketball',
        duration: 300,
        improvements: [
          { category: 'Shooting Form', score: 9.1, improvement: '+0.2' },
          { category: 'Court Vision', score: 7.8, improvement: '+1.2' },
          { category: 'Defense', score: 6.5, improvement: '+0.9' },
        ],
      },
      {
        id: '3',
        videoName: 'Football Practice.mp4',
        garScore: 9.2,
        analysisDate: new Date('2025-01-10'),
        status: 'completed',
        sport: 'Football',
        duration: 180,
        improvements: [
          { category: 'Footwork', score: 9.2, improvement: '+0.4' },
          { category: 'Route Running', score: 8.9, improvement: '+0.6' },
          { category: 'Catching', score: 9.5, improvement: '+0.1' },
        ],
      },
      {
        id: '4',
        videoName: 'Soccer Skills Training.mp4',
        garScore: 8.1,
        analysisDate: new Date('2025-01-08'),
        status: 'completed',
        sport: 'Soccer',
        duration: 240,
        improvements: [
          { category: 'Ball Control', score: 8.3, improvement: '+0.7' },
          { category: 'Passing Accuracy', score: 7.9, improvement: '+0.5' },
          { category: 'Shooting Power', score: 8.1, improvement: '+0.3' },
        ],
      },
      {
        id: '5',
        videoName: 'Tennis Match Analysis.mp4',
        garScore: 7.6,
        analysisDate: new Date('2025-01-05'),
        status: 'completed',
        sport: 'Tennis',
        duration: 420,
        improvements: [
          { category: 'Forehand Technique', score: 8.0, improvement: '+0.6' },
          { category: 'Backhand Power', score: 7.2, improvement: '+0.8' },
          { category: 'Court Movement', score: 7.6, improvement: '+0.4' },
        ],
      },
    ];

    return NextResponse.json({
      success: true,
      history: history.slice(0, limit),
      stats: {
        totalAnalyses: history.length,
        averageGarScore: history.reduce((sum, h) => sum + h.garScore, 0) / history.length,
        improvementTrend: '+12% over last month',
        lastAnalysis: history[0].analysisDate,
      },
    });
  } catch (error) {
    console.error('Video analysis history fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis history' }, { status: 500 });
  }
}
