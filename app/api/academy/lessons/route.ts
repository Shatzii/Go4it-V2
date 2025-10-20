import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

// GET /api/academy/lessons?courseId=123 - Get lessons for a course
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'courseId parameter required' }, { status: 400 });
    }

    const lessons = db.prepare(`
      SELECT * FROM academy_lessons
      WHERE course_id = ?
      ORDER BY order_index ASC
    `).all(courseId);

    // Get content for each lesson
    const lessonsWithContent = lessons.map(lesson => {
      const content = db.prepare(`
        SELECT * FROM academy_lesson_content
        WHERE lesson_id = ?
        ORDER BY order_index ASC
      `).all(lesson.id);

      return {
        ...lesson,
        content: content
      };
    });

    return NextResponse.json({ lessons: lessonsWithContent });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

// POST /api/academy/lessons - Create a new lesson
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, title, description, content, orderIndex, durationMinutes } = body;

    if (!courseId || !title) {
      return NextResponse.json({ error: 'courseId and title are required' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO academy_lessons (course_id, title, description, content, order_index, duration_minutes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(courseId, title, description || '', content || '', orderIndex || 0, durationMinutes || 45);

    const lesson = db.prepare('SELECT * FROM academy_lessons WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}