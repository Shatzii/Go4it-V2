import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const dbPath = path.join(process.cwd(), 'go4it-academy.db');
const db = new Database(dbPath);

export async function GET(request: NextRequest) {
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