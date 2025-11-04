import { NextResponse } from 'next/server';
import { z } from 'zod';

const Body = z.object({ url: z.string().url() });

export async function POST(req: Request) {
  try {
    const { url } = Body.parse(await req.json());
    const api = process.env.KUTT_URL || 'https://kutt.it';
    const key = process.env.KUTT_API_KEY;
    const domain = process.env.KUTT_DOMAIN || undefined;
    if (!key) return NextResponse.json({ error: 'Kutt not configured' }, { status: 501 });
    const res = await fetch(`${api}/api/v2/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': key },
      body: JSON.stringify({ target: url, domain }),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data?.error || 'Shorten failed' }, { status: 502 });
    return NextResponse.json({ shortUrl: data.link || data.shortUrl });
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to create shortlink' }, { status: 500 });
  }
}
