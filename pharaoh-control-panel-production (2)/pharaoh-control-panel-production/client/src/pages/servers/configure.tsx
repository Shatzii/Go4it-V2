import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Server, Database, Shield, Network, Settings, Save, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServerConfig {
  name: string;
  hostname: string;
  port: number;
  username: string;
  password: string;
  sshKey?: string;
  webServer: 'nginx' | 'apache' | 'lighttpd';
  phpVersion?: string;
  mysqlEnabled: boolean;
  postgresEnabled: boolean;
  redisEnabled: boolean;
  nodeVersion?: string;
  pythonVersion?: string;
  sslEnabled: boolean;
  firewallEnabled: boolean;
  autoBackup: boolean;
  monitoring: boolean;
}

export default function ConfigureServer() {
  const [config, setConfig] = useState<ServerConfig>({
    name: '',
    hostname: '',
    port: 22,
    username: 'root',
    password: '',
    webServer: 'nginx',
    phpVersion: '8.1',
    mysqlEnabled: true,
    postgresEnabled: false,
    redisEnabled: true,
    nodeVersion: '18',
    pythonVersion: '3.11',
    sslEnabled: true,
    firewallEnabled: true,
    autoBackup: true,
    monitoring: true
  });

  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const { toast } = useToast();

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnectionStatus('success');
      toast({
        title: "Connection successful",
        description: "Successfully connected to the server",
      });
    } catch (error) {
      setConnectionStatus('failed');
      toast({
        title: "Connection failed",
        description: "Could not connect to the server. Check your credentials.",
        variant: "destructive"
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      // Here you would save the configuration to your backend
      toast({
        title: "Configuration saved",
        description: "Server configuration has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Could not save server configuration",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configure Server</h1>
          <p className="text-slate-400">Set up and configure your server environment</p>
        </div>

        <Tabs defaultValue="connection" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="connection" className="data-[state=active]:bg-slate-700">Connection</TabsTrigger>
            <TabsTrigger value="software" className="data-[state=active]:bg-slate-700">Software</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">Security</TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-slate-700">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="connection">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Server Connection
                </CardTitle>
                <CardDescription>Configure SSH connection to your server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Server Name</Label>
                    <Input
                      id="name"
                      value={config.name}
                      onChange={(e) => setConfig({...config, name: e.target.value})}
                      placeholder="Production Server"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hostname" className="text-white">Hostname/IP</Label>
                    <Input
                      id="hostname"
                      value={config.hostname}
                      onChange={(e) => setConfig({...config, hostname: e.target.value})}
                      placeholder="192.168.1.100"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="port" className="text-white">SSH Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={config.port}
                      onChange={(e) => setConfig({...config, port: parseInt(e.target.value)})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <Input
                      id="username"
                      value={config.username}
                      onChange={(e) => setConfig({...config, username: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={config.password}
                      onChange={(e) => setConfig({...config, password: e.target.value})}
                      placeholder="Enter password"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sshKey" className="text-white">SSH Private Key (Optional)</Label>
                  <Textarea
                    id="sshKey"
                    value={config.sshKey || ''}
                    onChange={(e) => setConfig({...config, sshKey: e.target.value})}
                    placeholder="-----BEGIN PRIVATE KEY-----"
                    className="bg-slate-800 border-slate-700 text-white min-h-24"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button onClick={handleTestConnection} disabled={testingConnection}>
                    <TestTube className="h-4 w-4 mr-2" />
                    {testingConnection ? 'Testing...' : 'Test Connection'}
                  </Button>
                  {connectionStatus === 'success' && (
                    <Badge className="bg-green-600">Connected</Badge>
                  )}
                  {connectionStatus === 'failed' && (
                    <Badge variant="destructive">Failed</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="software">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Software Stack
                </CardTitle>
                <CardDescription>Choose the software to install on your server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white">Web Server</Label>
                  <Select value={config.webServer} onValueChange={(value: any) => setConfig({...config, webServer: value})}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="nginx" className="text-white">Nginx</SelectItem>
                      <SelectItem value="apache" className="text-white">Apache</SelectItem>
                      <SelectItem value="lighttpd" className="text-white">Lighttpd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">PHP Version</Label>
                    <Select value={config.phpVersion} onValueChange={(value) => setConfig({...config, phpVersion: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="8.2" className="text-white">PHP 8.2</SelectItem>
                        <SelectItem value="8.1" className="text-white">PHP 8.1</SelectItem>
                        <SelectItem value="8.0" className="text-white">PHP 8.0</SelectItem>
                        <SelectItem value="7.4" className="text-white">PHP 7.4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white">Node.js Version</Label>
                    <Select value={config.nodeVersion} onValueChange={(value) => setConfig({...config, nodeVersion: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="20" className="text-white">Node.js 20</SelectItem>
                        <SelectItem value="18" className="text-white">Node.js 18</SelectItem>
                        <SelectItem value="16" className="text-white">Node.js 16</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Python Version</Label>
                    <Select value={config.pythonVersion} onValueChange={(value) => setConfig({...config, pythonVersion: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="3.11" className="text-white">Python 3.11</SelectItem>
                        <SelectItem value="3.10" className="text-white">Python 3.10</SelectItem>
                        <SelectItem value="3.9" className="text-white">Python 3.9</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">SSL/TLS Certificates</Label>
                      <p className="text-sm text-slate-400">Automatically obtain and renew SSL certificates</p>
                    </div>
                    <Switch
                      checked={config.sslEnabled}
                      onCheckedChange={(checked) => setConfig({...config, sslEnabled: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Firewall Protection</Label>
                      <p className="text-sm text-slate-400">Enable UFW firewall with secure defaults</p>
                    </div>
                    <Switch
                      checked={config.firewallEnabled}
                      onCheckedChange={(checked) => setConfig({...config, firewallEnabled: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Automatic Backups</Label>
                      <p className="text-sm text-slate-400">Daily automated backups of files and databases</p>
                    </div>
                    <Switch
                      checked={config.autoBackup}
                      onCheckedChange={(checked) => setConfig({...config, autoBackup: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Server Monitoring</Label>
                      <p className="text-sm text-slate-400">Real-time monitoring and alerting</p>
                    </div>
                    <Switch
                      checked={config.monitoring}
                      onCheckedChange={(checked) => setConfig({...config, monitoring: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Services
                </CardTitle>
                <CardDescription>Configure database and caching services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">MySQL Database</Label>
                      <p className="text-sm text-slate-400">Install and configure MySQL server</p>
                    </div>
                    <Switch
                      checked={config.mysqlEnabled}
                      onCheckedChange={(checked) => setConfig({...config, mysqlEnabled: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">PostgreSQL Database</Label>
                      <p className="text-sm text-slate-400">Install and configure PostgreSQL server</p>
                    </div>
                    <Switch
                      checked={config.postgresEnabled}
                      onCheckedChange={(checked) => setConfig({...config, postgresEnabled: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Redis Cache</Label>
                      <p className="text-sm text-slate-400">Install Redis for caching and sessions</p>
                    </div>
                    <Switch
                      checked={config.redisEnabled}
                      onCheckedChange={(checked) => setConfig({...config, redisEnabled: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button onClick={handleSaveConfig} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}