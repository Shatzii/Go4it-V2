import { NextRequest, NextResponse } from 'next/server';
import { postAttendance } from '@/lib/utils/n8n-client';

export async function POST(request: NextRequest) {
  try {
    // Optional shared-secret guard for admin tools
    const requiredKey = process.env.N8N_API_KEY;
    if (requiredKey) {
      const provided = request.headers.get('x-n8n-key');
      if (!provided || provided !== requiredKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await request.json();

    // Minimal validation based on docs/Campaign_Trigger_Map.md
    const required = ['leadId', 'email', 'eventKind', 'attended'];
    for (const key of required) {
      if (body[key] === undefined || body[key] === null) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
      }
    }

    await postAttendance(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Attendance POST failed:', err);
    return NextResponse.json({ error: err.message || 'Failed to post attendance' }, { status: 500 });
  }
}
