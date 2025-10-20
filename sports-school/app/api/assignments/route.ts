import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { insertAssignmentSchema } from '@/shared/schema';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (courseId) {
      const assignments = await storage.getAssignmentsByCourse(courseId);
      return NextResponse.json(assignments);
    }

    const assignments = await storage.getAssignments();
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = insertAssignmentSchema.parse(body);
    const assignment = await storage.createAssignment(validatedData);
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid assignment data', details: error.errors },
        { status: 400 },
      );
    }
    console.error('Error creating assignment:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}
