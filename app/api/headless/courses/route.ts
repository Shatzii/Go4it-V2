import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const COURSES_DIR = path.join(process.cwd(), 'content', 'courses');

function extractTitleAndExcerpt(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  let title = '';
  let excerpt = '';
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!title && l.startsWith('# ')) {
      title = l.replace(/^#\s+/, '').trim();
      continue;
    }
    if (title && l) {
      excerpt = l;
      break;
    }
  }
  return { title: title || 'Untitled Course', excerpt: excerpt || '' };
}

export async function GET() {
  try {
    const files = await fs.readdir(COURSES_DIR);
    const courses: any[] = [];
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, '');
      const full = path.join(COURSES_DIR, file);
      const raw = await fs.readFile(full, 'utf8');
      const { title, excerpt } = extractTitleAndExcerpt(raw);
      courses.push({ slug, title, excerpt });
    }
    return NextResponse.json(courses);
  } catch (err: any) {
    console.error('Error reading courses:', err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, content } = body;
    if (!slug || !content) {
      return NextResponse.json({ error: 'Missing slug or content' }, { status: 400 });
    }
    if (!/^[a-z0-9\-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug. Use lower-case letters, numbers and hyphens only.' }, { status: 400 });
    }
    const target = path.join(COURSES_DIR, `${slug}.md`);
    await fs.mkdir(COURSES_DIR, { recursive: true });
    await fs.writeFile(target, content, 'utf8');
    return NextResponse.json({ ok: true, slug });
  } catch (err: any) {
    console.error('Error creating course:', err);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
