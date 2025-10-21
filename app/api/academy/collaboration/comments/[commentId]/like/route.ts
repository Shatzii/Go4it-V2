import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
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