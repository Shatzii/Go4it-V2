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
// GET /api/academy/lessons/[lessonId]/content - Get content for a lesson

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const lessonId = params.lessonId;
    const content = db.prepare(`
      SELECT * FROM academy_lesson_content
      WHERE lesson_id = ?
      ORDER BY order_index ASC
    `).all(lessonId);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching lesson content:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson content' }, { status: 500 });
  }
}

// POST /api/academy/lessons/[lessonId]/content - Add content to a lesson
export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const lessonId = params.lessonId;
    const body = await request.json();
    const { contentType, title, url, filePath, description, orderIndex } = body;

    if (!contentType) {
      return NextResponse.json({ error: 'contentType is required' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO academy_lesson_content (lesson_id, content_type, title, url, file_path, description, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(lessonId, contentType, title || '', url || '', filePath || '', description || '', orderIndex || 0);

    const content = db.prepare('SELECT * FROM academy_lesson_content WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json({ content }, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson content:', error);
    return NextResponse.json({ error: 'Failed to create lesson content' }, { status: 500 });
  }
}
 */
