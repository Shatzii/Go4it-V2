import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock performance metrics
    const metrics = {
      userId: user.id,
      sport: user.sport,
      overall: {
        garScore: 85,
        improvement: 12,
        ranking: 'Elite',
        percentile: 92,
      },
      technical: {
        accuracy: 88,
        speed: 82,
        consistency: 90,
        form: 85,
      },
      physical: {
        strength: 78,
        endurance: 85,
        flexibility: 82,
        agility: 88,
      },
      mental: {
        focus: 90,
        confidence: 85,
        decisionMaking: 87,
        pressure: 83,
      },
      recentAnalyses: [
        {
          id: 1,
          date: '2024-07-10',
          type: 'Game Performance',
          score: 87,
          improvement: 5,
        },
        {
          id: 2,
          date: '2024-07-08',
          type: 'Training Session',
          score: 84,
          improvement: 3,
        },
      ],
    };

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
