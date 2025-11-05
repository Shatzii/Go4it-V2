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
    const courseId = searchParams.get('courseId');
    const filter = searchParams.get('filter') || 'all';
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    let whereClause = 'cp.course_id = ?';
    const params = [courseId];

    if (filter !== 'all') {
      whereClause += ' AND cp.type = ?';
      params.push(filter);
    }

    const posts = db.prepare(`
      SELECT
        cp.id,
        cp.title,
        cp.content,
        cp.type,
        cp.is_pinned as isPinned,
        cp.is_anonymous as isAnonymous,
        cp.created_at as createdAt,
        s.name as authorName,
        SUBSTR(s.name, 1, 2) as authorInitials,
        COUNT(DISTINCT cc.id) as commentCount,
        COUNT(DISTINCT cr.id) as likeCount
      FROM collaboration_posts cp
      LEFT JOIN academy_students s ON cp.student_id = s.id
      LEFT JOIN collaboration_comments cc ON cp.id = cc.post_id
      LEFT JOIN collaboration_reactions cr ON cp.id = cr.post_id AND cr.reaction_type = 'like'
      WHERE ${whereClause}
      GROUP BY cp.id
      ORDER BY cp.is_pinned DESC, cp.created_at DESC
    `).all(...params);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const { title, content, type, courseId, studentId, isAnonymous } = await request.json();

    if (!title || !content || !courseId || !studentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const insertPost = db.prepare(`
      INSERT INTO collaboration_posts (course_id, student_id, title, content, type, is_anonymous)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertPost.run(courseId, studentId, title, content, type, isAnonymous ? 1 : 0);

    return NextResponse.json({
      success: true,
      postId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 */
