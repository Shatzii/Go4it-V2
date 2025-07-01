import { auth } from '@clerk/nextjs';
import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { userId } = auth();
  const path = params.path.join('/');
  
  const response = await fetch(`${BACKEND_URL}/api/player/${path}?${request.nextUrl.searchParams}`, {
    headers: {
      'x-user-id': userId || '',
      'cookie': request.headers.get('cookie') || '',
    }
  });
  
  return Response.json(await response.json());
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { userId } = auth();
  const path = params.path.join('/');
  const body = await request.json();
  
  const response = await fetch(`${BACKEND_URL}/api/player/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId || '',
    },
    body: JSON.stringify(body)
  });
  
  return Response.json(await response.json());
}