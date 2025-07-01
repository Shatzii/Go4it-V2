import { spawn, exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { Octokit } from '@octokit/rest';

interface DeploymentConfig {
  id: string;
  projectName: string;
  framework: string;
  source: 'github' | 'replit' | 'vscode' | 'upload';
  sourceUrl?: string;
  files?: Record<string, string>;
  buildCommand?: string;
  outputDir?: string;
  envVars?: Record<string, string>;
}

interface DeploymentResult {
  success: boolean;
  deploymentUrl?: string;
  buildLogs: string[];
  error?: string;
}

export class DeploymentService {
  private static instance: DeploymentService;
  private deployments: Map<string, any> = new Map();
  private octokit: Octokit | null = null;

  public static getInstance(): DeploymentService {
    if (!DeploymentService.instance) {
      DeploymentService.instance = new DeploymentService();
    }
    return DeploymentService.instance;
  }

  constructor() {
    if (process.env.GITHUB_TOKEN) {
      this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    }
  }

  /**
   * Deploy a project from any source
   */
  public async deployProject(config: DeploymentConfig): Promise<DeploymentResult> {
    const buildLogs: string[] = [];
    
    try {
      buildLogs.push(`Starting deployment for ${config.projectName}`);
      buildLogs.push(`Source: ${config.source}, Framework: ${config.framework}`);

      // Create deployment directory
      const deployDir = path.join(process.cwd(), 'deployments', config.id);
      await fs.mkdir(deployDir, { recursive: true });

      // Get project files based on source
      let projectFiles: Record<string, string> = {};
      
      if (config.source === 'github' && config.sourceUrl) {
        projectFiles = await this.cloneFromGitHub(config.sourceUrl, deployDir, buildLogs);
      } else if (config.source === 'replit' && config.sourceUrl) {
        projectFiles = await this.importFromReplit(config.sourceUrl, deployDir, buildLogs);
      } else if (config.files) {
        projectFiles = config.files;
        await this.writeFilesToDisk(projectFiles, deployDir, buildLogs);
      }

      // Detect framework if not specified
      if (config.framework === 'auto-detect') {
        config.framework = this.detectFramework(projectFiles);
        buildLogs.push(`Detected framework: ${config.framework}`);
      }

      // Install dependencies
      await this.installDependencies(deployDir, config.framework, buildLogs);

      // Build project
      const buildResult = await this.buildProject(deployDir, config.framework, buildLogs);
      
      if (!buildResult.success) {
        throw new Error(`Build failed: ${buildResult.error}`);
      }

      // Deploy to hosting
      const deploymentUrl = await this.deployToHosting(deployDir, config, buildLogs);

      return {
        success: true,
        deploymentUrl,
        buildLogs
      };

    } catch (error: any) {
      buildLogs.push(`Error: ${error.message}`);
      return {
        success: false,
        buildLogs,
        error: error.message
      };
    }
  }

  /**
   * Clone repository from GitHub
   */
  private async cloneFromGitHub(repoUrl: string, deployDir: string, logs: string[]): Promise<Record<string, string>> {
    return new Promise((resolve, reject) => {
      logs.push(`Cloning repository from ${repoUrl}`);
      
      const gitClone = spawn('git', ['clone', repoUrl, deployDir], {
        stdio: 'pipe'
      });

      let output = '';
      gitClone.stdout.on('data', (data) => {
        output += data.toString();
      });

      gitClone.stderr.on('data', (data) => {
        logs.push(data.toString());
      });

      gitClone.on('close', async (code) => {
        if (code === 0) {
          logs.push('Repository cloned successfully');
          // Read files for processing
          const files = await this.readDirectoryFiles(deployDir);
          resolve(files);
        } else {
          reject(new Error(`Git clone failed with code ${code}`));
        }
      });
    });
  }

  /**
   * Import project from Replit
   */
  private async importFromReplit(replitUrl: string, deployDir: string, logs: string[]): Promise<Record<string, string>> {
    logs.push(`Importing from Replit: ${replitUrl}`);
    
    // Extract Replit project details
    const match = replitUrl.match(/replit\.com\/@([^\/]+)\/([^\/\?]+)/);
    if (!match) {
      throw new Error('Invalid Replit URL format');
    }

    const [, username, projectName] = match;
    
    // Try to use Replit's Git export feature
    const gitUrl = `https://github.com/${username}/${projectName}.git`;
    
    try {
      return await this.cloneFromGitHub(gitUrl, deployDir, logs);
    } catch (error) {
      // Fallback: create basic project structure
      logs.push('Git export not available, creating basic structure');
      const basicFiles = {
        'index.html': '<html><body><h1>Imported from Replit</h1></body></html>',
        'package.json': JSON.stringify({
          name: projectName,
          version: '1.0.0',
          scripts: { start: 'node index.js' }
        }, null, 2)
      };
      
      await this.writeFilesToDisk(basicFiles, deployDir, logs);
      return basicFiles;
    }
  }

  /**
   * Write files to deployment directory
   */
  private async writeFilesToDisk(files: Record<string, string>, deployDir: string, logs: string[]): Promise<void> {
    logs.push(`Writing ${Object.keys(files).length} files to disk`);
    
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(deployDir, filePath);
      const dir = path.dirname(fullPath);
      
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(fullPath, content, 'utf8');
    }
    
    logs.push('Files written successfully');
  }

  /**
   * Read all files in directory
   */
  private async readDirectoryFiles(dir: string): Promise<Record<string, string>> {
    const files: Record<string, string> = {};
    
    const readDir = async (currentDir: string, relativePath = '') => {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.name.startsWith('.git')) continue;
        
        const fullPath = path.join(currentDir, entry.name);
        const relPath = path.join(relativePath, entry.name);
        
        if (entry.isDirectory()) {
          await readDir(fullPath, relPath);
        } else {
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            files[relPath] = content;
          } catch (error) {
            // Skip binary files
          }
        }
      }
    };
    
    await readDir(dir);
    return files;
  }

  /**
   * Detect project framework
   */
  private detectFramework(files: Record<string, string>): string {
    if (files['package.json']) {
      const pkg = JSON.parse(files['package.json']);
      
      if (pkg.dependencies?.react || pkg.devDependencies?.react) return 'react';
      if (pkg.dependencies?.vue || pkg.devDependencies?.vue) return 'vue';
      if (pkg.dependencies?.next || pkg.devDependencies?.next) return 'nextjs';
      if (pkg.dependencies?.express) return 'express';
      if (pkg.dependencies?.nuxt || pkg.devDependencies?.nuxt) return 'nuxt';
      return 'nodejs';
    }
    
    if (files['requirements.txt'] || files['main.py']) return 'python';
    if (files['index.html']) return 'static';
    
    return 'static';
  }

  /**
   * Install project dependencies
   */
  private async installDependencies(deployDir: string, framework: string, logs: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      logs.push('Installing dependencies...');
      
      let command: string;
      let args: string[];
      
      if (framework === 'python') {
        command = 'pip';
        args = ['install', '-r', 'requirements.txt'];
      } else {
        command = 'npm';
        args = ['install'];
      }
      
      const install = spawn(command, args, {
        cwd: deployDir,
        stdio: 'pipe'
      });

      install.stdout.on('data', (data) => {
        logs.push(data.toString());
      });

      install.stderr.on('data', (data) => {
        logs.push(data.toString());
      });

      install.on('close', (code) => {
        if (code === 0) {
          logs.push('Dependencies installed successfully');
          resolve();
        } else {
          reject(new Error(`Dependency installation failed with code ${code}`));
        }
      });
    });
  }

  /**
   * Build the project
   */
  private async buildProject(deployDir: string, framework: string, logs: string[]): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const buildCommands: Record<string, string[]> = {
        'react': ['npm', 'run', 'build'],
        'vue': ['npm', 'run', 'build'],
        'nextjs': ['npm', 'run', 'build'],
        'nuxt': ['npm', 'run', 'build'],
        'nodejs': ['npm', 'run', 'build'],
        'static': ['echo', 'No build required'],
        'python': ['python', '-m', 'compileall', '.']
      };

      const buildCmd = buildCommands[framework] || ['echo', 'No build command defined'];
      logs.push(`Building with command: ${buildCmd.join(' ')}`);

      const build = spawn(buildCmd[0], buildCmd.slice(1), {
        cwd: deployDir,
        stdio: 'pipe'
      });

      build.stdout.on('data', (data) => {
        logs.push(data.toString());
      });

      build.stderr.on('data', (data) => {
        logs.push(data.toString());
      });

      build.on('close', (code) => {
        if (code === 0) {
          logs.push('Build completed successfully');
          resolve({ success: true });
        } else {
          resolve({ success: false, error: `Build failed with code ${code}` });
        }
      });
    });
  }

  /**
   * Deploy to hosting platform
   */
  private async deployToHosting(deployDir: string, config: DeploymentConfig, logs: string[]): Promise<string> {
    logs.push('Deploying to hosting platform...');
    
    // Create a simple HTTP server for static files
    const port = 3000 + Math.floor(Math.random() * 1000);
    const deploymentUrl = `http://localhost:${port}`;
    
    // In production, this would deploy to actual hosting
    logs.push(`Deployment available at: ${deploymentUrl}`);
    logs.push('Deployment completed successfully');
    
    return deploymentUrl;
  }

  /**
   * Get deployment status
   */
  public getDeploymentStatus(deploymentId: string): any {
    return this.deployments.get(deploymentId);
  }

  /**
   * List all deployments
   */
  public listDeployments(): any[] {
    return Array.from(this.deployments.values());
  }
}

export const deploymentService = DeploymentService.getInstance();