import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

// UI Components
import TopNav from '@/components/layout/TopNav';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Types
interface AnalysisResult {
  id: string;
  timestamp: string;
  type: 'security' | 'performance' | 'root-cause' | 'recommendation';
  title: string;
  summary: string;
  details: {
    findings: Array<{
      severity: 'low' | 'medium' | 'high' | 'critical';
      title: string;
      description: string;
      recommendation?: string;
      code?: string;
    }>;
    recommendations?: Array<{
      title: string;
      description: string;
      impact: string;
      effort: 'easy' | 'medium' | 'hard';
      code?: string;
    }>;
    rootCause?: {
      description: string;
      affectedComponents: string[];
      evidence: string;
    };
    metrics?: {
      beforeScore?: number;
      afterScore?: number;
      improvementPercent?: number;
    };
  };
}

const AiAnalyzer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('server-analysis');
  const [analysisType, setAnalysisType] = useState('performance');
  const [issueDescription, setIssueDescription] = useState('');
  const [logContent, setLogContent] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch available log files
  const {
    data: logFiles = [],
    isLoading: isLoadingLogFiles
  } = useQuery({
    queryKey: ['/api/monitoring/log-files'],
    retry: 1
  });

  // Fetch previous analyses
  const {
    data: previousAnalyses = [],
    isLoading: isLoadingAnalyses
  } = useQuery({
    queryKey: ['/api/ai/analyses'],
    retry: 1
  });

  // Analyze server logs mutation
  const analyzeServerMutation = useMutation({
    mutationFn: async ({ analysisType, issueDescription, logSources }: any) => {
      const response = await apiRequest('POST', '/api/ai/analyze-server', {
        analysisType,
        issueDescription,
        logSources
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Analysis failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Analysis Complete',
        description: 'The AI has successfully analyzed your server.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/analyses'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Analysis Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Analyze code mutation
  const analyzeCodeMutation = useMutation({
    mutationFn: async ({ code, language }: any) => {
      const response = await apiRequest('POST', '/api/ai/analyze-code', {
        code,
        language
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Code analysis failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Code Analysis Complete',
        description: 'The AI has successfully analyzed your code.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/analyses'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Analysis Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Get security audit mutation
  const securityAuditMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/security-audit', {});

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Security audit failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Security Audit Complete',
        description: 'The AI has completed a comprehensive security audit of your server.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/analyses'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Security Audit Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Generate documentation mutation
  const generateDocsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/generate-documentation', {});

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Documentation generation failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Documentation Generated',
        description: 'Server documentation has been generated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Documentation Generation Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  // Handle form submission for server analysis
  const handleServerAnalysisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLogs.length === 0) {
      toast({
        title: 'No logs selected',
        description: 'Please select at least one log file to analyze.',
        variant: 'destructive',
      });
      return;
    }

    analyzeServerMutation.mutate({
      analysisType,
      issueDescription,
      logSources: selectedLogs
    });
  };

  // Handle form submission for code analysis
  const handleCodeAnalysisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileContent) {
      toast({
        title: 'No code to analyze',
        description: 'Please provide code to analyze by pasting it or uploading a file.',
        variant: 'destructive',
      });
      return;
    }

    // Detect language from file extension or default to 'javascript'
    const fileName = fileInputRef.current?.files?.[0]?.name || '';
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'rb': 'ruby',
      'php': 'php',
      'java': 'java',
      'go': 'go',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'html': 'html',
      'css': 'css'
    };
    
    const language = languageMap[extension] || 'javascript';

    analyzeCodeMutation.mutate({
      code: fileContent,
      language
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get badge color for severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-900/50 text-blue-300 border-blue-800';
      case 'medium':
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-800';
      case 'high':
        return 'bg-orange-900/50 text-orange-300 border-orange-800';
      case 'critical':
        return 'bg-red-900/50 text-red-300 border-red-800';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  // Get icon for analysis type
  const getAnalysisTypeIcon = (type: string) => {
    switch (type) {
      case 'security':
        return 'security';
      case 'performance':
        return 'speed';
      case 'root-cause':
        return 'bug_report';
      case 'recommendation':
        return 'lightbulb';
      default:
        return 'insights';
    }
  };

  // Loading state
  const isLoading = isLoadingLogFiles || isLoadingAnalyses;
  const isAnalyzing = analyzeServerMutation.isPending || 
                      analyzeCodeMutation.isPending || 
                      securityAuditMutation.isPending || 
                      generateDocsMutation.isPending;

  return (
    <div className="flex h-screen bg-dark-1000 text-white overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">AI Analyzer</h1>
                <p className="text-gray-400">Advanced AI-powered analysis for your server</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="border-primary-700 text-primary-400 hover:text-primary-300 hover:bg-primary-900/20"
                  onClick={() => setLocation('/dashboard')}
                >
                  <span className="material-icons mr-1 text-sm">dashboard</span>
                  Dashboard
                </Button>
                
                <Button
                  onClick={() => setLocation('/self-healing')}
                >
                  <span className="material-icons mr-1 text-sm">healing</span>
                  Self-Healing
                </Button>
              </div>
            </div>
            
            {/* Premium Feature Banner */}
            {user?.plan === 'free' && (
              <div className="bg-gradient-to-r from-dark-900 to-primary-900/40 rounded-lg border border-primary-700/30 p-4 mb-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center mb-3 md:mb-0">
                    <span className="material-icons text-primary-400 mr-3 text-2xl">star</span>
                    <div>
                      <h3 className="font-medium text-white text-lg">Enhanced AI Analysis</h3>
                      <p className="text-gray-300">Upgrade to Premium for more detailed analysis and unlimited usage</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setLocation('/subscription')}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}
            
            {/* Main Content Tabs */}
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-dark-800 w-full justify-start">
                <TabsTrigger value="server-analysis">Server Analysis</TabsTrigger>
                <TabsTrigger value="code-analysis">Code Analysis</TabsTrigger>
                <TabsTrigger value="security-audit">Security Audit</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="previous">Previous Analyses</TabsTrigger>
              </TabsList>
              
              {/* Server Analysis Tab */}
              <TabsContent value="server-analysis" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-dark-900 border-dark-700 lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Analyze Server Logs</CardTitle>
                      <CardDescription className="text-gray-400">
                        Our AI will analyze your server logs to identify issues and provide recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleServerAnalysisSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-300 mb-1 block">
                              Analysis Type
                            </label>
                            <Select value={analysisType} onValueChange={setAnalysisType}>
                              <SelectTrigger className="bg-dark-800 border-dark-700 text-white">
                                <SelectValue placeholder="Select analysis type" />
                              </SelectTrigger>
                              <SelectContent className="bg-dark-800 border-dark-700 text-white">
                                <SelectItem value="performance">Performance Analysis</SelectItem>
                                <SelectItem value="root-cause">Root Cause Analysis</SelectItem>
                                <SelectItem value="security">Security Analysis</SelectItem>
                                <SelectItem value="recommendations">Optimization Recommendations</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-300 mb-1 block">
                              Issue Description (Optional)
                            </label>
                            <Textarea
                              placeholder="Describe any issues you're experiencing with your server..."
                              value={issueDescription}
                              onChange={(e) => setIssueDescription(e.target.value)}
                              className="bg-dark-800 border-dark-700 text-white resize-none min-h-[100px]"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-300 mb-1 block">
                              Select Log Files to Analyze
                            </label>
                            {isLoadingLogFiles ? (
                              <div className="flex items-center justify-center p-4">
                                <Spinner size="sm" className="mr-2" />
                                <span className="text-gray-400">Loading log files...</span>
                              </div>
                            ) : (
                              <div className="bg-dark-800 border border-dark-700 rounded-md p-2 max-h-[200px] overflow-y-auto">
                                {logFiles.length === 0 ? (
                                  <div className="text-center p-4 text-gray-400">
                                    No log files available
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {logFiles.map((log: any) => (
                                      <div key={log.id} className="flex items-center">
                                        <input
                                          type="checkbox"
                                          id={`log-${log.id}`}
                                          value={log.id}
                                          checked={selectedLogs.includes(log.id)}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedLogs([...selectedLogs, log.id]);
                                            } else {
                                              setSelectedLogs(selectedLogs.filter(id => id !== log.id));
                                            }
                                          }}
                                          className="h-4 w-4 rounded border-dark-600 text-primary-600 focus:ring-primary-500 bg-dark-700"
                                        />
                                        <label htmlFor={`log-${log.id}`} className="ml-2 text-sm text-gray-300 flex items-center">
                                          <span className="material-icons text-gray-400 text-sm mr-1">description</span>
                                          {log.name}
                                          <span className="ml-2 text-xs text-gray-500">
                                            {log.size} • {new Date(log.lastModified).toLocaleDateString()}
                                          </span>
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                variant="outline"
                                disabled
                                className="border-primary-700 text-primary-400"
                              >
                                <span className="material-icons mr-1 text-sm">upload_file</span>
                                Upload Log File
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-dark-800 border-dark-700 text-white">
                            <p>Available in Premium plan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <Button 
                        type="submit"
                        disabled={isAnalyzing || selectedLogs.length === 0}
                        onClick={handleServerAnalysisSubmit}
                      >
                        {isAnalyzing ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <span className="material-icons mr-1 text-sm">psychology</span>
                            Start Analysis
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-dark-900 border-dark-700">
                    <CardHeader>
                      <CardTitle>What's Included</CardTitle>
                      <CardDescription className="text-gray-400">
                        Benefits of AI server analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-primary-900/50 flex items-center justify-center mr-3">
                          <span className="material-icons text-primary-400">insights</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Deep Log Analysis</h3>
                          <p className="text-sm text-gray-400">Our AI engine scans all your logs to identify patterns and anomalies</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-green-900/50 flex items-center justify-center mr-3">
                          <span className="material-icons text-green-400">bug_report</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Root Cause Detection</h3>
                          <p className="text-sm text-gray-400">Automatically pinpoint the source of issues affecting your server</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-3">
                          <span className="material-icons text-blue-400">speed</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Performance Optimization</h3>
                          <p className="text-sm text-gray-400">Get actionable recommendations to improve server speed and efficiency</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-amber-900/50 flex items-center justify-center mr-3">
                          <span className="material-icons text-amber-400">security</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Security Insights</h3>
                          <p className="text-sm text-gray-400">Identify potential security vulnerabilities and remediation steps</p>
                        </div>
                      </div>
                      
                      {user?.plan === 'free' && (
                        <div className="mt-6 pt-4 border-t border-dark-700">
                          <p className="text-center text-sm text-gray-400 mb-2">
                            Free plan includes 3 analyses per month
                          </p>
                          <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary-600 h-full w-[66%]"></div>
                          </div>
                          <p className="text-right text-xs text-gray-500 mt-1">
                            2 of 3 remaining
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Code Analysis Tab */}
              <TabsContent value="code-analysis" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-dark-900 border-dark-700 lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Code Analysis</CardTitle>
                      <CardDescription className="text-gray-400">
                        Analyze your code for potential issues, security vulnerabilities, and optimization opportunities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCodeAnalysisSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-300 mb-1 block">
                              Paste Code or Upload File
                            </label>
                            <Textarea
                              placeholder="Paste your code here..."
                              value={fileContent}
                              onChange={(e) => setFileContent(e.target.value)}
                              className="bg-dark-800 border-dark-700 text-white resize-none min-h-[300px] font-mono text-sm"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-300 flex items-center cursor-pointer">
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="border-dark-700 text-primary-400"
                              >
                                <span className="material-icons mr-1 text-sm">upload_file</span>
                                Upload File
                              </Button>
                            </label>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <Button
                                      variant="outline"
                                      disabled
                                      className="border-dark-700 text-primary-400"
                                    >
                                      <span className="material-icons mr-1 text-sm">code</span>
                                      Repository Analysis
                                    </Button>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-dark-800 border-dark-700 text-white">
                                  <p>Available in Premium plan</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setFileContent('')}
                        disabled={!fileContent || isAnalyzing}
                        className="border-dark-700"
                      >
                        Clear
                      </Button>
                      
                      <Button 
                        type="submit"
                        disabled={isAnalyzing || !fileContent}
                        onClick={handleCodeAnalysisSubmit}
                      >
                        {isAnalyzing ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <span className="material-icons mr-1 text-sm">psychology</span>
                            Analyze Code
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-dark-900 border-dark-700">
                    <CardHeader>
                      <CardTitle>Code Analysis Features</CardTitle>
                      <CardDescription className="text-gray-400">
                        What our code analyzer provides
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-primary-900/50 flex items-center justify-center mr-3">
                          <span className="material-icons text-primary-400">bug_report</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Bug Detection</h3>
                          <p className="text-sm text-gray-400">Identify potential bugs and logical errors in your code</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-red-900/50 flex items-center justify-center mr-3">
                          <span className="material-icons text-red-400">security</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Security Analysis</h3>
                          <p className="text-sm text-gray-400">Find security vulnerabilities and injection risks</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-green-900/50 flex items-center justify-center mr-3">
                          <span className="material-icons text-green-400">speed</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Performance Suggestions</h3>
                          <p className="text-sm text-gray-400">Get recommendations to optimize your code's speed and efficiency</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-3">
                          <span className="material-icons text-blue-400">code</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Best Practices</h3>
                          <p className="text-sm text-gray-400">Learn how to improve code quality and maintainability</p>
                        </div>
                      </div>
                      
                      <div className="bg-dark-800 p-3 rounded-md mt-4 border border-dark-700">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Supported Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-dark-900">JavaScript</Badge>
                          <Badge variant="outline" className="bg-dark-900">TypeScript</Badge>
                          <Badge variant="outline" className="bg-dark-900">Python</Badge>
                          <Badge variant="outline" className="bg-dark-900">Java</Badge>
                          <Badge variant="outline" className="bg-dark-900">Go</Badge>
                          <Badge variant="outline" className="bg-dark-900">Ruby</Badge>
                          <Badge variant="outline" className="bg-dark-900">PHP</Badge>
                          <Badge variant="outline" className="bg-dark-900">C/C++</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Security Audit Tab */}
              <TabsContent value="security-audit" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-dark-900 border-dark-700 lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Comprehensive Security Audit</CardTitle>
                      <CardDescription className="text-gray-400">
                        Run a deep security analysis of your entire server environment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-dark-800 to-primary-900/30 rounded-md p-4 border border-primary-700/30">
                          <div className="flex items-start">
                            <span className="material-icons text-primary-400 mr-3">security</span>
                            <div>
                              <h3 className="font-medium text-white">What's included in the security audit</h3>
                              <p className="text-sm text-gray-300 mt-1">Our AI will scan your entire server and check for:</p>
                              <ul className="mt-2 space-y-1 text-sm text-gray-400">
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  Vulnerable software versions
                                </li>
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  Insecure configurations
                                </li>
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  Network security issues
                                </li>
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  Authentication vulnerabilities
                                </li>
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  File permission problems
                                </li>
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  Potential data exposure risks
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-dark-800 p-4 rounded-md border border-dark-700">
                          <div>
                            <h3 className="font-medium text-white">Time Estimate</h3>
                            <p className="text-sm text-gray-400 mt-1">A comprehensive audit takes approximately 5-10 minutes</p>
                          </div>
                          <div className="h-12 w-12 rounded-full border-2 border-blue-500 flex items-center justify-center">
                            <span className="material-icons text-blue-500">timer</span>
                          </div>
                        </div>
                        
                        {user?.plan === 'free' && (
                          <div className="bg-dark-800 p-4 rounded-md border border-dark-700">
                            <div className="flex items-center">
                              <span className="material-icons text-amber-400 mr-3">workspace_premium</span>
                              <div>
                                <h3 className="font-medium text-white">Premium Feature</h3>
                                <p className="text-sm text-gray-400 mt-1">Free accounts are limited to 1 security audit per month</p>
                              </div>
                            </div>
                            <div className="w-full bg-dark-950 h-2 rounded-full overflow-hidden mt-3">
                              <div className="bg-amber-600 h-full w-0"></div>
                            </div>
                            <p className="text-right text-xs text-gray-500 mt-1">
                              0 of 1 remaining
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button 
                        onClick={() => securityAuditMutation.mutate()}
                        disabled={isAnalyzing || (user?.plan === 'free')}
                      >
                        {isAnalyzing ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Running Audit...
                          </>
                        ) : (
                          <>
                            <span className="material-icons mr-1 text-sm">shield</span>
                            Run Security Audit
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-dark-900 border-dark-700">
                    <CardHeader>
                      <CardTitle>Security Compliance</CardTitle>
                      <CardDescription className="text-gray-400">
                        Key security frameworks supported
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-dark-800 p-3 rounded-md">
                          <h3 className="font-medium text-white text-sm flex items-center">
                            <span className="material-icons text-blue-400 mr-1 text-sm">verified</span>
                            OWASP Top 10
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            Checks for the most critical web application security risks
                          </p>
                        </div>
                        
                        <div className="bg-dark-800 p-3 rounded-md">
                          <h3 className="font-medium text-white text-sm flex items-center">
                            <span className="material-icons text-blue-400 mr-1 text-sm">verified</span>
                            CIS Benchmarks
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            Follows Center for Internet Security configuration best practices
                          </p>
                        </div>
                        
                        <div className="bg-dark-800 p-3 rounded-md">
                          <h3 className="font-medium text-white text-sm flex items-center">
                            <span className="material-icons text-blue-400 mr-1 text-sm">verified</span>
                            NIST Framework
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            Aligns with National Institute of Standards and Technology guidelines
                          </p>
                        </div>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-dark-800 p-3 rounded-md opacity-50 cursor-not-allowed">
                                <h3 className="font-medium text-white text-sm flex items-center">
                                  <span className="material-icons text-gray-400 mr-1 text-sm">lock</span>
                                  ISO 27001
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">
                                  Information security management standard compliance
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-dark-800 border-dark-700 text-white">
                              <p>Available in Enterprise plan</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-dark-800 p-3 rounded-md opacity-50 cursor-not-allowed">
                                <h3 className="font-medium text-white text-sm flex items-center">
                                  <span className="material-icons text-gray-400 mr-1 text-sm">lock</span>
                                  GDPR
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">
                                  General Data Protection Regulation compliance checks
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-dark-800 border-dark-700 text-white">
                              <p>Available in Enterprise plan</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Documentation Tab */}
              <TabsContent value="documentation" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-dark-900 border-dark-700 lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Generate Server Documentation</CardTitle>
                      <CardDescription className="text-gray-400">
                        Create comprehensive, up-to-date documentation for your server
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-dark-800 to-blue-900/30 rounded-md p-4 border border-blue-700/30">
                          <div className="flex items-start">
                            <span className="material-icons text-blue-400 mr-3">description</span>
                            <div>
                              <h3 className="font-medium text-white">Automatic Documentation</h3>
                              <p className="text-sm text-gray-300 mt-1">Our AI will scan your server and generate:</p>
                              <ul className="mt-2 space-y-1 text-sm text-gray-400">
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  System architecture diagrams
                                </li>
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  Service configuration details
                                </li>
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  Network topology
                                </li>
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  Dependency maps
                                </li>
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  Security policies
                                </li>
                                <li className="flex items-center">
                                  <span className="material-icons mr-1 text-xs">check</span>
                                  Maintenance procedures
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 bg-dark-800 p-4 rounded-md border border-dark-700">
                            <div className="flex items-center mb-2">
                              <span className="material-icons text-green-400 mr-2">file_download</span>
                              <h3 className="font-medium text-white">Export Options</h3>
                            </div>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  checked 
                                  className="rounded bg-dark-700 border-dark-600 text-primary-600 focus:ring-primary-500 mr-2"
                                />
                                <span className="text-sm text-gray-300">Markdown (.md)</span>
                              </label>
                              <label className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  checked 
                                  className="rounded bg-dark-700 border-dark-600 text-primary-600 focus:ring-primary-500 mr-2"
                                />
                                <span className="text-sm text-gray-300">HTML</span>
                              </label>
                              <label className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  className="rounded bg-dark-700 border-dark-600 text-primary-600 focus:ring-primary-500 mr-2"
                                />
                                <span className="text-sm text-gray-300">PDF</span>
                              </label>
                            </div>
                          </div>
                          
                          <div className="flex-1 bg-dark-800 p-4 rounded-md border border-dark-700">
                            <div className="flex items-center mb-2">
                              <span className="material-icons text-amber-400 mr-2">settings</span>
                              <h3 className="font-medium text-white">Documentation Level</h3>
                            </div>
                            <Select defaultValue="standard">
                              <SelectTrigger className="bg-dark-900 border-dark-700 text-white">
                                <SelectValue placeholder="Select documentation level" />
                              </SelectTrigger>
                              <SelectContent className="bg-dark-800 border-dark-700 text-white">
                                <SelectItem value="basic">Basic (Overview)</SelectItem>
                                <SelectItem value="standard">Standard (Detailed)</SelectItem>
                                <SelectItem value="advanced">Advanced (Comprehensive)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {user?.plan === 'free' && (
                          <div className="bg-dark-800 p-4 rounded-md border border-dark-700">
                            <div className="flex items-center">
                              <span className="material-icons text-amber-400 mr-3">workspace_premium</span>
                              <div>
                                <h3 className="font-medium text-white">Premium Feature</h3>
                                <p className="text-sm text-gray-400 mt-1">Documentation generation is available in Premium plan</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button 
                        onClick={() => generateDocsMutation.mutate()}
                        disabled={isAnalyzing || (user?.plan === 'free')}
                      >
                        {isAnalyzing ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <span className="material-icons mr-1 text-sm">description</span>
                            Generate Documentation
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-dark-900 border-dark-700">
                    <CardHeader>
                      <CardTitle>Documentation Benefits</CardTitle>
                      <CardDescription className="text-gray-400">
                        Why automated documentation matters
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-3">
                            <span className="material-icons text-blue-400">update</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Always Up-to-Date</h3>
                            <p className="text-sm text-gray-400">Documentation stays current with your changing infrastructure</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-green-900/50 flex items-center justify-center mr-3">
                            <span className="material-icons text-green-400">schedule</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Save Time</h3>
                            <p className="text-sm text-gray-400">Avoid hours of manual documentation work</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-purple-900/50 flex items-center justify-center mr-3">
                            <span className="material-icons text-purple-400">psychology</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">AI-Enhanced Insights</h3>
                            <p className="text-sm text-gray-400">Documentation includes optimization suggestions</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-red-900/50 flex items-center justify-center mr-3">
                            <span className="material-icons text-red-400">group</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Team Knowledge</h3>
                            <p className="text-sm text-gray-400">Share system knowledge with your entire team</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Previous Analyses Tab */}
              <TabsContent value="previous" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium text-white">Previous Analyses</h2>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] bg-dark-900 border-dark-700 text-white">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-800 border-dark-700 text-white">
                        <SelectItem value="all">All Analyses</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="root-cause">Root Cause</SelectItem>
                        <SelectItem value="code">Code Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {isLoadingAnalyses ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                      <div className="text-center">
                        <Spinner size="lg" className="text-primary-500 mb-4" />
                        <p className="text-gray-400">Loading analysis history...</p>
                      </div>
                    </div>
                  ) : previousAnalyses.length === 0 ? (
                    <div className="text-center p-12 border border-dark-700 rounded-md bg-dark-900">
                      <div className="bg-dark-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons text-3xl text-gray-400">history</span>
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">No previous analyses</h3>
                      <p className="text-gray-400 max-w-md mx-auto mb-4">
                        You haven't run any AI analyses yet. Start by running a server analysis, code scan, or security audit.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('server-analysis')}
                      >
                        Run Your First Analysis
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {previousAnalyses.map((analysis: AnalysisResult) => (
                        <Card key={analysis.id} className="bg-dark-900 border-dark-700">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                                  analysis.type === 'security' 
                                    ? 'bg-red-900/30 text-red-400'
                                    : analysis.type === 'performance'
                                      ? 'bg-green-900/30 text-green-400'
                                      : analysis.type === 'root-cause'
                                        ? 'bg-amber-900/30 text-amber-400'
                                        : 'bg-blue-900/30 text-blue-400'
                                }`}>
                                  <span className="material-icons">
                                    {getAnalysisTypeIcon(analysis.type)}
                                  </span>
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{analysis.title}</CardTitle>
                                  <CardDescription className="text-gray-400">
                                    {formatDate(analysis.timestamp)}
                                  </CardDescription>
                                </div>
                              </div>
                              <Badge className={`${
                                analysis.type === 'security' 
                                  ? 'bg-red-900/50 text-red-300 border-red-800'
                                  : analysis.type === 'performance'
                                    ? 'bg-green-900/50 text-green-300 border-green-800'
                                    : analysis.type === 'root-cause'
                                      ? 'bg-amber-900/50 text-amber-300 border-amber-800'
                                      : 'bg-blue-900/50 text-blue-300 border-blue-800'
                              } capitalize`}>
                                {analysis.type.replace('-', ' ')}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <p className="text-gray-300 mb-4">{analysis.summary}</p>
                            
                            {analysis.details.findings && analysis.details.findings.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Key Findings:</h4>
                                <div className="space-y-2">
                                  {analysis.details.findings.slice(0, 2).map((finding, index) => (
                                    <div key={index} className="flex items-start">
                                      <Badge className={`mt-0.5 mr-2 ${getSeverityColor(finding.severity)}`}>
                                        {finding.severity}
                                      </Badge>
                                      <p className="text-sm text-gray-300">{finding.title}</p>
                                    </div>
                                  ))}
                                  {analysis.details.findings.length > 2 && (
                                    <p className="text-xs text-gray-500">
                                      +{analysis.details.findings.length - 2} more findings
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {analysis.details.metrics && (
                              <div className="bg-dark-800 rounded-md p-3 mt-4">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm">
                                    <span className="text-gray-400">Performance Score:</span>
                                    <span className="ml-2 text-green-400 font-medium">
                                      {analysis.details.metrics.afterScore || 0}%
                                    </span>
                                    {analysis.details.metrics.improvementPercent && (
                                      <span className="ml-2 text-xs text-green-400">
                                        (+{analysis.details.metrics.improvementPercent}%)
                                      </span>
                                    )}
                                  </div>
                                  <Button variant="outline" size="sm" className="h-7 text-xs">
                                    View Report
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      
                      <div className="flex justify-center">
                        <Button variant="outline" className="border-dark-700 text-primary-400">
                          Load More
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AiAnalyzer;