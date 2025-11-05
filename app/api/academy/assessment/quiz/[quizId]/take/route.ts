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
export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Check if student has already taken this quiz
    const existingAttempt = db.prepare(`
      SELECT id, completed_at FROM quiz_attempts
      WHERE quiz_id = ? AND student_id = ?
    `).get(params.quizId, studentId);

    if (existingAttempt && existingAttempt.completed_at) {
      return NextResponse.json({ error: 'Quiz already completed' }, { status: 403 });
    }

    // Get quiz details
    const quiz = db.prepare(`
      SELECT q.*, a.title as assessment_title, a.description as assessment_description,
             a.instructions, a.time_limit, a.shuffle_questions, a.shuffle_answers
      FROM assessments q
      JOIN assessments a ON q.id = a.id
      WHERE q.id = ?
    `).get(params.quizId);

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Get quiz questions
    const questions = db.prepare(`
      SELECT id, type, question, image, points, options, correct_answer
      FROM quiz_questions
      WHERE assessment_id = ?
      ORDER BY order_index
    `).all(params.quizId);

    // Shuffle questions if enabled
    let processedQuestions = questions;
    if (quiz.shuffle_questions) {
      processedQuestions = [...questions].sort(() => Math.random() - 0.5);
    }

    // Shuffle options for multiple choice questions if enabled
    if (quiz.shuffle_answers) {
      processedQuestions = processedQuestions.map(q => {
        if (q.type === 'multiple-choice' && q.options) {
          const options = JSON.parse(q.options);
          const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
          return { ...q, options: shuffledOptions };
        }
        return q;
      });
    }

    // Create or get existing attempt
    let attemptId = existingAttempt?.id;
    if (!attemptId) {
      const insertAttempt = db.prepare(`
        INSERT INTO quiz_attempts (quiz_id, student_id, started_at)
        VALUES (?, ?, datetime('now'))
      `);
      const result = insertAttempt.run(params.quizId, studentId);
      attemptId = result.lastInsertRowid;
    }

    const quizData = {
      id: quiz.id,
      title: quiz.assessment_title,
      description: quiz.assessment_description,
      instructions: quiz.instructions,
      timeLimit: quiz.time_limit,
      questions: processedQuestions.map(q => ({
        id: q.id,
        type: q.type,
        question: q.question,
        image: q.image,
        points: q.points,
        options: q.options ? JSON.parse(q.options) : null,
      })),
      shuffleQuestions: quiz.shuffle_questions,
      shuffleAnswers: quiz.shuffle_answers,
    };

    return NextResponse.json({
      quiz: quizData,
      attemptId,
    });
  } catch (error) {
    console.error('Error loading quiz:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 */
