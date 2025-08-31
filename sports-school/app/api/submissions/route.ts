import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { insertSubmissionSchema } from '@/shared/schema';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const userId = searchParams.get('userId');

    if (assignmentId) {
      const submissions = await storage.getSubmissionsByAssignment(assignmentId);
      return NextResponse.json(submissions);
    }

    if (userId) {
      const submissions = await storage.getSubmissionsByUser(userId);
      return NextResponse.json(submissions);
    }

    const submissions = await storage.getSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = insertSubmissionSchema.parse(body);
    const submission = await storage.createSubmission(validatedData);
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: error.errors },
        { status: 400 },
      );
    }
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
