import { NextRequest, NextResponse } from 'next/server';
import { postHotLead } from '@/lib/utils/n8n-client';

export async function POST(request: NextRequest) {
  try {
    // Optional shared-secret guard for admin/automation tools
    const requiredKey = process.env.N8N_API_KEY;
    if (requiredKey) {
      const provided = request.headers.get('x-n8n-key');
      if (!provided || provided !== requiredKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await request.json();
    const { leadId, score, reason } = body || {};
    if (typeof leadId !== 'number' || typeof score !== 'number') {
      return NextResponse.json({ error: 'leadId and score must be numbers' }, { status: 400 });
    }
    await postHotLead({ leadId, score, reason });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Hot-lead webhook failed:', err);
    return NextResponse.json({ error: err.message || 'Failed to post hot-lead' }, { status: 500 });
  }
}
