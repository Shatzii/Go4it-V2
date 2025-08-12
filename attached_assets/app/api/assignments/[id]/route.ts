import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { insertAssignmentSchema } from '@/shared/schema';
import { z } from 'zod';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const assignment = await storage.getAssignmentById(params.id);
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }
    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json({ error: 'Failed to fetch assignment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validatedData = insertAssignmentSchema.partial().parse(body);
    const assignment = await storage.updateAssignment(params.id, validatedData);
    return NextResponse.json(assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid assignment data', details: error.errors }, { status: 400 });
    }
    console.error('Error updating assignment:', error);
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await storage.deleteAssignment(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}