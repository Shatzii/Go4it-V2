import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const grades = await storage.getGradesByUser(params.userId);
    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching grades by user:', error);
    return NextResponse.json({ error: 'Failed to fetch grades' }, { status: 500 });
  }
}
