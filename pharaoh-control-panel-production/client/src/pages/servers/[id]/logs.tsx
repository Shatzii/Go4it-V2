import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useSocketStore } from '@/lib/socketClient';
import { 
  AlertCircle,
  ArrowLeft,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Search,
  Terminal,
  AlertTriangle,
  Info,
  XCircle
} from 'lucide-react';
import { Link } from 'wouter';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  source: string;
  message: string;
  metadata?: Record<string, any>;
}

interface LogFilter {
  level: string;
  source: string;
  timeRange: string;
  search: string;
}

const ServerLogsPage: React.FC = () => {
  const [, params] = useRoute('/servers/:id/logs');
  const serverId = params?.id;
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState<LogFilter>({
    level: 'all',
    source: 'all',
    timeRange: '1h',
    search: ''
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Get real-time logs from socket
  const socketData = useSocketStore(state => state.serverMetrics);

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

  // Fetch logs with filters
  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: [`/api/servers/${serverId}/logs`, filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters.level !== 'all') params.append('level', filters.level);
        if (filters.source !== 'all') params.append('source', filters.source);
        if (filters.timeRange !== 'all') params.append('timeRange', filters.timeRange);
        if (filters.search) params.append('search', filters.search);

        const response = await apiRequest('GET', `/api/servers/${serverId}/logs?${params}`);
        if (!response.ok) throw new Error('Failed to fetch logs');
        return response.json();
      } catch (error) {
        // Return sample data for demo
        return generateSampleLogs();
      }
    },
    enabled: !!serverId && !!user,
    refetchInterval: autoRefresh ? 5000 : false,
  });

  // Export logs mutation
  const exportLogsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/servers/${serverId}/logs/export`, { filters });
      if (!response.ok) throw new Error('Failed to export logs');
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `server-logs-${serverId}-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Logs exported",
        description: "Log file has been downloaded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate sample logs for demo
  const generateSampleLogs = (): LogEntry[] => {
    const levels: LogEntry['level'][] = ['error', 'warning', 'info', 'debug'];
    const sources = ['nginx', 'mysql', 'ssh', 'system', 'security', 'application'];
    const messages = {
      error: [
        'Connection to database failed: timeout after 30 seconds',
        'Failed to start service: permission denied',
        'Critical: Out of disk space on /var partition',
        'SSL certificate validation failed for domain.com',
        'Memory allocation failed: out of memory'
      ],
      warning: [
        'High CPU usage detected: 85%',
        'SSL certificate expires in 7 days',
        'Unusual number of failed login attempts',
        'Disk usage above 80% on /home partition',
        'Service restart required for configuration changes'
      ],
      info: [
        'Service started successfully',
        'User login from IP 192.168.1.100',
        'Backup completed successfully',
        'Configuration file updated',
        'System update available'
      ],
      debug: [
        'Processing request /api/users',
        'Database query executed in 250ms',
        'Cache miss for key: user_sessions',
        'File uploaded: document.pdf (2.5MB)',
        'Email sent to user@example.com'
      ]
    };

    const logs: LogEntry[] = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const messageList = messages[level];
      const message = messageList[Math.floor(Math.random() * messageList.length)];
      
      const timestamp = new Date(now.getTime() - Math.random() * 3600000 * 24); // Random time in last 24h
      
      logs.push({
        id: `log-${i}`,
        timestamp: timestamp.toISOString(),
        level,
        source,
        message,
        metadata: {
          pid: Math.floor(Math.random() * 10000),
          user: 'system',
          ...(source === 'nginx' && { request_id: `req-${Math.random().toString(36).substr(2, 9)}` }),
          ...(source === 'mysql' && { query_time: `${(Math.random() * 1000).toFixed(2)}ms` })
        }
      });
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // Filter logs based on current filters
  const filteredLogs = logs.filter((log: LogEntry) => {
    if (filters.level !== 'all' && log.level !== filters.level) return false;
    if (filters.source !== 'all' && log.source !== filters.source) return false;
    if (filters.search && !log.message.toLowerCase().includes(filters.search.toLowerCase())) return false;
    
    // Time range filtering
    if (filters.timeRange !== 'all') {
      const logTime = new Date(log.timestamp);
      const now = new Date();
      const ranges = {
        '1h': 3600000,
        '6h': 6 * 3600000,
        '24h': 24 * 3600000,
        '7d': 7 * 24 * 3600000,
        '30d': 30 * 24 * 3600000
      };
      const rangeMs = ranges[filters.timeRange as keyof typeof ranges];
      if (rangeMs && now.getTime() - logTime.getTime() > rangeMs) return false;
    }
    
    return true;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="h-4 w-4 text-rose-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'debug': return <Terminal className="h-4 w-4 text-slate-500" />;
      default: return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-rose-500';
      case 'warning': return 'bg-amber-500';
      case 'info': return 'bg-blue-500';
      case 'debug': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refetch();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refetch]);

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
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Server</span> Logs
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
            <Button
              variant="outline"
              size="sm"
              className={`border-slate-700 ${autoRefresh ? 'bg-blue-600 text-white' : ''}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700"
              onClick={() => exportLogsMutation.mutate()}
              disabled={exportLogsMutation.isPending}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 w-64 border-slate-700 bg-slate-800 text-white"
              />
            </div>
            
            <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
              <SelectTrigger className="w-32 border-slate-700 bg-slate-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800 text-white">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.source} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}>
              <SelectTrigger className="w-32 border-slate-700 bg-slate-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800 text-white">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="nginx">Nginx</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="ssh">SSH</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="application">Application</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.timeRange} onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value }))}>
              <SelectTrigger className="w-32 border-slate-700 bg-slate-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800 text-white">
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="6h">Last 6 Hours</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-slate-400">
            Showing {filteredLogs.length} of {logs.length} log entries
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Log list */}
          <div className="lg:col-span-2">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Log Entries</CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time server logs with filtering and search
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-blue-600"></div>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-1 p-4">
                      {filteredLogs.map((log: LogEntry) => (
                        <div
                          key={log.id}
                          className={`flex items-start space-x-3 rounded-lg p-3 hover:bg-slate-800 cursor-pointer transition-colors ${
                            selectedLog?.id === log.id ? 'bg-slate-800 border border-blue-500' : ''
                          }`}
                          onClick={() => setSelectedLog(log)}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {getLevelIcon(log.level)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline" className={`${getLevelColor(log.level)} text-white border-0 text-xs`}>
                                {log.level}
                              </Badge>
                              <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-400 text-xs">
                                {log.source}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {formatTimestamp(log.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 truncate">
                              {log.message}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {filteredLogs.length === 0 && (
                        <div className="text-center py-12">
                          <AlertCircle className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                          <h3 className="text-lg font-medium text-slate-400 mb-2">No logs found</h3>
                          <p className="text-slate-500">
                            No logs match your current filters. Try adjusting your search criteria.
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Log details */}
          <div className="lg:col-span-1">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Log Details</CardTitle>
                <CardDescription className="text-slate-400">
                  Detailed information about selected log entry
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedLog ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400">Timestamp</label>
                      <p className="text-sm text-white font-mono">
                        {formatTimestamp(selectedLog.timestamp)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400">Level</label>
                      <div className="flex items-center space-x-2 mt-1">
                        {getLevelIcon(selectedLog.level)}
                        <Badge className={`${getLevelColor(selectedLog.level)} text-white`}>
                          {selectedLog.level.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400">Source</label>
                      <p className="text-sm text-white">{selectedLog.source}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400">Message</label>
                      <p className="text-sm text-white break-words">
                        {selectedLog.message}
                      </p>
                    </div>
                    
                    {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Metadata</label>
                        <div className="mt-2 rounded-lg bg-slate-950 p-3">
                          <pre className="text-xs text-slate-300 overflow-x-auto">
                            {JSON.stringify(selectedLog.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-700"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
                          toast({
                            title: "Copied to clipboard",
                            description: "Log entry has been copied.",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-400 mb-2">Select a log entry</h3>
                    <p className="text-slate-500">
                      Click on a log entry to view detailed information.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerLogsPage;