import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { highlightReels, videos } from '../../../../lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = db
      .select({
        id: highlightReels.id,
        title: highlightReels.title,
        duration: highlightReels.duration,
        highlights: highlightReels.highlights,
        status: highlightReels.status,
        downloadUrl: highlightReels.downloadUrl,
        createdAt: highlightReels.createdAt,
        processedAt: highlightReels.processedAt,
        videoFileName: videos.fileName,
        videoSport: videos.sport,
        videoGarScore: videos.garScore,
      })
      .from(highlightReels)
      .leftJoin(videos, eq(highlightReels.videoId, videos.id))
      .orderBy(desc(highlightReels.createdAt))
      .limit(limit);

    if (userId) {
      query = query.where(eq(videos.userId, parseInt(userId)));
    }

    if (status) {
      query = query.where(eq(highlightReels.status, status));
    }

    const reels = await query;

    return NextResponse.json({
      success: true,
      highlightReels: reels
    });

  } catch (error) {
    console.error('Error fetching highlight reels:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch highlight reels' 
    }, { status: 500 });
  }
}