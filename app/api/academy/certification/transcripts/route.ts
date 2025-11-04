import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';
const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function GET(request: NextRequest) {
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