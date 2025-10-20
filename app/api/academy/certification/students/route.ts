import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    const students = db.prepare(`
      SELECT DISTINCT
        s.id,
        s.name,
        s.grade_level as grade
      FROM academy_students s
      JOIN academy_enrollments e ON s.id = e.student_id
      JOIN academy_courses c ON e.course_id = c.id
      WHERE c.teacher_id = ?
      ORDER BY s.name
    `).all(teacherId);

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}