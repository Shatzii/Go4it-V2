import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { logger } from '@/lib/logger';

export async function GET(_req: NextRequest) {
  const t0 = Date.now();
  try {
    await storage.ensureSeedCourses();
    const courses = await storage.listCourses();
    return NextResponse.json({ courses });
  } catch (error) {
    logger.error('academy.courses.error', { err: (error as Error).message });
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  } finally {
    logger.info('academy.courses.fetch', { durationMs: Date.now() - t0 });
  }
}
