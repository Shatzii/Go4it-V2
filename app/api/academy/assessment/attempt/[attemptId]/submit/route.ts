import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function POST(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { answers, timeSpent, autoSubmit } = await request.json();

    // Get attempt details
    const attempt = db.prepare(`
      SELECT qa.*, q.time_limit, q.passing_score
      FROM quiz_attempts qa
      JOIN assessments q ON qa.quiz_id = q.id
      WHERE qa.id = ?
    `).get(params.attemptId);

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    if (attempt.completed_at) {
      return NextResponse.json({ error: 'Quiz already submitted' }, { status: 400 });
    }

    // Get all questions for this quiz
    const questions = db.prepare(`
      SELECT id, type, points, correct_answer, options
      FROM quiz_questions
      WHERE assessment_id = ?
    `).all(attempt.quiz_id);

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    // Insert student answers and calculate score
    const insertAnswer = db.prepare(`
      INSERT INTO student_answers (attempt_id, question_id, answer, is_correct, points_earned)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const question of questions) {
      const studentAnswer = answers[question.id] || '';
      let isCorrect = false;
      let pointsEarned = 0;

      maxScore += question.points;

      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        isCorrect = studentAnswer.toLowerCase() === question.correct_answer.toLowerCase();
      } else if (question.type === 'short-answer') {
        // For short answer, we'll need manual grading - mark as pending for now
        isCorrect = null; // null means needs manual grading
      } else if (question.type === 'essay') {
        // Essays always need manual grading
        isCorrect = null;
      }

      if (isCorrect === true) {
        pointsEarned = question.points;
        totalScore += pointsEarned;
        correctAnswers++;
      } else if (isCorrect === false) {
        incorrectAnswers++;
      }

      insertAnswer.run(params.attemptId, question.id, studentAnswer, isCorrect, pointsEarned);
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentage >= (attempt.passing_score || 70);

    // Update attempt with results
    const updateAttempt = db.prepare(`
      UPDATE quiz_attempts
      SET completed_at = datetime('now'),
          score = ?,
          max_score = ?,
          percentage = ?,
          passed = ?,
          time_spent = ?,
          auto_submitted = ?
      WHERE id = ?
    `);

    updateAttempt.run(totalScore, maxScore, percentage, passed ? 1 : 0, timeSpent, autoSubmit ? 1 : 0, params.attemptId);

    // Generate feedback based on performance
    let feedback = '';
    if (passed) {
      if (percentage >= 90) {
        feedback = 'Excellent work! You demonstrated outstanding understanding of the material.';
      } else if (percentage >= 80) {
        feedback = 'Great job! You have a solid understanding of the material.';
      } else {
        feedback = 'Good work! You passed the quiz. Consider reviewing areas where you struggled.';
      }
    } else {
      feedback = 'You did not pass this quiz. Please review the material and try again, or consult with your instructor.';
    }

    const results = {
      score: totalScore,
      maxScore,
      percentage,
      passed,
      correctAnswers,
      incorrectAnswers,
      timeSpent,
      feedback,
      needsGrading: questions.some(q => (q.type === 'short-answer' || q.type === 'essay') && answers[q.id]),
    };

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}