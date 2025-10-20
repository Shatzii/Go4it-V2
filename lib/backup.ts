// Enterprise Database Backup System
// Production-ready backup and restore functionality

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { db } from '../db';
import { logger } from '../logger';

const execAsync = promisify(exec);

export interface BackupMetadata {
  id: string;
  timestamp: string;
  status: 'in_progress' | 'completed' | 'failed';
  size?: number;
  duration?: number;
  path?: string;
  checksum?: string;
  tables?: string[];
  error?: string;
}

export interface BackupConfig {
  retentionDays: number;
  backupDir: string;
  maxConcurrentBackups: number;
  compressionLevel: number;
  includeSchema: boolean;
  excludeTables?: string[];
}

const defaultConfig: BackupConfig = {
  retentionDays: 30,
  backupDir: process.env.BACKUP_DIR || './backups',
  maxConcurrentBackups: 1,
  compressionLevel: 6,
  includeSchema: true,
  excludeTables: ['audit_events'], // Don't backup audit logs
};

export class DatabaseBackupManager {
  private config: BackupConfig;
  private activeBackups: Set<string> = new Set();

  constructor(config: Partial<BackupConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async createDatabaseBackup(): Promise<BackupMetadata> {
    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    try {
      // Check concurrent backup limit
      if (this.activeBackups.size >= this.config.maxConcurrentBackups) {
        throw new Error('Maximum concurrent backups reached');
      }

      this.activeBackups.add(backupId);

      // Create backup directory
      await fs.mkdir(this.config.backupDir, { recursive: true });

      const backupPath = path.join(this.config.backupDir, `${backupId}.sql`);
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp: new Date().toISOString(),
        status: 'in_progress',
        path: backupPath,
      };

      logger.info('backup.started', { backupId });

      // Create PostgreSQL dump
      const dumpCommand = this.buildDumpCommand(backupPath);
      await execAsync(dumpCommand);

      // Calculate file size and checksum
      const stats = await fs.stat(backupPath);
      const checksum = await this.calculateChecksum(backupPath);

      metadata.size = stats.size;
      metadata.duration = Date.now() - startTime;
      metadata.checksum = checksum;
      metadata.status = 'completed';

      // Save metadata
      await this.saveBackupMetadata(metadata);

      // Cleanup old backups
      await this.cleanupOldBackups();

      logger.info('backup.completed', {
        backupId,
        size: metadata.size,
        duration: metadata.duration,
      });

      return metadata;

    } catch (error) {
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: (error as Error).message,
        duration: Date.now() - startTime,
      };

      await this.saveBackupMetadata(metadata);
      logger.error('backup.failed', { backupId, error: (error as Error).message });

      throw error;
    } finally {
      this.activeBackups.delete(backupId);
    }
  }

  async restoreFromBackup(backupId: string): Promise<boolean> {
    try {
      const metadata = await this.getBackupMetadata(backupId);
      if (!metadata || metadata.status !== 'completed') {
        throw new Error('Backup not found or not completed');
      }

      logger.info('restore.started', { backupId });

      // Create restore command
      const restoreCommand = this.buildRestoreCommand(metadata.path!);
      await execAsync(restoreCommand);

      logger.info('restore.completed', { backupId });

      return true;
    } catch (error) {
      logger.error('restore.failed', { backupId, error: (error as Error).message });
      throw error;
    }
  }

  async listBackups(): Promise<BackupMetadata[]> {
    try {
      const metadataDir = path.join(this.config.backupDir, 'metadata');
      await fs.mkdir(metadataDir, { recursive: true });

      const files = await fs.readdir(metadataDir);
      const backups: BackupMetadata[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const content = await fs.readFile(path.join(metadataDir, file), 'utf-8');
            const metadata: BackupMetadata = JSON.parse(content);
            backups.push(metadata);
          } catch (error) {
            logger.warn('backup.metadata_corrupted', { file, error: (error as Error).message });
          }
        }
      }

      return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      logger.error('backup.list_failed', { error: (error as Error).message });
      return [];
    }
  }

  private buildDumpCommand(outputPath: string): string {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    const host = dbUrl.hostname;
    const port = dbUrl.port || '5432';
    const database = dbUrl.pathname.slice(1);
    const username = dbUrl.username;
    const password = dbUrl.password;

    let command = `pg_dump --host=${host} --port=${port} --username=${username} --dbname=${database}`;

    if (this.config.includeSchema) {
      command += ' --schema-only';
    } else {
      command += ' --data-only';
    }

    if (this.config.excludeTables && this.config.excludeTables.length > 0) {
      for (const table of this.config.excludeTables) {
        command += ` --exclude-table=${table}`;
      }
    }

    command += ` --compress=${this.config.compressionLevel}`;
    command += ` --file=${outputPath}`;
    command += ` --format=custom`; // Custom format for better compression

    // Set password environment variable
    process.env.PGPASSWORD = password;

    return command;
  }

  private buildRestoreCommand(backupPath: string): string {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    const host = dbUrl.hostname;
    const port = dbUrl.port || '5432';
    const database = dbUrl.pathname.slice(1);
    const username = dbUrl.username;

    let command = `pg_restore --host=${host} --port=${port} --username=${username} --dbname=${database}`;
    command += ` --clean --if-exists`; // Clean before restore
    command += ` ${backupPath}`;

    process.env.PGPASSWORD = dbUrl.password;

    return command;
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    const crypto = await import('crypto');
    const fileBuffer = await fs.readFile(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  }

  private async saveBackupMetadata(metadata: BackupMetadata): Promise<void> {
    const metadataDir = path.join(this.config.backupDir, 'metadata');
    await fs.mkdir(metadataDir, { recursive: true });

    const metadataPath = path.join(metadataDir, `${metadata.id}.json`);
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  private async getBackupMetadata(backupId: string): Promise<BackupMetadata | null> {
    try {
      const metadataPath = path.join(this.config.backupDir, 'metadata', `${backupId}.json`);
      const content = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const backups = await this.listBackups();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

      for (const backup of backups) {
        if (new Date(backup.timestamp) < cutoffDate) {
          // Delete backup file
          if (backup.path) {
            try {
              await fs.unlink(backup.path);
            } catch (error) {
              logger.warn('backup.cleanup_file_failed', { backupId: backup.id, error: (error as Error).message });
            }
          }

          // Delete metadata
          const metadataPath = path.join(this.config.backupDir, 'metadata', `${backup.id}.json`);
          try {
            await fs.unlink(metadataPath);
          } catch (error) {
            logger.warn('backup.cleanup_metadata_failed', { backupId: backup.id, error: (error as Error).message });
          }

          logger.info('backup.cleaned_up', { backupId: backup.id });
        }
      }
    } catch (error) {
      logger.error('backup.cleanup_failed', { error: (error as Error).message });
    }
  }
}

// Export singleton instance
export const backupManager = new DatabaseBackupManager();

// Convenience functions
export async function createDatabaseBackup(): Promise<BackupMetadata> {
  return backupManager.createDatabaseBackup();
}

export async function listBackups(): Promise<BackupMetadata[]> {
  return backupManager.listBackups();
}

export async function restoreFromBackup(backupId: string): Promise<boolean> {
  return backupManager.restoreFromBackup(backupId);
}