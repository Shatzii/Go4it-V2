import { NextRequest, NextResponse } from 'next/server';


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

export async function POST(request: NextRequest) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const body = await request.json();
    const { contentId, courseId, teacherId } = body;
    if (!contentId || !teacherId) {
      return NextResponse.json(
        { error: 'Missing required fields: contentId, teacherId' },
        { status: 400 }
      );
    }

    // Update the content to mark it as approved/saved
    const update = db.prepare(`
      UPDATE ai_generated_lessons
      SET approved = 1, approved_by = ?, approved_at = CURRENT_TIMESTAMP, usage_count = usage_count + 1
      WHERE id = ? AND generated_by = ?
    `);

    const result = update.run(teacherId, contentId, teacherId);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Content not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Content saved successfully' });

  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    );
  }
}
 */
