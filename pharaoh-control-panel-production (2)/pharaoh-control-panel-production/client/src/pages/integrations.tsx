import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code2, 
  Upload, 
  Download, 
  RefreshCw, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  PlayCircle,
  ArrowRightLeft,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface IntegrationProject {
  id: string;
  name: string;
  framework: string;
  source: 'replit' | 'vscode' | 'local';
  status: 'synced' | 'pending' | 'error';
  lastSync: string;
  platforms: {
    pharaoh: boolean;
    replit: boolean;
    vscode: boolean;
  };
}

export default function Integrations() {
  const [activeTab, setActiveTab] = useState('receive');
  const [projects, setProjects] = useState<IntegrationProject[]>([]);
  const [replitUrl, setReplitUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [installLinks, setInstallLinks] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadIntegrationData();
  }, []);

  const loadIntegrationData = async () => {
    try {
      const links = await apiRequest('GET', '/api/integrations/install-links');
      setInstallLinks(links);
      
      // Load existing projects
      const mockProjects: IntegrationProject[] = [
        {
          id: 'proj_1',
          name: 'react-portfolio',
          framework: 'react',
          source: 'replit',
          status: 'synced',
          lastSync: '2 minutes ago',
          platforms: { pharaoh: true, replit: true, vscode: false }
        },
        {
          id: 'proj_2',
          name: 'vue-dashboard',
          framework: 'vue',
          source: 'vscode',
          status: 'pending',
          lastSync: '1 hour ago',
          platforms: { pharaoh: true, replit: false, vscode: true }
        }
      ];
      setProjects(mockProjects);
    } catch (error: any) {
      toast({
        title: "Failed to load integration data",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const importFromReplit = async () => {
    if (!replitUrl) {
      toast({
        title: "URL required",
        description: "Please enter a Replit project URL",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    try {
      const result = await apiRequest('POST', '/api/integrations/replit/import', {
        replitUrl,
        projectName: extractProjectName(replitUrl),
        framework: 'auto-detect'
      });

      toast({
        title: "Import successful",
        description: `Project ${result.config.projectName} imported successfully`,
      });

      setReplitUrl('');
      loadIntegrationData();
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const exportToReplit = async (project: IntegrationProject) => {
    try {
      const result = await apiRequest('POST', '/api/integrations/export/replit', {
        projectId: project.id,
        projectName: project.name,
        framework: project.framework,
        files: {} // In production, fetch actual project files
      });

      window.open(result.exportUrl, '_blank');
      toast({
        title: "Export initiated",
        description: "Opening Replit with your project",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const exportToVSCode = async (project: IntegrationProject) => {
    try {
      const result = await apiRequest('POST', '/api/integrations/export/vscode', {
        projectId: project.id,
        projectName: project.name,
        framework: project.framework,
        files: {} // In production, fetch actual project files
      });

      // Trigger download
      window.open(result.downloadUrl, '_blank');
      toast({
        title: "Download started",
        description: "Project files are being prepared for VS Code",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const syncProject = async (projectId: string) => {
    try {
      const syncStatus = await apiRequest('GET', `/api/integrations/sync/${projectId}`);
      
      toast({
        title: "Sync complete",
        description: `Project synchronized across ${Object.keys(syncStatus.platforms).length} platforms`,
      });

      loadIntegrationData();
    } catch (error: any) {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Link copied successfully",
    });
  };

  const extractProjectName = (url: string): string => {
    const match = url.match(/replit\.com\/@[^\/]+\/([^\/\?]+)/);
    return match ? match[1] : 'imported-project';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'synced':
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Synced</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ArrowRightLeft className="h-8 w-8" />
            Platform Integrations
          </h1>
          <p className="text-slate-400">Seamlessly sync projects between Replit, VS Code, and Pharaoh Control Panel</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="receive" className="data-[state=active]:bg-slate-700">
              <Upload className="h-4 w-4 mr-2" />
              Receive Projects
            </TabsTrigger>
            <TabsTrigger value="send" className="data-[state=active]:bg-slate-700">
              <Download className="h-4 w-4 mr-2" />
              Send Projects
            </TabsTrigger>
            <TabsTrigger value="sync" className="data-[state=active]:bg-slate-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Management
            </TabsTrigger>
            <TabsTrigger value="extensions" className="data-[state=active]:bg-slate-700">
              <Code2 className="h-4 w-4 mr-2" />
              Extensions
            </TabsTrigger>
          </TabsList>

          {/* Receive Projects Tab */}
          <TabsContent value="receive">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <img src="https://replit.com/public/images/logo-small.png" alt="Replit" className="h-5 w-5" />
                    Import from Replit
                  </CardTitle>
                  <CardDescription>
                    Import any Replit project and deploy it instantly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <Button 
                    onClick={importFromReplit}
                    disabled={importing || !replitUrl}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {importing ? 'Importing...' : 'Import Project'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    From VS Code Extension
                  </CardTitle>
                  <CardDescription>
                    Deploy directly from VS Code with our extension
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-blue-500/20 bg-blue-50/5">
                    <Zap className="h-4 w-4" />
                    <AlertDescription className="text-white">
                      Install the VS Code extension to deploy projects with one click
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={() => window.open(installLinks?.vscode?.marketplaceUrl, '_blank')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get VS Code Extension
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Send Projects Tab */}
          <TabsContent value="send">
            <div className="space-y-6">
              <Alert className="border-green-500/20 bg-green-50/5">
                <ArrowRightLeft className="h-4 w-4" />
                <AlertDescription className="text-white">
                  Export your projects to continue development on Replit or VS Code
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                {projects.map(project => (
                  <Card key={project.id} className="border-slate-800 bg-slate-900">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="text-white font-semibold">{project.name}</h3>
                            <p className="text-sm text-slate-400">Framework: {project.framework}</p>
                          </div>
                          {getStatusBadge(project.status)}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => exportToReplit(project)}
                            variant="outline"
                            size="sm"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            To Replit
                          </Button>
                          <Button
                            onClick={() => exportToVSCode(project)}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            To VS Code
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Sync Management Tab */}
          <TabsContent value="sync">
            <div className="space-y-6">
              <Alert className="border-yellow-500/20 bg-yellow-50/5">
                <RefreshCw className="h-4 w-4" />
                <AlertDescription className="text-white">
                  Keep your projects synchronized across all platforms with real-time updates
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                {projects.map(project => (
                  <Card key={project.id} className="border-slate-800 bg-slate-900">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">{project.name}</h3>
                          <p className="text-sm text-slate-400">Last sync: {project.lastSync}</p>
                          <div className="flex gap-2 mt-2">
                            {project.platforms.pharaoh && <Badge variant="outline">Pharaoh</Badge>}
                            {project.platforms.replit && <Badge variant="outline">Replit</Badge>}
                            {project.platforms.vscode && <Badge variant="outline">VS Code</Badge>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(project.status)}
                          <Button
                            onClick={() => syncProject(project.id)}
                            variant="outline"
                            size="sm"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Extensions Tab */}
          <TabsContent value="extensions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    VS Code Extension
                  </CardTitle>
                  <CardDescription>
                    Deploy directly from your VS Code workspace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded text-sm text-slate-300 font-mono">
                      ext install pharaoh.control-panel-deploy
                    </div>
                    <Button
                      onClick={() => copyToClipboard('ext install pharaoh.control-panel-deploy')}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Install Command
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(installLinks?.vscode?.marketplaceUrl, '_blank')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Marketplace
                    </Button>
                    <Button
                      onClick={() => window.open(installLinks?.vscode?.url, '_blank')}
                      variant="outline"
                      className="flex-1"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Install
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <img src="https://replit.com/public/images/logo-small.png" alt="Replit" className="h-5 w-5" />
                    Replit Template
                  </CardTitle>
                  <CardDescription>
                    Quick deployment template for Replit projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded text-sm text-slate-300">
                      Use our template to set up automatic deployment from any Replit project
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(installLinks?.replit?.templateUrl, '_blank')}
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(installLinks?.replit?.webhookUrl)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Webhook URL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}