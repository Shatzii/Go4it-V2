import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const messages = db.prepare(`
      SELECT
        gm.id,
        gm.content,
        gm.message_type as messageType,
        gm.file_url as fileUrl,
        gm.created_at as createdAt,
        s.name as authorName,
        SUBSTR(s.name, 1, 2) as authorInitials
      FROM group_messages gm
      LEFT JOIN academy_students s ON gm.student_id = s.id
      WHERE gm.group_id = ?
      ORDER BY gm.created_at DESC
      LIMIT 50
    `).all(params.groupId);

    // Reverse to show oldest first
    messages.reverse();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { content, studentId, messageType, fileUrl } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    if (!content && !fileUrl) {
      return NextResponse.json({ error: 'Message content or file is required' }, { status: 400 });
    }

    // Verify student is a member of the group
    const isMember = db.prepare(`
      SELECT id FROM study_group_members
      WHERE group_id = ? AND student_id = ?
    `).get(params.groupId, studentId);

    if (!isMember) {
      return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 });
    }

    const insertMessage = db.prepare(`
      INSERT INTO group_messages (group_id, student_id, content, message_type, file_url)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insertMessage.run(
      params.groupId,
      studentId,
      content || '',
      messageType || 'text',
      fileUrl || null
    );

    return NextResponse.json({
      success: true,
      messageId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}