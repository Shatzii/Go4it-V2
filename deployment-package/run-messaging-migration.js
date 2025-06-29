/**
 * Runner script for Messaging migration
 * 
 * This script executes the migration to create the messaging tables in the database.
 */

import dotenv from 'dotenv';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting messaging tables migration runner...');

const result = spawnSync('npx', ['tsx', 'migrations/messaging_tables_creation.ts'], {
  stdio: 'inherit',
  env: process.env
});

if (result.error) {
  console.error('Error executing migration:', result.error);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(`Migration process exited with code ${result.status}`);
  process.exit(result.status);
}

console.log('Migration completed successfully!');