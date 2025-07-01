import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  AlertCircle,
  Check,
  Copy,
  Edit,
  Eye,
  EyeOff,
  HardDrive,
  MoreVertical,
  Plus,
  RefreshCw,
  Server,
  Settings,
  Terminal,
  Trash2,
  Upload,
  Zap
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';

// Server type from schema
interface ServerConnection {
  id: string;
  userId: string;
  name: string;
  hostname: string;
  port: number;
  username: string;
  authType: 'password' | 'ssh_key';
  password?: string;
  privateKey?: string;
  connectionStatus: 'connected' | 'disconnected' | 'pending' | 'failed';
  lastChecked?: string;
  serverType: 'linux' | 'windows';
  operatingSystem?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Form validation schema for adding a server
const serverSchema = z.object({
  name: z.string().min(2, { message: "Server name must be at least 2 characters." }),
  hostname: z.string().min(1, { message: "Hostname is required." }),
  port: z.coerce.number().int().min(1).max(65535),
  username: z.string().min(1, { message: "Username is required." }),
  authType: z.enum(['password', 'ssh_key']),
  password: z.string().optional(),
  privateKey: z.string().optional(),
  serverType: z.enum(['linux', 'windows']),
  tags: z.array(z.string()).optional(),
}).refine(data => {
  if (data.authType === 'password' && !data.password) {
    return false;
  }
  if (data.authType === 'ssh_key' && !data.privateKey) {
    return false;
  }
  return true;
}, {
  message: "Please provide the required authentication credentials",
  path: ['password', 'privateKey']
});

type ServerFormValues = z.infer<typeof serverSchema>;

const ServersPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingServer, setIsAddingServer] = useState(false);
  const [isEditingServer, setIsEditingServer] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null);

  // Fetch servers
  const { 
    data: servers = [], 
    isLoading,
    refetch: refetchServers
  } = useQuery({
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
        return [];
      }
    },
    enabled: !!user,
  });

  // Add server mutation
  const addServerMutation = useMutation({
    mutationFn: async (serverData: ServerFormValues) => {
      const response = await apiRequest('POST', '/api/servers', serverData);
      if (!response.ok) {
        throw new Error('Failed to add server');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      toast({
        title: "Server added",
        description: "Your server has been added successfully.",
      });
      setIsAddingServer(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to add server",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update server mutation
  const updateServerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: ServerFormValues }) => {
      const response = await apiRequest('PATCH', `/api/servers/${id}`, data);
      if (!response.ok) {
        throw new Error('Failed to update server');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      toast({
        title: "Server updated",
        description: "Your server has been updated successfully.",
      });
      setIsEditingServer(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to update server",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete server mutation
  const deleteServerMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/servers/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete server');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      toast({
        title: "Server deleted",
        description: "Your server has been deleted successfully.",
      });
      setIsConfirmingDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete server",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Test connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('POST', `/api/servers/${id}/test-connection`);
      if (!response.ok) {
        throw new Error('Failed to test connection');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      toast({
        title: data.success ? "Connection successful" : "Connection failed",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      setIsTestingConnection(null);
    },
    onError: (error) => {
      toast({
        title: "Connection test failed",
        description: error.message,
        variant: "destructive",
      });
      setIsTestingConnection(null);
    },
  });

  // Form for adding/editing a server
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: '',
      hostname: '',
      port: 22,
      username: '',
      authType: 'password',
      password: '',
      privateKey: '',
      serverType: 'linux',
      tags: [],
    },
  });

  // Reset form when adding a new server
  const handleAddServerClick = () => {
    form.reset({
      name: '',
      hostname: '',
      port: 22,
      username: '',
      authType: 'password',
      password: '',
      privateKey: '',
      serverType: 'linux',
      tags: [],
    });
    setIsAddingServer(true);
    setShowPassword(false);
    setShowPrivateKey(false);
  };

  // Load server data for editing
  const handleEditServerClick = (server: ServerConnection) => {
    form.reset({
      name: server.name,
      hostname: server.hostname,
      port: server.port,
      username: server.username,
      authType: server.authType,
      password: server.password || '',
      privateKey: server.privateKey || '',
      serverType: server.serverType,
      tags: server.tags || [],
    });
    setIsEditingServer(server.id);
    setShowPassword(false);
    setShowPrivateKey(false);
  };

  // Handle form submission
  const onSubmit = (data: ServerFormValues) => {
    if (isEditingServer) {
      updateServerMutation.mutate({ id: isEditingServer, data });
    } else {
      addServerMutation.mutate(data);
    }
  };

  // Watch auth type to handle conditional validation
  const authType = form.watch('authType');

  // Server card component
  const ServerCard = ({ server }: { server: ServerConnection }) => {
    return (
      <Card className="border-slate-800 bg-slate-900 hover:border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg text-white">{server.name}</CardTitle>
              <CardDescription className="text-sm text-slate-400">
                {server.hostname}:{server.port}
              </CardDescription>
            </div>
            <Badge className={`${
              server.connectionStatus === 'connected' 
                ? 'bg-emerald-500' 
                : server.connectionStatus === 'pending' 
                ? 'bg-amber-500' 
                : server.connectionStatus === 'failed' 
                ? 'bg-rose-500' 
                : 'bg-slate-500'
            }`}>
              {server.connectionStatus === 'connected' ? 'Connected' : 
               server.connectionStatus === 'pending' ? 'Pending' : 
               server.connectionStatus === 'failed' ? 'Failed' : 'Disconnected'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Server className="mr-2 h-4 w-4 text-slate-400" />
              <span className="text-slate-400">Type:</span>
              <span className="ml-2 text-white">{server.serverType === 'linux' ? 'Linux' : 'Windows'}</span>
            </div>
            <div className="flex items-center text-sm">
              <Terminal className="mr-2 h-4 w-4 text-slate-400" />
              <span className="text-slate-400">User:</span>
              <span className="ml-2 text-white">{server.username}</span>
            </div>
            {server.operatingSystem && (
              <div className="flex items-center text-sm">
                <HardDrive className="mr-2 h-4 w-4 text-slate-400" />
                <span className="text-slate-400">OS:</span>
                <span className="ml-2 text-white">{server.operatingSystem}</span>
              </div>
            )}
            {server.lastChecked && (
              <div className="flex items-center text-sm">
                <RefreshCw className="mr-2 h-4 w-4 text-slate-400" />
                <span className="text-slate-400">Last checked:</span>
                <span className="ml-2 text-white">
                  {new Date(server.lastChecked).toLocaleString()}
                </span>
              </div>
            )}
          </div>
          {server.tags && server.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {server.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-400">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-slate-800 pt-4 flex justify-between">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-slate-700 hover:border-blue-500 hover:text-blue-400"
              onClick={() => {
                setIsTestingConnection(server.id);
                testConnectionMutation.mutate(server.id);
              }}
              disabled={testConnectionMutation.isPending && isTestingConnection === server.id}
            >
              {testConnectionMutation.isPending && isTestingConnection === server.id ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Test
            </Button>
            <Link href={`/servers/${server.id}/terminal`}>
              <Button 
                size="sm" 
                variant="outline"
                className="border-slate-700 hover:border-slate-600"
              >
                <Terminal className="h-4 w-4 mr-1" />
                Terminal
              </Button>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-slate-800 bg-slate-900">
              <DropdownMenuLabel className="text-slate-400">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem 
                className="text-slate-400 focus:bg-slate-800 focus:text-white"
                onClick={() => handleEditServerClick(server)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Server
              </DropdownMenuItem>
              <Link href={`/servers/${server.id}/manage`}>
                <DropdownMenuItem 
                  className="text-slate-400 focus:bg-slate-800 focus:text-white"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Server
                </DropdownMenuItem>
              </Link>
              <Link href={`/servers/${server.id}/deploy`}>
                <DropdownMenuItem 
                  className="text-slate-400 focus:bg-slate-800 focus:text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Deploy to Server
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem 
                className="text-rose-500 focus:bg-rose-950 focus:text-rose-400"
                onClick={() => setIsConfirmingDelete(server.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Server
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    );
  };

  // Sample server data for development
  const sampleServers: ServerConnection[] = [
    {
      id: '1',
      userId: 'user-1',
      name: 'Production Web Server',
      hostname: 'web1.example.com',
      port: 22,
      username: 'admin',
      authType: 'ssh_key',
      connectionStatus: 'connected',
      lastChecked: new Date(Date.now() - 5 * 60000).toISOString(),
      serverType: 'linux',
      operatingSystem: 'Ubuntu 22.04 LTS',
      tags: ['production', 'web'],
      createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString()
    },
    {
      id: '2',
      userId: 'user-1',
      name: 'Database Server',
      hostname: 'db.example.com',
      port: 22,
      username: 'dbadmin',
      authType: 'password',
      connectionStatus: 'connected',
      lastChecked: new Date(Date.now() - 15 * 60000).toISOString(),
      serverType: 'linux',
      operatingSystem: 'CentOS 8',
      tags: ['production', 'database'],
      createdAt: new Date(Date.now() - 25 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString()
    },
    {
      id: '3',
      userId: 'user-1',
      name: 'Staging Server',
      hostname: 'staging.example.com',
      port: 22,
      username: 'developer',
      authType: 'ssh_key',
      connectionStatus: 'disconnected',
      lastChecked: new Date(Date.now() - 2 * 3600000).toISOString(),
      serverType: 'linux',
      operatingSystem: 'Debian 11',
      tags: ['staging', 'testing'],
      createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString()
    }
  ];

  // Use sample data for now, later will use actual server data
  const serverList = servers.length > 0 ? servers : sampleServers;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Server</span> Management
          </h1>
          <Button
            onClick={handleAddServerClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Server
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        {/* Server list */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-blue-600"></div>
          </div>
        ) : serverList.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900 p-8">
            <Server className="mb-4 h-12 w-12 text-slate-700" />
            <h3 className="mb-2 text-xl font-medium text-slate-400">No servers added yet</h3>
            <p className="mb-6 text-center text-slate-500">
              Connect your servers to enable monitoring, management, and deployment functionality.
            </p>
            <Button
              onClick={handleAddServerClick}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Server
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serverList.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        )}

        {/* Deployment guide */}
        {serverList.length > 0 && (
          <div className="mt-12 rounded-lg border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-500/10 p-3">
                <Upload className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">One-Click Deployment</h2>
                <p className="mt-2 text-slate-400">
                  Deploy your applications directly to your connected servers with one click.
                  Our deployment system handles packaging, file transfer, and service management
                  automatically.
                </p>
                <div className="mt-4 flex space-x-4">
                  <Link href="/deployment">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Start Deployment
                    </Button>
                  </Link>
                  <Link href="/deployment/guide">
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
                    >
                      View Deployment Guide
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit server dialog */}
      <Dialog
        open={isAddingServer || !!isEditingServer}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingServer(false);
            setIsEditingServer(null);
          }
        }}
      >
        <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditingServer ? 'Edit Server' : 'Add New Server'}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {isEditingServer 
                ? 'Update your server connection details.'
                : 'Connect to your server via SSH to enable monitoring and management.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Production Web Server"
                        {...field}
                        className="border-slate-700 bg-slate-800 text-white"
                      />
                    </FormControl>
                    <FormDescription className="text-slate-500">
                      A friendly name to identify this server.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hostname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hostname / IP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example.com or 192.168.1.1"
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
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSH Port</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="border-slate-700 bg-slate-800 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="root"
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
                name="authType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authentication Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                          <SelectValue placeholder="Select authentication method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-slate-700 bg-slate-800 text-white">
                        <SelectItem value="password">Password</SelectItem>
                        <SelectItem value="ssh_key">SSH Key</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {authType === 'password' && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter server password"
                            {...field}
                            className="border-slate-700 bg-slate-800 text-white pr-10"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-slate-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormDescription className="text-slate-500">
                        Your password will be encrypted and securely stored.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {authType === 'ssh_key' && (
                <FormField
                  control={form.control}
                  name="privateKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSH Private Key</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Textarea
                            placeholder="-----BEGIN RSA PRIVATE KEY-----..."
                            {...field}
                            className="min-h-[120px] resize-y border-slate-700 bg-slate-800 text-white font-mono text-xs"
                          />
                        </FormControl>
                        <div className="absolute right-2 top-2 flex space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                          >
                            {showPrivateKey ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                            onClick={() => {
                              // Generate random SSH key pair placeholder
                              form.setValue('privateKey', '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA1c7gxzMvK9U9...\n-----END RSA PRIVATE KEY-----');
                              toast({
                                title: "SSH key generated",
                                description: "A new SSH key pair has been generated.",
                              });
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <FormDescription className="text-slate-500">
                        Paste your private key here or generate a new one.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="serverType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                          <SelectValue placeholder="Select server type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-slate-700 bg-slate-800 text-white">
                        <SelectItem value="linux">Linux</SelectItem>
                        <SelectItem value="windows">Windows</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingServer(false);
                    setIsEditingServer(null);
                  }}
                  className="border-slate-700 hover:border-slate-600"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={addServerMutation.isPending || updateServerMutation.isPending}
                >
                  {(addServerMutation.isPending || updateServerMutation.isPending) ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                      {isEditingServer ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>{isEditingServer ? 'Update Server' : 'Add Server'}</>
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
            <DialogTitle>Delete Server</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this server? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
            <div className="flex items-start">
              <AlertCircle className="mr-2 mt-0.5 h-5 w-5 text-rose-500" />
              <div>
                <p className="text-sm text-slate-300">
                  Deleting this server will:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-400">
                  <li>• Remove all monitoring data</li>
                  <li>• Delete any deployment configurations</li>
                  <li>• Remove all connection settings</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmingDelete(null)}
              disabled={deleteServerMutation.isPending}
              className="border-slate-700 hover:border-slate-600"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => isConfirmingDelete && deleteServerMutation.mutate(isConfirmingDelete)}
              disabled={deleteServerMutation.isPending}
            >
              {deleteServerMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                <>Delete Server</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServersPage;