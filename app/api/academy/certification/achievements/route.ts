import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    const achievements = db.prepare(`
      SELECT
        aa.id,
        s.name as studentName,
        aa.title,
        aa.description,
        aa.achievement_type as achievementType,
        aa.awarded_date as awardedDate,
        aa.academic_year as academicYear,
        aa.semester
      FROM academic_achievements aa
      JOIN academy_students s ON aa.student_id = s.id
      WHERE aa.awarded_by = ?
      ORDER BY aa.awarded_date DESC
    `).all(teacherId);

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}