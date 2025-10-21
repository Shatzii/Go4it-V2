import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

// GET /api/academy/lessons/[lessonId] - Get a specific lesson
export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lessonId = params.lessonId;

    const lesson = db.prepare('SELECT * FROM academy_lessons WHERE id = ?').get(lessonId);

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Get content for the lesson
    const content = db.prepare(`
      SELECT * FROM academy_lesson_content
      WHERE lesson_id = ?
      ORDER BY order_index ASC
    `).all(lessonId);

    return NextResponse.json({
      lesson: {
        ...lesson,
        content: content
      }
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}

// PUT /api/academy/lessons/[lessonId] - Update a lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lessonId = params.lessonId;
    const body = await request.json();
    const { title, description, content, orderIndex, durationMinutes, isActive } = body;

    const result = db.prepare(`
      UPDATE academy_lessons
      SET title = ?, description = ?, content = ?, order_index = ?, duration_minutes = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, description, content, orderIndex, durationMinutes, isActive ? 1 : 0, lessonId);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const updatedLesson = db.prepare('SELECT * FROM academy_lessons WHERE id = ?').get(lessonId);

    return NextResponse.json({ lesson: updatedLesson });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

// DELETE /api/academy/lessons/[lessonId] - Delete a lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lessonId = params.lessonId;

    // Delete lesson content first
    db.prepare('DELETE FROM academy_lesson_content WHERE lesson_id = ?').run(lessonId);

    // Delete lesson progress
    db.prepare('DELETE FROM academy_lesson_progress WHERE lesson_id = ?').run(lessonId);

    // Delete the lesson
    const result = db.prepare('DELETE FROM academy_lessons WHERE id = ?').run(lessonId);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}