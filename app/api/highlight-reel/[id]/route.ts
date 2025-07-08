import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { highlightReels, videos } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid highlight reel ID' }, { status: 400 });
    }

    const highlightReel = await db
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
      .where(eq(highlightReels.id, id))
      .limit(1);

    if (highlightReel.length === 0) {
      return NextResponse.json({ error: 'Highlight reel not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      highlightReel: highlightReel[0]
    });

  } catch (error) {
    console.error('Error fetching highlight reel:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch highlight reel' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid highlight reel ID' }, { status: 400 });
    }

    const deletedReel = await db
      .delete(highlightReels)
      .where(eq(highlightReels.id, id))
      .returning();

    if (deletedReel.length === 0) {
      return NextResponse.json({ error: 'Highlight reel not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Highlight reel deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting highlight reel:', error);
    return NextResponse.json({ 
      error: 'Failed to delete highlight reel' 
    }, { status: 500 });
  }
}