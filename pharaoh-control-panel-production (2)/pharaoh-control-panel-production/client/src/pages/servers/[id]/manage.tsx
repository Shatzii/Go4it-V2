import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft,
  Copy,
  Download,
  Edit,
  FileText,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Terminal,
  Users,
  Wifi
} from 'lucide-react';
import { Link } from 'wouter';

interface ConfigFile {
  id: string;
  name: string;
  path: string;
  description: string;
  category: 'system' | 'web' | 'database' | 'security' | 'network';
  content: string;
  lastModified: string;
  size: number;
  permissions: string;
  backupAvailable: boolean;
}

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'failed' | 'unknown';
  enabled: boolean;
  description: string;
  uptime?: string;
  port?: number;
}

const ServerManagePage: React.FC = () => {
  const [, params] = useRoute('/servers/:id/manage');
  const serverId = params?.id;
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedConfig, setSelectedConfig] = useState<ConfigFile | null>(null);
  const [editingConfig, setEditingConfig] = useState(false);
  const [configContent, setConfigContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch server details
  const { data: server } = useQuery({
    queryKey: [`/api/servers/${serverId}`],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/servers/${serverId}`);
      if (!response.ok) throw new Error('Failed to fetch server details');
      return response.json();
    },
    enabled: !!serverId && !!user,
  });

  // Sample configuration files
  const sampleConfigFiles: ConfigFile[] = [
    {
      id: 'nginx-conf',
      name: 'nginx.conf',
      path: '/etc/nginx/nginx.conf',
      description: 'Main Nginx configuration file',
      category: 'web',
      content: `user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 768;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip on;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}`,
      lastModified: new Date(Date.now() - 2 * 3600000).toISOString(),
      size: 1540,
      permissions: '-rw-r--r--',
      backupAvailable: true
    },
    {
      id: 'ssh-config',
      name: 'sshd_config',
      path: '/etc/ssh/sshd_config',
      description: 'SSH daemon configuration',
      category: 'security',
      content: `Port 22
PermitRootLogin prohibit-password
PubkeyAuthentication yes
PasswordAuthentication yes
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding yes
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server`,
      lastModified: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
      size: 3241,
      permissions: '-rw-r--r--',
      backupAvailable: true
    }
  ];

  // Sample services
  const sampleServices: ServiceStatus[] = [
    {
      name: 'nginx',
      status: 'running',
      enabled: true,
      description: 'A high performance web server and a reverse proxy server',
      uptime: '3 days, 4 hours',
      port: 80
    },
    {
      name: 'mysql',
      status: 'running',
      enabled: true,
      description: 'MySQL Community Server database server',
      uptime: '5 days, 2 hours',
      port: 3306
    },
    {
      name: 'ssh',
      status: 'running',
      enabled: true,
      description: 'OpenBSD Secure Shell server',
      uptime: '7 days, 12 hours',
      port: 22
    }
  ];

  // Update config mutation
  const updateConfigMutation = useMutation({
    mutationFn: async ({ configId, content }: { configId: string, content: string }) => {
      const response = await apiRequest('PUT', `/api/servers/${serverId}/configs/${configId}`, { content });
      if (!response.ok) throw new Error('Failed to update configuration');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuration updated",
        description: "Configuration file has been saved successfully.",
      });
      setEditingConfig(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update configuration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Service control mutation
  const serviceControlMutation = useMutation({
    mutationFn: async ({ serviceName, action }: { serviceName: string, action: string }) => {
      const response = await apiRequest('POST', `/api/servers/${serverId}/services/${serviceName}/${action}`);
      if (!response.ok) throw new Error(`Failed to ${action} service`);
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Service action completed",
        description: `Successfully executed ${variables.action} on ${variables.serviceName}`,
      });
    },
    onError: (error, variables) => {
      toast({
        title: "Service action failed",
        description: `Failed to ${variables.action} ${variables.serviceName}: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const filteredConfigs = sampleConfigFiles.filter((config) => {
    const matchesSearch = config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || config.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditConfig = (config: ConfigFile) => {
    setSelectedConfig(config);
    setConfigContent(config.content);
    setEditingConfig(true);
  };

  const handleSaveConfig = () => {
    if (selectedConfig) {
      updateConfigMutation.mutate({
        configId: selectedConfig.id,
        content: configContent
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web': return <Wifi className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'database': return <FileText className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-emerald-500';
      case 'stopped': return 'bg-slate-500';
      case 'failed': return 'bg-rose-500';
      default: return 'bg-amber-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/servers">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Servers
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Server</span> Management
              {server && <span className="ml-2 text-slate-400">• {server.name}</span>}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {server && (
              <Badge className={`px-3 py-1 ${
                server.connectionStatus === 'connected' 
                  ? 'bg-emerald-500' 
                  : 'bg-rose-500'
              }`}>
                {server.connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </Badge>
            )}
            <Link href={`/servers/${serverId}/terminal`}>
              <Button variant="outline" size="sm" className="border-slate-700">
                <Terminal className="mr-2 h-4 w-4" />
                Terminal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="configs" className="w-full">
          <TabsList className="bg-slate-800 mb-6">
            <TabsTrigger value="configs">Configuration Files</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          {/* Configuration Files Tab */}
          <TabsContent value="configs" className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search configuration files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-700 bg-slate-800 text-white"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 border-slate-700 bg-slate-800 text-white">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-800 text-white">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="web">Web Server</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredConfigs.map((config) => (
                <Card key={config.id} className="border-slate-800 bg-slate-900 hover:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(config.category)}
                        <div>
                          <CardTitle className="text-lg text-white">{config.name}</CardTitle>
                          <CardDescription className="text-sm text-slate-400">
                            {config.path}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-400">
                        {config.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-slate-300 mb-3">{config.description}</p>
                    <div className="space-y-2 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{(config.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Permissions:</span>
                        <span className="font-mono">{config.permissions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modified:</span>
                        <span>{new Date(config.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent className="border-t border-slate-800 pt-3">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-700 hover:border-blue-500"
                        onClick={() => handleEditConfig(config)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 hover:border-amber-500"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sampleServices.map((service) => (
                <Card key={service.name} className="border-slate-800 bg-slate-900">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(service.status)}`} />
                        <CardTitle className="text-lg text-white">{service.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className={`border-slate-700 ${
                        service.enabled ? 'bg-slate-800 text-slate-400' : 'bg-slate-700 text-slate-500'
                      }`}>
                        {service.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-slate-300 mb-3">{service.description}</p>
                    <div className="space-y-2 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`capitalize ${
                          service.status === 'running' ? 'text-emerald-400' : 
                          service.status === 'failed' ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      {service.port && (
                        <div className="flex justify-between">
                          <span>Port:</span>
                          <span>{service.port}</span>
                        </div>
                      )}
                      {service.uptime && (
                        <div className="flex justify-between">
                          <span>Uptime:</span>
                          <span>{service.uptime}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardContent className="border-t border-slate-800 pt-3">
                    <div className="flex space-x-2">
                      {service.status === 'running' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-slate-700 hover:border-amber-500"
                            onClick={() => serviceControlMutation.mutate({
                              serviceName: service.name,
                              action: 'restart'
                            })}
                            disabled={serviceControlMutation.isPending}
                          >
                            <RefreshCw className="mr-2 h-3 w-3" />
                            Restart
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-slate-700 hover:border-rose-500"
                            onClick={() => serviceControlMutation.mutate({
                              serviceName: service.name,
                              action: 'stop'
                            })}
                            disabled={serviceControlMutation.isPending}
                          >
                            Stop
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-slate-700 hover:border-emerald-500"
                          onClick={() => serviceControlMutation.mutate({
                            serviceName: service.name,
                            action: 'start'
                          })}
                          disabled={serviceControlMutation.isPending}
                        >
                          Start
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage system users and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-400 mb-2">User Management Coming Soon</h3>
                <p className="text-slate-500">
                  Advanced user and permission management features will be available in the next update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Config Editor Dialog */}
      <Dialog open={editingConfig} onOpenChange={setEditingConfig}>
        <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Configuration: {selectedConfig?.name}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedConfig?.path} • Make changes carefully and create a backup first
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div className="text-sm text-slate-400">
                File size: {selectedConfig && (selectedConfig.size / 1024).toFixed(1)} KB • 
                Last modified: {selectedConfig && new Date(selectedConfig.lastModified).toLocaleString()}
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700"
                  onClick={() => {
                    navigator.clipboard.writeText(configContent);
                    toast({
                      title: "Copied to clipboard",
                      description: "Configuration content has been copied.",
                    });
                  }}
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-96 w-full">
              <Textarea
                value={configContent}
                onChange={(e) => setConfigContent(e.target.value)}
                className="min-h-[380px] font-mono text-sm border-slate-700 bg-slate-950 text-white"
                placeholder="Configuration file content..."
              />
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingConfig(false)}
              className="border-slate-700 hover:border-slate-600"
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSaveConfig}
              disabled={updateConfigMutation.isPending}
            >
              {updateConfigMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServerManagePage;