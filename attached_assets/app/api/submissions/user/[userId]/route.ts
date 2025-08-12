import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const submissions = await storage.getSubmissionsByUser(params.userId);
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions by user:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}