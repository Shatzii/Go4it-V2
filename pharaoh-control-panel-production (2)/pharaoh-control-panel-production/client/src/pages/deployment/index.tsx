import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code,
  Cog,
  Database,
  FileCode,
  GitBranch,
  Github,
  Globe,
  HardDrive,
  LayoutGrid,
  Package,
  Play,
  RefreshCw,
  Rocket,
  Server,
  Settings,
  Share2,
  Terminal,
  Upload,
  Workflow,
  XCircle,
  Zap
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';

// Server type
interface ServerConnection {
  id: string;
  name: string;
  hostname: string;
  port: number;
  username: string;
  connectionStatus: 'connected' | 'disconnected' | 'pending' | 'failed';
  serverType: 'linux' | 'windows';
  operatingSystem?: string;
  tags: string[];
}

// Deployment config type
interface DeploymentConfig {
  id: string;
  name: string;
  description?: string;
  sourceType: 'git' | 'local' | 'docker';
  repositoryUrl?: string;
  branch?: string;
  localPath?: string;
  dockerImage?: string;
  buildCommand?: string;
  startCommand: string;
  environmentVariables: Record<string, string>;
  port: number;
  healthCheckPath?: string;
  serverId: string;
  deploymentPath: string;
  createdAt: string;
  updatedAt: string;
  lastDeployedAt?: string;
  deploymentStatus?: 'success' | 'failed' | 'in-progress' | 'not-deployed';
}

// Deployment log type
interface DeploymentLog {
  id: string;
  deploymentId: string;
  timestamp: string;
  status: 'success' | 'error' | 'info' | 'warning';
  message: string;
  step: 'init' | 'build' | 'transfer' | 'setup' | 'start' | 'complete';
}

// New deployment form schema
const deploymentSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  sourceType: z.enum(['git', 'local', 'docker']),
  repositoryUrl: z.string().url().optional().refine(url => {
    // Only required when sourceType is 'git'
    return true;
  }),
  branch: z.string().optional(),
  localPath: z.string().optional(),
  dockerImage: z.string().optional(),
  buildCommand: z.string().optional(),
  startCommand: z.string().min(1, { message: 'Start command is required.' }),
  port: z.coerce.number().int().min(1).max(65535),
  environmentVariables: z.record(z.string()),
  healthCheckPath: z.string().optional(),
  serverId: z.string().min(1, { message: 'Server is required.' }),
  deploymentPath: z.string().min(1, { message: 'Deployment path is required.' }),
}).refine(data => {
  // Conditional validation based on sourceType
  if (data.sourceType === 'git' && !data.repositoryUrl) {
    return false;
  }
  if (data.sourceType === 'docker' && !data.dockerImage) {
    return false;
  }
  return true;
}, {
  message: "Please provide required fields for the selected source type",
  path: ["repositoryUrl", "dockerImage"]
});

type DeploymentFormValues = z.infer<typeof deploymentSchema>;

const DeploymentPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentLogs, setDeploymentLogs] = useState<DeploymentLog[]>([]);
  const [deploymentStep, setDeploymentStep] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);

  // Fetch servers
  const { data: servers = [], isLoading: isLoadingServers } = useQuery({
    queryKey: ['/api/servers'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/servers');
        if (!response.ok) {
          throw new Error('Failed to fetch servers');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching servers:', error);
        // Return sample data for development
        return sampleServers;
      }
    },
    enabled: !!user,
  });

  // Fetch deployment configurations
  const { data: deployments = [], isLoading: isLoadingDeployments } = useQuery({
    queryKey: ['/api/deployments'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/deployments');
        if (!response.ok) {
          throw new Error('Failed to fetch deployments');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching deployments:', error);
        // Return sample data for development
        return sampleDeployments;
      }
    },
    enabled: !!user,
  });

  // Fetch deployment logs when a deployment is selected
  const { data: logs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: [`/api/deployments/${selectedDeployment}/logs`],
    queryFn: async () => {
      if (!selectedDeployment) return [];
      
      try {
        const response = await apiRequest('GET', `/api/deployments/${selectedDeployment}/logs`);
        if (!response.ok) {
          throw new Error('Failed to fetch deployment logs');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching deployment logs:', error);
        return [];
      }
    },
    enabled: !!selectedDeployment && !!user,
  });

  // Create deployment mutation
  const createDeploymentMutation = useMutation({
    mutationFn: async (data: DeploymentFormValues) => {
      const response = await apiRequest('POST', '/api/deployments', data);
      if (!response.ok) {
        throw new Error('Failed to create deployment');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deployments'] });
      toast({
        title: "Deployment created",
        description: "Your deployment configuration has been created successfully.",
      });
      setIsCreating(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create deployment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Deploy mutation
  const deployMutation = useMutation({
    mutationFn: async (deploymentId: string) => {
      // Reset progress and logs for new deployment
      setDeploymentProgress(0);
      setDeploymentLogs([]);
      setDeploymentStep('init');
      
      const response = await apiRequest('POST', `/api/deployments/${deploymentId}/deploy`);
      if (!response.ok) {
        throw new Error('Failed to deploy');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/deployments'] });
      toast({
        title: "Deployment successful",
        description: "Your application has been deployed successfully.",
      });
      setIsDeploying(null);
      setDeploymentStep(null);
      setDeploymentProgress(100);
    },
    onError: (error) => {
      toast({
        title: "Deployment failed",
        description: error.message,
        variant: "destructive",
      });
      setIsDeploying(null);
      setDeploymentStep(null);
    },
  });

  // Delete deployment mutation
  const deleteDeploymentMutation = useMutation({
    mutationFn: async (deploymentId: string) => {
      const response = await apiRequest('DELETE', `/api/deployments/${deploymentId}`);
      if (!response.ok) {
        throw new Error('Failed to delete deployment');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deployments'] });
      toast({
        title: "Deployment deleted",
        description: "Your deployment configuration has been deleted.",
      });
      setIsConfirmingDelete(null);
      if (selectedDeployment === isConfirmingDelete) {
        setSelectedDeployment(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to delete deployment",
        description: error.message,
        variant: "destructive",
      });
      setIsConfirmingDelete(null);
    },
  });

  // Deployment form
  const form = useForm<DeploymentFormValues>({
    resolver: zodResolver(deploymentSchema),
    defaultValues: {
      name: '',
      description: '',
      sourceType: 'git',
      repositoryUrl: '',
      branch: 'main',
      buildCommand: 'npm run build',
      startCommand: 'npm start',
      port: 3000,
      environmentVariables: {},
      deploymentPath: '/var/www/app',
      serverId: '',
    },
  });

  // Watch sourceType to handle conditional validation
  const sourceType = form.watch('sourceType');

  // Handle form submission
  const onSubmit = (data: DeploymentFormValues) => {
    createDeploymentMutation.mutate(data);
  };

  // Helper function to get the server name from ID
  const getServerName = (serverId: string) => {
    const server = servers.find((s: ServerConnection) => s.id === serverId);
    return server ? server.name : 'Unknown Server';
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Sample server data for development
  const sampleServers: ServerConnection[] = [
    {
      id: '1',
      name: 'Production Web Server',
      hostname: 'web1.example.com',
      port: 22,
      username: 'admin',
      connectionStatus: 'connected',
      serverType: 'linux',
      operatingSystem: 'Ubuntu 22.04 LTS',
      tags: ['production', 'web'],
    },
    {
      id: '2',
      name: 'Database Server',
      hostname: 'db.example.com',
      port: 22,
      username: 'dbadmin',
      connectionStatus: 'connected',
      serverType: 'linux',
      operatingSystem: 'CentOS 8',
      tags: ['production', 'database'],
    },
    {
      id: '3',
      name: 'Staging Server',
      hostname: 'staging.example.com',
      port: 22,
      username: 'developer',
      connectionStatus: 'disconnected',
      serverType: 'linux',
      operatingSystem: 'Debian 11',
      tags: ['staging', 'testing'],
    }
  ];

  // Sample deployment data for development
  const sampleDeployments: DeploymentConfig[] = [
    {
      id: '1',
      name: 'Frontend App',
      description: 'React frontend application',
      sourceType: 'git',
      repositoryUrl: 'https://github.com/user/frontend-app.git',
      branch: 'main',
      buildCommand: 'npm run build',
      startCommand: 'npm start',
      environmentVariables: {
        NODE_ENV: 'production',
        API_URL: 'https://api.example.com',
      },
      port: 3000,
      healthCheckPath: '/health',
      serverId: '1',
      deploymentPath: '/var/www/frontend',
      createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      lastDeployedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      deploymentStatus: 'success',
    },
    {
      id: '2',
      name: 'Backend API',
      description: 'Node.js API server',
      sourceType: 'git',
      repositoryUrl: 'https://github.com/user/backend-api.git',
      branch: 'main',
      buildCommand: 'npm run build',
      startCommand: 'node dist/index.js',
      environmentVariables: {
        NODE_ENV: 'production',
        DB_URL: 'postgresql://user:pass@db.example.com/api',
        PORT: '4000',
      },
      port: 4000,
      healthCheckPath: '/api/health',
      serverId: '1',
      deploymentPath: '/var/www/backend',
      createdAt: new Date(Date.now() - 14 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
      lastDeployedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
      deploymentStatus: 'success',
    },
    {
      id: '3',
      name: 'Database Migrations',
      description: 'Database migration scripts',
      sourceType: 'git',
      repositoryUrl: 'https://github.com/user/db-migrations.git',
      branch: 'main',
      buildCommand: 'npm install',
      startCommand: 'npm run migrate',
      environmentVariables: {
        DB_URL: 'postgresql://user:pass@db.example.com/api',
      },
      port: 0,
      serverId: '2',
      deploymentPath: '/var/db/migrations',
      createdAt: new Date(Date.now() - 21 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
      deploymentStatus: 'not-deployed',
    }
  ];

  // Sample logs for development
  const sampleLogs: DeploymentLog[] = [
    {
      id: '1',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 121 * 60000).toISOString(),
      status: 'info',
      message: 'Starting deployment process for Frontend App',
      step: 'init',
    },
    {
      id: '2',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      status: 'info',
      message: 'Cloning repository from https://github.com/user/frontend-app.git',
      step: 'init',
    },
    {
      id: '3',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 119 * 60000).toISOString(),
      status: 'info',
      message: 'Repository cloned successfully',
      step: 'init',
    },
    {
      id: '4',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 118 * 60000).toISOString(),
      status: 'info',
      message: 'Installing dependencies...',
      step: 'build',
    },
    {
      id: '5',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 115 * 60000).toISOString(),
      status: 'info',
      message: 'Dependencies installed successfully',
      step: 'build',
    },
    {
      id: '6',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 114 * 60000).toISOString(),
      status: 'info',
      message: 'Running build command: npm run build',
      step: 'build',
    },
    {
      id: '7',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 110 * 60000).toISOString(),
      status: 'info',
      message: 'Build completed successfully',
      step: 'build',
    },
    {
      id: '8',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 108 * 60000).toISOString(),
      status: 'info',
      message: 'Transferring files to server...',
      step: 'transfer',
    },
    {
      id: '9',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 105 * 60000).toISOString(),
      status: 'info',
      message: 'Files transferred successfully',
      step: 'transfer',
    },
    {
      id: '10',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 104 * 60000).toISOString(),
      status: 'info',
      message: 'Setting up application on server...',
      step: 'setup',
    },
    {
      id: '11',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 102 * 60000).toISOString(),
      status: 'info',
      message: 'Setting environment variables',
      step: 'setup',
    },
    {
      id: '12',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 101 * 60000).toISOString(),
      status: 'info',
      message: 'Setting up process manager',
      step: 'setup',
    },
    {
      id: '13',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 100 * 60000).toISOString(),
      status: 'info',
      message: 'Starting application: npm start',
      step: 'start',
    },
    {
      id: '14',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 99 * 60000).toISOString(),
      status: 'info',
      message: 'Application started successfully',
      step: 'start',
    },
    {
      id: '15',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 98 * 60000).toISOString(),
      status: 'info',
      message: 'Health check passed',
      step: 'start',
    },
    {
      id: '16',
      deploymentId: '1',
      timestamp: new Date(Date.now() - 97 * 60000).toISOString(),
      status: 'success',
      message: 'Deployment completed successfully',
      step: 'complete',
    },
  ];

  // Use the fetched logs or sample logs
  const deploymentLogEntries = selectedDeployment && logs.length > 0 ? logs : 
    selectedDeployment === '1' ? sampleLogs : [];

  // Add new environment variable field
  const addEnvironmentVariable = () => {
    const envVars = form.getValues('environmentVariables');
    const newKey = `ENV_VAR_${Object.keys(envVars).length + 1}`;
    form.setValue('environmentVariables', {
      ...envVars,
      [newKey]: '',
    });
  };

  // Remove environment variable field
  const removeEnvironmentVariable = (key: string) => {
    const envVars = { ...form.getValues('environmentVariables') };
    delete envVars[key];
    form.setValue('environmentVariables', envVars);
  };

  // Deployment card component
  const DeploymentCard = ({ deployment }: { deployment: DeploymentConfig }) => {
    const isActive = selectedDeployment === deployment.id;
    const isDeployingThis = isDeploying === deployment.id;
    
    return (
      <Card 
        className={`border-slate-800 bg-slate-900 transition-all duration-200 ${
          isActive ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'hover:border-slate-700'
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg text-white">{deployment.name}</CardTitle>
              <CardDescription className="text-sm text-slate-400">
                {deployment.description || 'No description'}
              </CardDescription>
            </div>
            <Badge className={`px-3 py-1 ${
              deployment.deploymentStatus === 'success' ? 'bg-emerald-500' :
              deployment.deploymentStatus === 'failed' ? 'bg-rose-500' :
              deployment.deploymentStatus === 'in-progress' ? 'bg-amber-500' :
              'bg-slate-500'
            }`}>
              {deployment.deploymentStatus === 'success' ? 'Deployed' :
               deployment.deploymentStatus === 'failed' ? 'Failed' :
               deployment.deploymentStatus === 'in-progress' ? 'In Progress' :
               'Not Deployed'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Server className="mr-2 h-4 w-4 text-slate-400" />
              <span className="text-slate-400">Server:</span>
              <span className="ml-2 text-white">{getServerName(deployment.serverId)}</span>
            </div>
            <div className="flex items-center text-sm">
              <HardDrive className="mr-2 h-4 w-4 text-slate-400" />
              <span className="text-slate-400">Path:</span>
              <span className="ml-2 text-white">{deployment.deploymentPath}</span>
            </div>
            <div className="flex items-center text-sm">
              <Globe className="mr-2 h-4 w-4 text-slate-400" />
              <span className="text-slate-400">Port:</span>
              <span className="ml-2 text-white">{deployment.port}</span>
            </div>
            {deployment.sourceType === 'git' && (
              <div className="flex items-center text-sm">
                <Github className="mr-2 h-4 w-4 text-slate-400" />
                <span className="text-slate-400">Repository:</span>
                <span className="ml-2 text-white truncate max-w-xs">{deployment.repositoryUrl}</span>
              </div>
            )}
            {deployment.lastDeployedAt && (
              <div className="flex items-center text-sm">
                <Rocket className="mr-2 h-4 w-4 text-slate-400" />
                <span className="text-slate-400">Last deployed:</span>
                <span className="ml-2 text-white">{formatDate(deployment.lastDeployedAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t border-slate-800 pt-4 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 hover:border-blue-500 hover:text-blue-400"
            onClick={() => setSelectedDeployment(deployment.id)}
          >
            {isActive ? 'Hide Details' : 'View Details'}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
            disabled={isDeployingThis}
            onClick={() => {
              setIsDeploying(deployment.id);
              deployMutation.mutate(deployment.id);
            }}
          >
            {isDeployingThis ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" />
                Deploy
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">One-Click</span> Deployment
          </h1>
          <Button
            onClick={() => {
              form.reset();
              setIsCreating(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
          >
            <Rocket className="mr-2 h-4 w-4" />
            New Deployment
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        {isLoadingDeployments || isLoadingServers ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left column - Deployment configurations */}
            <div className="lg:col-span-1">
              <h2 className="mb-4 text-xl font-semibold text-white">Deployment Configurations</h2>
              
              {deployments.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900 p-8 text-center">
                  <Rocket className="mb-4 h-12 w-12 text-slate-700" />
                  <h3 className="mb-2 text-xl font-medium text-slate-400">No deployments yet</h3>
                  <p className="mb-6 text-slate-500">
                    Create your first deployment configuration to get started.
                  </p>
                  <Button
                    onClick={() => {
                      form.reset();
                      setIsCreating(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    New Deployment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {deployments.map((deployment) => (
                    <DeploymentCard key={deployment.id} deployment={deployment} />
                  ))}
                </div>
              )}
            </div>
            
            {/* Right column - Deployment details */}
            <div className="lg:col-span-2">
              {selectedDeployment ? (
                <div className="space-y-6">
                  {/* Selected deployment details */}
                  {deployments.filter(d => d.id === selectedDeployment).map(deployment => (
                    <Card key={deployment.id} className="border-slate-800 bg-slate-900">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl text-white">{deployment.name} Details</CardTitle>
                            <CardDescription className="text-slate-400">{deployment.description}</CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-700 hover:border-slate-600"
                              onClick={() => setIsConfirmingDelete(deployment.id)}
                            >
                              <XCircle className="mr-2 h-4 w-4 text-rose-500" />
                              Delete
                            </Button>
                            <Button
                              className="bg-blue-600 hover:bg-blue-700"
                              size="sm"
                              disabled={isDeploying === deployment.id}
                              onClick={() => {
                                setIsDeploying(deployment.id);
                                deployMutation.mutate(deployment.id);
                              }}
                            >
                              {isDeploying === deployment.id ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Deploying...
                                </>
                              ) : (
                                <>
                                  <Rocket className="mr-2 h-4 w-4" />
                                  Deploy Now
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <Tabs defaultValue="configuration">
                          <TabsList className="bg-slate-800">
                            <TabsTrigger value="configuration">Configuration</TabsTrigger>
                            <TabsTrigger value="environment">Environment</TabsTrigger>
                            <TabsTrigger value="logs">Deployment Logs</TabsTrigger>
                          </TabsList>
                          
                          {/* Configuration tab */}
                          <TabsContent value="configuration" className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                                <h3 className="mb-3 font-medium text-white">Deployment Details</h3>
                                <dl className="space-y-2">
                                  <div className="flex justify-between">
                                    <dt className="text-sm text-slate-400">Server</dt>
                                    <dd className="text-sm text-white">{getServerName(deployment.serverId)}</dd>
                                  </div>
                                  <div className="flex justify-between">
                                    <dt className="text-sm text-slate-400">Path</dt>
                                    <dd className="text-sm text-white">{deployment.deploymentPath}</dd>
                                  </div>
                                  <div className="flex justify-between">
                                    <dt className="text-sm text-slate-400">Port</dt>
                                    <dd className="text-sm text-white">{deployment.port}</dd>
                                  </div>
                                  {deployment.healthCheckPath && (
                                    <div className="flex justify-between">
                                      <dt className="text-sm text-slate-400">Health Check</dt>
                                      <dd className="text-sm text-white">{deployment.healthCheckPath}</dd>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <dt className="text-sm text-slate-400">Created</dt>
                                    <dd className="text-sm text-white">{formatDate(deployment.createdAt)}</dd>
                                  </div>
                                  {deployment.lastDeployedAt && (
                                    <div className="flex justify-between">
                                      <dt className="text-sm text-slate-400">Last Deployed</dt>
                                      <dd className="text-sm text-white">{formatDate(deployment.lastDeployedAt)}</dd>
                                    </div>
                                  )}
                                </dl>
                              </div>
                              
                              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                                <h3 className="mb-3 font-medium text-white">Source Configuration</h3>
                                <dl className="space-y-2">
                                  <div className="flex justify-between">
                                    <dt className="text-sm text-slate-400">Source Type</dt>
                                    <dd className="text-sm text-white capitalize">{deployment.sourceType}</dd>
                                  </div>
                                  {deployment.sourceType === 'git' && (
                                    <>
                                      <div className="flex justify-between">
                                        <dt className="text-sm text-slate-400">Repository</dt>
                                        <dd className="text-sm text-white truncate max-w-[200px]">{deployment.repositoryUrl}</dd>
                                      </div>
                                      <div className="flex justify-between">
                                        <dt className="text-sm text-slate-400">Branch</dt>
                                        <dd className="text-sm text-white">{deployment.branch}</dd>
                                      </div>
                                    </>
                                  )}
                                  {deployment.sourceType === 'docker' && (
                                    <div className="flex justify-between">
                                      <dt className="text-sm text-slate-400">Docker Image</dt>
                                      <dd className="text-sm text-white">{deployment.dockerImage}</dd>
                                    </div>
                                  )}
                                  {deployment.buildCommand && (
                                    <div className="flex justify-between">
                                      <dt className="text-sm text-slate-400">Build Command</dt>
                                      <dd className="text-sm text-white">{deployment.buildCommand}</dd>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <dt className="text-sm text-slate-400">Start Command</dt>
                                    <dd className="text-sm text-white">{deployment.startCommand}</dd>
                                  </div>
                                </dl>
                              </div>
                            </div>
                            
                            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                              <h3 className="mb-3 font-medium text-white">Deployment Steps</h3>
                              <ol className="relative border-l border-slate-700">
                                <li className="mb-6 ml-6">
                                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 ring-8 ring-slate-950">
                                    <FileCode className="h-3 w-3 text-blue-500" />
                                  </span>
                                  <h4 className="font-medium text-white">Source Code Retrieval</h4>
                                  <p className="text-sm text-slate-400">
                                    {deployment.sourceType === 'git' ? 
                                      `Clone repository from ${deployment.repositoryUrl}` :
                                     deployment.sourceType === 'docker' ?
                                      `Pull Docker image ${deployment.dockerImage}` :
                                      'Package local source code'}
                                  </p>
                                </li>
                                <li className="mb-6 ml-6">
                                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 ring-8 ring-slate-950">
                                    <Package className="h-3 w-3 text-indigo-500" />
                                  </span>
                                  <h4 className="font-medium text-white">Build Process</h4>
                                  <p className="text-sm text-slate-400">
                                    {deployment.buildCommand ? 
                                      `Execute build command: ${deployment.buildCommand}` :
                                      'No build step required'}
                                  </p>
                                </li>
                                <li className="mb-6 ml-6">
                                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 ring-8 ring-slate-950">
                                    <Upload className="h-3 w-3 text-teal-500" />
                                  </span>
                                  <h4 className="font-medium text-white">Deployment</h4>
                                  <p className="text-sm text-slate-400">
                                    Transfer files to {getServerName(deployment.serverId)} at {deployment.deploymentPath}
                                  </p>
                                </li>
                                <li className="ml-6">
                                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 ring-8 ring-slate-950">
                                    <Play className="h-3 w-3 text-emerald-500" />
                                  </span>
                                  <h4 className="font-medium text-white">Launch</h4>
                                  <p className="text-sm text-slate-400">
                                    Start application with command: {deployment.startCommand}
                                  </p>
                                </li>
                              </ol>
                            </div>
                          </TabsContent>
                          
                          {/* Environment tab */}
                          <TabsContent value="environment" className="mt-4">
                            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                              <h3 className="mb-3 font-medium text-white">Environment Variables</h3>
                              {Object.keys(deployment.environmentVariables).length === 0 ? (
                                <p className="text-sm text-slate-400">No environment variables configured.</p>
                              ) : (
                                <div className="space-y-2">
                                  {Object.entries(deployment.environmentVariables).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between rounded-md bg-slate-900 p-2">
                                      <div className="font-mono text-sm text-blue-400">{key}</div>
                                      <div className="font-mono text-sm text-slate-400">{value}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          {/* Logs tab */}
                          <TabsContent value="logs" className="mt-4">
                            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                              <h3 className="mb-3 font-medium text-white">Deployment Logs</h3>
                              {isLoadingLogs ? (
                                <div className="flex h-64 items-center justify-center">
                                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-blue-600"></div>
                                </div>
                              ) : deploymentLogEntries.length === 0 ? (
                                <p className="text-sm text-slate-400">No deployment logs available.</p>
                              ) : (
                                <ScrollArea className="h-96 pr-4">
                                  <div className="space-y-2">
                                    {deploymentLogEntries.map((log) => (
                                      <div 
                                        key={log.id} 
                                        className="rounded-md border border-slate-800 bg-slate-900 p-2"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center">
                                            <Badge className={`mr-2 ${
                                              log.status === 'success' ? 'bg-emerald-500' :
                                              log.status === 'error' ? 'bg-rose-500' :
                                              log.status === 'warning' ? 'bg-amber-500' :
                                              'bg-blue-500'
                                            }`}>
                                              {log.status}
                                            </Badge>
                                            <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-400">
                                              {log.step}
                                            </Badge>
                                          </div>
                                          <div className="text-xs text-slate-500">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                          </div>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-300">{log.message}</p>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Deployment progress */}
                  {isDeploying === selectedDeployment && (
                    <Card className="border-slate-800 bg-slate-900">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-white">Deployment in Progress</CardTitle>
                        <CardDescription className="text-slate-400">
                          Deploying to {getServerName(deployments.find(d => d.id === selectedDeployment)?.serverId || '')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="mb-4">
                          <div className="mb-2 flex justify-between">
                            <span className="text-sm text-slate-400">Progress</span>
                            <span className="text-sm text-slate-400">{deploymentProgress}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                            <div 
                              className="h-full bg-blue-600 transition-all duration-500"
                              style={{ width: `${deploymentProgress}%` }}
                            />
                          </div>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                          <h4 className="mb-3 text-sm font-medium text-white">
                            {deploymentStep === 'init' ? 'Initializing Deployment' :
                             deploymentStep === 'build' ? 'Building Application' :
                             deploymentStep === 'transfer' ? 'Transferring Files' :
                             deploymentStep === 'setup' ? 'Setting Up Application' :
                             deploymentStep === 'start' ? 'Starting Application' :
                             deploymentStep === 'complete' ? 'Deployment Complete' :
                             'Preparing Deployment'}
                          </h4>
                          <ScrollArea className="h-64 pr-4">
                            <div className="space-y-2">
                              {deploymentLogs.map((log, index) => (
                                <div key={index} className="text-sm">
                                  <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                                  <span className="ml-2 text-slate-300">{log.message}</span>
                                </div>
                              ))}
                              {deploymentStep && (
                                <div className="text-sm">
                                  <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                                  <span className="ml-2 text-blue-400">
                                    {deploymentStep === 'init' ? 'Preparing deployment...' :
                                     deploymentStep === 'build' ? 'Building application...' :
                                     deploymentStep === 'transfer' ? 'Transferring files to server...' :
                                     deploymentStep === 'setup' ? 'Setting up application on server...' :
                                     deploymentStep === 'start' ? 'Starting application...' :
                                     deploymentStep === 'complete' ? 'Deployment completed successfully.' :
                                     'Processing...'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900 p-8 text-center h-64">
                  <LayoutGrid className="mb-4 h-12 w-12 text-slate-700" />
                  <h3 className="mb-2 text-xl font-medium text-slate-400">Select a Deployment</h3>
                  <p className="text-slate-500">
                    Select a deployment configuration to view details and manage deployments.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create deployment dialog */}
      <Dialog 
        open={isCreating} 
        onOpenChange={(open) => {
          if (!open) setIsCreating(false);
        }}
      >
        <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Deployment</DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure how your application will be deployed to your server.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="bg-slate-800 mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="source">Source</TabsTrigger>
                  <TabsTrigger value="environment">Environment</TabsTrigger>
                </TabsList>
                
                {/* Basic info tab */}
                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deployment Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="My Application"
                            {...field}
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          A name to identify this deployment.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief description of this deployment"
                            {...field}
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="serverId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Server</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                              <SelectValue placeholder="Select a server" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-slate-700 bg-slate-800 text-white">
                            {servers.map((server: ServerConnection) => (
                              <SelectItem key={server.id} value={server.id}>
                                {server.name} ({server.hostname})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-500">
                          The server where this application will be deployed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deploymentPath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deployment Path</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="/var/www/app"
                            {...field}
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          The directory path on the server where the application will be deployed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Port</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="3000"
                            {...field}
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          The port on which your application will run.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="healthCheckPath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Check Path (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="/health"
                            {...field}
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          The URL path that returns a 200 status when your application is healthy.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                {/* Source tab */}
                <TabsContent value="source" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="sourceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                              <SelectValue placeholder="Select source type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-slate-700 bg-slate-800 text-white">
                            <SelectItem value="git">Git Repository</SelectItem>
                            <SelectItem value="local">Local Files</SelectItem>
                            <SelectItem value="docker">Docker Image</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-500">
                          Where your application code comes from.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {sourceType === 'git' && (
                    <>
                      <FormField
                        control={form.control}
                        name="repositoryUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Repository URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://github.com/username/repo.git"
                                {...field}
                                className="border-slate-700 bg-slate-800 text-white"
                              />
                            </FormControl>
                            <FormDescription className="text-slate-500">
                              The URL of your Git repository.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="branch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Branch</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="main"
                                {...field}
                                className="border-slate-700 bg-slate-800 text-white"
                              />
                            </FormControl>
                            <FormDescription className="text-slate-500">
                              The branch to deploy from.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
                  {sourceType === 'docker' && (
                    <FormField
                      control={form.control}
                      name="dockerImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Docker Image</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="nginx:latest"
                              {...field}
                              className="border-slate-700 bg-slate-800 text-white"
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500">
                            The Docker image to deploy.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {sourceType === 'local' && (
                    <FormField
                      control={form.control}
                      name="localPath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Local Path</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="./my-app"
                              {...field}
                              className="border-slate-700 bg-slate-800 text-white"
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500">
                            The local path to your application files.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {sourceType !== 'docker' && (
                    <FormField
                      control={form.control}
                      name="buildCommand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Build Command (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="npm run build"
                              {...field}
                              className="border-slate-700 bg-slate-800 text-white"
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500">
                            The command to build your application.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="startCommand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Command</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="npm start"
                            {...field}
                            className="border-slate-700 bg-slate-800 text-white"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          The command to start your application.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                {/* Environment tab */}
                <TabsContent value="environment" className="space-y-4">
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-white">Environment Variables</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-slate-700 hover:border-blue-500"
                        onClick={addEnvironmentVariable}
                      >
                        Add Variable
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(form.getValues('environmentVariables') || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Input
                            value={key}
                            onChange={(e) => {
                              const newKey = e.target.value;
                              const envVars = { ...form.getValues('environmentVariables') };
                              const newEnvVars = Object.entries(envVars).reduce((acc, [k, v]) => {
                                if (k === key) {
                                  acc[newKey] = v;
                                } else {
                                  acc[k] = v;
                                }
                                return acc;
                              }, {} as Record<string, string>);
                              form.setValue('environmentVariables', newEnvVars);
                            }}
                            className="w-1/3 border-slate-700 bg-slate-800 text-white"
                            placeholder="KEY"
                          />
                          <Input
                            value={value}
                            onChange={(e) => {
                              const envVars = form.getValues('environmentVariables');
                              form.setValue('environmentVariables', {
                                ...envVars,
                                [key]: e.target.value,
                              });
                            }}
                            className="flex-1 border-slate-700 bg-slate-800 text-white"
                            placeholder="value"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-rose-500"
                            onClick={() => removeEnvironmentVariable(key)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      {Object.keys(form.getValues('environmentVariables') || {}).length === 0 && (
                        <p className="text-sm text-slate-500">
                          No environment variables added yet. Click 'Add Variable' to add one.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <h3 className="font-medium text-white mb-2">Common Environment Variables</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Click to add these common environment variables to your deployment.
                    </p>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="justify-start border-slate-700 hover:border-blue-500"
                        onClick={() => {
                          const envVars = form.getValues('environmentVariables') || {};
                          form.setValue('environmentVariables', {
                            ...envVars,
                            NODE_ENV: 'production',
                          });
                        }}
                      >
                        <Code className="mr-2 h-4 w-4" />
                        NODE_ENV=production
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="justify-start border-slate-700 hover:border-blue-500"
                        onClick={() => {
                          const envVars = form.getValues('environmentVariables') || {};
                          const port = form.getValues('port');
                          form.setValue('environmentVariables', {
                            ...envVars,
                            PORT: port.toString(),
                          });
                        }}
                      >
                        <Code className="mr-2 h-4 w-4" />
                        PORT={form.getValues('port')}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="justify-start border-slate-700 hover:border-blue-500"
                        onClick={() => {
                          const envVars = form.getValues('environmentVariables') || {};
                          form.setValue('environmentVariables', {
                            ...envVars,
                            DATABASE_URL: 'postgresql://user:password@localhost:5432/dbname',
                          });
                        }}
                      >
                        <Database className="mr-2 h-4 w-4" />
                        DATABASE_URL
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="justify-start border-slate-700 hover:border-blue-500"
                        onClick={() => {
                          const envVars = form.getValues('environmentVariables') || {};
                          form.setValue('environmentVariables', {
                            ...envVars,
                            LOG_LEVEL: 'info',
                          });
                        }}
                      >
                        <Code className="mr-2 h-4 w-4" />
                        LOG_LEVEL=info
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  className="border-slate-700 hover:border-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={createDeploymentMutation.isPending}
                >
                  {createDeploymentMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>Create Deployment</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!isConfirmingDelete}
        onOpenChange={(open) => {
          if (!open) setIsConfirmingDelete(null);
        }}
      >
        <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Deployment</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this deployment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
            <div className="flex items-start">
              <AlertCircle className="mr-2 mt-0.5 h-5 w-5 text-rose-500" />
              <div>
                <p className="text-sm text-slate-300">
                  Deleting this deployment will:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-400">
                  <li>• Remove the deployment configuration</li>
                  <li>• Delete deployment logs and history</li>
                  <li>• Not affect files already deployed to the server</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmingDelete(null)}
              disabled={deleteDeploymentMutation.isPending}
              className="border-slate-700 hover:border-slate-600"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => isConfirmingDelete && deleteDeploymentMutation.mutate(isConfirmingDelete)}
              disabled={deleteDeploymentMutation.isPending}
            >
              {deleteDeploymentMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete Deployment</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeploymentPage;