import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ENROLL_FILE = path.join(DATA_DIR, 'enrollments.json');

async function readEnrollments() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(ENROLL_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeEnrollments(list: any[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ENROLL_FILE, JSON.stringify(list, null, 2), 'utf8');
}

export async function POST(req: NextRequest) {
  try {
    const { courseSlug, email, name } = await req.json();
    if (!courseSlug || !email) {
      return NextResponse.json({ error: 'Missing courseSlug or email' }, { status: 400 });
    }
    const list = await readEnrollments();
    const exists = list.find((e: any) => e.courseSlug === courseSlug && e.email === email);
    if (exists) {
      return NextResponse.json({ ok: true, alreadyEnrolled: true });
    }
    const entry = { courseSlug, email, name: name || null, timestamp: new Date().toISOString() };
    list.push(entry);
    await writeEnrollments(list);
    return NextResponse.json({ ok: true, entry });
  } catch (err: any) {
    console.error('Enroll error:', err);
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 });
  }
}
