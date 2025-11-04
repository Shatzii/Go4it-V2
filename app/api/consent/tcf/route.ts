import { NextResponse } from 'next/server';

const MAX_AGE_DAYS = 365;

export async function POST(req: Request) {
  try {
    const { tcf } = await req.json();
    if (!tcf || typeof tcf !== 'string') {
      return NextResponse.json({ error: 'Missing tcf string' }, { status: 400 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set('g4t_cmp', tcf, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + MAX_AGE_DAYS * 864e5),
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Failed to set TCF string' }, { status: 500 });
  }
}
