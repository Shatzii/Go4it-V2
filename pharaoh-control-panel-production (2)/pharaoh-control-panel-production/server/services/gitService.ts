import { Octokit } from '@octokit/rest';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface GitRepository {
  url: string;
  branch: string;
  token?: string;
}

export interface DeploymentResult {
  success: boolean;
  buildOutput: string;
  deploymentUrl?: string;
  error?: string;
}

export class GitService {
  private octokit?: Octokit;

  constructor(token?: string) {
    if (token) {
      this.octokit = new Octokit({
        auth: token,
      });
    }
  }

  /**
   * Clone a repository and return the local path
   */
  async cloneRepository(repo: GitRepository): Promise<string> {
    const tempDir = path.join(process.cwd(), 'temp', `deploy-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    const cloneUrl = repo.token 
      ? repo.url.replace('https://', `https://${repo.token}@`)
      : repo.url;

    await execAsync(`git clone -b ${repo.branch} ${cloneUrl} ${tempDir}`);
    return tempDir;
  }

  /**
   * Validate repository access and get repository information
   */
  async validateRepository(repoUrl: string, token?: string): Promise<{ valid: boolean; info?: any; error?: string }> {
    try {
      if (!this.octokit && token) {
        this.octokit = new Octokit({ auth: token });
      }

      if (!this.octokit) {
        return { valid: false, error: 'GitHub token required for repository validation' };
      }

      // Extract owner/repo from URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        return { valid: false, error: 'Invalid GitHub repository URL format' };
      }

      const [, owner, repo] = match;
      const repoName = repo.replace('.git', '');

      const { data } = await this.octokit.repos.get({
        owner,
        repo: repoName,
      });

      return {
        valid: true,
        info: {
          name: data.name,
          fullName: data.full_name,
          description: data.description,
          language: data.language,
          defaultBranch: data.default_branch,
          private: data.private,
        }
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Get repository branches
   */
  async getBranches(repoUrl: string): Promise<string[]> {
    if (!this.octokit) {
      throw new Error('GitHub token required');
    }

    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }

    const [, owner, repo] = match;
    const repoName = repo.replace('.git', '');

    const { data } = await this.octokit.repos.listBranches({
      owner,
      repo: repoName,
    });

    return data.map(branch => branch.name);
  }

  /**
   * Detect framework from package.json
   */
  async detectFramework(projectPath: string): Promise<{ framework: string; buildCommand: string; outputDir: string }> {
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

      // Check dependencies for framework detection
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps.react && deps['react-scripts']) {
        return { framework: 'react', buildCommand: 'npm run build', outputDir: 'build' };
      }
      if (deps.vue) {
        return { framework: 'vue', buildCommand: 'npm run build', outputDir: 'dist' };
      }
      if (deps['@angular/core']) {
        return { framework: 'angular', buildCommand: 'ng build', outputDir: 'dist' };
      }
      if (deps.next) {
        return { framework: 'nextjs', buildCommand: 'npm run build', outputDir: '.next' };
      }
      if (deps.nuxt) {
        return { framework: 'nuxt', buildCommand: 'npm run generate', outputDir: 'dist' };
      }
      if (deps.gatsby) {
        return { framework: 'gatsby', buildCommand: 'gatsby build', outputDir: 'public' };
      }
      if (deps.svelte) {
        return { framework: 'svelte', buildCommand: 'npm run build', outputDir: 'public' };
      }

      // Check for build scripts
      if (packageJson.scripts?.build) {
        return { framework: 'nodejs', buildCommand: 'npm run build', outputDir: 'dist' };
      }

      return { framework: 'static', buildCommand: '', outputDir: '.' };
    } catch (error) {
      // Fallback to static if no package.json
      return { framework: 'static', buildCommand: '', outputDir: '.' };
    }
  }

  /**
   * Install dependencies
   */
  async installDependencies(projectPath: string): Promise<string> {
    const { stdout, stderr } = await execAsync('npm install', { cwd: projectPath });
    return stdout + stderr;
  }

  /**
   * Build project
   */
  async buildProject(projectPath: string, buildCommand: string): Promise<string> {
    if (!buildCommand) {
      return 'No build command specified - static site';
    }

    const { stdout, stderr } = await execAsync(buildCommand, { cwd: projectPath });
    return stdout + stderr;
  }

  /**
   * Deploy to hosting service (placeholder for actual deployment)
   */
  async deployProject(projectPath: string, outputDir: string, siteName: string): Promise<DeploymentResult> {
    try {
      const buildPath = path.join(projectPath, outputDir);
      
      // Check if build directory exists
      try {
        await fs.access(buildPath);
      } catch {
        throw new Error(`Build directory ${outputDir} not found`);
      }

      // In a real implementation, this would deploy to a hosting service
      // For now, we'll simulate a successful deployment
      const deploymentId = Math.random().toString(36).substring(7);
      const deploymentUrl = `https://${siteName}-${deploymentId}.pharaoh-deploy.com`;

      return {
        success: true,
        buildOutput: 'Project deployed successfully',
        deploymentUrl
      };
    } catch (error: any) {
      return {
        success: false,
        buildOutput: '',
        error: error.message
      };
    }
  }

  /**
   * Clean up temporary files
   */
  async cleanup(projectPath: string): Promise<void> {
    try {
      await execAsync(`rm -rf ${projectPath}`);
    } catch (error) {
      console.error('Failed to cleanup temporary files:', error);
    }
  }
}

export const gitService = new GitService(process.env.GITHUB_TOKEN);