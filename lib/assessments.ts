import fs from 'fs/promises';

const FILE = 'data/assessments.json';

export interface Assessment {
  id: string;
  userId: string;
  paidAt: string; // ISO
  zoomAddon?: boolean;
}

function useDB() {
  return process.env.FEATURE_STUDIO_DB === 'true';
}

async function readFileStore(): Promise<Assessment[]> {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeFileStore(list: Assessment[]) {
  await fs.mkdir('data', { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2));
}

export async function listAssessments(): Promise<Assessment[]> {
  if (useDB()) {
    try {
      // lightweight optional proxy to server/storage if available
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const storage = require('../server/storage');
      if (storage && storage.listAssessments) return await storage.listAssessments();
    } catch (e) {
      // fall back to file
    }
  }
  return await readFileStore();
}

export async function addAssessment(a: Assessment): Promise<void> {
  if (useDB()) {
    try {
      const storage = require('../server/storage');
      if (storage && storage.addAssessment) return await storage.addAssessment(a);
    } catch (e) {
      // fall back
    }
  }
  const list = await readFileStore();
  list.push(a);
  await writeFileStore(list);
}

export async function findLatestAssessmentForUser(userId: string) {
  const list = await listAssessments();
  const filtered = list.filter(l => l.userId === userId).sort((a,b) => +new Date(b.paidAt) - +new Date(a.paidAt));
  return filtered[0] || null;
}
