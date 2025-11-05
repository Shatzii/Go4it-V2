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

export async function GET(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    // Get attempt details with quiz info
    const attempt = db.prepare(`
      SELECT qa.*, q.title as quiz_title, q.description as quiz_description,
             c.title as course_title, s.name as student_name
      FROM quiz_attempts qa
      JOIN assessments q ON qa.quiz_id = q.id
      JOIN academy_courses c ON q.course_id = c.id
      JOIN academy_students s ON qa.student_id = s.id
      WHERE qa.id = ?
    `).get(params.attemptId);
    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    // Get student answers with question details
    const answers = db.prepare(`
      SELECT sa.*, qq.question, qq.type, qq.points, qq.correct_answer, qq.options
      FROM student_answers sa
      JOIN quiz_questions qq ON sa.question_id = qq.id
      WHERE sa.attempt_id = ?
      ORDER BY qq.order_index
    `).all(params.attemptId);

    // Process answers for display
    const processedAnswers = answers.map(answer => ({
      id: answer.id,
      question: answer.question,
      type: answer.type,
      points: answer.points,
      maxPoints: answer.points,
      earnedPoints: answer.points_earned,
      studentAnswer: answer.answer,
      correctAnswer: answer.correct_answer,
      options: answer.options ? JSON.parse(answer.options) : null,
      isCorrect: answer.is_correct,
      needsGrading: answer.is_correct === null,
    }));

    const results = {
      attempt: {
        id: attempt.id,
        quizTitle: attempt.quiz_title,
        quizDescription: attempt.quiz_description,
        courseTitle: attempt.course_title,
        studentName: attempt.student_name,
        startedAt: attempt.started_at,
        completedAt: attempt.completed_at,
        score: attempt.score,
        maxScore: attempt.max_score,
        percentage: attempt.percentage,
        passed: attempt.passed === 1,
        timeSpent: attempt.time_spent,
        autoSubmitted: attempt.auto_submitted === 1,
      },
      answers: processedAnswers,
      summary: {
        totalQuestions: answers.length,
        correctAnswers: answers.filter(a => a.is_correct === 1).length,
        incorrectAnswers: answers.filter(a => a.is_correct === 0).length,
        needsGrading: answers.filter(a => a.is_correct === null).length,
        totalScore: attempt.score,
        maxScore: attempt.max_score,
        percentage: attempt.percentage,
      },
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const { grades } = await request.json();

    // Update grades for manually graded questions
    const updateGrade = db.prepare(`
      UPDATE student_answers
      SET points_earned = ?, is_correct = ?
      WHERE id = ? AND attempt_id = ?
    `);

    let totalScore = 0;
    let maxScore = 0;

    for (const grade of grades) {
      const isCorrect = grade.pointsEarned > 0 ? 1 : 0;
      updateGrade.run(grade.pointsEarned, isCorrect, grade.answerId, params.attemptId);

      totalScore += grade.pointsEarned;
      maxScore += grade.maxPoints;
    }

    // Recalculate attempt totals
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    // Get quiz passing score
    const quiz = db.prepare(`
      SELECT passing_score FROM assessments
      WHERE id = (SELECT quiz_id FROM quiz_attempts WHERE id = ?)
    `).get(params.attemptId);

    const passed = percentage >= (quiz?.passing_score || 70);

    // Update attempt
    const updateAttempt = db.prepare(`
      UPDATE quiz_attempts
      SET score = ?, percentage = ?, passed = ?
      WHERE id = ?
    `);

    updateAttempt.run(totalScore, percentage, passed ? 1 : 0, params.attemptId);

    return NextResponse.json({
      success: true,
      newScore: totalScore,
      newPercentage: percentage,
      passed,
    });
  } catch (error) {
    console.error('Error updating grades:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 */
