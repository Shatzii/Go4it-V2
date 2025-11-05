import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// TODO: This route uses raw SQLite queries and needs migration to Drizzle ORM
// Temporarily disabled during PostgreSQL migration

const MIGRATION_MESSAGE = {
  error: 'Academy feature requires database migration',
  message: 'This endpoint uses legacy SQLite and is being migrated to PostgreSQL',
  status: 'under_maintenance'
};

export async function GET(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

/* 
 * ORIGINAL CODE BELOW - NEEDS MIGRATION TO DRIZZLE ORM
 * ====================================================
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const limit = parseInt(searchParams.get('limit') || '20');
    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    // Get recent AI-generated content for this teacher
    const content = db.prepare(`
      SELECT
        agl.id,
        agl.content,
        agl.content_type,
        agl.rating,
        agl.generated_at,
        agl.approved,
        agl.metadata,
        c.title as course_title,
        c.code as course_code
      FROM ai_generated_lessons agl
      LEFT JOIN academy_courses c ON agl.course_id = c.id
      WHERE agl.generated_by = ?
      ORDER BY agl.generated_at DESC
      LIMIT ?
    `).all(teacherId, limit);

    // Process the results
    const processedContent = content.map(item => ({
      id: item.id,
      content: item.content,
      contentType: item.content_type,
      rating: item.rating,
      approved: Boolean(item.approved),
      generatedAt: item.generated_at,
      courseTitle: item.course_title,
      courseCode: item.course_code,
      metadata: item.metadata ? JSON.parse(item.metadata) : {},
    }));

    return NextResponse.json({ content: processedContent });

  } catch (error) {
    console.error('Error fetching recent content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent content' },
      { status: 500 }
    );
  }
}
 */
