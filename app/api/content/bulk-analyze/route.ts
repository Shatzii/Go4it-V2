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

    const { fileIds, batchSize = 5 } = await request.json();

    if (!fileIds || !Array.isArray(fileIds)) {
      return NextResponse.json({ error: 'fileIds must be an array' }, { status: 400 });
    }

    // Get file information from database
    const files = await db
      .select()
      .from(userFiles)
      .where(eq(userFiles.userId, user.id))
      .limit(batchSize);

    const filesToAnalyze = files
      .filter((file) => fileIds.includes(file.id))
      .map((file) => ({
        id: file.id,
        path: file.filePath,
        name: file.fileName,
        type: file.fileType as 'video' | 'image' | 'document',
      }));

    if (filesToAnalyze.length === 0) {
      return NextResponse.json({ error: 'No valid files found' }, { status: 404 });
    }

    // Start bulk analysis
    const results = [];
    const errors = [];

    for (const file of filesToAnalyze) {
      try {
        const analysis = await smartContentTagger.analyzeContent(file.path, file.name, file.type);

        // Store tags in database
        for (const tag of analysis.tags) {
          await db
            .insert(contentTags)
            .values({
              userId: user.id,
              fileId: file.id,
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

        results.push({
          fileId: file.id,
          fileName: file.name,
          success: true,
          tagsCount: analysis.tags.length,
          skillsCount: analysis.skills.length,
          analysis: {
            primarySport: analysis.primarySport,
            performance: analysis.performance,
            suggestions: analysis.suggestions,
            autoCategories: analysis.autoCategories,
          },
        });
      } catch (error: any) {
        errors.push({
          fileId: file.id,
          fileName: file.name,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      errors: errors.length,
      results,
      errors,
    });
  } catch (error: any) {
    console.error('Bulk analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk analysis: ' + error.message },
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

    // Get analysis status for all user files
    const files = await db.select().from(userFiles).where(eq(userFiles.userId, user.id));

    const analysisStatus = [];

    for (const file of files) {
      const tagCount = await db
        .select()
        .from(contentTags)
        .where(eq(contentTags.fileId, file.id))
        .then((tags) => tags.length);

      analysisStatus.push({
        fileId: file.id,
        fileName: file.fileName,
        fileType: file.fileType,
        hasAnalysis: tagCount > 0,
        tagCount,
        uploadedAt: file.createdAt,
      });
    }

    return NextResponse.json({
      files: analysisStatus,
      total: files.length,
      analyzed: analysisStatus.filter((f) => f.hasAnalysis).length,
      pending: analysisStatus.filter((f) => !f.hasAnalysis).length,
    });
  } catch (error: any) {
    console.error('Bulk analysis status error:', error);
    return NextResponse.json(
      { error: 'Failed to get analysis status: ' + error.message },
      { status: 500 },
    );
  }
}
