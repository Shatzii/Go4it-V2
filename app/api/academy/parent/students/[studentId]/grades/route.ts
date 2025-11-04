import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    if (!parentId) {
      return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 });
    }

    // Verify parent has access to this student
    const accessCheck = db.prepare(`
      SELECT id FROM parent_student_links
      WHERE parent_id = ? AND student_id = ? AND can_view_grades = 1
    `).get(parentId, params.studentId);

    if (!accessCheck) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const grades = db.prepare(`
      SELECT
        sa.id,
        c.title as courseName,
        a.title as assignmentName,
        sa.grade,
        sa.points_earned as points,
        a.points_possible as maxPoints,
        ROUND((sa.points_earned * 100.0 / a.points_possible), 1) || '%' as percentage,
        sa.submitted_at as submittedAt,
        sa.feedback
      FROM academy_submissions sa
      JOIN academy_assignments a ON sa.assignment_id = a.id
      JOIN academy_courses c ON a.course_id = c.id
      WHERE sa.student_id = ? AND sa.grade IS NOT NULL
      ORDER BY sa.submitted_at DESC
    `).all(params.studentId);

    return NextResponse.json({ grades });
  } catch (error) {
    console.error('Error fetching student grades:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}