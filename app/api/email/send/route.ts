import { NextRequest, NextResponse } from 'next/server';
import { sendEmailNodemailer } from '@/lib/sendEmailNodemailer';

export async function POST(req: NextRequest) {
  const { to, subject, text, html, from } = await req.json();
  if (!to || !subject || (!text && !html)) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const info = await sendEmailNodemailer({ to, subject, text, html, from });
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
