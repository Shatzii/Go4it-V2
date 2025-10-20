import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

// GET /api/academy/lessons/[lessonId]/content - Get content for a lesson
export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lessonId = params.lessonId;

    const content = db.prepare(`
      SELECT * FROM academy_lesson_content
      WHERE lesson_id = ?
      ORDER BY order_index ASC
    `).all(lessonId);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching lesson content:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson content' }, { status: 500 });
  }
}

// POST /api/academy/lessons/[lessonId]/content - Add content to a lesson
export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lessonId = params.lessonId;
    const body = await request.json();
    const { contentType, title, url, filePath, description, orderIndex } = body;

    if (!contentType) {
      return NextResponse.json({ error: 'contentType is required' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO academy_lesson_content (lesson_id, content_type, title, url, file_path, description, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(lessonId, contentType, title || '', url || '', filePath || '', description || '', orderIndex || 0);

    const content = db.prepare('SELECT * FROM academy_lesson_content WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json({ content }, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson content:', error);
    return NextResponse.json({ error: 'Failed to create lesson content' }, { status: 500 });
  }
}