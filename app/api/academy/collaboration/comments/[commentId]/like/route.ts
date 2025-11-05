import { NextRequest, NextResponse } from 'next/server';


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

export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const { studentId } = await request.json();
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Check if reaction already exists
    const existingReaction = db.prepare(`
      SELECT id FROM collaboration_reactions
      WHERE comment_id = ? AND student_id = ? AND reaction_type = 'like'
    `).get(params.commentId, studentId);

    if (existingReaction) {
      // Remove reaction (unlike)
      db.prepare('DELETE FROM collaboration_reactions WHERE id = ?').run(existingReaction.id);
      return NextResponse.json({ success: true, action: 'unliked' });
    } else {
      // Add reaction (like)
      db.prepare(`
        INSERT INTO collaboration_reactions (comment_id, student_id, reaction_type)
        VALUES (?, ?, 'like')
      `).run(params.commentId, studentId);
      return NextResponse.json({ success: true, action: 'liked' });
    }
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 */
