import React, { useEffect, useState } from 'react';
import { useSocketStore } from '../../lib/socketClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Bell, AlertTriangle, CheckCircle, Activity, Server, HardDrive, Cpu, MemoryStick } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Status badge component for metrics
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'healthy':
      return <Badge className="bg-green-500 text-white">Healthy</Badge>;
    case 'attention':
      return <Badge className="bg-yellow-500 text-white">Attention</Badge>;
    case 'critical':
      return <Badge className="bg-red-500 text-white">Critical</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white">Unknown</Badge>;
  }
};

// Alert badge component for system alerts
const AlertBadge = ({ type }: { type: 'info' | 'warning' | 'error' }) => {
  const variants = {
    info: {
      icon: <Bell className="h-4 w-4" />,
      className: "bg-blue-100 text-blue-800 border-blue-300",
    },
    warning: {
      icon: <AlertTriangle className="h-4 w-4" />,
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    error: {
      icon: <AlertTriangle className="h-4 w-4" />,
      className: "bg-red-100 text-red-800 border-red-300",
    },
  };

  const { icon, className } = variants[type];
  
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {icon}
      <span className="ml-1 capitalize">{type}</span>
    </div>
  );
};

// Real-time monitor component
export const RealTimeMonitor: React.FC = () => {
  // Socket connection and state
  const socket = useSocketStore((state) => state.socket);
  const connected = useSocketStore((state) => state.connected);
  const subscribeToDashboard = useSocketStore((state) => state.subscribeToDashboard);
  const connect = useSocketStore((state) => state.connect);
  
  // Real-time metrics and data
  const metrics = useSocketStore((state) => state.lastMetrics);
  const performanceData = useSocketStore((state) => state.performanceData);
  const logData = useSocketStore((state) => state.logData);
  const systemAlerts = useSocketStore((state) => state.systemAlerts);
  
  // Local state for display
  const [activeTab, setActiveTab] = useState('metrics');
  const [formattedPerformanceData, setFormattedPerformanceData] = useState<any[]>([]);

  // Initialize socket connection
  useEffect(() => {
    if (!socket) {
      connect();
    }
  }, [socket, connect]);

  // Subscribe to dashboard updates
  useEffect(() => {
    if (connected) {
      subscribeToDashboard();
    }
  }, [connected, subscribeToDashboard]);

  // Format performance data for charts
  useEffect(() => {
    if (performanceData && 
        performanceData.timestamps && 
        performanceData.cpu && 
        performanceData.memory && 
        performanceData.network) {
      // Transform performance data for recharts
      const formatted = performanceData.timestamps.map((time: string, index: number) => ({
        name: time,
        cpu: performanceData.cpu[index] || 0,
        memory: performanceData.memory[index] || 0,
        network: performanceData.network[index] || 0,
      }));
      setFormattedPerformanceData(formatted);
    }
  }, [performanceData]);

  // No metrics received yet
  if (!metrics) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Real-Time Monitoring</CardTitle>
          <CardDescription>Establishing connection to server...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">
            {connected ? "Connected, waiting for metrics..." : "Connecting to server..."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Real-Time Monitoring</CardTitle>
            <CardDescription>
              Live server metrics and performance data
            </CardDescription>
          </div>
          {connected ? (
            <Badge className="bg-green-500 text-white">Connected</Badge>
          ) : (
            <Badge className="bg-red-500 text-white">Disconnected</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>
          
          {/* Server Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metrics && Object.entries(metrics).map(([key, value]: [string, any]) => {
                // Skip non-metric properties
                if (!['cpu', 'memory', 'disk', 'network'].includes(key)) return null;
                
                // Calculate values based on metric type
                let displayValue = 0;
                let status = 'healthy';
                let icon = <Activity className="h-4 w-4" />;
                let title = key.charAt(0).toUpperCase() + key.slice(1);
                let max = 100;
                
                if (key === 'cpu') {
                  displayValue = value.usage;
                  status = displayValue > 80 ? 'critical' : displayValue > 60 ? 'attention' : 'healthy';
                  icon = <Cpu className="h-4 w-4" />;
                  title = "CPU Usage";
                } else if (key === 'memory') {
                  displayValue = value.percentage;
                  status = displayValue > 90 ? 'critical' : displayValue > 75 ? 'attention' : 'healthy';
                  icon = <MemoryStick className="h-4 w-4" />;
                  title = "Memory Usage";
                } else if (key === 'disk') {
                  displayValue = value.percentage;
                  status = displayValue > 90 ? 'critical' : displayValue > 80 ? 'attention' : 'healthy';
                  icon = <HardDrive className="h-4 w-4" />;
                  title = "Disk Usage";
                } else if (key === 'network') {
                  displayValue = Math.min(100, (value.bytesReceived + value.bytesSent) / (1024 * 1024 * 10) * 100);
                  icon = <Activity className="h-4 w-4" />;
                  title = "Network Usage";
                  max = 100; // 100 MB/s as max for display
                }
                
                return (
                  <Card key={key} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {icon}
                          <CardTitle className="text-lg">{title}</CardTitle>
                        </div>
                        <StatusBadge status={status} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{Math.round(displayValue)}%</span>
                          <span className="text-muted-foreground">{max}%</span>
                        </div>
                        <Progress 
                          value={displayValue} 
                          max={max}
                          className={
                            status === 'critical' ? 'bg-red-200' : 
                            status === 'attention' ? 'bg-yellow-200' : 
                            'bg-gray-200'
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">System Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {metrics && Object.entries(metrics).map(([key, value]: [string, any]) => {
                    // Skip metric properties already displayed above
                    if (['cpu', 'memory', 'disk', 'network'].includes(key)) return null;
                    
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-muted-foreground">{
                          typeof value === 'object' ? 
                            JSON.stringify(value) : 
                            value
                        }</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance">
            <div className="space-y-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">CPU Usage Over Time</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="cpu" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Memory Usage Over Time</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="memory" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Network Usage Over Time</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="network" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Logs Tab */}
          <TabsContent value="logs">
            <div className="space-y-4">
              {logData?.analysis && (
                <Alert>
                  <AlertTitle className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Log Analysis
                  </AlertTitle>
                  <AlertDescription>
                    {logData.analysis.summary || "No significant issues detected in logs."}
                  </AlertDescription>
                </Alert>
              )}
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Recent Logs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-96 rounded-md">
                    <div className="p-4">
                      {logData?.recentLogs && logData.recentLogs.length > 0 ? (
                        logData.recentLogs.map((log: any, index: number) => (
                          <div 
                            key={index} 
                            className={`py-2 border-b ${
                              log.level === 'error' ? 'text-red-600' : 
                              log.level === 'warning' ? 'text-yellow-600' : 
                              'text-muted-foreground'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground mr-2">[{log.timestamp}]</span>
                              <span className="uppercase text-xs font-bold mr-2">{log.level}</span>
                              <span>{log.message}</span>
                            </div>
                            {log.source && (
                              <div className="ml-6 text-xs text-muted-foreground">
                                Source: {log.source}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No logs available
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <div className="space-y-4">
              {systemAlerts && systemAlerts.length > 0 ? (
                systemAlerts.map((alert, index) => (
                  <Alert key={index} className={
                    alert.type === 'error' ? 'border-red-600 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-600 bg-yellow-50' :
                    'border-blue-600 bg-blue-50'
                  }>
                    <AlertTitle className="flex items-center">
                      <AlertBadge type={alert.type} />
                      <span className="ml-2">{alert.title}</span>
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      {alert.message}
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No alerts at this time
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealTimeMonitor;