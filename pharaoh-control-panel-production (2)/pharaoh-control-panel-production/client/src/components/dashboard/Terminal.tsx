import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Terminal as TerminalIcon, Send, AlertTriangle, PlusCircle, X, Copy, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { aiService } from "@/lib/aiService";
import ReactMarkdown from 'react-markdown';

interface TerminalCommand {
  command: string;
  output: string;
  isAI?: boolean;
  timestamp: string;
}

export default function Terminal() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<TerminalCommand[]>([]);
  const [currentSession, setCurrentSession] = useState("session1");
  const [sessions, setSessions] = useState<{id: string, name: string}[]>([
    { id: "session1", name: "Main Terminal" }
  ]);
  const [isAsking, setIsAsking] = useState(false);
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to the bottom of the terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  // Get common commands for dropdown suggestions
  const { data: suggestions = [] } = useQuery({
    queryKey: ['/api/terminal/suggestions'],
    queryFn: async () => {
      return [
        { command: "df -h", description: "Check disk space" },
        { command: "free -m", description: "View memory usage" },
        { command: "ps aux | grep node", description: "Find Node.js processes" },
        { command: "tail -n 50 /var/log/syslog", description: "View recent system logs" },
        { command: "netstat -tulpn", description: "Show network connections" }
      ];
    },
    staleTime: Infinity
  });
  
  // Execute a command
  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    
    // Add command to history
    const timestamp = new Date().toISOString();
    
    // Simulate command execution (in real implementation, this would call the server)
    let output = "";
    
    if (cmd.startsWith("cd ")) {
      output = "Directory changed.";
    } else if (cmd === "ls" || cmd === "ls -la") {
      output = "drwxr-xr-x 2 user user 4096 May 22 14:30 app\n" +
               "drwxr-xr-x 4 user user 4096 May 22 14:15 logs\n" +
               "-rw-r--r-- 1 user user 2345 May 22 13:45 server.js\n" +
               "-rw-r--r-- 1 user user 1250 May 22 13:40 package.json";
    } else if (cmd === "ps aux") {
      output = "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\n" +
               "root         1  0.0  0.1 169652 11644 ?        Ss   May21   0:02 /sbin/init\n" +
               "user      1000  0.2  1.5 1460400 125000 ?      Sl   14:30   0:45 node server.js\n" +
               "user      1200  0.1  0.8 954128 70544 ?        Sl   14:30   0:22 node worker.js";
    } else if (cmd === "df -h") {
      output = "Filesystem      Size  Used Avail Use% Mounted on\n" +
               "/dev/sda1       120G   38G   77G  34% /\n" +
               "tmpfs           7.8G     0  7.8G   0% /dev/shm";
    } else if (cmd === "free -h" || cmd === "free -m") {
      output = "              total        used        free      shared  buff/cache   available\n" +
               "Mem:           15Gi       8.0Gi       2.1Gi       0.1Gi       5.4Gi       7.0Gi\n" +
               "Swap:         8.0Gi       0.2Gi       7.8Gi";
    } else if (cmd === "uptime") {
      output = " 15:40:22 up 1 day, 3:35,  3 users,  load average: 0.45, 0.62, 0.58";
    } else if (cmd.startsWith("cat ")) {
      output = "File content would be displayed here.";
    } else if (cmd === "help" || cmd === "--help") {
      output = "Available commands: ls, cd, ps, df, free, cat, uptime\n" +
               "For AI assistance, use the 'Ask AI' tab.";
    } else if (cmd === "clear") {
      setHistory([]);
      return;
    } else {
      output = `Command not found: ${cmd}\nThis is a simulated terminal. Try basic commands like ls, ps, df -h, or use the 'Ask AI' tab for help.`;
    }
    
    setHistory(prev => [...prev, { command: cmd, output, timestamp }]);
    setCommand("");
  };
  
  // Handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(command);
  };
  
  // Handle "Ask AI" submission
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        title: "Empty question",
        description: "Please enter a question to ask the AI assistant.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAsking(true);
    
    try {
      const response = await aiService.getTerminalAssistance(question);
      
      // Add AI response to history with special flag
      const aiCommand: TerminalCommand = {
        command: `ai-assistant "${question}"`,
        output: response.response || response,
        isAI: true,
        timestamp: new Date().toISOString()
      };
      
      setHistory(prev => [...prev, aiCommand]);
      setAiResponse(response.response || response);
      setQuestion("");
      
    } catch (error) {
      toast({
        title: "AI request failed",
        description: "Failed to get AI assistance. Please try again.",
        variant: "destructive"
      });
      console.error("AI request error:", error);
    } finally {
      setIsAsking(false);
    }
  };
  
  // Add a new terminal session
  const addSession = () => {
    const id = `session${sessions.length + 1}`;
    const name = `Terminal ${sessions.length + 1}`;
    setSessions([...sessions, { id, name }]);
    setCurrentSession(id);
    setHistory([]);
  };
  
  // Remove a terminal session
  const removeSession = (id: string) => {
    if (sessions.length <= 1) {
      toast({
        title: "Cannot remove session",
        description: "You must have at least one terminal session.",
        variant: "destructive"
      });
      return;
    }
    
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    
    if (currentSession === id) {
      setCurrentSession(newSessions[0].id);
      setHistory([]);
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  
  // Copy command to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Command copied to clipboard.",
    });
  };
  
  // Execute suggested command
  const executeSuggestion = (cmd: string) => {
    setCommand(cmd);
    setTimeout(() => {
      executeCommand(cmd);
    }, 100);
  };
  
  return (
    <div className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center gap-2">
            <TerminalIcon className="h-6 w-6 text-primary" />
            <span>Terminal</span>
          </CardTitle>
          <CardDescription>
            Execute commands and get AI assistance for server management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="terminal" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="terminal">Terminal</TabsTrigger>
                <TabsTrigger value="ai">Ask AI</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                {sessions.map((session) => (
                  <Badge 
                    key={session.id}
                    variant={currentSession === session.id ? "default" : "outline"}
                    className="cursor-pointer flex items-center gap-1"
                  >
                    <span onClick={() => setCurrentSession(session.id)}>{session.name}</span>
                    {sessions.length > 1 && (
                      <X 
                        className="h-3 w-3 ml-1 opacity-70 hover:opacity-100"
                        onClick={() => removeSession(session.id)}
                      />
                    )}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={addSession}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="terminal" className="space-y-4">
              <div 
                className="bg-black text-green-400 font-mono p-4 rounded-lg h-[400px] overflow-y-auto"
                ref={terminalRef}
              >
                <div className="pb-2 border-b border-green-700 mb-3 flex justify-between items-center">
                  <div>PharaohOS v2.0 Terminal</div>
                  <div className="text-xs opacity-70">{new Date().toLocaleDateString()}</div>
                </div>
                
                {history.length === 0 ? (
                  <div className="text-gray-500 italic">
                    Type 'help' to see available commands or switch to the 'Ask AI' tab for assistance.
                  </div>
                ) : (
                  history.map((item, index) => (
                    <div key={index} className="mb-3">
                      {/* Command line with timestamp */}
                      <div className="flex items-start gap-2 mb-1">
                        <div className="text-blue-400 whitespace-nowrap">
                          user@pharaoh:~$
                        </div>
                        <div className="flex-1 break-all">
                          {!item.isAI ? item.command : (
                            <span className="flex items-center gap-2">
                              <span className="text-yellow-400">[AI]</span>
                              {item.command.replace('ai-assistant ', '')}
                            </span>
                          )}
                        </div>
                        <div className="text-xs opacity-50 whitespace-nowrap">
                          {formatTimestamp(item.timestamp)}
                        </div>
                      </div>
                      
                      {/* Command output */}
                      <div className={cn(
                        "ml-6 pl-2 border-l-2 border-opacity-30 overflow-x-auto",
                        item.isAI ? "border-l-yellow-500" : "border-l-green-700"
                      )}>
                        {item.isAI ? (
                          <div className="ai-response">
                            <ReactMarkdown>
                              {item.output}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <pre className="whitespace-pre-wrap">
                            {item.output}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter command..."
                    className="pl-7 font-mono"
                    autoComplete="off"
                  />
                </div>
                
                <Button type="submit">
                  <Send className="h-4 w-4 mr-1" />
                  Execute
                </Button>
              </form>
              
              <div className="flex flex-wrap gap-2">
                <div className="text-sm font-medium text-muted-foreground mr-2 mt-1">
                  Quick Commands:
                </div>
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer flex items-center gap-1 group"
                    onClick={() => executeSuggestion(suggestion.command)}
                  >
                    <span>{suggestion.command}</span>
                    <span className="text-xs opacity-70 hidden group-hover:inline-block">
                      ({suggestion.description})
                    </span>
                  </Badge>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="space-y-4">
              <div className="bg-slate-950 rounded-lg p-4 h-[400px] overflow-y-auto flex flex-col">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <TerminalIcon className="h-5 w-5 text-primary" />
                  <div className="text-lg font-semibold">Terminal Assistant</div>
                </div>
                
                <div className="pt-4 space-y-4 flex-1 overflow-y-auto">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 bg-slate-900 rounded-lg p-3 text-sm">
                      <p>
                        Hello! I'm your PharaohAI Terminal Assistant. Ask me questions about server 
                        administration, Linux commands, or troubleshooting. I'll provide you with 
                        helpful commands and explanations.
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer" 
                          onClick={() => setQuestion("How do I check disk space?")}
                        >
                          How do I check disk space?
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer" 
                          onClick={() => setQuestion("Show me commands for monitoring CPU usage")}
                        >
                          CPU monitoring commands
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer" 
                          onClick={() => setQuestion("How to find memory leaks?")}
                        >
                          Finding memory leaks
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {aiResponse && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                        <TerminalIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 bg-slate-900 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">AI Response</div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(aiResponse)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <Separator className="my-2" />
                        <div className="ai-response text-sm">
                          <ReactMarkdown>
                            {aiResponse}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleAskAI} className="mt-4 flex gap-2">
                  <Input
                    ref={questionRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask about Linux commands, server management, etc."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isAsking}>
                    {isAsking ? (
                      <>
                        <span className="loading h-4 w-4 mr-2"></span>
                        Asking...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Ask
                      </>
                    )}
                  </Button>
                </form>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-medium">All Terminal Assistant Responses Are Local</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  PharaohAI runs entirely on your server using local pattern matching. Your commands and 
                  server information never leave your machine, ensuring 100% privacy and security. This 
                  approach also means the terminal remains functional even without internet access.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}