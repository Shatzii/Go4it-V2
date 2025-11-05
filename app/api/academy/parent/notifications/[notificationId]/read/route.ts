import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// TODO: This route uses raw SQLite queries and needs migration to Drizzle ORM
// Temporarily disabled during PostgreSQL migration

const MIGRATION_MESSAGE = {
  error: 'Academy feature requires database migration',
  message: 'This endpoint uses legacy SQLite and is being migrated to PostgreSQL',
  status: 'under_maintenance'
};

export async function GET(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

/* 
 * ORIGINAL CODE BELOW - NEEDS MIGRATION TO DRIZZLE ORM
 * ====================================================
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

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
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

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
 */
