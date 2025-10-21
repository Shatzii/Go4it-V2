import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { highlightReels, videos } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { videoId, title, duration = 60, highlights = [] } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    // Verify video exists
    const video = await db.select().from(videos).where(eq(videos.id, videoId)).limit(1);
    if (video.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Generate AI-powered highlight moments if not provided
    const highlightMoments =
      highlights.length > 0 ? highlights : await generateHighlightMoments(videoId, duration);

    // Create highlight reel record
    const newHighlightReel = await db
      .insert(highlightReels)
      .values({
        videoId,
        title: title || `Highlight Reel - ${new Date().toLocaleDateString()}`,
        duration,
        highlights: highlightMoments,
        status: 'processing',
        createdAt: new Date(),
      })
      .returning();

    // Start background processing
    processHighlightReel(newHighlightReel[0].id);

    return NextResponse.json({
      success: true,
      highlightReel: newHighlightReel[0],
      message: 'Highlight reel generation started',
    });
  } catch (error) {
    console.error('Highlight reel generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate highlight reel',
      },
      { status: 500 },
    );
  }
}

async function generateHighlightMoments(videoId: number, duration: number) {
  // AI-powered highlight detection based on GAR analysis
  // This simulates AI analysis of key performance moments
  const highlights = [
    {
      startTime: 15,
      endTime: 20,
      type: 'best_shot',
      score: 95,
      description: 'Perfect shooting form with excellent follow-through',
    },
    {
      startTime: 45,
      endTime: 52,
      type: 'agility_display',
      score: 88,
      description: 'Quick lateral movement and ball control',
    },
    {
      startTime: 78,
      endTime: 85,
      type: 'defensive_play',
      score: 92,
      description: 'Outstanding defensive positioning and steal',
    },
    {
      startTime: 120,
      endTime: 128,
      type: 'teamwork',
      score: 90,
      description: 'Excellent passing and court vision',
    },
  ];

  // Filter highlights to fit within specified duration
  const totalHighlightDuration = highlights.reduce((sum, h) => sum + (h.endTime - h.startTime), 0);

  if (totalHighlightDuration > duration) {
    // Sort by score and select top moments that fit duration
    highlights.sort((a, b) => b.score - a.score);
    const selectedHighlights = [];
    let currentDuration = 0;

    for (const highlight of highlights) {
      const segmentDuration = highlight.endTime - highlight.startTime;
      if (currentDuration + segmentDuration <= duration) {
        selectedHighlights.push(highlight);
        currentDuration += segmentDuration;
      }
    }

    return selectedHighlights;
  }

  return highlights;
}

async function processHighlightReel(highlightReelId: number) {
  // Simulate video processing
  setTimeout(async () => {
    try {
      await db
        .update(highlightReels)
        .set({
          status: 'completed',
          processedAt: new Date(),
          downloadUrl: `/api/highlight-reel/${highlightReelId}/download`,
        })
        .where(eq(highlightReels.id, highlightReelId));
    } catch (error) {
      console.error('Error updating highlight reel status:', error);
      await db
        .update(highlightReels)
        .set({ status: 'failed' })
        .where(eq(highlightReels.id, highlightReelId));
    }
  }, 5000); // 5 second processing simulation
}
