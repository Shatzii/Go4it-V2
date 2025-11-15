import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const COURSES_DIR = path.join(process.cwd(), 'content', 'courses');

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    const target = path.join(COURSES_DIR, `${slug}.md`);
    const raw = await fs.readFile(target, 'utf8');
    return NextResponse.json({ slug, content: raw });
  } catch (err: any) {
    console.error('Error reading course:', err);
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
}
