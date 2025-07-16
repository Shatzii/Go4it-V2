import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { videoAnalysis } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get video analysis history for the user
    const history = await db
      .select()
      .from(videoAnalysis)
      .where(eq(videoAnalysis.userId, user.id))
      .orderBy(desc(videoAnalysis.createdAt))
      .limit(50);

    return NextResponse.json({
      success: true,
      history: history.map(analysis => ({
        id: analysis.id,
        fileName: analysis.fileName,
        sport: analysis.sport,
        garScore: analysis.garScore,
        createdAt: analysis.createdAt,
        feedback: analysis.feedback,
        analysisData: analysis.analysisData
      }))
    });

  } catch (error) {
    console.error('Error fetching video analysis history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis history' },
      { status: 500 }
    );
  }
}