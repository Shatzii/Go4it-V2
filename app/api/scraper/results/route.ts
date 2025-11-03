import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scraperResults } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';

// GET /api/scraper/results - Fetch scraper results
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = db.select().from(scraperResults);

    if (source) {
      query = query.where(eq(scraperResults.source, source)) as any;
    }

    const results = await query.limit(limit).orderBy(scraperResults.createdAt);

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    logger.error('Failed to fetch scraper results', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch scraper results',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/scraper/results - Save scraper results
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, athleteData, metadata } = body;

    if (!source || !athleteData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: source, athleteData',
        },
        { status: 400 }
      );
    }

    // Insert scraper results
    const result = await db.insert(scraperResults).values({
      source,
      athleteData,
      metadata: metadata || {},
      createdAt: new Date(),
    }).returning();

    logger.info('Saved scraper results', {
      source,
      resultId: result[0]?.id,
      athleteCount: Array.isArray(athleteData) ? athleteData.length : 1,
    });

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Scraper results saved successfully',
    });
  } catch (error) {
    logger.error('Failed to save scraper results', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save scraper results',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/scraper/results - Delete scraper results
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing result ID',
        },
        { status: 400 }
      );
    }

    await db.delete(scraperResults).where(eq(scraperResults.id, parseInt(id)));

    logger.info('Deleted scraper result', { id });

    return NextResponse.json({
      success: true,
      message: 'Scraper result deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete scraper result', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete scraper result',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
