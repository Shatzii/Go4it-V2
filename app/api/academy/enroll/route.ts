import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Implement academy enrollment logic
    return NextResponse.json({
      success: true,
      message: 'Enrollment request received',
      data: body
    });
  } catch (error) {
    console.error('Academy enrollment error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Academy enrollment API endpoint',
    methods: ['POST']
  });
}