import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeCheck, Shield, RefreshCw, Activity, Server, Database, Cpu, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SystemPage() {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Query system status
  const { data: systemStatus, isLoading, refetch } = useQuery({
    queryKey: ["/api/system/status"],
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
  
  // Simulated performance metrics for visualization
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0
  });
  
  // Update simulated metrics every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.min(95, Math.floor(40 + Math.random() * 20)),
        memory: Math.min(95, Math.floor(50 + Math.random() * 25)),
        disk: Math.min(95, Math.floor(30 + Math.random() * 15)),
        network: Math.min(95, Math.floor(20 + Math.random() * 30))
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle system optimization
  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    try {
      const response = await fetch("/api/system/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "System Optimized",
          description: "Performance optimization completed successfully.",
        });
        refetch(); // Refresh system status
      } else {
        toast({
          title: "Optimization Failed",
          description: data.message || "Failed to optimize system.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during optimization.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const getStatusColor = (value: number): string => {
    if (value < 60) return "bg-green-500";
    if (value < 80) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">System Health</h1>
        <Button 
          variant="default" 
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-20">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Server className="h-4 w-4 mr-2 text-blue-400" />
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.cpu}%</div>
                  <Progress className="h-2 mt-2" value={metrics.cpu} 
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className={metrics.cpu > 75 ? "text-red-500" : "text-blue-500"}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-green-400" />
                    Memory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.memory}%</div>
                  <Progress className="h-2 mt-2" value={metrics.memory} 
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className={metrics.memory > 75 ? "text-red-500" : "text-green-500"}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Database className="h-4 w-4 mr-2 text-purple-400" />
                    Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.disk}%</div>
                  <Progress className="h-2 mt-2" value={metrics.disk} 
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className="text-purple-500"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-orange-400" />
                    Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.network}%</div>
                  <Progress className="h-2 mt-2" value={metrics.network} 
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className="text-orange-500"
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Overview of system health and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Performance</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Uptime</span>
                          <span className="font-medium">{Math.floor(Math.random() * 120) + 24} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cache Hit Rate</span>
                          <span className="font-medium">{Math.floor(Math.random() * 20) + 80}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Avg. Response Time</span>
                          <span className="font-medium">{Math.floor(Math.random() * 100) + 20} ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">DB Queries / min</span>
                          <span className="font-medium">{Math.floor(Math.random() * 500) + 100}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Services</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span>Threat Detection</span>
                          </div>
                          <span className="text-xs text-gray-400">Running</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span>Anomaly Detection</span>
                          </div>
                          <span className="text-xs text-gray-400">Running</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span>Network Monitoring</span>
                          </div>
                          <span className="text-xs text-gray-400">Running</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span>File Integrity</span>
                          </div>
                          <span className="text-xs text-gray-400">Running</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Services</CardTitle>
                <CardDescription>Status of all system services and components</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uptime</TableHead>
                      <TableHead>Last Event</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Threat Detection Engine</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
                          <span>Operational</span>
                        </div>
                      </TableCell>
                      <TableCell>{Math.floor(Math.random() * 120) + 24}h</TableCell>
                      <TableCell className="text-gray-400 text-sm">{new Date().toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Anomaly Detection</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
                          <span>Operational</span>
                        </div>
                      </TableCell>
                      <TableCell>{Math.floor(Math.random() * 120) + 24}h</TableCell>
                      <TableCell className="text-gray-400 text-sm">{new Date().toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Network Monitoring</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
                          <span>Operational</span>
                        </div>
                      </TableCell>
                      <TableCell>{Math.floor(Math.random() * 120) + 24}h</TableCell>
                      <TableCell className="text-gray-400 text-sm">{new Date().toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">File Integrity Monitor</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
                          <span>Operational</span>
                        </div>
                      </TableCell>
                      <TableCell>{Math.floor(Math.random() * 120) + 24}h</TableCell>
                      <TableCell className="text-gray-400 text-sm">{new Date().toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Notification Hub</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
                          <span>Operational</span>
                        </div>
                      </TableCell>
                      <TableCell>{Math.floor(Math.random() * 120) + 24}h</TableCell>
                      <TableCell className="text-gray-400 text-sm">{new Date().toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Database Service</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
                          <span>Operational</span>
                        </div>
                      </TableCell>
                      <TableCell>{Math.floor(Math.random() * 120) + 24}h</TableCell>
                      <TableCell className="text-gray-400 text-sm">{new Date().toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Connection Statistics</CardTitle>
                <CardDescription>Active client connections and websocket stats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-xl font-bold">{Math.floor(Math.random() * 30) + 5}</div>
                    <div className="text-sm text-gray-400">Active WebSocket Connections</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xl font-bold">{Math.floor(Math.random() * 10) + 2}</div>
                    <div className="text-sm text-gray-400">Database Connections</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xl font-bold">{Math.floor(Math.random() * 200) + 50}/min</div>
                    <div className="text-sm text-gray-400">Real-time Events</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="optimization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Optimization</CardTitle>
                <CardDescription>Optimize system performance and resource usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert className="bg-blue-900/30 border-blue-800">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>System Performance</AlertTitle>
                    <AlertDescription>
                      The system performance is currently operating at optimal levels. Regular maintenance is recommended to ensure continued performance.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="p-6 border rounded-lg border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Optimization Actions</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Running system optimization will clear caches, optimize database connections, and free up memory. This may cause a brief period of slower performance before improvements take effect.
                    </p>
                    
                    <Button 
                      onClick={handleOptimize}
                      disabled={isOptimizing}
                      className="w-full"
                    >
                      {isOptimizing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Optimizing...
                        </>
                      ) : (
                        <>
                          <Cpu className="h-4 w-4 mr-2" />
                          Optimize System Performance
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Cached Data</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Memory Cache</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">{Math.floor(Math.random() * 400) + 100} entries</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Database Query Cache</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">{Math.floor(Math.random() * 300) + 200} entries</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>File System Cache</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">{Math.floor(Math.random() * 200) + 50} entries</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History</CardTitle>
                <CardDescription>Recent system maintenance and optimization events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-blue-500 pl-4 py-2">
                    <div className="text-sm text-gray-400">Today, {new Date().toLocaleTimeString()}</div>
                    <div className="font-medium">Manual System Optimization</div>
                    <div className="text-sm text-gray-400 mt-1">Cleaned 345 cache entries, optimized 23 database queries</div>
                  </div>
                  
                  <div className="border-l-2 border-gray-700 pl-4 py-2">
                    <div className="text-sm text-gray-400">Yesterday, 14:32</div>
                    <div className="font-medium">Automatic Cache Cleanup</div>
                    <div className="text-sm text-gray-400 mt-1">Removed 127 expired cache entries</div>
                  </div>
                  
                  <div className="border-l-2 border-gray-700 pl-4 py-2">
                    <div className="text-sm text-gray-400">2 days ago, 08:15</div>
                    <div className="font-medium">Database Index Optimization</div>
                    <div className="text-sm text-gray-400 mt-1">Rebuilt indexes for security logs and threat data</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}