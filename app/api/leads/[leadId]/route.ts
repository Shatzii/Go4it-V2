import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema/funnel';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: { leadId: string } }) {
  try {
    const idNum = Number(params.leadId);
    if (!Number.isFinite(idNum)) {
      return NextResponse.json({ error: 'Invalid leadId' }, { status: 400 });
    }
    const body = await request.json();
    if (!body?.stage || typeof body.stage !== 'string') {
      return NextResponse.json({ error: 'Missing stage' }, { status: 400 });
    }

    await db.update(leads).set({ stage: body.stage, updatedAt: new Date() }).where(eq(leads.id, idNum));
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Lead stage update failed:', err);
    return NextResponse.json({ error: err.message || 'Failed to update lead' }, { status: 500 });
  }
}
