import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../server/db';
import { studyHall, students } from '../../../shared/comprehensive-schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema
const StudyLogSchema = z.object({
  studentId: z.string().uuid(),
  minutes: z.number().int().min(1).max(480), // Max 8 hours
  notes: z.string().max(500).optional(),
  subject: z.string().max(100).optional(),
  location: z.string().max(100).optional()
});

/**
 * GET /api/study
 * Get study hall logs for a student
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Build query
    const conditions = [eq(studyHall.studentId, studentId)];
    
    if (startDate) {
      conditions.push(gte(studyHall.date, startDate));
    }
    
    if (endDate) {
      conditions.push(lte(studyHall.date, endDate));
    }

    // Fetch logs
    const logs = await db
      .select()
      .from(studyHall)
      .where(and(...conditions))
      .orderBy(desc(studyHall.date));

    // Calculate totals
    const totalMinutes = logs.reduce((sum, log) => sum + (log.minutes || 0), 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const avgMinutesPerDay = logs.length > 0 ? Math.round(totalMinutes / logs.length) : 0;

    // Calculate streak (consecutive days with study)
    let streak = 0;
    const sortedLogs = logs.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const today = new Date().toISOString().split('T')[0];
    if (sortedLogs.length > 0 && sortedLogs[0].date === today) {
      streak = 1;
      for (let i = 1; i < sortedLogs.length; i++) {
        const currentDate = new Date(sortedLogs[i].date);
        const previousDate = new Date(sortedLogs[i - 1].date);
        const dayDiff = Math.floor(
          (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dayDiff === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    return NextResponse.json({
      success: true,
      logs,
      stats: {
        totalMinutes,
        totalHours,
        totalSessions: logs.length,
        avgMinutesPerDay,
        streak
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch study logs', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/study
 * Log a study session
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const parsed = StudyLogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { studentId, minutes, notes, subject, location } = parsed.data;

    // Verify student exists
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if there's already a log for today
    const today = new Date().toISOString().split('T')[0];
    const [existingLog] = await db
      .select()
      .from(studyHall)
      .where(
        and(
          eq(studyHall.studentId, studentId),
          eq(studyHall.date, today)
        )
      )
      .limit(1);

    let result;
    
    if (existingLog) {
      // Update existing log (add to minutes)
      const [updated] = await db
        .update(studyHall)
        .set({
          minutes: (existingLog.minutes || 0) + minutes,
          notes: notes ? `${existingLog.notes || ''}\n${notes}`.trim() : existingLog.notes,
          updatedAt: new Date()
        })
        .where(eq(studyHall.id, existingLog.id))
        .returning();
      
      result = updated;
    } else {
      // Create new log
      const [newLog] = await db
        .insert(studyHall)
        .values({
          studentId,
          date: today,
          minutes,
          notes: notes || null,
          subject: subject || null,
          location: location || null
        })
        .returning();
      
      result = newLog;
    }

    return NextResponse.json({
      success: true,
      log: result,
      message: existingLog 
        ? `Added ${minutes} minutes to today's log` 
        : 'Study session logged successfully'
    }, { status: existingLog ? 200 : 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to log study session', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/study?id=xxx
 * Delete a study log
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const logId = searchParams.get('id');

    if (!logId) {
      return NextResponse.json(
        { error: 'Log ID is required' },
        { status: 400 }
      );
    }

    await db
      .delete(studyHall)
      .where(eq(studyHall.id, logId));

    return NextResponse.json({
      success: true,
      message: 'Study log deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete study log', details: (error as Error).message },
      { status: 500 }
    );
  }
}
