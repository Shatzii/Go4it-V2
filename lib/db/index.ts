import * as schema from './schema';

// Replit-friendly DB bootstrapper: SQLite in dev (file: URL) and Postgres otherwise
const DATABASE_URL = process.env.DATABASE_URL ?? 'file:./go4it-os.db';
const isSQLite = DATABASE_URL.startsWith('file:') || DATABASE_URL.startsWith('sqlite:');

let shutdown: (() => Promise<void> | void) | null = null;

// Export a unified `db` instance regardless of backend
// - SQLite: better-sqlite3
// - Postgres: postgres-js
// Note: Both imports exist to avoid dynamic import complexity in Next.js server runtime
let db: any;

if (isSQLite) {
  // SQLite (development / Replit default)
  // Strip the `file:` prefix for better-sqlite3
  const filePath = DATABASE_URL.replace(/^file:/, '');
  const fs = require('fs');
  const path = require('path');
  
  // Ensure database directory exists before creating database
  const dbDir = path.dirname(filePath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  const Database = require('better-sqlite3');
  const { drizzle } = require('drizzle-orm/better-sqlite3');
  
  // Wrap database initialization in try-catch for build time
  let sqlite;
  try {
    sqlite = new Database(filePath);
    db = drizzle(sqlite, { schema });
  } catch (error) {
    // During build time, database might not be accessible
    // Create a mock db object that will be replaced at runtime
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('Database not accessible during build, using mock');
      db = null;
    } else {
      throw error;
    }
  }

  shutdown = () => {
    try {
      if (sqlite) sqlite.close();
    } catch (_) {
      // noop
    }
  };
} else {
  // Postgres (production)
  const postgres = require('postgres');
  const { drizzle } = require('drizzle-orm/postgres-js');
  // Connection pooling configuration based on environment
  const { poolConfig } = require('../database-optimizations');
  const isProduction = process.env.NODE_ENV === 'production';
  const poolSettings = isProduction ? poolConfig.production : poolConfig.development;

  const queryClient = postgres(DATABASE_URL, {
    max: poolSettings.max,
    min: poolSettings.min,
    idle_timeout: poolSettings.idle,
    connect_timeout: poolSettings.acquire,
    max_lifetime: poolSettings.evict,
    // Enable prepared statements for better performance
    prepare: true,
    // Connection retry logic
    retry_on_release: true,
    // Health checks
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
