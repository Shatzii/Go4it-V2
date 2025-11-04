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
    const parentId = searchParams.get('parentId');

    if (!parentId) {
      return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 });
    }

    const notifications = db.prepare(`
      SELECT
        pn.id,
        pn.type,
        pn.title,
        pn.message,
        pn.is_read as isRead,
        pn.created_at as createdAt,
        s.name as studentName
      FROM parent_notifications pn
      LEFT JOIN academy_students s ON pn.student_id = s.id
      WHERE pn.parent_id = ?
      ORDER BY pn.created_at DESC
      LIMIT 50
    `).all(parentId);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching parent notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const { parentId } = await request.json();

    if (!parentId) {
      return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 });
    }

    // Verify notification belongs to parent
    const notification = db.prepare(`
      SELECT id FROM parent_notifications
      WHERE id = ? AND parent_id = ?
    `).get(params.notificationId, parentId);

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Mark as read
    db.prepare(`
      UPDATE parent_notifications
      SET is_read = 1
      WHERE id = ?
    `).run(params.notificationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}