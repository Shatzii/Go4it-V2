import * as schema from '../shared/schema';

// Build-time safety: return null during static generation
// Check multiple conditions to ensure we skip during ANY build scenario
const isBuildPhase = 
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.SKIP_DB_INIT === 'true';

let db: any;

if (isBuildPhase) {
  console.log('[server/db] Build phase detected - skipping database initialization');
  // @ts-ignore - db will be null during build
  db = null;
} else {
  // Runtime: Use main database from lib/db
  // This ensures consistency across the application
  const { db: mainDb } = require('@/lib/db');
  db = mainDb;
}

export { db };
