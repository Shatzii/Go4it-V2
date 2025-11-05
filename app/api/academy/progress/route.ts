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
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get student's enrolled courses
    const enrolledCourses = db.prepare(`
      SELECT DISTINCT
        c.id as courseId,
        c.title as courseTitle,
        c.code as courseCode,
        c.description,
        e.enrolled_at
      FROM academy_courses c
      JOIN academy_enrollments e ON c.id = e.course_id
      WHERE e.student_id = ?
      ORDER BY e.enrolled_at DESC
    `).all(userId) as any[];

    const courses = [];

    for (const course of enrolledCourses) {
      // Get lesson progress
      const lessonProgress = db.prepare(`
        SELECT
          COUNT(CASE WHEN sp.completed = 1 THEN 1 END) as completed,
          COUNT(*) as total
        FROM academy_lessons l
        LEFT JOIN student_progress sp ON l.id = sp.lesson_id AND sp.student_id = ?
        WHERE l.course_id = ?
      `).get(userId, course.courseId) as { completed: number; total: number };

      // Get assignment progress
      const assignmentProgress = db.prepare(`
        SELECT
          COUNT(CASE WHEN s.submitted_at IS NOT NULL THEN 1 END) as completed,
          COUNT(*) as total
        FROM academy_assignments a
        LEFT JOIN academy_submissions s ON a.id = s.assignment_id AND s.student_id = ?
        WHERE a.course_id = ?
      `).get(userId, course.courseId) as { completed: number; total: number };

      // Calculate overall progress
      const totalItems = lessonProgress.total + assignmentProgress.total;
      const completedItems = lessonProgress.completed + assignmentProgress.completed;
      const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

      // Get current grade (average of graded assignments)
      const gradeData = db.prepare(`
        SELECT
          AVG(CASE WHEN gr.points_earned IS NOT NULL THEN (gr.points_earned / a.points) * 100 ELSE NULL END) as avgGrade
        FROM academy_assignments a
        LEFT JOIN grade_reports gr ON a.id = gr.assignment_id AND gr.student_id = ?
        WHERE a.course_id = ?
      `).get(userId, course.courseId) as { avgGrade: number | null };

      const currentGrade = gradeData.avgGrade || 0;

      // Get time spent (from progress records)
      const timeSpent = db.prepare(`
        SELECT COALESCE(SUM(sp.time_spent_minutes), 0) as totalTime
        FROM student_progress sp
        JOIN academy_lessons l ON sp.lesson_id = l.id
        WHERE sp.student_id = ? AND l.course_id = ?
      `).get(userId, course.courseId) as { totalTime: number };

      // Get last activity
      const lastActivity = db.prepare(`
        SELECT MAX(last_accessed) as lastActivity
        FROM student_progress sp
        JOIN academy_lessons l ON sp.lesson_id = l.id
        WHERE sp.student_id = ? AND l.course_id = ?
      `).get(userId, course.courseId) as { lastActivity: string | null };

      // Get grade history
      const gradeHistory = db.prepare(`
        SELECT
          a.title as assignment,
          gr.points_earned as grade,
          a.points as maxPoints,
          gr.graded_at as date
        FROM grade_reports gr
        JOIN academy_assignments a ON gr.assignment_id = a.id
        WHERE gr.student_id = ? AND a.course_id = ?
        ORDER BY gr.graded_at DESC
        LIMIT 10
      `).all(userId, course.courseId) as any[];

      courses.push({
        courseId: course.courseId,
        courseTitle: course.courseTitle,
        courseCode: course.courseCode,
        overallProgress: Math.round(overallProgress * 10) / 10,
        lessonsCompleted: lessonProgress.completed,
        totalLessons: lessonProgress.total,
        assignmentsCompleted: assignmentProgress.completed,
        totalAssignments: assignmentProgress.total,
        currentGrade: Math.round(currentGrade * 10) / 10,
        letterGrade: getLetterGrade(currentGrade),
        timeSpent: timeSpent.totalTime,
        lastActivity: lastActivity.lastActivity || course.enrolled_at,
        gradeHistory: gradeHistory.map(g => ({
          assignment: g.assignment,
          grade: g.grade,
          maxPoints: g.maxPoints,
          date: g.date,
        })),
      });
    }

    return NextResponse.json({ courses });

  } catch (error) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    );
  }
}

function getLetterGrade(percentage: number): string {
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
}
 */
