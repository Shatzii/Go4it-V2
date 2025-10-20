import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function GET(request: NextRequest) {
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