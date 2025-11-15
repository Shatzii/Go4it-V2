import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'gar-scores.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.stat(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]), 'utf-8');
  }
}

export async function GET() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  const data = JSON.parse(raw || '[]');
  return new Response(JSON.stringify({ scores: data }), { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { entityType, entityId, score, components, actor } = body;
  if (!entityType || !entityId || typeof score !== 'number') {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  const data = JSON.parse(raw || '[]');

  const existingIndex = data.findIndex((d: any) => d.entityType === entityType && d.entityId === entityId);
  const entry = {
    entityType,
    entityId,
    score,
    components: components || null,
    actor: actor || 'unknown',
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) data[existingIndex] = entry; else data.push(entry);

  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  return new Response(JSON.stringify({ ok: true, entry }), { status: 200 });
}
