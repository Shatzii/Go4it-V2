import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai-integration';

export async function POST(request: NextRequest) {
  try {
    const { message, teacherId, context } = await request.json();

    if (!message || !teacherId) {
      return NextResponse.json({ error: 'Message and teacher ID are required' }, { status: 400 });
    }

    const response = await generateAIResponse(teacherId, message, null, context);

    return NextResponse.json({
      success: true,
      response,
      teacherId,
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'teachers') {
      const { AI_TEACHERS } = await import('@/lib/ai-integration');
      return NextResponse.json({
        success: true,
        teachers: AI_TEACHERS,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json({ error: 'Failed to fetch AI data' }, { status: 500 });
  }
}
