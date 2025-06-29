import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport');
    
    if (!sport) {
      return NextResponse.json({ error: 'Sport type is required' }, { status: 400 });
    }

    // Forward to Express backend running on different port
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const userId = request.headers.get('x-user-id');
    
    const response = await fetch(`${backendUrl}/api/skill-tree/nodes?sport=${sport}`, {
      headers: {
        'x-user-id': userId || '',
        'cookie': request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend response: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching skill nodes:', error);
    return NextResponse.json({ error: 'Failed to fetch skill nodes' }, { status: 500 });
  }
}