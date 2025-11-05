import * as schema from '../shared/schema';

// Build-time safety: return null during static generation
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

if (isBuildPhase) {
  console.log('[server/db] Build phase detected - skipping database initialization');
  // @ts-ignore - db will be null during build
  export const db = null;
} else {
  // Runtime: Use main database from lib/db
  // This ensures consistency across the application
  const { db: mainDb } = require('@/lib/db');
  export const db = mainDb;
}
