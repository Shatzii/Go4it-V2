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
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');

    if (!courseId || !studentId) {
      return NextResponse.json({ error: 'Course ID and Student ID are required' }, { status: 400 });
    }

    const groups = db.prepare(`
      SELECT
        sg.id,
        sg.name,
        sg.description,
        sg.max_members as maxMembers,
        sg.is_private as isPrivate,
        sg.created_at as createdAt,
        s.name as createdBy,
        COUNT(DISTINCT sgm.student_id) as memberCount,
        MAX(gm.created_at) as lastActivity,
        CASE WHEN sgm.student_id IS NOT NULL THEN 1 ELSE 0 END as isMember,
        COALESCE(sgm.role, 'member') as role
      FROM study_groups sg
      LEFT JOIN academy_students s ON sg.created_by = s.id
      LEFT JOIN study_group_members sgm ON sg.id = sgm.group_id AND sgm.student_id = ?
      LEFT JOIN group_messages gm ON sg.id = gm.group_id
      WHERE sg.course_id = ?
      GROUP BY sg.id, sgm.student_id, sgm.role
      ORDER BY sg.created_at DESC
    `).all(studentId, courseId);

    return NextResponse.json({ groups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, maxMembers, isPrivate, courseId, studentId } = await request.json();

    if (!name || !description || !courseId || !studentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Start transaction
    const insertGroup = db.prepare(`
      INSERT INTO study_groups (course_id, name, description, max_members, is_private, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertGroup.run(courseId, name, description, maxMembers, isPrivate ? 1 : 0, studentId);
    const groupId = result.lastInsertRowid;

    // Add creator as admin member
    const insertMember = db.prepare(`
      INSERT INTO study_group_members (group_id, student_id, role)
      VALUES (?, ?, 'admin')
    `);
    insertMember.run(groupId, studentId);

    return NextResponse.json({
      success: true,
      groupId,
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}