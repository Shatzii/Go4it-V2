import { NextResponse } from 'next/server';
import { z } from 'zod';

const Body = z.object({ leadId: z.number(), answers: z.array(z.any()).default([]) });

export async function POST(req: Request) {
  try {
  Body.parse(await req.json());
    // Placeholder: integrate with PDF service or html-pdf in a serverless-safe way
    return NextResponse.json({ pdfUrl: 'TODO://eligibility.pdf' }, { status: 501 });
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to generate eligibility PDF' }, { status: 500 });
  }
}
