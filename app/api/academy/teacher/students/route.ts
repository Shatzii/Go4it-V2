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
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    // Get all students enrolled in teacher's courses
    const students = db.prepare(`
      SELECT DISTINCT
        u.id,
        u.name,
        u.email,
        u.grade_level as grade,
        e.enrolled_at
      FROM academy_users u
      JOIN academy_enrollments e ON u.id = e.student_id
      JOIN academy_courses c ON e.course_id = c.id
      WHERE c.teacher_id = ?
      ORDER BY u.name
    `).all(teacherId);

    // Get personalization profiles for these students
    const studentIds = students.map(s => s.id);
    const profiles = studentIds.length > 0 ? db.prepare(`
      SELECT * FROM ai_personalization_profiles
      WHERE user_id IN (${studentIds.map(() => '?').join(',')})
    `).all(...studentIds) : [];

    // Combine student data with profiles
    const studentsWithProfiles = students.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      grade: student.grade,
      enrolledAt: student.enrolled_at,
      profile: profiles.find(p => p.user_id === student.id) || null,
    }));

    return NextResponse.json({ students: studentsWithProfiles });

  } catch (error) {
    console.error('Error fetching teacher students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
 */
