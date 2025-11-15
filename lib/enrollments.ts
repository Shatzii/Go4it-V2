import fs from 'fs/promises';

const FILE = 'data/enrollments.json';

export interface Enrollment {
  id: string; // session or generated id
  userId: string;
  productId: string;
  createdAt: string; // ISO
  amount?: number;
  metadata?: Record<string, any>;
}

function useDB() {
  return process.env.FEATURE_STUDIO_DB === 'true';
}

async function readFileStore(): Promise<Enrollment[]> {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeFileStore(list: Enrollment[]) {
  await fs.mkdir('data', { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2));
}

export async function listEnrollments(): Promise<Enrollment[]> {
  if (useDB()) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const storage = require('../server/storage');
      if (storage && storage.listEnrollments) return await storage.listEnrollments();
    } catch (e) {
      // fallback to file
    }
  }
  return await readFileStore();
}

export async function addEnrollment(e: Enrollment): Promise<void> {
  if (useDB()) {
    try {
      const storage = require('../server/storage');
      if (storage && storage.addEnrollment) return await storage.addEnrollment(e);
    } catch (e) {
      // fall back
    }
  }
  const list = await readFileStore();
  list.push(e);
  await writeFileStore(list);
}

export async function findEnrollmentsForUser(userId: string) {
  const list = await listEnrollments();
  return list.filter(l => l.userId === userId);
}
