import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { smartContentTagger } from '@/lib/smart-content-tagging';
import { db } from '@/lib/db';
import { contentTags, userFiles } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId, filePath, fileName, fileType, userContext } = await request.json();

    if (!fileId || !filePath || !fileName || !fileType) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Analyze the content
    const analysis = await smartContentTagger.analyzeContent(
      filePath,
      fileName,
      fileType,
      userContext,
    );

    // Store analysis results in database
    const analysisData = {
      fileId,
      userId: user.id,
      primarySport: analysis.primarySport,
      secondarySports: analysis.secondarySports,
      tags: analysis.tags,
      skills: analysis.skills,
      performance: analysis.performance,
      context: analysis.context,
      suggestions: analysis.suggestions,
      autoCategories: analysis.autoCategories,
      detectedObjects: analysis.detectedObjects,
      timestamps: analysis.timestamps,
      analyzedAt: new Date(),
    };

    // Save individual tags for searchability
    for (const tag of analysis.tags) {
      await db
        .insert(contentTags)
        .values({
          userId: user.id,
          fileId,
          tagName: tag.name,
          tagCategory: tag.category,
          confidence: tag.confidence,
          relevance: tag.relevance,
          metadata: tag.metadata,
        })
        .onConflictDoUpdate({
          target: [contentTags.userId, contentTags.fileId, contentTags.tagName],
          set: {
            confidence: tag.confidence,
            relevance: tag.relevance,
            metadata: tag.metadata,
            updatedAt: new Date(),
          },
        });
    }

    return NextResponse.json({
      success: true,
      analysis: analysisData,
      message: `Content analyzed successfully. Found ${analysis.tags.length} tags and ${analysis.skills.length} skills.`,
    });
  } catch (error: any) {
    console.error('Content analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content: ' + error.message },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    const query = searchParams.get('query');
    const sport = searchParams.get('sport');
    const category = searchParams.get('category');

    if (fileId) {
      // Get analysis for specific file
      const tags = await db
        .select()
        .from(contentTags)
        .where(eq(contentTags.fileId, parseInt(fileId)))
        .orderBy(contentTags.relevance);

      return NextResponse.json({ tags });
    }

    if (query) {
      // Get tag suggestions
      const suggestions = await smartContentTagger.getTagSuggestions(query, sport || undefined);
      return NextResponse.json({ suggestions });
    }

    // Get all tags for user
    const allTags = await db
      .select()
      .from(contentTags)
      .where(eq(contentTags.userId, user.id))
      .orderBy(contentTags.relevance);

    let filteredTags = allTags;

    if (category) {
      filteredTags = filteredTags.filter((tag) => tag.tagCategory === category);
    }

    if (sport) {
      filteredTags = filteredTags.filter(
        (tag) =>
          tag.tagName.toLowerCase().includes(sport.toLowerCase()) ||
          tag.metadata?.position?.toLowerCase().includes(sport.toLowerCase()),
      );
    }

    return NextResponse.json({ tags: filteredTags });
  } catch (error: any) {
    console.error('Tag retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve tags: ' + error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');
    const fileId = searchParams.get('fileId');

    if (tagId) {
      // Delete specific tag
      await db.delete(contentTags).where(eq(contentTags.id, parseInt(tagId)));

      return NextResponse.json({ success: true, message: 'Tag deleted successfully' });
    }

    if (fileId) {
      // Delete all tags for a file
      await db.delete(contentTags).where(eq(contentTags.fileId, parseInt(fileId)));

      return NextResponse.json({ success: true, message: 'All tags deleted for file' });
    }

    return NextResponse.json({ error: 'Missing tagId or fileId' }, { status: 400 });
  } catch (error: any) {
    console.error('Tag deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete tag: ' + error.message }, { status: 500 });
  }
}
