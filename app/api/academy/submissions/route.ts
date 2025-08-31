import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const submissionData = await req.json();
    const submission = await storage.submitAssignment(submissionData);
    return NextResponse.json({ submission });
  } catch (error) {
    logger.error('academy.submissions.error', { err: (error as Error).message });
    return NextResponse.json({ error: 'Failed to submit assignment' }, { status: 500 });
  } finally {
    logger.info('academy.submissions.done', { durationMs: Date.now() - t0 });
  }
}

export async function PATCH(req: NextRequest) {
  const t0 = Date.now();
  try {
    const { submissionId, score, feedback } = await req.json();
    const submission = await storage.gradeSubmission(submissionId, score, feedback);
    return NextResponse.json({ submission });
  } catch (error) {
    logger.error('academy.submissions.grade.error', { err: (error as Error).message });
    return NextResponse.json({ error: 'Failed to grade submission' }, { status: 500 });
  } finally {
    logger.info('academy.submissions.grade.done', { durationMs: Date.now() - t0 });
  }
}
