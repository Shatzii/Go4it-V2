import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

export interface CommandResult {
  command: string;
  output: string;
  error?: string;
  exitCode: number;
  timestamp: string;
  duration: number;
}

export interface SafeCommand {
  command: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  requiresConfirmation: boolean;
}

export class TerminalExecutor {
  private static instance: TerminalExecutor;
  private commandHistory: CommandResult[] = [];
  private readonly maxHistorySize = 1000;
  
  // Safe commands that can be executed without confirmation
  private safeCommands: SafeCommand[] = [
    { command: 'ps aux', description: 'List running processes', riskLevel: 'low', requiresConfirmation: false },
    { command: 'top -b -n 1', description: 'Show system processes', riskLevel: 'low', requiresConfirmation: false },
    { command: 'free -h', description: 'Show memory usage', riskLevel: 'low', requiresConfirmation: false },
    { command: 'df -h', description: 'Show disk usage', riskLevel: 'low', requiresConfirmation: false },
    { command: 'uptime', description: 'Show system uptime', riskLevel: 'low', requiresConfirmation: false },
    { command: 'whoami', description: 'Show current user', riskLevel: 'low', requiresConfirmation: false },
    { command: 'pwd', description: 'Show current directory', riskLevel: 'low', requiresConfirmation: false },
    { command: 'ls -la', description: 'List files in directory', riskLevel: 'low', requiresConfirmation: false },
    { command: 'netstat -tuln', description: 'Show network connections', riskLevel: 'low', requiresConfirmation: false },
    { command: 'systemctl status', description: 'Show service status', riskLevel: 'low', requiresConfirmation: false },
    { command: 'journalctl --no-pager -n 50', description: 'Show recent system logs', riskLevel: 'low', requiresConfirmation: false },
    { command: 'dmesg | tail -20', description: 'Show kernel messages', riskLevel: 'low', requiresConfirmation: false }
  ];

  // Commands that require confirmation due to potential system impact
  private restrictedCommands: SafeCommand[] = [
    { command: 'systemctl restart', description: 'Restart system service', riskLevel: 'high', requiresConfirmation: true },
    { command: 'systemctl stop', description: 'Stop system service', riskLevel: 'high', requiresConfirmation: true },
    { command: 'kill -9', description: 'Force kill process', riskLevel: 'medium', requiresConfirmation: true },
    { command: 'rm -rf', description: 'Remove files/directories', riskLevel: 'high', requiresConfirmation: true },
    { command: 'chmod', description: 'Change file permissions', riskLevel: 'medium', requiresConfirmation: true },
    { command: 'chown', description: 'Change file ownership', riskLevel: 'medium', requiresConfirmation: true }
  ];

  private constructor() {}

  public static getInstance(): TerminalExecutor {
    if (!TerminalExecutor.instance) {
      TerminalExecutor.instance = new TerminalExecutor();
    }
    return TerminalExecutor.instance;
  }

  /**
   * Execute a terminal command safely
   */
  public async executeCommand(command: string, confirmed: boolean = false): Promise<CommandResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    try {
      // Validate command safety
      const validation = this.validateCommand(command);
      
      if (!validation.allowed) {
        throw new Error(`Command not allowed: ${validation.reason}`);
      }

      if (validation.requiresConfirmation && !confirmed) {
        throw new Error(`Command requires confirmation due to ${validation.riskLevel} risk level`);
      }

      // Execute the command with timeout
      const { stdout, stderr } = await execAsync(command, {
        timeout: 30000, // 30 second timeout
        maxBuffer: 1024 * 1024, // 1MB buffer
        cwd: process.cwd(),
        env: { ...process.env, PATH: process.env.PATH }
      });

      const result: CommandResult = {
        command,
        output: stdout || stderr || 'Command executed successfully',
        error: stderr || undefined,
        exitCode: 0,
        timestamp,
        duration: Date.now() - startTime
      };

      this.addToHistory(result);
      return result;

    } catch (error: any) {
      const result: CommandResult = {
        command,
        output: '',
        error: error.message || 'Command execution failed',
        exitCode: error.code || 1,
        timestamp,
        duration: Date.now() - startTime
      };

      this.addToHistory(result);
      return result;
    }
  }

  /**
   * Validate if a command is safe to execute
   */
  private validateCommand(command: string): {
    allowed: boolean;
    reason?: string;
    riskLevel?: string;
    requiresConfirmation?: boolean;
  } {
    const cmd = command.trim().toLowerCase();

    // Block dangerous commands
    const dangerousPatterns = [
      'rm -rf /',
      'dd if=',
      'mkfs',
      'fdisk',
      'format',
      'shutdown',
      'reboot',
      'init 0',
      'init 6',
      'halt',
      'poweroff',
      '> /dev/',
      'curl.*|.*sh',
      'wget.*|.*sh',
      'sudo su',
      'su -'
    ];

    for (const pattern of dangerousPatterns) {
      if (cmd.includes(pattern.toLowerCase())) {
        return {
          allowed: false,
          reason: `Dangerous command pattern detected: ${pattern}`
        };
      }
    }

    // Check if command is in safe list
    const safeCommand = this.safeCommands.find(safe => 
      cmd.startsWith(safe.command.toLowerCase())
    );

    if (safeCommand) {
      return {
        allowed: true,
        riskLevel: safeCommand.riskLevel,
        requiresConfirmation: safeCommand.requiresConfirmation
      };
    }

    // Check if command requires confirmation
    const restrictedCommand = this.restrictedCommands.find(restricted => 
      cmd.includes(restricted.command.toLowerCase())
    );

    if (restrictedCommand) {
      return {
        allowed: true,
        riskLevel: restrictedCommand.riskLevel,
        requiresConfirmation: restrictedCommand.requiresConfirmation
      };
    }

    // Allow basic commands that don't match patterns
    const basicCommands = ['ls', 'cat', 'head', 'tail', 'grep', 'find', 'which', 'echo', 'date'];
    const isBasicCommand = basicCommands.some(basic => cmd.startsWith(basic));

    if (isBasicCommand) {
      return {
        allowed: true,
        riskLevel: 'low',
        requiresConfirmation: false
      };
    }

    // Default to requiring confirmation for unknown commands
    return {
      allowed: true,
      riskLevel: 'medium',
      requiresConfirmation: true
    };
  }

  /**
   * Add command result to history
   */
  private addToHistory(result: CommandResult): void {
    this.commandHistory.push(result);
    
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory.shift();
    }
  }

  /**
   * Get command execution history
   */
  public getCommandHistory(limit: number = 50): CommandResult[] {
    return this.commandHistory.slice(-limit);
  }

  /**
   * Get available safe commands
   */
  public getSafeCommands(): SafeCommand[] {
    return [...this.safeCommands];
  }

  /**
   * Check if a command requires confirmation
   */
  public requiresConfirmation(command: string): boolean {
    const validation = this.validateCommand(command);
    return validation.requiresConfirmation || false;
  }

  /**
   * Get command suggestions based on user input
   */
  public getCommandSuggestions(input: string): SafeCommand[] {
    const searchTerm = input.toLowerCase().trim();
    
    if (!searchTerm) {
      return this.safeCommands.slice(0, 10);
    }

    return [...this.safeCommands, ...this.restrictedCommands]
      .filter(cmd => 
        cmd.command.toLowerCase().includes(searchTerm) ||
        cmd.description.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10);
  }

  /**
   * Execute a series of AI-recommended commands
   */
  public async executeHealingCommands(
    commands: Array<{command: string, purpose: string, risk: string}>,
    autoExecute: boolean = false
  ): Promise<CommandResult[]> {
    const results: CommandResult[] = [];

    for (const cmd of commands) {
      try {
        // For healing commands, we can be more permissive if they're low risk
        const confirmed = autoExecute && cmd.risk === 'low';
        const result = await this.executeCommand(cmd.command, confirmed);
        results.push(result);

        // Stop execution if a command fails critically
        if (result.exitCode !== 0 && cmd.risk === 'high') {
          console.log(`[TerminalExecutor] Stopping healing sequence due to failed high-risk command: ${cmd.command}`);
          break;
        }
      } catch (error) {
        console.error(`[TerminalExecutor] Error executing healing command: ${cmd.command}`, error);
        
        results.push({
          command: cmd.command,
          output: '',
          error: error.message || 'Execution failed',
          exitCode: 1,
          timestamp: new Date().toISOString(),
          duration: 0
        });
        
        break; // Stop on any error
      }
    }

    return results;
  }

  /**
   * Get real-time system information
   */
  public async getSystemInfo(): Promise<{
    hostname: string;
    platform: string;
    architecture: string;
    nodeVersion: string;
    uptime: string;
    currentUser: string;
    workingDirectory: string;
  }> {
    try {
      const [hostname, platform, arch, uptime, user, pwd] = await Promise.all([
        execAsync('hostname').then(r => r.stdout.trim()).catch(() => 'unknown'),
        Promise.resolve(process.platform),
        Promise.resolve(process.arch),
        execAsync('uptime').then(r => r.stdout.trim()).catch(() => 'unknown'),
        execAsync('whoami').then(r => r.stdout.trim()).catch(() => 'unknown'),
        execAsync('pwd').then(r => r.stdout.trim()).catch(() => process.cwd())
      ]);

      return {
        hostname,
        platform,
        architecture: arch,
        nodeVersion: process.version,
        uptime,
        currentUser: user,
        workingDirectory: pwd
      };
    } catch (error) {
      throw new Error(`Failed to get system info: ${error.message}`);
    }
  }

  /**
   * Clear command history
   */
  public clearHistory(): void {
    this.commandHistory = [];
  }
}

// Export singleton instance
export const terminalExecutor = TerminalExecutor.getInstance();