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
    const parentId = searchParams.get('parentId');
    if (!parentId) {
      return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 });
    }

    const students = db.prepare(`
      SELECT
        s.id,
        s.name,
        s.grade_level as grade,
        SUBSTR(s.name, 1, 2) as avatar,
        COALESCE(AVG(CASE WHEN sa.grade IS NOT NULL THEN
          CAST(REPLACE(sa.grade, '%', '') AS REAL) ELSE NULL END), 0) as overallProgress,
        COALESCE(AVG(CASE WHEN sa.status = 'present' THEN 100 ELSE 0 END), 0) as attendanceRate,
        MAX(COALESCE(sa.submitted_at, sa.created_at)) as lastActivity
      FROM academy_students s
      JOIN parent_student_links psl ON s.id = psl.student_id
      LEFT JOIN academy_submissions sa ON s.id = sa.student_id
      WHERE psl.parent_id = ? AND psl.can_view_grades = 1
      GROUP BY s.id, s.name, s.grade_level
      ORDER BY s.name
    `).all(parentId);

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error fetching parent students:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 */
