import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Activity, Cpu, Database, Network, Shield, Zap } from "lucide-react";
import { ProfessionalChart, ProfessionalCpu, ProfessionalDatabase, ProfessionalShield } from "@/components/ui/professional-icons";

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  change: number;
}

interface AIModel {
  id: string;
  name: string;
  status: "online" | "offline" | "deploying";
  requests: number;
  latency: number;
  accuracy: number;
  errorRate: number;
}

interface SecurityAlert {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  type: string;
  description: string;
  timestamp: string;
  status: "active" | "resolved" | "investigating";
}

export default function EnterpriseDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    { name: "CPU Usage", value: 67, unit: "%", status: "healthy", trend: "stable", change: 0.2 },
    { name: "Memory Usage", value: 54, unit: "%", status: "healthy", trend: "down", change: -2.1 },
    { name: "GPU Utilization", value: 89, unit: "%", status: "warning", trend: "up", change: 5.3 },
    { name: "Network I/O", value: 234, unit: "MB/s", status: "healthy", trend: "up", change: 12.4 },
    { name: "Storage Usage", value: 76, unit: "%", status: "warning", trend: "up", change: 1.8 },
    { name: "API Requests", value: 15420, unit: "/min", status: "healthy", trend: "up", change: 8.7 }
  ]);

  const [aiModels, setAiModels] = useState<AIModel[]>([
    { id: "nlp-v3", name: "QuantumNLP-v3", status: "online", requests: 8934, latency: 12.3, accuracy: 94.7, errorRate: 0.02 },
    { id: "vision-pro", name: "NeuralVision Pro", status: "online", requests: 5672, latency: 8.9, accuracy: 96.2, errorRate: 0.01 },
    { id: "security-guardian", name: "CyberSec Guardian", status: "online", requests: 12456, latency: 3.2, accuracy: 98.1, errorRate: 0.003 },
    { id: "analytics-engine", name: "Predictive Analytics", status: "deploying", requests: 0, latency: 0, accuracy: 91.5, errorRate: 0 },
    { id: "recommendation-ai", name: "Recommendation AI+", status: "online", requests: 3421, latency: 25.1, accuracy: 87.9, errorRate: 0.05 }
  ]);

  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([
    {
      id: "alert-001",
      severity: "high",
      type: "Suspicious Login Attempt",
      description: "Multiple failed login attempts detected from IP 192.168.1.100",
      timestamp: "2 minutes ago",
      status: "investigating"
    },
    {
      id: "alert-002",
      severity: "medium",
      type: "Unusual API Usage",
      description: "API request rate exceeded normal thresholds by 150%",
      timestamp: "15 minutes ago",
      status: "active"
    },
    {
      id: "alert-003",
      severity: "low",
      type: "Certificate Expiring",
      description: "SSL certificate for api.shatzii.com expires in 30 days",
      timestamp: "1 hour ago",
      status: "active"
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update system metrics with realistic fluctuations
      setSystemMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 2)),
        change: (Math.random() - 0.5) * 10
      })));

      // Update AI model metrics
      setAiModels(prev => prev.map(model => ({
        ...model,
        requests: model.status === "online" ? model.requests + Math.floor(Math.random() * 50) : 0,
        latency: model.status === "online" ? Math.max(1, model.latency + (Math.random() - 0.5) * 2) : 0,
        errorRate: model.status === "online" ? Math.max(0, model.errorRate + (Math.random() - 0.5) * 0.01) : 0
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
      case "resolved":
        return "text-green-400 border-green-400/30 bg-green-400/10";
      case "warning":
      case "deploying":
      case "investigating":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "critical":
      case "offline":
      case "active":
        return "text-red-400 border-red-400/30 bg-red-400/10";
      default:
        return "text-slate-400 border-slate-400/30 bg-slate-400/10";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-blue-400 border-blue-400/30";
      case "medium": return "text-yellow-400 border-yellow-400/30";
      case "high": return "text-orange-400 border-orange-400/30";
      case "critical": return "text-red-400 border-red-400/30";
      default: return "text-slate-400 border-slate-400/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <section className="py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wide mb-4">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></span>
                Enterprise Command Center
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 leading-tight mb-2">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Real-Time</span> Infrastructure Monitor
              </h1>
              
              <p className="text-lg text-slate-300">
                Live monitoring of AI systems, security status, and performance metrics
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0">
              <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
                <div className="text-xs text-slate-400 font-mono mb-1">SYSTEM TIME</div>
                <div className="text-lg text-cyan-400 font-mono">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-slate-400 font-mono">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <Activity className="w-4 h-4 mr-2" />
                System Overview
              </TabsTrigger>
              <TabsTrigger value="models" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <ProfessionalCpu className="w-4 h-4 mr-2" />
                AI Models
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <ProfessionalShield className="w-4 h-4 mr-2" />
                Security Center
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <ProfessionalChart className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* System Overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemMetrics.map((metric, index) => (
                  <Card key={index} className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-slate-100 text-sm font-mono uppercase tracking-wide">
                          {metric.name}
                        </CardTitle>
                        <Badge variant="outline" className={`text-xs font-mono ${getStatusColor(metric.status)}`}>
                          {metric.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-between mb-3">
                        <div className="text-2xl font-mono text-cyan-400">
                          {metric.value.toFixed(1)}{metric.unit}
                        </div>
                        <div className={`flex items-center text-sm font-mono ${metric.trend === "up" ? "text-green-400" : metric.trend === "down" ? "text-red-400" : "text-slate-400"}`}>
                          {metric.trend === "up" ? <TrendingUp className="w-3 h-3 mr-1" /> : 
                           metric.trend === "down" ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                          {metric.change > 0 ? "+" : ""}{metric.change.toFixed(1)}%
                        </div>
                      </div>
                      {metric.unit === "%" && (
                        <Progress 
                          value={metric.value} 
                          className="h-2"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* AI Models */}
            <TabsContent value="models" className="space-y-6">
              <div className="grid gap-4">
                {aiModels.map((model) => (
                  <Card key={model.id} className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-100">{model.name}</h3>
                            <Badge variant="outline" className={`text-xs font-mono mt-1 ${getStatusColor(model.status)}`}>
                              {model.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">REQUESTS</div>
                            <div className="text-sm text-cyan-400 font-mono">{model.requests.toLocaleString()}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">LATENCY</div>
                            <div className="text-sm text-blue-400 font-mono">{model.latency.toFixed(1)}ms</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">ACCURACY</div>
                            <div className="text-sm text-green-400 font-mono">{model.accuracy}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">ERROR RATE</div>
                            <div className="text-sm text-orange-400 font-mono">{(model.errorRate * 100).toFixed(2)}%</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Security Center */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-4">
                {securityAlerts.map((alert) => (
                  <Card key={alert.id} className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {alert.severity === "critical" || alert.severity === "high" ? 
                              <AlertTriangle className="w-5 h-5 text-red-400" /> :
                              <Shield className="w-5 h-5 text-yellow-400" />
                            }
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-100">{alert.type}</h3>
                              <Badge variant="outline" className={`text-xs font-mono ${getSeverityColor(alert.severity)}`}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className={`text-xs font-mono ${getStatusColor(alert.status)}`}>
                                {alert.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-slate-300 mb-2">{alert.description}</p>
                            <div className="text-xs text-slate-400 font-mono">{alert.timestamp}</div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10">
                            Investigate
                          </Button>
                          <Button size="sm" variant="outline" className="border-green-400/30 text-green-400 hover:bg-green-400/10">
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <ProfessionalChart className="w-5 h-5 text-cyan-400" />
                      Performance Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-slate-900/50 rounded-lg border border-cyan-500/20 flex items-center justify-center">
                      <div className="text-slate-400 font-mono text-sm">Real-time performance chart visualization</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      Resource Utilization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-mono text-sm">Compute Nodes</span>
                        <span className="text-cyan-400 font-mono text-sm">24/32 Active</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-mono text-sm">GPU Clusters</span>
                        <span className="text-blue-400 font-mono text-sm">8/12 Active</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-mono text-sm">Storage Pools</span>
                        <span className="text-green-400 font-mono text-sm">6/8 Online</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-mono text-sm">Network Bandwidth</span>
                        <span className="text-purple-400 font-mono text-sm">67% Utilized</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}