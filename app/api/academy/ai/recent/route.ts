import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';
const dbPath = path.join(process.cwd(), 'go4it-academy.db');
const db = new Database(dbPath);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    // Get recent AI-generated content for this teacher
    const content = db.prepare(`
      SELECT
        agl.id,
        agl.content,
        agl.content_type,
        agl.rating,
        agl.generated_at,
        agl.approved,
        agl.metadata,
        c.title as course_title,
        c.code as course_code
      FROM ai_generated_lessons agl
      LEFT JOIN academy_courses c ON agl.course_id = c.id
      WHERE agl.generated_by = ?
      ORDER BY agl.generated_at DESC
      LIMIT ?
    `).all(teacherId, limit);

    // Process the results
    const processedContent = content.map(item => ({
      id: item.id,
      content: item.content,
      contentType: item.content_type,
      rating: item.rating,
      approved: Boolean(item.approved),
      generatedAt: item.generated_at,
      courseTitle: item.course_title,
      courseCode: item.course_code,
      metadata: item.metadata ? JSON.parse(item.metadata) : {},
    }));

    return NextResponse.json({ content: processedContent });

  } catch (error) {
    console.error('Error fetching recent content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent content' },
      { status: 500 }
    );
  }
}