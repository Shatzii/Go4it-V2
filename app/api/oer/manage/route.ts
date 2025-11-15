import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requireRole } from '@/lib/auth';

const CATALOG = 'content/oer/catalog.json';

export async function GET() {
  try {
    const raw = await fs.readFile(CATALOG, 'utf8');
    const json = JSON.parse(raw);
    return Response.json(json);
  } catch (e) {
    return Response.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole('teacher');
  } catch (err) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { id, slug, title, price, summary, content } = body;
  if (!id || !slug || !title) return Response.json({ error: 'Missing fields' }, { status: 400 });

  // read catalog
  let catalog: any[] = [];
  try {
    const raw = await fs.readFile(CATALOG, 'utf8');
    catalog = JSON.parse(raw);
  } catch (e) {
    catalog = [];
  }

  // upsert
  const existingIndex = catalog.findIndex(c => c.id === id || c.slug === slug);
  const contentPath = `content/oer/${slug}.md`;
  const entry = { id, slug, title, price: Number(price || 0), summary: summary || '', contentPath };
  if (existingIndex >= 0) {
    catalog[existingIndex] = entry;
  } else {
    catalog.push(entry);
  }

  // write catalog and content
  await fs.mkdir(path.dirname(CATALOG), { recursive: true });
  await fs.writeFile(CATALOG, JSON.stringify(catalog, null, 2));
  if (typeof content === 'string') {
    await fs.writeFile(contentPath, content, 'utf8');
  }

  return Response.json(catalog);
}
