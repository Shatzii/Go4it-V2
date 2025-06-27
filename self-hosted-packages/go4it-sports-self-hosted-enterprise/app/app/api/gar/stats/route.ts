import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { videoAnalysis } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's video analysis statistics
    const userAnalyses = await db
      .select()
      .from(videoAnalysis)
      .where(eq(videoAnalysis.userId, user.id));

    const totalAnalyses = userAnalyses.length;
    const averageGarScore = userAnalyses.length > 0 
      ? Math.round(userAnalyses.reduce((sum, analysis) => sum + parseFloat(analysis.garScore || '0'), 0) / userAnalyses.length)
      : 0;

    const recentAnalyses = userAnalyses
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return NextResponse.json({
      count: totalAnalyses,
      averageScore: averageGarScore,
      recentAnalyses: recentAnalyses.map(analysis => ({
        id: analysis.id,
        sport: analysis.sport,
        garScore: analysis.garScore,
        createdAt: analysis.createdAt,
        fileName: analysis.fileName
      }))
    });

  } catch (error) {
    console.error('GAR stats error:', error);
    return NextResponse.json(
      { error: 'Failed to load statistics' },
      { status: 500 }
    );
  }
}