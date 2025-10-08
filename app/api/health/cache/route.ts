import { NextResponse } from 'next/server';

export const runtime = 'node';
export const revalidate = 0;

export async function GET() {
  try {
    // TODO: Wire Redis/ioredis and perform a PING
    return NextResponse.json({ status: 'ok', cache: 'not-configured' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
