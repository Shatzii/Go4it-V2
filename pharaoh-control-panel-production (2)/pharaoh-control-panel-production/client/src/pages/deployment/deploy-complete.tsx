import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  GitBranch, 
  Rocket, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Loader2,
  FileText,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface DeploymentResult {
  success: boolean;
  deploymentId: string;
  deploymentUrl?: string;
  buildLogs: string[];
  error?: string;
}

export default function DeployComplete() {
  const [activeTab, setActiveTab] = useState('github');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const { toast } = useToast();

  // GitHub deployment state
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [siteName, setSiteName] = useState('');
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [outputDir, setOutputDir] = useState('build');
  const [envVars, setEnvVars] = useState('');
  const [branches, setBranches] = useState<string[]>([]);
  const [framework, setFramework] = useState('');

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [uploadSiteName, setUploadSiteName] = useState('');
  const [uploadFramework, setUploadFramework] = useState('auto-detect');

  // Replit import state
  const [replitUrl, setReplitUrl] = useState('');
  const [replitProjectName, setReplitProjectName] = useState('');

  const deployFromGitHub = async () => {
    if (!repoUrl || !siteName) {
      toast({
        title: "Missing information",
        description: "Please provide repository URL and site name",
        variant: "destructive"
      });
      return;
    }

    setIsDeploying(true);
    try {
      const envVarsObj = envVars ? JSON.parse(envVars) : {};
      
      const result = await apiRequest('POST', '/api/deployment/deploy-repo', {
        repoUrl,
        branch,
        siteName,
        buildCommand,
        outputDir,
        envVars: envVarsObj
      });

      setDeploymentResult(result);
      
      if (result.success) {
        toast({
          title: "Deployment successful",
          description: `Site deployed successfully at ${result.deploymentUrl}`,
        });
      } else {
        toast({
          title: "Deployment failed",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Deployment error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const deployFromUpload = async () => {
    if (Object.keys(uploadedFiles).length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload files to deploy",
        variant: "destructive"
      });
      return;
    }

    setIsDeploying(true);
    try {
      const result = await apiRequest('POST', '/api/deployment/upload', {
        files: uploadedFiles,
        siteName: uploadSiteName || 'uploaded-site',
        framework: uploadFramework
      });

      setDeploymentResult(result);
      
      if (result.success) {
        toast({
          title: "Deployment successful",
          description: `Site deployed successfully at ${result.deploymentUrl}`,
        });
      } else {
        toast({
          title: "Deployment failed",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Deployment error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const deployFromReplit = async () => {
    if (!replitUrl) {
      toast({
        title: "Missing Replit URL",
        description: "Please provide a Replit project URL",
        variant: "destructive"
      });
      return;
    }

    setIsDeploying(true);
    try {
      const result = await apiRequest('POST', '/api/integrations/replit/import', {
        replitUrl,
        projectName: replitProjectName,
        framework: 'auto-detect'
      });

      setDeploymentResult(result);
      
      if (result.success) {
        toast({
          title: "Import and deployment successful",
          description: `Replit project deployed successfully at ${result.deploymentUrl}`,
        });
      } else {
        toast({
          title: "Import failed",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Import error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filePromises = Array.from(files).map(file => {
      return new Promise<{ name: string; content: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            content: reader.result as string
          });
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    });

    Promise.all(filePromises).then(fileContents => {
      const newFiles: Record<string, string> = {};
      fileContents.forEach(({ name, content }) => {
        newFiles[name] = content;
      });
      setUploadedFiles(prev => ({ ...prev, ...newFiles }));
      
      toast({
        title: "Files uploaded",
        description: `${fileContents.length} files ready for deployment`,
      });
    });
  };

  const validateRepo = async () => {
    if (!repoUrl) return;
    
    try {
      const [validation, branchesData, frameworkData] = await Promise.all([
        apiRequest('POST', '/api/deployment/validate-repo', { repoUrl }),
        apiRequest('POST', '/api/deployment/repo-branches', { repoUrl }),
        apiRequest('POST', '/api/deployment/detect-framework', { repoUrl })
      ]);

      if (validation.valid) {
        setBranches(branchesData.branches || []);
        setFramework(frameworkData.framework || 'static');
        setBuildCommand(getDefaultBuildCommand(frameworkData.framework));
        setOutputDir(getDefaultOutputDir(frameworkData.framework));
        
        toast({
          title: "Repository validated",
          description: `Detected ${frameworkData.framework} project with ${branchesData.branches?.length || 0} branches`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Validation failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getDefaultBuildCommand = (framework: string): string => {
    const commands: Record<string, string> = {
      'react': 'npm run build',
      'vue': 'npm run build',
      'nextjs': 'npm run build',
      'static': 'echo "No build required"',
      'python': 'python -m compileall .'
    };
    return commands[framework] || 'npm run build';
  };

  const getDefaultOutputDir = (framework: string): string => {
    const dirs: Record<string, string> = {
      'react': 'build',
      'vue': 'dist',
      'nextjs': '.next',
      'static': '.',
      'python': '.'
    };
    return dirs[framework] || 'build';
  };

  useEffect(() => {
    if (repoUrl) {
      const debounce = setTimeout(validateRepo, 1000);
      return () => clearTimeout(debounce);
    }
  }, [repoUrl]);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Rocket className="h-8 w-8" />
            Deploy Your Site
          </h1>
          <p className="text-slate-400">Deploy from GitHub, upload files, or import from Replit</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="github" className="data-[state=active]:bg-slate-700">
              <GitBranch className="h-4 w-4 mr-2" />
              GitHub Repository
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-slate-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="replit" className="data-[state=active]:bg-slate-700">
              <Zap className="h-4 w-4 mr-2" />
              Import from Replit
            </TabsTrigger>
          </TabsList>

          {/* GitHub Deployment */}
          <TabsContent value="github">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Deploy from GitHub Repository</CardTitle>
                <CardDescription>
                  Connect your GitHub repository and deploy automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="repo-url" className="text-white">Repository URL</Label>
                    <Input
                      id="repo-url"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/repository"
                      className="bg-slate-800 border-slate-700 text-white mt-2"
                    />
                    {framework && (
                      <p className="text-sm text-green-400 mt-1">
                        Detected: {framework} project
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="site-name" className="text-white">Site Name</Label>
                      <Input
                        id="site-name"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        placeholder="my-awesome-site"
                        className="bg-slate-800 border-slate-700 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch" className="text-white">Branch</Label>
                      <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {branches.map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="build-command" className="text-white">Build Command</Label>
                      <Input
                        id="build-command"
                        value={buildCommand}
                        onChange={(e) => setBuildCommand(e.target.value)}
                        placeholder="npm run build"
                        className="bg-slate-800 border-slate-700 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="output-dir" className="text-white">Output Directory</Label>
                      <Input
                        id="output-dir"
                        value={outputDir}
                        onChange={(e) => setOutputDir(e.target.value)}
                        placeholder="build"
                        className="bg-slate-800 border-slate-700 text-white mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="env-vars" className="text-white">Environment Variables (JSON)</Label>
                    <Textarea
                      id="env-vars"
                      value={envVars}
                      onChange={(e) => setEnvVars(e.target.value)}
                      placeholder='{"NODE_ENV": "production", "API_URL": "https://api.example.com"}'
                      className="bg-slate-800 border-slate-700 text-white mt-2"
                      rows={3}
                    />
                  </div>
                </div>

                <Button 
                  onClick={deployFromGitHub}
                  disabled={isDeploying || !repoUrl || !siteName}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      Deploy from GitHub
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* File Upload Deployment */}
          <TabsContent value="upload">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Deploy from Files</CardTitle>
                <CardDescription>
                  Upload your project files and deploy instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload" className="text-white">Upload Files</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="bg-slate-800 border-slate-700 text-white mt-2"
                    />
                    {Object.keys(uploadedFiles).length > 0 && (
                      <p className="text-sm text-green-400 mt-1">
                        {Object.keys(uploadedFiles).length} files uploaded
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="upload-site-name" className="text-white">Site Name</Label>
                      <Input
                        id="upload-site-name"
                        value={uploadSiteName}
                        onChange={(e) => setUploadSiteName(e.target.value)}
                        placeholder="my-uploaded-site"
                        className="bg-slate-800 border-slate-700 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="upload-framework" className="text-white">Framework</Label>
                      <Select value={uploadFramework} onValueChange={setUploadFramework}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="auto-detect">Auto-detect</SelectItem>
                          <SelectItem value="react">React</SelectItem>
                          <SelectItem value="vue">Vue.js</SelectItem>
                          <SelectItem value="static">Static HTML</SelectItem>
                          <SelectItem value="nodejs">Node.js</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={deployFromUpload}
                  disabled={isDeploying || Object.keys(uploadedFiles).length === 0}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Deploy Uploaded Files
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Replit Import */}
          <TabsContent value="replit">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Import from Replit</CardTitle>
                <CardDescription>
                  Import and deploy a project directly from Replit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="replit-url" className="text-white">Replit Project URL</Label>
                    <Input
                      id="replit-url"
                      value={replitUrl}
                      onChange={(e) => setReplitUrl(e.target.value)}
                      placeholder="https://replit.com/@username/project-name"
                      className="bg-slate-800 border-slate-700 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="replit-project-name" className="text-white">Project Name (optional)</Label>
                    <Input
                      id="replit-project-name"
                      value={replitProjectName}
                      onChange={(e) => setReplitProjectName(e.target.value)}
                      placeholder="Leave empty to use original name"
                      className="bg-slate-800 border-slate-700 text-white mt-2"
                    />
                  </div>
                </div>

                <Button 
                  onClick={deployFromReplit}
                  disabled={isDeploying || !replitUrl}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Import from Replit
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Deployment Result */}
        {deploymentResult && (
          <Card className="border-slate-800 bg-slate-900 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {deploymentResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Deployment Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deploymentResult.success ? (
                <Alert className="border-green-500/20 bg-green-50/5">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-white">
                    Deployment successful! Your site is live at{' '}
                    <a 
                      href={deploymentResult.deploymentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                    >
                      {deploymentResult.deploymentUrl}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-500/20 bg-red-50/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-white">
                    Deployment failed: {deploymentResult.error}
                  </AlertDescription>
                </Alert>
              )}

              {deploymentResult.buildLogs.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Build Logs
                  </h4>
                  <div className="bg-slate-800 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                      {deploymentResult.buildLogs.join('\n')}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}