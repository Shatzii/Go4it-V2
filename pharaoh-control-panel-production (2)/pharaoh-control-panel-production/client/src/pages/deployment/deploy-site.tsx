import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  GitBranch, 
  Rocket, 
  CheckCircle, 
  AlertCircle, 
  Folder,
  Globe,
  Terminal,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface DeploymentConfig {
  name: string;
  framework: string;
  buildCommand: string;
  outputDir: string;
  envVars: Record<string, string>;
  domain?: string;
}

interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
}

export default function DeploySite() {
  const [deploymentMethod, setDeploymentMethod] = useState<'upload' | 'git'>('upload');
  const [config, setConfig] = useState<DeploymentConfig>({
    name: '',
    framework: 'static',
    buildCommand: '',
    outputDir: 'dist',
    envVars: {}
  });
  
  const [files, setFiles] = useState<FileList | null>(null);
  const [gitRepo, setGitRepo] = useState('');
  const [gitBranch, setGitBranch] = useState('main');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([]);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [envVarKey, setEnvVarKey] = useState('');
  const [envVarValue, setEnvVarValue] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const frameworks = [
    { id: 'static', name: 'Static HTML/CSS/JS', buildCmd: '', outputDir: '.' },
    { id: 'react', name: 'React', buildCmd: 'npm run build', outputDir: 'build' },
    { id: 'vue', name: 'Vue.js', buildCmd: 'npm run build', outputDir: 'dist' },
    { id: 'angular', name: 'Angular', buildCmd: 'ng build', outputDir: 'dist' },
    { id: 'svelte', name: 'Svelte', buildCmd: 'npm run build', outputDir: 'public' },
    { id: 'nextjs', name: 'Next.js', buildCmd: 'npm run build', outputDir: '.next' },
    { id: 'nuxt', name: 'Nuxt.js', buildCmd: 'npm run generate', outputDir: 'dist' },
    { id: 'gatsby', name: 'Gatsby', buildCmd: 'gatsby build', outputDir: 'public' }
  ];

  const handleFrameworkChange = (frameworkId: string) => {
    const framework = frameworks.find(f => f.id === frameworkId);
    if (framework) {
      setConfig({
        ...config,
        framework: frameworkId,
        buildCommand: framework.buildCmd,
        outputDir: framework.outputDir
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles && uploadedFiles.length > 0) {
      setFiles(uploadedFiles);
      toast({
        title: "Files selected",
        description: `Selected ${uploadedFiles.length} files for upload`,
      });
    }
  };

  const addEnvVar = () => {
    if (envVarKey && envVarValue) {
      setConfig({
        ...config,
        envVars: {
          ...config.envVars,
          [envVarKey]: envVarValue
        }
      });
      setEnvVarKey('');
      setEnvVarValue('');
    }
  };

  const removeEnvVar = (key: string) => {
    const newEnvVars = { ...config.envVars };
    delete newEnvVars[key];
    setConfig({ ...config, envVars: newEnvVars });
  };

  const startDeployment = async () => {
    if (deploymentMethod === 'upload' && !files) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive"
      });
      return;
    }

    if (deploymentMethod === 'git' && !gitRepo) {
      toast({
        title: "No repository specified",
        description: "Please enter a Git repository URL",
        variant: "destructive"
      });
      return;
    }

    setIsDeploying(true);
    setDeploymentProgress(0);
    setDeploymentUrl(null);

    const steps: DeploymentStep[] = [
      { id: 'init', name: 'Initializing deployment', status: 'pending' },
      { id: 'upload', name: deploymentMethod === 'upload' ? 'Uploading files' : 'Cloning repository', status: 'pending' },
      { id: 'deps', name: 'Installing dependencies', status: 'pending' },
      { id: 'build', name: 'Building application', status: 'pending' },
      { id: 'deploy', name: 'Deploying to server', status: 'pending' },
      { id: 'complete', name: 'Deployment complete', status: 'pending' }
    ];

    setDeploymentSteps(steps);

    try {
      // Simulate deployment process
      for (let i = 0; i < steps.length; i++) {
        const currentStep = steps[i];
        
        // Update step status to running
        setDeploymentSteps(prev => prev.map(step => 
          step.id === currentStep.id 
            ? { ...step, status: 'running' }
            : step
        ));
        
        // Simulate deployment time
        const delay = Math.random() * 2000 + 1000; // 1-3 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Update progress
        setDeploymentProgress((i + 1) / steps.length * 100);
        
        // Mark step as completed
        setDeploymentSteps(prev => prev.map(step => 
          step.id === currentStep.id 
            ? { 
                ...step, 
                status: 'completed',
                output: `${currentStep.name} completed successfully`
              }
            : step
        ));
        
        // Add some realistic output for certain steps
        if (currentStep.id === 'upload') {
          setDeploymentSteps(prev => prev.map(step => 
            step.id === currentStep.id 
              ? { 
                  ...step, 
                  output: deploymentMethod === 'upload' 
                    ? `Uploaded ${files?.length || 0} files` 
                    : `Cloned repository: ${gitRepo}`
                }
              : step
          ));
        }
      }

      // Generate deployment URL
      const deploymentId = Math.random().toString(36).substring(7);
      const url = `https://${config.name || 'site'}-${deploymentId}.pharaoh-deploy.com`;
      setDeploymentUrl(url);

      toast({
        title: "Deployment successful!",
        description: "Your site has been deployed successfully",
      });

    } catch (error) {
      toast({
        title: "Deployment failed",
        description: "There was an error during deployment",
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Deploy Site</h1>
          <p className="text-slate-400">Deploy your website or application with automatic build and hosting</p>
        </div>

        {!isDeploying && !deploymentUrl && (
          <Tabs defaultValue="source" className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="source" className="data-[state=active]:bg-slate-700">Source</TabsTrigger>
              <TabsTrigger value="config" className="data-[state=active]:bg-slate-700">Configuration</TabsTrigger>
              <TabsTrigger value="deploy" className="data-[state=active]:bg-slate-700">Deploy</TabsTrigger>
            </TabsList>

            <TabsContent value="source">
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">Choose Deployment Method</CardTitle>
                  <CardDescription>Select how you want to deploy your site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card 
                      className={`cursor-pointer transition-colors ${
                        deploymentMethod === 'upload' 
                          ? 'border-blue-500 bg-blue-50/5' 
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                      onClick={() => setDeploymentMethod('upload')}
                    >
                      <CardContent className="p-6 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white mb-2">Upload Files</h3>
                        <p className="text-sm text-slate-400">Upload a ZIP file or multiple files</p>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-colors ${
                        deploymentMethod === 'git' 
                          ? 'border-blue-500 bg-blue-50/5' 
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                      onClick={() => setDeploymentMethod('git')}
                    >
                      <CardContent className="p-6 text-center">
                        <GitBranch className="h-12 w-12 mx-auto mb-4 text-green-400" />
                        <h3 className="text-lg font-semibold text-white mb-2">Git Repository</h3>
                        <p className="text-sm text-slate-400">Deploy from GitHub, GitLab, or Bitbucket</p>
                      </CardContent>
                    </Card>
                  </div>

                  {deploymentMethod === 'upload' && (
                    <div className="space-y-4">
                      <Label className="text-white">Upload Files</Label>
                      <div 
                        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Folder className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                        <p className="text-white mb-2">
                          {files ? `${files.length} files selected` : 'Click to upload files or drag and drop'}
                        </p>
                        <p className="text-sm text-slate-400">
                          ZIP files, HTML, CSS, JS, or any web assets
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".zip,.html,.css,.js,.json,image/*"
                      />
                    </div>
                  )}

                  {deploymentMethod === 'git' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="gitRepo" className="text-white">Repository URL</Label>
                        <Input
                          id="gitRepo"
                          value={gitRepo}
                          onChange={(e) => setGitRepo(e.target.value)}
                          placeholder="https://github.com/username/repository.git"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gitBranch" className="text-white">Branch</Label>
                        <Input
                          id="gitBranch"
                          value={gitBranch}
                          onChange={(e) => setGitBranch(e.target.value)}
                          placeholder="main"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="config">
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Build Configuration
                  </CardTitle>
                  <CardDescription>Configure how your site should be built and deployed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="siteName" className="text-white">Site Name</Label>
                      <Input
                        id="siteName"
                        value={config.name}
                        onChange={(e) => setConfig({...config, name: e.target.value})}
                        placeholder="my-awesome-site"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Framework</Label>
                      <Select value={config.framework} onValueChange={handleFrameworkChange}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {frameworks.map(framework => (
                            <SelectItem key={framework.id} value={framework.id} className="text-white">
                              {framework.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buildCommand" className="text-white">Build Command</Label>
                      <Input
                        id="buildCommand"
                        value={config.buildCommand}
                        onChange={(e) => setConfig({...config, buildCommand: e.target.value})}
                        placeholder="npm run build"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="outputDir" className="text-white">Output Directory</Label>
                      <Input
                        id="outputDir"
                        value={config.outputDir}
                        onChange={(e) => setConfig({...config, outputDir: e.target.value})}
                        placeholder="dist"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-4 block">Environment Variables</Label>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={envVarKey}
                          onChange={(e) => setEnvVarKey(e.target.value)}
                          placeholder="Variable name"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                        <Input
                          value={envVarValue}
                          onChange={(e) => setEnvVarValue(e.target.value)}
                          placeholder="Variable value"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                        <Button onClick={addEnvVar} variant="outline">Add</Button>
                      </div>
                      
                      {Object.entries(config.envVars).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-slate-800 p-3 rounded">
                          <span className="text-white">{key} = {value}</span>
                          <Button 
                            onClick={() => removeEnvVar(key)} 
                            variant="ghost" 
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deploy">
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Ready to Deploy
                  </CardTitle>
                  <CardDescription>Review your configuration and deploy your site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-4">Deployment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Method:</span>
                        <span className="text-white">{deploymentMethod === 'upload' ? 'File Upload' : 'Git Repository'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Framework:</span>
                        <span className="text-white">{frameworks.find(f => f.id === config.framework)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Build Command:</span>
                        <span className="text-white">{config.buildCommand || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Output Directory:</span>
                        <span className="text-white">{config.outputDir}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={startDeployment} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Deploy Site
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {isDeploying && (
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Deploying Your Site
              </CardTitle>
              <CardDescription>Please wait while your site is being deployed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white">{Math.round(deploymentProgress)}%</span>
                </div>
                <Progress value={deploymentProgress} className="w-full" />
              </div>

              <div className="space-y-3">
                {deploymentSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3">
                    {step.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-400" />}
                    {step.status === 'running' && <div className="h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />}
                    {step.status === 'failed' && <AlertCircle className="h-5 w-5 text-red-400" />}
                    {step.status === 'pending' && <div className="h-5 w-5 border-2 border-slate-600 rounded-full" />}
                    
                    <div className="flex-1">
                      <p className="text-white">{step.name}</p>
                      {step.output && <p className="text-sm text-slate-400">{step.output}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {deploymentUrl && (
          <Card className="border-green-500 bg-green-50/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Deployment Successful!
              </CardTitle>
              <CardDescription>Your site has been deployed and is now live</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-green-500/20 bg-green-50/5">
                <Globe className="h-4 w-4" />
                <AlertDescription className="text-white">
                  Your site is now available at: 
                  <a 
                    href={deploymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 ml-2 underline"
                  >
                    {deploymentUrl}
                  </a>
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button 
                  onClick={() => window.open(deploymentUrl, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Site
                </Button>
                <Button 
                  onClick={() => {
                    setDeploymentUrl(null);
                    setFiles(null);
                    setGitRepo('');
                    setConfig({
                      name: '',
                      framework: 'static',
                      buildCommand: '',
                      outputDir: 'dist',
                      envVars: {}
                    });
                  }}
                  variant="outline"
                >
                  Deploy Another Site
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}