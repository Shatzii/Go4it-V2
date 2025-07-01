import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { aiEngine } from '../ai/engine';

const execAsync = promisify(exec);

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  source: string;
  message: string;
  rawLine: string;
}

export interface LogAnalysisResult {
  issuesDetected: number;
  criticalErrors: number;
  warnings: number;
  lastAnalysis: string;
  recentErrors: LogEntry[];
}

export class LogMonitor {
  private static instance: LogMonitor;
  private monitoringPaths: string[] = [
    '/var/log/syslog',
    '/var/log/messages',
    '/var/log/auth.log',
    '/var/log/nginx/error.log',
    '/var/log/apache2/error.log',
    '/var/log/mysql/error.log',
    '/var/log/postgresql/postgresql.log'
  ];
  private intervalId: NodeJS.Timeout | null = null;
  private lastReadPositions: Map<string, number> = new Map();
  private recentLogs: LogEntry[] = [];
  private readonly maxLogHistory = 1000;

  private constructor() {}

  public static getInstance(): LogMonitor {
    if (!LogMonitor.instance) {
      LogMonitor.instance = new LogMonitor();
    }
    return LogMonitor.instance;
  }

  /**
   * Start monitoring log files for issues
   */
  public async startLogMonitoring(intervalMs: number = 10000): Promise<void> {
    if (this.intervalId) {
      this.stopLogMonitoring();
    }

    // Initialize log positions
    await this.initializeLogPositions();

    this.intervalId = setInterval(async () => {
      try {
        await this.checkLogsForIssues();
      } catch (error) {
        console.error('[LogMonitor] Error during log monitoring:', error);
      }
    }, intervalMs);

    console.log(`[PharaohAI] Log monitoring started with ${intervalMs}ms interval`);
  }

  /**
   * Stop log monitoring
   */
  public stopLogMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[PharaohAI] Log monitoring stopped');
    }
  }

  /**
   * Initialize log file read positions
   */
  private async initializeLogPositions(): Promise<void> {
    for (const logPath of this.monitoringPaths) {
      try {
        const stats = await fs.stat(logPath);
        // Start reading from the end of existing files
        this.lastReadPositions.set(logPath, stats.size);
      } catch (error) {
        // File doesn't exist or no permission, start from 0
        this.lastReadPositions.set(logPath, 0);
      }
    }
  }

  /**
   * Check all monitored logs for new entries and issues
   */
  private async checkLogsForIssues(): Promise<void> {
    const newEntries: LogEntry[] = [];

    for (const logPath of this.monitoringPaths) {
      try {
        const entries = await this.readNewLogEntries(logPath);
        newEntries.push(...entries);
      } catch (error) {
        // Silently continue if log file is not accessible
        continue;
      }
    }

    if (newEntries.length > 0) {
      // Add to recent logs
      this.recentLogs.push(...newEntries);
      
      // Keep only recent entries
      if (this.recentLogs.length > this.maxLogHistory) {
        this.recentLogs = this.recentLogs.slice(-this.maxLogHistory);
      }

      // Analyze for issues
      await this.analyzeNewEntries(newEntries);
    }
  }

  /**
   * Read new entries from a log file
   */
  private async readNewLogEntries(logPath: string): Promise<LogEntry[]> {
    try {
      const stats = await fs.stat(logPath);
      const lastPosition = this.lastReadPositions.get(logPath) || 0;

      // Check if file has new content
      if (stats.size <= lastPosition) {
        return [];
      }

      // Read new content
      const fileHandle = await fs.open(logPath, 'r');
      const buffer = Buffer.alloc(stats.size - lastPosition);
      
      await fileHandle.read(buffer, 0, buffer.length, lastPosition);
      await fileHandle.close();

      // Update position
      this.lastReadPositions.set(logPath, stats.size);

      // Parse log entries
      const content = buffer.toString('utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      return lines.map(line => this.parseLogLine(line, path.basename(logPath)));
    } catch (error) {
      throw new Error(`Failed to read log file ${logPath}: ${error.message}`);
    }
  }

  /**
   * Parse a log line into a structured entry
   */
  private parseLogLine(line: string, source: string): LogEntry {
    // Basic log parsing - can be enhanced for specific log formats
    let level: LogEntry['level'] = 'info';
    let timestamp = new Date().toISOString();
    let message = line;

    // Extract timestamp (common formats)
    const timestampRegex = /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/;
    const timestampMatch = line.match(timestampRegex);
    
    if (timestampMatch) {
      try {
        timestamp = new Date(timestampMatch[1]).toISOString();
      } catch (error) {
        // Use current time if parsing fails
        timestamp = new Date().toISOString();
      }
    }

    // Determine log level
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('error') || lowerLine.includes('err') || lowerLine.includes('fatal')) {
      level = 'error';
    } else if (lowerLine.includes('warn') || lowerLine.includes('warning')) {
      level = 'warning';
    } else if (lowerLine.includes('debug')) {
      level = 'debug';
    }

    return {
      timestamp,
      level,
      source,
      message: message.trim(),
      rawLine: line
    };
  }

  /**
   * Analyze new log entries for issues using the AI engine
   */
  private async analyzeNewEntries(entries: LogEntry[]): Promise<void> {
    // Filter for error and warning entries
    const significantEntries = entries.filter(entry => 
      entry.level === 'error' || entry.level === 'warning'
    );

    if (significantEntries.length === 0) {
      return;
    }

    // Group entries by type for analysis
    const logContent = significantEntries
      .map(entry => `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.source}: ${entry.message}`)
      .join('\n');

    try {
      // Use AI engine to analyze the logs
      const issueDescription = `Detected ${significantEntries.length} potential issues in server logs`;
      
      await aiEngine.analyzeServerIssue(logContent, issueDescription);
      
      console.log(`[PharaohAI] Analyzed ${significantEntries.length} log entries, created healing event`);
    } catch (error) {
      console.error('[LogMonitor] Error analyzing logs with AI:', error);
    }
  }

  /**
   * Get recent log entries
   */
  public getRecentLogs(count: number = 100): LogEntry[] {
    return this.recentLogs.slice(-count);
  }

  /**
   * Get recent errors
   */
  public getRecentErrors(count: number = 50): LogEntry[] {
    return this.recentLogs
      .filter(entry => entry.level === 'error')
      .slice(-count);
  }

  /**
   * Get log analysis summary
   */
  public getLogAnalysis(): LogAnalysisResult {
    const recentEntries = this.recentLogs.slice(-100); // Last 100 entries
    
    const criticalErrors = recentEntries.filter(entry => entry.level === 'error').length;
    const warnings = recentEntries.filter(entry => entry.level === 'warning').length;
    const issuesDetected = criticalErrors + warnings;

    return {
      issuesDetected,
      criticalErrors,
      warnings,
      lastAnalysis: new Date().toISOString(),
      recentErrors: this.getRecentErrors(10)
    };
  }

  /**
   * Manually analyze a specific log file
   */
  public async analyzeLogFile(filePath: string, issueDescription?: string): Promise<void> {
    try {
      // Read the last 100 lines of the log file
      const { stdout } = await execAsync(`tail -n 100 "${filePath}"`);
      
      const description = issueDescription || `Manual analysis of ${path.basename(filePath)}`;
      
      await aiEngine.analyzeServerIssue(stdout, description);
      
      console.log(`[PharaohAI] Manually analyzed log file: ${filePath}`);
    } catch (error) {
      throw new Error(`Failed to analyze log file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Add custom log path for monitoring
   */
  public addLogPath(logPath: string): void {
    if (!this.monitoringPaths.includes(logPath)) {
      this.monitoringPaths.push(logPath);
      this.lastReadPositions.set(logPath, 0);
      console.log(`[PharaohAI] Added log path for monitoring: ${logPath}`);
    }
  }

  /**
   * Remove log path from monitoring
   */
  public removeLogPath(logPath: string): void {
    const index = this.monitoringPaths.indexOf(logPath);
    if (index > -1) {
      this.monitoringPaths.splice(index, 1);
      this.lastReadPositions.delete(logPath);
      console.log(`[PharaohAI] Removed log path from monitoring: ${logPath}`);
    }
  }

  /**
   * Get list of monitored log paths
   */
  public getMonitoredPaths(): string[] {
    return [...this.monitoringPaths];
  }
}

// Export singleton instance
export const logMonitor = LogMonitor.getInstance();