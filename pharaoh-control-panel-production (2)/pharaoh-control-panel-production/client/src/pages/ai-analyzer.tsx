import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function AIAnalyzer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    document.title = "AI Root Cause Analyzer | Pharaoh Control Panel 2.0";
  }, []);

  const {
    data: analysisData,
    isLoading: isAnalysisLoading,
    isError: isAnalysisError,
    refetch: analyzeIssue
  } = useQuery({
    queryKey: ['/api/ai/analyze-logs'],
    enabled: false,
    refetchOnWindowFocus: false
  });

  const submitAnalysis = () => {
    if (!issueDescription.trim()) {
      toast({
        title: "Error",
        description: "Please provide a description of the issue",
        variant: "destructive"
      });
      return;
    }

    // @ts-ignore - We know we're calling refetch with params which is not in the type definition
    analyzeIssue({ issueDescription });
  };

  const selfHealMutation = useMutation({
    mutationFn: (actionId: number) => 
      apiRequest('POST', '/api/ai/self-heal', { 
        issueId: analysisData?.analysis?.rootCause,
        recommendedActionId: actionId
      }),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "AI self-healing action completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/server/healing-events'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to perform self-healing action",
        variant: "destructive"
      });
    }
  });

  const handleSelfHeal = () => {
    if (selectedAction === null) {
      toast({
        title: "Error",
        description: "Please select a recommended action first",
        variant: "destructive"
      });
      return;
    }

    selfHealMutation.mutate(selectedAction);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-800 text-green-300';
      case 'medium':
        return 'bg-yellow-800 text-yellow-300';
      case 'hard':
        return 'bg-red-800 text-red-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-dark-1000 text-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-dark-1000">
        <TopNav toggleSidebar={toggleSidebar} />
        
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white">AI Root Cause Analyzer</h1>
            <p className="text-gray-400 mt-1">Harness the power of AI to diagnose and fix server issues</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-dark-900 border-dark-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="material-icons mr-2 text-primary-400">psychology</span>
                    Issue Description
                  </CardTitle>
                  <CardDescription>
                    Describe the problem you're experiencing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full h-48 bg-dark-800 border border-dark-700 rounded-md p-3 text-white"
                    placeholder="Describe your issue here... (e.g., 'My WordPress site is showing 500 errors since this morning after updating plugins')"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-primary-600 hover:bg-primary-700"
                    onClick={submitAnalysis}
                    disabled={isAnalysisLoading || selfHealMutation.isPending}
                  >
                    {isAnalysisLoading ? (
                      <>
                        <span className="material-icons animate-spin mr-2">autorenew</span>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2">search</span>
                        Analyze Issue
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {isAnalysisLoading ? (
                <Card className="bg-dark-900 border-dark-700">
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ) : analysisData ? (
                <Card className="bg-dark-900 border-dark-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-xl">
                      <span className="material-icons mr-2 text-secondary-500">lightbulb</span>
                      Root Cause Analysis
                    </CardTitle>
                    <div className="flex items-center mt-2">
                      <span className="text-gray-400 mr-2">Confidence:</span>
                      <div className="w-32 h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-secondary-500" 
                          style={{ width: `${analysisData.analysis.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-secondary-400">{(analysisData.analysis.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-3 bg-dark-800 rounded-md border border-dark-700">
                      <div className="font-medium mb-1">Root Cause:</div>
                      <div className="text-lg text-secondary-400">
                        {analysisData.analysis.rootCause}
                      </div>
                    </div>

                    <Tabs defaultValue="logs" className="w-full">
                      <TabsList className="bg-dark-800 border border-dark-700">
                        <TabsTrigger value="logs">Relevant Logs</TabsTrigger>
                        <TabsTrigger value="changes">Recent Changes</TabsTrigger>
                        <TabsTrigger value="actions">Recommended Actions</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="logs" className="mt-4 space-y-3">
                        {analysisData.analysis.relevantLogs.map((log, index) => (
                          <div key={index} className="p-3 bg-dark-800 rounded-md border border-dark-700">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-medium text-gray-300">{log.source}</div>
                              <div className="text-xs text-gray-500">{log.timestamp}</div>
                            </div>
                            <div className="font-mono text-sm text-gray-400 overflow-x-auto p-2 bg-dark-1000 rounded">
                              {log.snippet}
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="changes" className="mt-4 space-y-3">
                        {analysisData.analysis.recentChanges.map((change, index) => (
                          <div key={index} className="p-3 bg-dark-800 rounded-md border border-dark-700 flex items-center">
                            <span className="material-icons mr-3 text-primary-400">history</span>
                            <div className="flex-1">
                              <div className="font-medium">{change.action}</div>
                              <div className="text-xs text-gray-500">{change.timestamp}</div>
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="actions" className="mt-4 space-y-3">
                        {analysisData.analysis.recommendedActions.map((action, index) => (
                          <div 
                            key={index} 
                            className={`p-3 bg-dark-800 rounded-md border border-dark-700 cursor-pointer transition-colors ${
                              selectedAction === index ? 'border-primary-500' : ''
                            }`}
                            onClick={() => setSelectedAction(index)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{action.title}</div>
                              <Badge className={getDifficultyColor(action.difficulty)}>
                                {action.difficulty}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-400">{action.description}</div>
                            {action.automationAvailable && (
                              <div className="mt-2 text-xs text-primary-400 flex items-center">
                                <span className="material-icons text-xs mr-1">smart_toy</span>
                                AI can automate this fix
                              </div>
                            )}
                          </div>
                        ))}

                        <Button
                          className="w-full bg-secondary-600 hover:bg-secondary-700 mt-4"
                          onClick={handleSelfHeal}
                          disabled={selectedAction === null || selfHealMutation.isPending}
                        >
                          {selfHealMutation.isPending ? (
                            <>
                              <span className="material-icons animate-spin mr-2">autorenew</span>
                              Applying Fix...
                            </>
                          ) : (
                            <>
                              <span className="material-icons mr-2">auto_fix_high</span>
                              Apply Selected Fix with AI
                            </>
                          )}
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : isAnalysisError ? (
                <Card className="bg-dark-900 border-dark-700">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <span className="material-icons text-4xl text-red-500 mb-2">error</span>
                      <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
                      <p className="text-gray-400 mb-4">
                        We couldn't complete the analysis. Please check your connection and try again.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => submitAnalysis()}
                      >
                        Try Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-dark-900 border-dark-700 border-dashed">
                  <CardContent className="p-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-dark-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="material-icons text-3xl text-gray-500">search</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">AI Assistant Ready</h3>
                      <p className="text-gray-400 mb-4 max-w-md mx-auto">
                        Describe your server issue, and our AI will analyze logs, configuration files, and recent changes to identify the root cause.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 max-w-md mx-auto">
                        <span className="px-2 py-1 bg-dark-800 rounded-full">NGINX Logs</span>
                        <span className="px-2 py-1 bg-dark-800 rounded-full">PHP Errors</span>
                        <span className="px-2 py-1 bg-dark-800 rounded-full">Database Queries</span>
                        <span className="px-2 py-1 bg-dark-800 rounded-full">Config Files</span>
                        <span className="px-2 py-1 bg-dark-800 rounded-full">System Metrics</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}