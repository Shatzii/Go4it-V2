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
// GET /api/academy/lessons?courseId=123 - Get lessons for a course
export async function GET(request: NextRequest) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) {
      return NextResponse.json({ error: 'courseId parameter required' }, { status: 400 });
    }

    const lessons = db.prepare(`
      SELECT * FROM academy_lessons
      WHERE course_id = ?
      ORDER BY order_index ASC
    `).all(courseId);

    // Get content for each lesson
    const lessonsWithContent = lessons.map(lesson => {
      const content = db.prepare(`
        SELECT * FROM academy_lesson_content
        WHERE lesson_id = ?
        ORDER BY order_index ASC
      `).all(lesson.id);

      return {
        ...lesson,
        content: content
      };
    });

    return NextResponse.json({ lessons: lessonsWithContent });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

// POST /api/academy/lessons - Create a new lesson
export async function POST(request: NextRequest) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const body = await request.json();
    const { courseId, title, description, content, orderIndex, durationMinutes } = body;

    if (!courseId || !title) {
      return NextResponse.json({ error: 'courseId and title are required' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO academy_lessons (course_id, title, description, content, order_index, duration_minutes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(courseId, title, description || '', content || '', orderIndex || 0, durationMinutes || 45);

    const lesson = db.prepare('SELECT * FROM academy_lessons WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
 */
