import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  HardDrive,
  Network,
  Play,
  RefreshCw,
  Settings,
  Shield,
  Zap,
  XCircle
} from 'lucide-react';

interface HealingEvent {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'error' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'detecting' | 'analyzing' | 'healing' | 'complete' | 'failed';
  autoFixed: boolean;
  fixCommands?: string[];
  affectedServices: string[];
  estimatedDowntime?: string;
  actualDowntime?: string;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'security' | 'availability' | 'capacity';
  enabled: boolean;
  triggers: string[];
  actions: string[];
  lastTriggered?: string;
  successRate: number;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  score: number;
  issues: {
    category: string;
    count: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
  trends: {
    improving: number;
    stable: number;
    degrading: number;
  };
}

const SelfHealingPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedEvent, setSelectedEvent] = useState<HealingEvent | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  // Sample healing events
  const sampleEvents: HealingEvent[] = [
    {
      id: 'heal-1',
      title: 'High Memory Usage Detected',
      description: 'Memory usage exceeded 90% threshold, triggered automatic memory optimization',
      type: 'warning',
      severity: 'medium',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      status: 'complete',
      autoFixed: true,
      fixCommands: ['sudo systemctl restart apache2', 'echo 3 > /proc/sys/vm/drop_caches'],
      affectedServices: ['apache2', 'mysql'],
      estimatedDowntime: '30 seconds',
      actualDowntime: '15 seconds'
    },
    {
      id: 'heal-2',
      title: 'Disk Space Critical',
      description: 'Root partition reached 95% capacity, initiated cleanup procedures',
      type: 'error',
      severity: 'high',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      status: 'complete',
      autoFixed: true,
      fixCommands: ['sudo apt autoremove -y', 'sudo journalctl --vacuum-time=7d', 'sudo find /tmp -type f -atime +7 -delete'],
      affectedServices: ['system'],
      estimatedDowntime: '0 seconds',
      actualDowntime: '0 seconds'
    },
    {
      id: 'heal-3',
      title: 'Service Failure Detected',
      description: 'Nginx service stopped unexpectedly, attempting automatic restart',
      type: 'error',
      severity: 'critical',
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      status: 'healing',
      autoFixed: false,
      fixCommands: ['sudo systemctl start nginx', 'sudo systemctl reload nginx'],
      affectedServices: ['nginx', 'web-server'],
      estimatedDowntime: '1-2 minutes'
    },
    {
      id: 'heal-4',
      title: 'SSL Certificate Renewal',
      description: 'SSL certificate expiring in 7 days, initiated automatic renewal',
      type: 'info',
      severity: 'low',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      status: 'complete',
      autoFixed: true,
      fixCommands: ['sudo certbot renew', 'sudo systemctl reload nginx'],
      affectedServices: ['nginx', 'ssl'],
      estimatedDowntime: '0 seconds',
      actualDowntime: '0 seconds'
    }
  ];

  // Sample automation rules
  const sampleRules: AutomationRule[] = [
    {
      id: 'rule-1',
      name: 'Memory Optimization',
      description: 'Automatically clear cache and restart services when memory usage exceeds 85%',
      category: 'performance',
      enabled: true,
      triggers: ['memory_usage > 85%', 'swap_usage > 50%'],
      actions: ['clear_cache', 'restart_high_memory_services', 'notify_admin'],
      lastTriggered: new Date(Date.now() - 5 * 60000).toISOString(),
      successRate: 94
    },
    {
      id: 'rule-2',
      name: 'Service Recovery',
      description: 'Restart failed services and notify administrators',
      category: 'availability',
      enabled: true,
      triggers: ['service_down', 'health_check_failed'],
      actions: ['restart_service', 'check_dependencies', 'send_alert'],
      lastTriggered: new Date(Date.now() - 10 * 60000).toISOString(),
      successRate: 98
    },
    {
      id: 'rule-3',
      name: 'Disk Cleanup',
      description: 'Automatically clean temporary files and logs when disk usage is high',
      category: 'capacity',
      enabled: true,
      triggers: ['disk_usage > 90%', 'log_size > 5GB'],
      actions: ['cleanup_temp_files', 'rotate_logs', 'remove_old_backups'],
      lastTriggered: new Date(Date.now() - 2 * 3600000).toISOString(),
      successRate: 91
    },
    {
      id: 'rule-4',
      name: 'Security Monitoring',
      description: 'Monitor for suspicious activities and block threats automatically',
      category: 'security',
      enabled: true,
      triggers: ['failed_login_attempts > 10', 'suspicious_network_activity'],
      actions: ['block_ip', 'update_firewall_rules', 'send_security_alert'],
      successRate: 97
    }
  ];

  // Sample system health
  const sampleHealth: SystemHealth = {
    overall: 'warning',
    score: 78,
    issues: [
      { category: 'performance', count: 2, severity: 'medium' },
      { category: 'security', count: 0, severity: 'low' },
      { category: 'availability', count: 1, severity: 'high' },
      { category: 'capacity', count: 1, severity: 'medium' }
    ],
    trends: {
      improving: 3,
      stable: 5,
      degrading: 1
    }
  };

  // Fetch healing events
  const { data: healingEvents = sampleEvents, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['/api/healing/events'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/healing/events');
      if (!response.ok) {
        return sampleEvents; // Fallback for demo
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch automation rules
  const { data: automationRules = sampleRules, isLoading: isLoadingRules } = useQuery({
    queryKey: ['/api/healing/rules'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/healing/rules');
      if (!response.ok) {
        return sampleRules; // Fallback for demo
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch system health
  const { data: systemHealth = sampleHealth, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['/api/system/health'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/system/health');
      if (!response.ok) {
        return sampleHealth; // Fallback for demo
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Toggle automation rule
  const toggleRuleMutation = useMutation({
    mutationFn: async ({ ruleId, enabled }: { ruleId: string, enabled: boolean }) => {
      const response = await apiRequest('PUT', `/api/healing/rules/${ruleId}`, { enabled });
      if (!response.ok) throw new Error('Failed to update rule');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/healing/rules'] });
      toast({
        title: "Rule updated",
        description: "Automation rule has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Run system diagnostics
  const runDiagnosticsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/healing/diagnostics');
      if (!response.ok) throw new Error('Failed to run diagnostics');
      return response.json();
    },
    onMutate: () => {
      setIsRunningDiagnostics(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/system/health'] });
      queryClient.invalidateQueries({ queryKey: ['/api/healing/events'] });
      toast({
        title: "Diagnostics complete",
        description: "System health scan completed successfully.",
      });
      setIsRunningDiagnostics(false);
    },
    onError: (error: any) => {
      toast({
        title: "Diagnostics failed",
        description: error.message,
        variant: "destructive",
      });
      setIsRunningDiagnostics(false);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-emerald-500';
      case 'healing': return 'text-blue-500';
      case 'failed': return 'text-rose-500';
      case 'detecting': return 'text-amber-500';
      case 'analyzing': return 'text-amber-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'healing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed': return <XCircle className="h-4 w-4 text-rose-500" />;
      case 'detecting': return <Activity className="h-4 w-4 text-amber-500" />;
      case 'analyzing': return <Bot className="h-4 w-4 text-amber-500" />;
      default: return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'availability': return <Activity className="h-4 w-4" />;
      case 'capacity': return <HardDrive className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-emerald-500';
      case 'warning': return 'text-amber-500';
      case 'critical': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Self-Healing</span> Automation
              </h1>
              <p className="mt-2 text-slate-400">
                Intelligent system monitoring and automatic issue resolution
              </p>
            </div>
            <Button
              onClick={() => runDiagnosticsMutation.mutate()}
              disabled={isRunningDiagnostics}
              className="bg-gradient-to-r from-blue-600 to-indigo-700"
            >
              {isRunningDiagnostics ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Run Diagnostics
                </>
              )}
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-2xl font-bold ${getHealthColor(systemHealth.overall)}`}>
                  {systemHealth.overall.toUpperCase()}
                </span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{systemHealth.score}</div>
                  <div className="text-xs text-slate-400">Health Score</div>
                </div>
              </div>
              <Progress value={systemHealth.score} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Active Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemHealth.issues.map((issue, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(issue.category)}
                      <span className="text-sm text-slate-300 capitalize">{issue.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getSeverityColor(issue.severity)} text-white text-xs`}>
                        {issue.count}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Improving:</span>
                  <span className="text-emerald-400">{systemHealth.trends.improving}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stable:</span>
                  <span className="text-blue-400">{systemHealth.trends.stable}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Degrading:</span>
                  <span className="text-amber-400">{systemHealth.trends.degrading}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Auto-Healing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {automationRules.filter(rule => rule.enabled).length}
                </div>
                <div className="text-xs text-slate-400 mb-3">Active Rules</div>
                <div className="text-xs text-slate-500">
                  {Math.round(automationRules.reduce((acc, rule) => acc + rule.successRate, 0) / automationRules.length)}% Success Rate
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="bg-slate-800 mb-6">
            <TabsTrigger value="events">Recent Events</TabsTrigger>
            <TabsTrigger value="rules">Automation Rules</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="space-y-4">
              {healingEvents.map((event: HealingEvent) => (
                <Card 
                  key={event.id} 
                  className="border-slate-800 bg-slate-900 hover:bg-slate-800 cursor-pointer transition-colors"
                  onClick={() => setSelectedEvent(event)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(event.status)}
                        <div>
                          <CardTitle className="text-lg text-white">{event.title}</CardTitle>
                          <p className="text-sm text-slate-400 mt-1">{event.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getSeverityColor(event.severity)} text-white`}>
                          {event.severity}
                        </Badge>
                        {event.autoFixed && (
                          <Badge className="bg-emerald-500 text-white">
                            Auto-Fixed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-400">Services:</span>
                        <span className="text-white">{event.affectedServices.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-400">Status:</span>
                        <span className={getStatusColor(event.status)}>{event.status}</span>
                        <span className="text-slate-400">{formatTimestamp(event.timestamp)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {automationRules.map((rule: AutomationRule) => (
                <Card key={rule.id} className="border-slate-800 bg-slate-900">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(rule.category)}
                        <CardTitle className="text-lg text-white">{rule.name}</CardTitle>
                      </div>
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(enabled) => 
                          toggleRuleMutation.mutate({ ruleId: rule.id, enabled })
                        }
                      />
                    </div>
                    <p className="text-sm text-slate-400">{rule.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-400">Triggers:</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rule.triggers.map((trigger, index) => (
                            <Badge key={index} variant="outline" className="border-slate-700 text-slate-400 text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-slate-400">Actions:</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rule.actions.map((action, index) => (
                            <Badge key={index} variant="outline" className="border-slate-700 text-slate-400 text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-slate-400">Success Rate:</span>
                          <span className="text-emerald-400 ml-1">{rule.successRate}%</span>
                        </div>
                        {rule.lastTriggered && (
                          <div>
                            <span className="text-slate-400">Last Triggered:</span>
                            <span className="text-white ml-1">{formatTimestamp(rule.lastTriggered)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Healing Analytics</CardTitle>
                <CardDescription className="text-slate-400">
                  Performance metrics and trend analysis for self-healing operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">Advanced Analytics</h3>
                  <p className="text-slate-500">
                    Detailed performance analytics and healing trend charts coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Event Details Dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedEvent && getStatusIcon(selectedEvent.status)}
                <span>{selectedEvent?.title}</span>
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {selectedEvent?.description}
              </DialogDescription>
            </DialogHeader>
            
            {selectedEvent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-400">Severity</label>
                    <Badge className={`mt-1 ${getSeverityColor(selectedEvent.severity)} text-white`}>
                      {selectedEvent.severity}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Status</label>
                    <p className={`${getStatusColor(selectedEvent.status)} capitalize`}>{selectedEvent.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Timestamp</label>
                    <p className="text-white">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Auto-Fixed</label>
                    <p className={selectedEvent.autoFixed ? 'text-emerald-400' : 'text-amber-400'}>
                      {selectedEvent.autoFixed ? 'Yes' : 'Manual intervention required'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-400">Affected Services</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedEvent.affectedServices.map((service, index) => (
                      <Badge key={index} variant="outline" className="border-slate-700 text-slate-400">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedEvent.fixCommands && (
                  <div>
                    <label className="text-sm font-medium text-slate-400">Fix Commands</label>
                    <ScrollArea className="h-32 mt-2">
                      <div className="rounded-lg bg-slate-950 p-3">
                        {selectedEvent.fixCommands.map((command, index) => (
                          <div key={index} className="font-mono text-sm text-slate-300 mb-1">
                            $ {command}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {selectedEvent.estimatedDowntime && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400">Estimated Downtime</label>
                      <p className="text-white">{selectedEvent.estimatedDowntime}</p>
                    </div>
                    {selectedEvent.actualDowntime && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Actual Downtime</label>
                        <p className="text-white">{selectedEvent.actualDowntime}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedEvent(null)}
                className="border-slate-700"
              >
                Close
              </Button>
              {selectedEvent && selectedEvent.status === 'failed' && (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-4 w-4" />
                  Retry Healing
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SelfHealingPage;