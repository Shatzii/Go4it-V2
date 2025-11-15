// Manual GAR score storage and approval
import fs from 'fs/promises';

const GAR_FILE = 'data/gar-scores.json';

export interface GARScore {
  id: string; // enrollment or user id
  score: number;
  submittedBy: string;
  approved: boolean;
  approvedBy?: string;
  timestamp: string;
}

function shouldUseDB() {
  return process.env.FEATURE_STUDIO_DB === 'true';
}

async function readFileStore(): Promise<GARScore[]> {
  try {
    const raw = await fs.readFile(GAR_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeFileStore(list: GARScore[]) {
  await fs.mkdir('data', { recursive: true });
  await fs.writeFile(GAR_FILE, JSON.stringify(list, null, 2));
}

export async function listGARScores(): Promise<GARScore[]> {
  if (shouldUseDB()) {
    try {
      // try to proxy to server/storage if available
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const storage = require('../server/storage');
      if (storage && storage.listGARScores) return await storage.listGARScores();
    } catch (e) {
      // fall back to file
    }
  }
  return await readFileStore();
}

export async function addGARScore(entry: GARScore): Promise<void> {
  if (shouldUseDB()) {
    try {
      const storage = require('../server/storage');
      if (storage && storage.addGARScore) return await storage.addGARScore(entry);
    } catch (e) {
      // fall back
    }
  }
  const scores = await readFileStore();
  scores.push(entry);
  await writeFileStore(scores);
}

export async function approveGARScore(id: string, adminId: string): Promise<boolean> {
  if (shouldUseDB()) {
    try {
      const storage = require('../server/storage');
      if (storage && storage.approveGARScore) return await storage.approveGARScore(id, adminId);
    } catch (e) {
      // fall back
    }
  }
  const scores = await readFileStore();
  const idx = scores.findIndex((s) => s.id === id && !s.approved);
  if (idx === -1) return false;
  scores[idx].approved = true;
  scores[idx].approvedBy = adminId;
  await writeFileStore(scores);
  return true;
}
