import * as schema from './schema';

// Database configuration - use PostgreSQL by default, SQLite only for local dev
const DATABASE_URL = process.env.DATABASE_URL;
const isSQLite = DATABASE_URL?.startsWith('file:') || DATABASE_URL?.startsWith('sqlite:');

let shutdown: (() => Promise<void> | void) | null = null;

// Export a unified `db` instance
let db: any;

// Skip database initialization during build phase
// Check multiple conditions to ensure we skip during ANY build scenario
const isBuildPhase = 
  process.env.NEXT_PHASE === 'phase-production-build' || 
  process.env.SKIP_DB_INIT === 'true' ||
  typeof window !== 'undefined'; // Never init on client-side

if (isBuildPhase) {
  console.log('Build phase detected - skipping database initialization');
  db = null;
} else if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  throw new Error('DATABASE_URL must be configured. Set it to your PostgreSQL connection string.');
} else if (isSQLite) {
  // SQLite (local development only)
  const filePath = DATABASE_URL.replace(/^file:/, '');
  const fs = require('fs');
  const path = require('path');
  
  const dbDir = path.dirname(filePath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  const Database = require('better-sqlite3');
  const { drizzle } = require('drizzle-orm/better-sqlite3');
  
  const sqlite = new Database(filePath);
  db = drizzle(sqlite, { schema });

  shutdown = () => {
    try {
      sqlite.close();
    } catch (_) {
      // noop
    }
  };
} else {
  // PostgreSQL (production and staging)
  const postgres = require('postgres');
  const { drizzle } = require('drizzle-orm/postgres-js');
  
  // Connection pooling configuration
  const { poolConfig } = require('../database-optimizations');
  const isProduction = process.env.NODE_ENV === 'production';
  const poolSettings = isProduction ? poolConfig.production : poolConfig.development;

  const queryClient = postgres(DATABASE_URL, {
    max: poolSettings.max,
    min: poolSettings.min,
    idle_timeout: poolSettings.idle,
    connect_timeout: poolSettings.acquire,
    max_lifetime: poolSettings.evict,
    prepare: true,
    retry_on_release: true,
    keep_alive: 60,
  });

  db = drizzle(queryClient, { schema });

  shutdown = async () => {
    try {
      await queryClient.end();
    } catch (_) {
      // noop
    }
  };
}

export { db };

// Graceful shutdown (works for either backend)
process.on('SIGINT', async () => {
  if (shutdown) await shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (shutdown) await shutdown();
  process.exit(0);
});
