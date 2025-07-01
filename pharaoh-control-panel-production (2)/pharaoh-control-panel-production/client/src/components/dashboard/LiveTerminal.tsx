import React, { useState, useRef, useEffect } from 'react';
import { useSocketStore } from '../../lib/socketClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Terminal, Sparkles, AlertCircle, History, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface TerminalCommand {
  command: string;
  output: string;
  success: boolean;
  healingEventId?: number;
}

export const LiveTerminal: React.FC = () => {
  // Socket connection and state
  const socket = useSocketStore((state) => state.socket);
  const connected = useSocketStore((state) => state.connected);
  const connect = useSocketStore((state) => state.connect);
  const executeCommand = useSocketStore((state) => state.executeCommand);
  const terminalResponses = useSocketStore((state) => state.terminalResponses);
  const applyFix = useSocketStore((state) => state.applyFix);
  
  // Local state
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('terminal');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Initialize socket connection if not connected
  useEffect(() => {
    if (!socket) {
      connect();
    }
  }, [socket, connect]);
  
  // Auto-scroll to bottom when new commands are received
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalResponses]);
  
  // Simulated AI suggestions based on history
  useEffect(() => {
    // If there's history, generate a suggestion based on the last command
    if (history.length > 0) {
      const lastCommand = history[history.length - 1];
      
      // Simple pattern matching for suggestions
      if (lastCommand.includes('ls')) {
        setAiSuggestion('Try "ls -la" to show hidden files and details');
      } else if (lastCommand.includes('docker')) {
        setAiSuggestion('Try "docker ps" to list running containers');
      } else if (lastCommand.includes('top') || lastCommand.includes('htop')) {
        setAiSuggestion('Try "free -m" to check memory usage');
      } else if (lastCommand.includes('grep')) {
        setAiSuggestion('Try adding "-i" for case-insensitive search');
      } else if (lastCommand.includes('memory') || lastCommand.includes('cpu')) {
        setAiSuggestion('Try "top -bn1" for a snapshot of system resources');
      } else {
        // Generate a random helpful suggestion
        const suggestions = [
          'Try "df -h" to check disk usage',
          'Try "netstat -tuln" to check network connections',
          'Try "ps aux | grep node" to find Node.js processes',
          'Try "tail -f /var/log/syslog" to watch system logs',
          'Try "uptime" to see system load averages'
        ];
        setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
      }
    }
  }, [history]);
  
  // Function to handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    // Send the command via WebSocket
    if (connected) {
      executeCommand(command);
      
      // Update history
      setHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      
      // Clear the input
      setCommand('');
    } else {
      // Fallback for when socket is not connected
      console.error('Terminal is not connected to the server');
    }
  };
  
  // Handle keyboard navigation through history
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };
  
  // Function to apply an AI suggestion
  const applySuggestion = (suggestion: string) => {
    if (connected) {
      executeCommand(suggestion);
      setHistory(prev => [...prev, suggestion]);
      setHistoryIndex(-1);
    }
  };
  
  // Function to apply a healing fix
  const handleApplyFix = (eventId: number, command: string) => {
    if (connected) {
      applyFix(eventId, command);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5" />
            <CardTitle>Live Terminal</CardTitle>
          </div>
          <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        <CardDescription>
          Execute commands and get real-time responses
        </CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mx-6">
          <TabsTrigger value="terminal">Terminal</TabsTrigger>
          <TabsTrigger value="ai-assistance">AI Assistance</TabsTrigger>
          <TabsTrigger value="healing">Self-Healing</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        {/* Terminal Tab */}
        <TabsContent value="terminal">
          <CardContent>
            <ScrollArea className="h-[350px] w-full rounded-md border bg-black p-4 text-white font-mono text-sm" ref={terminalRef}>
              <div className="whitespace-pre-wrap">
                <div className="mb-4 text-gray-400">
                  # Welcome to Pharaoh Terminal
                  <br />
                  # Type 'help' for a list of available commands
                  <br />
                  # Connected to AI-assisted execution engine
                </div>
                
                {terminalResponses.map((resp, index) => (
                  <div key={index} className="mb-2">
                    <div className="text-green-400">$ {resp.command}</div>
                    <div className={resp.success ? 'text-white' : 'text-red-400'}>
                      {resp.output}
                    </div>
                  </div>
                ))}
                
                {!connected && (
                  <div className="text-red-400 mt-4">
                    Terminal disconnected from server. Reconnecting...
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="w-full flex space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500">$</span>
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter command..."
                  className="pl-8 font-mono bg-black text-white"
                  disabled={!connected}
                />
              </div>
              <Button type="submit" disabled={!connected}>
                Execute
              </Button>
            </form>
          </CardFooter>
        </TabsContent>
        
        {/* AI Assistance Tab */}
        <TabsContent value="ai-assistance">
          <CardContent className="space-y-4">
            <Alert className="bg-indigo-50 border-indigo-200">
              <div className="flex items-center space-x-2 font-semibold text-indigo-800">
                <Sparkles className="h-5 w-5" />
                <span>AI-Powered Command Suggestions</span>
              </div>
              <AlertDescription className="text-indigo-700 mt-2">
                Get intelligent command suggestions based on your terminal history and system state.
              </AlertDescription>
            </Alert>
            
            {aiSuggestion && (
              <Card className="border-dashed border-2 border-indigo-300 bg-indigo-50">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-md flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span className="text-indigo-700">Suggested Command</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <code className="bg-indigo-100 p-2 rounded-md block text-indigo-800 font-mono">
                    {aiSuggestion}
                  </code>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                    onClick={() => applySuggestion(aiSuggestion)}
                  >
                    Apply Suggestion
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Common Tasks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: "Check Disk Space", command: "df -h" },
                  { label: "View System Load", command: "uptime" },
                  { label: "List Processes", command: "ps aux" },
                  { label: "Memory Usage", command: "free -m" },
                  { label: "Network Connections", command: "netstat -tuln" },
                  { label: "Recent Logs", command: "tail -n 20 /var/log/syslog" }
                ].map((item, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start text-left font-mono text-sm"
                    onClick={() => applySuggestion(item.command)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        {/* Self-Healing Tab */}
        <TabsContent value="healing">
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <div className="flex items-center space-x-2 font-semibold text-green-800">
                <AlertCircle className="h-5 w-5" />
                <span>Self-Healing Commands</span>
              </div>
              <AlertDescription className="text-green-700 mt-2">
                Automated fixes for detected issues that can be applied with a single click.
              </AlertDescription>
            </Alert>
            
            {terminalResponses.filter(r => r.healingEventId).length > 0 ? (
              <div className="space-y-2">
                {terminalResponses
                  .filter(r => r.healingEventId)
                  .map((resp, index) => (
                    <Card key={index} className={`border-2 ${resp.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-md flex items-center space-x-2">
                          {resp.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={resp.success ? 'text-green-700' : 'text-red-700'}>
                            Healing Event #{resp.healingEventId}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium mb-1">Command:</div>
                        <code className="bg-white p-2 rounded-md block font-mono text-sm mb-2">
                          {resp.command}
                        </code>
                        <div className="text-sm font-medium mb-1">Result:</div>
                        <div className={`p-2 rounded-md ${resp.success ? 'bg-green-100' : 'bg-red-100'}`}>
                          {resp.output}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No healing commands have been executed yet.
                <br />
                Check the Self-Healing tab for recommended fixes.
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history">
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <History className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Command History</h3>
            </div>
            
            <ScrollArea className="h-[300px]">
              {history.length > 0 ? (
                <div className="space-y-1">
                  {history.map((cmd, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => setCommand(cmd)}
                    >
                      <div className="font-mono text-sm">{cmd}</div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          applySuggestion(cmd);
                        }}
                      >
                        Run
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No command history yet.
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LiveTerminal;