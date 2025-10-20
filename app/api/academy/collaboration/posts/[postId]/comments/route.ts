import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const comments = db.prepare(`
      SELECT
        cc.id,
        cc.content,
        cc.is_anonymous as isAnonymous,
        cc.created_at as createdAt,
        s.name as authorName,
        SUBSTR(s.name, 1, 2) as authorInitials,
        COUNT(DISTINCT cr.id) as likeCount
      FROM collaboration_comments cc
      LEFT JOIN academy_students s ON cc.student_id = s.id
      LEFT JOIN collaboration_reactions cr ON cc.id = cr.comment_id AND cr.reaction_type = 'like'
      WHERE cc.post_id = ? AND cc.parent_comment_id IS NULL
      GROUP BY cc.id
      ORDER BY cc.created_at ASC
    `).all(params.postId);

    // Get replies for each comment
    const commentsWithReplies = comments.map(comment => ({
      ...comment,
      replies: db.prepare(`
        SELECT
          cc.id,
          cc.content,
          cc.is_anonymous as isAnonymous,
          cc.created_at as createdAt,
          s.name as authorName,
          SUBSTR(s.name, 1, 2) as authorInitials,
          COUNT(DISTINCT cr.id) as likeCount
        FROM collaboration_comments cc
        LEFT JOIN academy_students s ON cc.student_id = s.id
        LEFT JOIN collaboration_reactions cr ON cc.id = cr.comment_id AND cr.reaction_type = 'like'
        WHERE cc.parent_comment_id = ?
        GROUP BY cc.id
        ORDER BY cc.created_at ASC
      `).all(comment.id),
    }));

    return NextResponse.json({ comments: commentsWithReplies });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { content, studentId, isAnonymous, parentCommentId } = await request.json();

    if (!content || !studentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const insertComment = db.prepare(`
      INSERT INTO collaboration_comments (post_id, student_id, content, is_anonymous, parent_comment_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insertComment.run(
      params.postId,
      studentId,
      content,
      isAnonymous ? 1 : 0,
      parentCommentId || null
    );

    return NextResponse.json({
      success: true,
      commentId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}