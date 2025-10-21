import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Check if group exists and get member count
    const group = db.prepare(`
      SELECT sg.max_members, COUNT(sgm.student_id) as currentMembers, sg.is_private
      FROM study_groups sg
      LEFT JOIN study_group_members sgm ON sg.id = sgm.group_id
      WHERE sg.id = ?
      GROUP BY sg.id
    `).get(params.groupId);

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (group.currentMembers >= group.max_members) {
      return NextResponse.json({ error: 'Group is full' }, { status: 400 });
    }

    // Check if student is already a member
    const existingMember = db.prepare(`
      SELECT id FROM study_group_members
      WHERE group_id = ? AND student_id = ?
    `).get(params.groupId, studentId);

    if (existingMember) {
      return NextResponse.json({ error: 'Already a member of this group' }, { status: 400 });
    }

    // Add student to group
    const insertMember = db.prepare(`
      INSERT INTO study_group_members (group_id, student_id, role)
      VALUES (?, ?, 'member')
    `);

    insertMember.run(params.groupId, studentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}