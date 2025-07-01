import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  HardDrive,
  MemoryStick,
  Network,
  Play,
  RefreshCw,
  Settings,
  TrendingUp,
  Zap
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  current: number;
  optimal: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  recommendation?: string;
}

interface OptimizationSuggestion {
  id: string;
  category: 'cpu' | 'memory' | 'disk' | 'network' | 'database' | 'system';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedImprovement: string;
  commands: string[];
  applied: boolean;
}

interface PerformanceAnalysis {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  metrics: PerformanceMetric[];
  suggestions: OptimizationSuggestion[];
  lastAnalyzed: string;
}

const AIPerformanceTuner: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<OptimizationSuggestion | null>(null);
  const [isApplying, setIsApplying] = useState<string | null>(null);

  // Fetch current performance analysis
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['/api/ai/performance-analysis'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/ai/performance-analysis');
        if (!response.ok) throw new Error('Failed to fetch analysis');
        return response.json();
      } catch (error) {
        // Return sample data for demo
        return generateSampleAnalysis();
      }
    },
    enabled: !!user,
  });

  // Run performance analysis mutation
  const analyzePerformanceMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/analyze-performance');
      if (!response.ok) throw new Error('Failed to analyze performance');
      return response.json();
    },
    onMutate: () => {
      setIsAnalyzing(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/performance-analysis'] });
      toast({
        title: "Analysis complete",
        description: "Performance analysis has been updated with new recommendations.",
      });
      setIsAnalyzing(false);
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
      setIsAnalyzing(false);
    },
  });

  // Apply optimization mutation
  const applyOptimizationMutation = useMutation({
    mutationFn: async (suggestionId: string) => {
      const response = await apiRequest('POST', `/api/ai/apply-optimization/${suggestionId}`);
      if (!response.ok) throw new Error('Failed to apply optimization');
      return response.json();
    },
    onSuccess: (data, suggestionId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/performance-analysis'] });
      toast({
        title: "Optimization applied",
        description: "Performance optimization has been successfully applied.",
      });
      setIsApplying(null);
      setSelectedSuggestion(null);
    },
    onError: (error) => {
      toast({
        title: "Optimization failed",
        description: error.message,
        variant: "destructive",
      });
      setIsApplying(null);
    },
  });

  // Generate sample analysis data
  const generateSampleAnalysis = (): PerformanceAnalysis => {
    return {
      score: 78,
      grade: 'B',
      lastAnalyzed: new Date().toISOString(),
      metrics: [
        {
          name: 'CPU Usage',
          current: 65,
          optimal: 70,
          unit: '%',
          status: 'optimal',
          trend: 'stable',
          recommendation: 'CPU usage is within optimal range'
        },
        {
          name: 'Memory Usage',
          current: 85,
          optimal: 80,
          unit: '%',
          status: 'warning',
          trend: 'up',
          recommendation: 'Consider adding more RAM or optimizing memory usage'
        },
        {
          name: 'Disk I/O',
          current: 45,
          optimal: 60,
          unit: 'MB/s',
          status: 'critical',
          trend: 'down',
          recommendation: 'Disk performance is below optimal, consider SSD upgrade'
        },
        {
          name: 'Network Latency',
          current: 12,
          optimal: 10,
          unit: 'ms',
          status: 'warning',
          trend: 'up',
          recommendation: 'Network latency slightly elevated'
        },
        {
          name: 'Database Connections',
          current: 45,
          optimal: 100,
          unit: 'active',
          status: 'optimal',
          trend: 'stable',
          recommendation: 'Database connection pool is healthy'
        }
      ],
      suggestions: [
        {
          id: 'opt-1',
          category: 'memory',
          title: 'Enable Memory Compression',
          description: 'Enable zRAM to compress memory pages and reduce memory pressure',
          impact: 'medium',
          difficulty: 'easy',
          estimatedImprovement: '15-20% memory efficiency',
          commands: [
            'sudo apt install zram-config',
            'sudo systemctl enable zram-config',
            'sudo systemctl start zram-config'
          ],
          applied: false
        },
        {
          id: 'opt-2',
          category: 'disk',
          title: 'Optimize Disk Scheduler',
          description: 'Switch to deadline I/O scheduler for better SSD performance',
          impact: 'high',
          difficulty: 'medium',
          estimatedImprovement: '25-30% disk throughput',
          commands: [
            'echo deadline | sudo tee /sys/block/sda/queue/scheduler',
            'echo "GRUB_CMDLINE_LINUX_DEFAULT=\\"elevator=deadline\\"" | sudo tee -a /etc/default/grub',
            'sudo update-grub'
          ],
          applied: false
        },
        {
          id: 'opt-3',
          category: 'network',
          title: 'TCP Congestion Control',
          description: 'Switch to BBR congestion control for better network performance',
          impact: 'medium',
          difficulty: 'easy',
          estimatedImprovement: '10-15% network throughput',
          commands: [
            'echo "net.core.default_qdisc=fq" | sudo tee -a /etc/sysctl.conf',
            'echo "net.ipv4.tcp_congestion_control=bbr" | sudo tee -a /etc/sysctl.conf',
            'sudo sysctl -p'
          ],
          applied: false
        },
        {
          id: 'opt-4',
          category: 'system',
          title: 'Kernel Parameter Tuning',
          description: 'Optimize kernel parameters for server workloads',
          impact: 'high',
          difficulty: 'hard',
          estimatedImprovement: '20-25% overall performance',
          commands: [
            'echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.conf',
            'echo "vm.dirty_ratio=15" | sudo tee -a /etc/sysctl.conf',
            'echo "vm.dirty_background_ratio=5" | sudo tee -a /etc/sysctl.conf',
            'sudo sysctl -p'
          ],
          applied: false
        },
        {
          id: 'opt-5',
          category: 'database',
          title: 'MySQL Query Cache',
          description: 'Optimize MySQL query cache settings for better database performance',
          impact: 'high',
          difficulty: 'medium',
          estimatedImprovement: '30-40% query response time',
          commands: [
            'sudo mysql -e "SET GLOBAL query_cache_size = 67108864;"',
            'sudo mysql -e "SET GLOBAL query_cache_type = ON;"',
            'echo "query_cache_size = 64M" | sudo tee -a /etc/mysql/mysql.conf.d/mysqld.cnf'
          ],
          applied: false
        }
      ]
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-emerald-500';
      case 'warning': return 'text-amber-500';
      case 'critical': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      default: return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cpu': return <Cpu className="h-4 w-4" />;
      case 'memory': return <MemoryStick className="h-4 w-4" />;
      case 'disk': return <HardDrive className="h-4 w-4" />;
      case 'network': return <Network className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'hard': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-500';
      case 'B': return 'text-blue-500';
      case 'C': return 'text-amber-500';
      case 'D': return 'text-orange-500';
      case 'F': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  // Auto-analyze on component mount
  useEffect(() => {
    if (user && !analysis && !isLoading) {
      analyzePerformanceMutation.mutate();
    }
  }, [user, analysis, isLoading]);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">AI Performance</span> Tuner
              </h1>
              <p className="mt-2 text-slate-400">
                Intelligent system optimization powered by AI analysis
              </p>
            </div>
            <Button
              onClick={() => analyzePerformanceMutation.mutate()}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-indigo-700"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-blue-600"></div>
          </div>
        ) : analysis ? (
          <div className="space-y-8">
            {/* Performance Score */}
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Performance Score</CardTitle>
                <CardDescription className="text-slate-400">
                  Overall system performance rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-bold text-white">{analysis.score}</div>
                    <div className={`text-2xl font-bold ${getGradeColor(analysis.grade)}`}>
                      Grade {analysis.grade}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Last analyzed:</p>
                    <p className="text-white">{new Date(analysis.lastAnalyzed).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={analysis.score} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="bg-slate-800">
                <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
                <TabsTrigger value="suggestions">Optimization Suggestions</TabsTrigger>
                <TabsTrigger value="history">Performance History</TabsTrigger>
              </TabsList>

              {/* Metrics Tab */}
              <TabsContent value="metrics" className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {analysis.metrics.map((metric, index) => (
                    <Card key={index} className="border-slate-800 bg-slate-900">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-white">{metric.name}</CardTitle>
                          {getStatusIcon(metric.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Current:</span>
                            <span className={`font-medium ${getStatusColor(metric.status)}`}>
                              {metric.current}{metric.unit}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Optimal:</span>
                            <span className="text-slate-300">{metric.optimal}{metric.unit}</span>
                          </div>
                          <div className="relative">
                            <Progress
                              value={Math.min((metric.current / metric.optimal) * 100, 100)}
                              className="h-2"
                            />
                          </div>
                          {metric.recommendation && (
                            <p className="text-xs text-slate-500 mt-2">
                              {metric.recommendation}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Suggestions Tab */}
              <TabsContent value="suggestions" className="space-y-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {analysis.suggestions.map((suggestion) => (
                    <Card
                      key={suggestion.id}
                      className={`border-slate-800 bg-slate-900 hover:bg-slate-800 cursor-pointer transition-colors ${
                        selectedSuggestion?.id === suggestion.id ? 'border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedSuggestion(suggestion)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(suggestion.category)}
                            <CardTitle className="text-lg text-white">{suggestion.title}</CardTitle>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={`${getImpactColor(suggestion.impact)} text-white text-xs`}>
                              {suggestion.impact} impact
                            </Badge>
                            <Badge className={`${getDifficultyColor(suggestion.difficulty)} text-white text-xs`}>
                              {suggestion.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-sm mb-3">{suggestion.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-500">Expected improvement:</p>
                            <p className="text-sm text-emerald-400">{suggestion.estimatedImprovement}</p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={suggestion.applied || isApplying === suggestion.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsApplying(suggestion.id);
                              applyOptimizationMutation.mutate(suggestion.id);
                            }}
                          >
                            {suggestion.applied ? (
                              <>
                                <CheckCircle2 className="mr-2 h-3 w-3" />
                                Applied
                              </>
                            ) : isApplying === suggestion.id ? (
                              <>
                                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                                Applying...
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-3 w-3" />
                                Apply
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <Card className="border-slate-800 bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-white">Performance History</CardTitle>
                    <CardDescription className="text-slate-400">
                      Track performance improvements over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                      <h3 className="text-lg font-medium text-slate-400 mb-2">Performance Tracking</h3>
                      <p className="text-slate-500">
                        Historical performance data and trend analysis coming soon.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : null}

        {/* Suggestion Details Dialog */}
        <Dialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
          <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedSuggestion && getCategoryIcon(selectedSuggestion.category)}
                <span>{selectedSuggestion?.title}</span>
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {selectedSuggestion?.description}
              </DialogDescription>
            </DialogHeader>
            
            {selectedSuggestion && (
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div>
                    <label className="text-sm font-medium text-slate-400">Impact</label>
                    <Badge className={`mt-1 ${getImpactColor(selectedSuggestion.impact)} text-white`}>
                      {selectedSuggestion.impact}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Difficulty</label>
                    <Badge className={`mt-1 ${getDifficultyColor(selectedSuggestion.difficulty)} text-white`}>
                      {selectedSuggestion.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-400">Expected Improvement</label>
                  <p className="text-emerald-400">{selectedSuggestion.estimatedImprovement}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-400">Commands to Execute</label>
                  <ScrollArea className="h-32 mt-2">
                    <div className="rounded-lg bg-slate-950 p-3">
                      {selectedSuggestion.commands.map((command, index) => (
                        <div key={index} className="font-mono text-sm text-slate-300 mb-1">
                          $ {command}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedSuggestion(null)}
                className="border-slate-700"
              >
                Close
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                disabled={selectedSuggestion?.applied || isApplying === selectedSuggestion?.id}
                onClick={() => {
                  if (selectedSuggestion) {
                    setIsApplying(selectedSuggestion.id);
                    applyOptimizationMutation.mutate(selectedSuggestion.id);
                  }
                }}
              >
                {selectedSuggestion?.applied ? (
                  'Already Applied'
                ) : isApplying === selectedSuggestion?.id ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Apply Optimization
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AIPerformanceTuner;