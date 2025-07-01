import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Play, 
  Save, 
  Download, 
  Upload, 
  Terminal, 
  Eye, 
  Settings,
  Zap,
  Brain,
  Activity
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface AgentCode {
  id: string;
  name: string;
  type: string;
  mainLogic: string;
  configurations: Record<string, any>;
  dependencies: string[];
  environment: Record<string, string>;
}

interface TestResult {
  success: boolean;
  output: string;
  errors: string[];
  performance: {
    executionTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

export default function AgentProgrammer({ agentId }: { agentId: string }) {
  const [activeTab, setActiveTab] = useState("code");
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [liveOutput, setLiveOutput] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: agentCode } = useQuery<AgentCode>({
    queryKey: [`/api/admin/ai-agents/${agentId}/code`],
    enabled: !!agentId
  });

  const [code, setCode] = useState({
    mainLogic: "",
    configurations: "{}",
    environment: "{}"
  });

  useEffect(() => {
    if (agentCode) {
      setCode({
        mainLogic: agentCode.mainLogic,
        configurations: JSON.stringify(agentCode.configurations, null, 2),
        environment: JSON.stringify(agentCode.environment, null, 2)
      });
    }
  }, [agentCode]);

  // WebSocket for live output monitoring
  useEffect(() => {
    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/agent/${agentId}/output`);
    
    ws.onmessage = (event) => {
      const output = JSON.parse(event.data);
      setLiveOutput(prev => [...prev.slice(-99), `[${new Date().toLocaleTimeString()}] ${output.message}`]);
    };

    return () => ws.close();
  }, [agentId]);

  const saveCodeMutation = useMutation({
    mutationFn: async (updatedCode: Partial<AgentCode>) => {
      const response = await fetch(`/api/admin/ai-agents/${agentId}/code`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCode)
      });
      if (!response.ok) throw new Error('Failed to save code');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/ai-agents/${agentId}/code`] });
    }
  });

  const testCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/ai-agents/${agentId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainLogic: code.mainLogic,
          configurations: JSON.parse(code.configurations),
          environment: JSON.parse(code.environment)
        })
      });
      if (!response.ok) throw new Error('Test failed');
      return response.json();
    },
    onSuccess: (data) => {
      setTestResults(data);
      setIsTestRunning(false);
    },
    onError: () => {
      setIsTestRunning(false);
    }
  });

  const handleSave = () => {
    try {
      const updatedCode = {
        mainLogic: code.mainLogic,
        configurations: JSON.parse(code.configurations),
        environment: JSON.parse(code.environment)
      };
      saveCodeMutation.mutate(updatedCode);
    } catch (error) {
      console.error('Invalid JSON format');
    }
  };

  const handleTest = () => {
    setIsTestRunning(true);
    setTestResults(null);
    testCodeMutation.mutate();
  };

  const handleExportCode = () => {
    const exportData = {
      ...agentCode,
      mainLogic: code.mainLogic,
      configurations: JSON.parse(code.configurations),
      environment: JSON.parse(code.environment),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agentCode?.name || 'agent'}-code.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <Code className="h-5 w-5" />
            AI Agent Programmer
          </h2>
          <p className="text-slate-400 text-sm">
            {agentCode?.name} - {agentCode?.type}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCode}
            className="border-cyan-500/20 text-cyan-400"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-cyan-500/20 text-cyan-400"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button
            onClick={handleTest}
            disabled={isTestRunning}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {isTestRunning ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Test Run
              </>
            )}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveCodeMutation.isPending}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Code Editor */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800/50 border border-cyan-500/20">
              <TabsTrigger value="code">Main Logic</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="env">Environment</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="mt-4">
              <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-sm text-cyan-400">AI Agent Logic</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={code.mainLogic}
                    onChange={(e) => setCode(prev => ({ ...prev, mainLogic: e.target.value }))}
                    className="min-h-96 font-mono text-sm bg-slate-900/50 border-slate-600"
                    placeholder="// Write your AI agent logic here
class AgentLogic {
  async processTask(input) {
    // Your implementation
    return result;
  }
  
  async analyzeData(data) {
    // Analysis logic
    return insights;
  }
}"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="config" className="mt-4">
              <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-sm text-cyan-400">Agent Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={code.configurations}
                    onChange={(e) => setCode(prev => ({ ...prev, configurations: e.target.value }))}
                    className="min-h-96 font-mono text-sm bg-slate-900/50 border-slate-600"
                    placeholder='{
  "maxConcurrentTasks": 10,
  "retryAttempts": 3,
  "timeout": 30000,
  "learningRate": 0.01,
  "triggers": ["schedule", "event", "manual"]
}'
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="env" className="mt-4">
              <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-sm text-cyan-400">Environment Variables</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={code.environment}
                    onChange={(e) => setCode(prev => ({ ...prev, environment: e.target.value }))}
                    className="min-h-96 font-mono text-sm bg-slate-900/50 border-slate-600"
                    placeholder='{
  "LOG_LEVEL": "info",
  "MAX_MEMORY": "512MB",
  "CACHE_TTL": "3600",
  "API_RATE_LIMIT": "100"
}'
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Monitor & Test Results */}
        <div className="space-y-4">
          {/* Live Output */}
          <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-cyan-400 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Live Output Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900/50 rounded p-3 max-h-64 overflow-y-auto">
                <div className="font-mono text-xs space-y-1">
                  {liveOutput.length === 0 ? (
                    <div className="text-slate-500">Waiting for agent activity...</div>
                  ) : (
                    liveOutput.map((line, index) => (
                      <div key={index} className="text-slate-300">
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          {testResults && (
            <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-sm text-cyan-400 flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Test Results
                  <Badge variant={testResults.success ? "default" : "destructive"}>
                    {testResults.success ? "PASSED" : "FAILED"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-slate-400">Execution</div>
                    <div className="text-cyan-400">{testResults.performance.executionTime}ms</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-slate-400">Memory</div>
                    <div className="text-cyan-400">{testResults.performance.memoryUsage}MB</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-slate-400">CPU</div>
                    <div className="text-cyan-400">{testResults.performance.cpuUsage}%</div>
                  </div>
                </div>

                {/* Output */}
                <div>
                  <Label className="text-xs text-slate-400">Output</Label>
                  <div className="bg-slate-900/50 rounded p-2 max-h-32 overflow-y-auto">
                    <pre className="font-mono text-xs text-slate-300">
                      {testResults.output}
                    </pre>
                  </div>
                </div>

                {/* Errors */}
                {testResults.errors.length > 0 && (
                  <div>
                    <Label className="text-xs text-red-400">Errors</Label>
                    <div className="bg-red-900/20 rounded p-2 max-h-32 overflow-y-auto">
                      {testResults.errors.map((error, index) => (
                        <div key={index} className="font-mono text-xs text-red-300">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-cyan-400">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start border-cyan-500/20">
                <Brain className="h-4 w-4 mr-2" />
                Deploy to Production
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-cyan-500/20">
                <Zap className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-cyan-500/20">
                <Settings className="h-4 w-4 mr-2" />
                Agent Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}