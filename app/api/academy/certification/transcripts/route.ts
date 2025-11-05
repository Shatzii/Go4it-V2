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
    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    const transcripts = db.prepare(`
      SELECT
        t.id,
        s.name as studentName,
        c.title as courseName,
        c.code as courseCode,
        t.grade,
        t.grade_points as gradePoints,
        t.credits,
        t.status,
        t.academic_year as academicYear,
        t.semester,
        t.instructor_name as instructorName
      FROM transcripts t
      JOIN academy_students s ON t.student_id = s.id
      JOIN academy_courses c ON t.course_id = c.id
      WHERE c.teacher_id = ?
      ORDER BY t.academic_year DESC, t.semester DESC, s.name
    `).all(teacherId);

    return NextResponse.json({ transcripts });
  } catch (error) {
    console.error('Error fetching transcripts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 */
