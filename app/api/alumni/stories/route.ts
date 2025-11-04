import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { successStories, alumniProfiles } from '@/lib/db/alumni-network-schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    const conditions = [eq(successStories.isPublished, true)];
    
    if (featured) {
      conditions.push(eq(successStories.isFeatured, true));
    }

    const stories = await db
      .select({
        id: successStories.id,
        title: successStories.title,
        content: successStories.content,
        storyType: successStories.storyType,
        sport: successStories.sport,
        images: successStories.images,
        viewCount: successStories.viewCount,
        likeCount: successStories.likeCount,
        createdAt: successStories.createdAt,
        alumniName: alumniProfiles.displayName,
        profileImage: alumniProfiles.profileImage,
      })
      .from(successStories)
      .innerJoin(alumniProfiles, eq(successStories.authorId, alumniProfiles.userId))
      .where(eq(successStories.isPublished, true))
      .orderBy(desc(successStories.viewCount))
      .limit(limit);

    return NextResponse.json({ stories });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}
