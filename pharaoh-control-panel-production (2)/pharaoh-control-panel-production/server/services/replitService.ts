import { Octokit } from '@octokit/rest';

interface ReplitDeployment {
  id: string;
  name: string;
  url: string;
  status: 'pending' | 'deploying' | 'success' | 'failed';
  framework: string;
  createdAt: Date;
}

interface ReplitConfig {
  language: string;
  run: string;
  modules?: string[];
  packager?: {
    language: string;
    packageSearch: boolean;
  };
  unitTest?: string;
  nix?: {
    channel: string;
  };
}

export class ReplitService {
  private static instance: ReplitService;
  private deployments: Map<string, ReplitDeployment> = new Map();

  public static getInstance(): ReplitService {
    if (!ReplitService.instance) {
      ReplitService.instance = new ReplitService();
    }
    return ReplitService.instance;
  }

  /**
   * Generate Replit configuration based on detected framework
   */
  public generateReplitConfig(framework: string, projectName: string): ReplitConfig {
    const configs: Record<string, ReplitConfig> = {
      'react': {
        language: 'nodejs-18',
        run: 'npm run dev',
        modules: ['nodejs-18', 'web'],
        packager: {
          language: 'nodejs',
          packageSearch: true
        },
        unitTest: 'npm test',
        nix: {
          channel: 'stable-23_11'
        }
      },
      'vue': {
        language: 'nodejs-18',
        run: 'npm run dev',
        modules: ['nodejs-18', 'web'],
        packager: {
          language: 'nodejs',
          packageSearch: true
        },
        nix: {
          channel: 'stable-23_11'
        }
      },
      'nextjs': {
        language: 'nodejs-18',
        run: 'npm run dev',
        modules: ['nodejs-18', 'web'],
        packager: {
          language: 'nodejs',
          packageSearch: true
        },
        nix: {
          channel: 'stable-23_11'
        }
      },
      'express': {
        language: 'nodejs-18',
        run: 'npm start',
        modules: ['nodejs-18'],
        packager: {
          language: 'nodejs',
          packageSearch: true
        },
        nix: {
          channel: 'stable-23_11'
        }
      },
      'python': {
        language: 'python3',
        run: 'python main.py',
        modules: ['python3'],
        packager: {
          language: 'python3',
          packageSearch: true
        },
        nix: {
          channel: 'stable-23_11'
        }
      },
      'static': {
        language: 'web',
        run: 'python -m http.server 3000',
        modules: ['web'],
        nix: {
          channel: 'stable-23_11'
        }
      }
    };

    return configs[framework] || configs['static'];
  }

  /**
   * Create deployment files for Replit
   */
  public generateDeploymentFiles(framework: string, projectName: string): Record<string, string> {
    const config = this.generateReplitConfig(framework, projectName);
    
    const files: Record<string, string> = {
      '.replit': this.generateReplitFile(config),
      'replit.nix': this.generateNixFile(config),
    };

    // Add framework-specific files
    if (framework === 'react' || framework === 'vue' || framework === 'nextjs') {
      files['vite.config.js'] = this.generateViteConfig();
    }

    if (framework === 'python') {
      files['main.py'] = this.generatePythonMain();
      files['requirements.txt'] = this.generatePythonRequirements();
    }

    return files;
  }

  private generateReplitFile(config: ReplitConfig): string {
    return `# Replit configuration file
modules = ${JSON.stringify(config.modules || [], null, 2)}

[nix]
channel = "${config.nix?.channel || 'stable-23_11'}"

[packager]
language = "${config.packager?.language || 'nodejs'}"
packageSearch = ${config.packager?.packageSearch || true}

[gitHubImport]
requiredFiles = [".replit", "replit.nix"]

[languages]

[languages.javascript]
pattern = "**/{*.js,*.jsx,*.ts,*.tsx}"

[languages.javascript.languageServer]
start = "typescript-language-server --stdio"

[deployment]
run = ["sh", "-c", "${config.run}"]
deploymentTarget = "cloudrun"

[[ports]]
localPort = 3000
externalPort = 80
`;
  }

  private generateNixFile(config: ReplitConfig): string {
    const packages = {
      'nodejs-18': 'pkgs.nodejs-18_x pkgs.nodePackages.npm',
      'python3': 'pkgs.python310Full pkgs.python310Packages.pip',
      'web': 'pkgs.python310Full'
    };

    const selectedPackages = config.modules?.map(module => packages[module as keyof typeof packages] || '').filter(Boolean).join(' ') || packages['nodejs-18'];

    return `{ pkgs }: {
  deps = [
    ${selectedPackages}
    pkgs.git
    pkgs.curl
  ];
}`;
  }

  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})`;
  }

  private generatePythonMain(): string {
    return `print("Hello, Replit!")

# Your Python application starts here
if __name__ == "__main__":
    print("Application is running on Replit!")
`;
  }

  private generatePythonRequirements(): string {
    return `# Add your Python dependencies here
# flask==2.3.3
# requests==2.31.0
`;
  }

  /**
   * Deploy to Replit by creating deployment bundle
   */
  public async deployToReplit(repoUrl: string, framework: string, projectName: string): Promise<ReplitDeployment> {
    const deploymentId = `repl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const deployment: ReplitDeployment = {
      id: deploymentId,
      name: projectName,
      url: `https://replit.com/@username/${projectName}`,
      status: 'pending',
      framework,
      createdAt: new Date()
    };

    this.deployments.set(deploymentId, deployment);

    try {
      // Generate Replit configuration files
      const replitFiles = this.generateDeploymentFiles(framework, projectName);
      
      // Simulate deployment process
      deployment.status = 'deploying';
      this.deployments.set(deploymentId, deployment);

      // In a real implementation, this would:
      // 1. Clone the repository
      // 2. Add Replit configuration files
      // 3. Create a new Replit project via API
      // 4. Import the repository
      // 5. Start the deployment

      setTimeout(() => {
        deployment.status = 'success';
        deployment.url = `https://replit.com/@username/${projectName}`;
        this.deployments.set(deploymentId, deployment);
      }, 3000);

      return deployment;
    } catch (error) {
      deployment.status = 'failed';
      this.deployments.set(deploymentId, deployment);
      throw error;
    }
  }

  /**
   * Get deployment status
   */
  public getDeployment(deploymentId: string): ReplitDeployment | undefined {
    return this.deployments.get(deploymentId);
  }

  /**
   * List all deployments
   */
  public listDeployments(): ReplitDeployment[] {
    return Array.from(this.deployments.values());
  }

  /**
   * Generate Replit import URL for easy one-click deployment
   */
  public generateReplitImportUrl(repoUrl: string): string {
    const encodedUrl = encodeURIComponent(repoUrl);
    return `https://replit.com/github/${encodedUrl}`;
  }

  /**
   * Create a deployment package with all necessary files
   */
  public createDeploymentPackage(framework: string, projectName: string, sourceFiles?: Record<string, string>): Record<string, string> {
    const replitFiles = this.generateDeploymentFiles(framework, projectName);
    
    return {
      ...sourceFiles,
      ...replitFiles,
      'README_REPLIT.md': this.generateReplitReadme(framework, projectName)
    };
  }

  private generateReplitReadme(framework: string, projectName: string): string {
    return `# ${projectName} - Replit Deployment

This project has been configured for deployment on Replit.

## Framework: ${framework}

### Getting Started on Replit

1. Click the "Run" button to start the application
2. The application will be available at the provided URL
3. Any changes you make will be automatically deployed

### Configuration Files

- \`.replit\`: Main configuration file for Replit
- \`replit.nix\`: Package dependencies and environment setup
- \`vite.config.js\`: Frontend build configuration (if applicable)

### Deployment Features

✅ Automatic dependency installation
✅ Hot reload and live preview
✅ Built-in terminal and file editor
✅ Collaborative coding support
✅ Custom domain support (with paid plans)

### Troubleshooting

If you encounter issues:
1. Check the console for error messages
2. Ensure all dependencies are properly listed
3. Verify the run command in \`.replit\` file
4. Check that the correct port (3000) is being used

Deployed with Pharaoh Control Panel 2.0
`;
  }
}

export const replitService = ReplitService.getInstance();