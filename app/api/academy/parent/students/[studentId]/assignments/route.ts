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
export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    if (!parentId) {
      return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 });
    }

    // Verify parent has access to this student
    const accessCheck = db.prepare(`
      SELECT id FROM parent_student_links
      WHERE parent_id = ? AND student_id = ? AND can_view_assignments = 1
    `).get(parentId, params.studentId);

    if (!accessCheck) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const assignments = db.prepare(`
      SELECT
        a.id,
        c.title as courseName,
        a.title,
        a.description,
        a.due_date as dueDate,
        CASE
          WHEN sa.id IS NOT NULL AND sa.grade IS NOT NULL THEN 'graded'
          WHEN sa.id IS NOT NULL THEN 'submitted'
          WHEN datetime('now') > datetime(a.due_date) THEN 'overdue'
          ELSE 'pending'
        END as status,
        sa.grade,
        sa.submitted_at as submittedAt
      FROM academy_assignments a
      JOIN academy_courses c ON a.course_id = c.id
      LEFT JOIN academy_submissions sa ON a.id = sa.assignment_id AND sa.student_id = ?
      WHERE a.course_id IN (
        SELECT course_id FROM academy_enrollments WHERE student_id = ?
      )
      ORDER BY a.due_date ASC
    `).all(params.studentId, params.studentId);

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 */
