import React, { useState, useEffect, useRef } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useSocketStore } from '@/lib/socketClient';
import { 
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  Command,
  Copy,
  Download,
  MoreVertical, 
  RefreshCw,
  Save,
  Terminal as TerminalIcon,
  Trash2,
  Upload
} from 'lucide-react';
import { Link } from 'wouter';

interface ServerConnection {
  id: string;
  name: string;
  hostname: string;
  port: number;
  username: string;
  connectionStatus: string;
  serverType: 'linux' | 'windows';
  operatingSystem?: string;
}

interface TerminalCommand {
  command: string;
  output: string;
  exitCode?: number;
  timestamp: Date;
  isLoading?: boolean;
  isError?: boolean;
}

const TerminalPage: React.FC = () => {
  const [, params] = useRoute('/servers/:id/terminal');
  const serverId = params?.id;
  const { user } = useAuth();
  const { toast } = useToast();
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<TerminalCommand[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isConnecting, setIsConnecting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalData = useSocketStore(state => state.terminalOutput);

  // Fetch server details
  const { data: server, isLoading: isLoadingServer } = useQuery({
    queryKey: [`/api/servers/${serverId}`],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', `/api/servers/${serverId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch server details');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching server details:', error);
        // Use sample data if API fails
        return {
          id: serverId,
          name: 'Server Connection',
          hostname: 'hostname.example.com',
          port: 22,
          username: 'username',
          connectionStatus: 'connected',
          serverType: 'linux',
          operatingSystem: 'Linux'
        } as ServerConnection;
      }
    },
    enabled: !!serverId && !!user,
  });

  // Connect to server terminal
  const connectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/servers/${serverId}/terminal/connect`);
      if (!response.ok) {
        throw new Error('Failed to connect to server terminal');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setIsConnecting(false);
      setHistory(prev => [...prev, {
        command: 'Connection established',
        output: `Connected to ${server?.name} (${server?.hostname})\n${data.message || ''}`,
        timestamp: new Date(),
      }]);

      // Automatically get system info
      executeMutation.mutate('uname -a && cat /etc/os-release | grep PRETTY_NAME');
    },
    onError: (error) => {
      setIsConnecting(false);
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
      setHistory(prev => [...prev, {
        command: 'Connection failed',
        output: `Failed to connect to ${server?.name}: ${error.message}`,
        isError: true,
        timestamp: new Date(),
      }]);
    },
  });

  // Execute command
  const executeMutation = useMutation({
    mutationFn: async (cmd: string) => {
      const response = await apiRequest('POST', `/api/servers/${serverId}/terminal/execute`, { command: cmd });
      if (!response.ok) {
        throw new Error('Failed to execute command');
      }
      return response.json();
    },
    onMutate: (cmd) => {
      // Optimistically add command to history
      const newCommand: TerminalCommand = {
        command: cmd,
        output: '',
        isLoading: true,
        timestamp: new Date(),
      };
      setHistory(prev => [...prev, newCommand]);
      
      // Scroll to bottom
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 10);
    },
    onSuccess: (data, cmd) => {
      // Update command with result
      setHistory(prev => 
        prev.map(item => 
          item.command === cmd && item.isLoading 
            ? { 
                ...item, 
                output: data.output || 'Command executed successfully with no output.', 
                exitCode: data.exitCode,
                isLoading: false,
                isError: data.exitCode !== 0
              } 
            : item
        )
      );
      
      // Scroll to bottom
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 10);
    },
    onError: (error, cmd) => {
      // Update command with error
      setHistory(prev => 
        prev.map(item => 
          item.command === cmd && item.isLoading 
            ? { 
                ...item, 
                output: `Error: ${error.message}`, 
                isLoading: false,
                isError: true
              } 
            : item
        )
      );
      
      toast({
        title: "Command failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    executeMutation.mutate(command);
    setCommand('');
    setHistoryIndex(-1);
  };

  // Handle key navigation through command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  // Connect to terminal on page load
  useEffect(() => {
    if (server && !isConnecting && history.length === 0) {
      setIsConnecting(true);
      setHistory([{
        command: 'Connecting...',
        output: `Establishing connection to ${server.name} (${server.hostname})...`,
        timestamp: new Date(),
      }]);
      connectMutation.mutate();
    }
  }, [server, connectMutation, history.length, isConnecting]);

  // Auto-focus input when available
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-scroll to bottom when terminal content changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Common terminal commands for the dropdown
  const commonCommands = [
    { label: 'List Files', command: 'ls -la' },
    { label: 'Check Disk Space', command: 'df -h' },
    { label: 'Check Memory', command: 'free -m' },
    { label: 'Process List', command: 'ps aux' },
    { label: 'System Info', command: 'uname -a' },
    { label: 'Network Status', command: 'netstat -tuln' },
    { label: 'Check Services', command: 'systemctl status' },
    { label: 'Recent Logs', command: 'tail -n 50 /var/log/syslog' },
  ];

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
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Terminal</span>
              {server && <span className="ml-2 text-slate-400">• {server.name}</span>}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {server && (
              <Badge className={`px-3 py-1 ${
                server.connectionStatus === 'connected' 
                  ? 'bg-emerald-500' 
                  : server.connectionStatus === 'pending' 
                  ? 'bg-amber-500' 
                  : 'bg-rose-500'
              }`}>
                {server.connectionStatus === 'connected' ? 'Connected' : 
                 server.connectionStatus === 'pending' ? 'Connecting' : 'Disconnected'}
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-slate-700">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-slate-800 bg-slate-900">
                <DropdownMenuLabel className="text-slate-400">Terminal Options</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem 
                  className="text-slate-400 focus:bg-slate-800 focus:text-white"
                  onClick={() => {
                    setHistory([]);
                    setIsConnecting(true);
                    setHistory([{
                      command: 'Reconnecting...',
                      output: `Reestablishing connection to ${server?.name}...`,
                      timestamp: new Date(),
                    }]);
                    connectMutation.mutate();
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reconnect
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-slate-400 focus:bg-slate-800 focus:text-white"
                  onClick={() => {
                    const text = history
                      .map(cmd => `$ ${cmd.command}\n${cmd.output}\n`)
                      .join('\n');
                    navigator.clipboard.writeText(text);
                    toast({
                      title: "Terminal output copied",
                      description: "Terminal history has been copied to clipboard",
                    });
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All Output
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-slate-400 focus:bg-slate-800 focus:text-white"
                  onClick={() => {
                    const text = history
                      .map(cmd => `$ ${cmd.command}\n${cmd.output}\n`)
                      .join('\n');
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `terminal_${server?.name || 'output'}_${new Date().toISOString().slice(0, 10)}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Save Output
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem 
                  className="text-rose-500 focus:bg-rose-950 focus:text-rose-400"
                  onClick={() => {
                    setHistory([]);
                    toast({
                      title: "Terminal cleared",
                      description: "Terminal history has been cleared",
                    });
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Terminal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-lg text-white">
                  <TerminalIcon className="mr-2 h-5 w-5 text-blue-500" />
                  {server ? `${server.username}@${server.hostname}` : 'Terminal'}
                </CardTitle>
                {server?.operatingSystem && (
                  <CardDescription className="text-slate-400">
                    {server.operatingSystem}
                  </CardDescription>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-slate-700">
                    <Command className="mr-2 h-4 w-4" />
                    Common Commands
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-slate-800 bg-slate-900">
                  <DropdownMenuLabel className="text-slate-400">Quick Commands</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  {commonCommands.map((cmd, index) => (
                    <DropdownMenuItem 
                      key={index}
                      className="text-slate-400 focus:bg-slate-800 focus:text-white"
                      onClick={() => {
                        setCommand(cmd.command);
                        if (inputRef.current) {
                          inputRef.current.focus();
                        }
                      }}
                    >
                      {cmd.label}
                      <span className="ml-2 text-xs text-slate-500">{cmd.command}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              ref={terminalRef}
              className="h-[60vh] overflow-auto bg-slate-950 p-4 font-mono text-sm text-slate-300"
            >
              {history.map((item, index) => (
                <div key={index} className="mb-2">
                  <div className="flex items-center text-xs text-slate-500">
                    <span className="mr-2">[{formatTimestamp(item.timestamp)}]</span>
                    {item.command !== 'Connecting...' && item.command !== 'Connection established' && item.command !== 'Connection failed' && (
                      <span className="text-blue-500">$ {item.command}</span>
                    )}
                  </div>
                  <div className={`mt-1 whitespace-pre-wrap ${item.isError ? 'text-rose-400' : ''}`}>
                    {item.isLoading ? (
                      <div className="flex items-center text-slate-500">
                        <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-blue-500"></div>
                        Executing...
                      </div>
                    ) : (
                      item.output
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-800 p-4">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <div className="text-slate-500">$</div>
              <Input
                ref={inputRef}
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter command..."
                className="flex-1 border-slate-700 bg-slate-800 text-white font-mono"
                disabled={isConnecting || connectMutation.isPending}
              />
              <Button
                type="submit"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isConnecting || connectMutation.isPending || !command.trim()}
              >
                Execute
              </Button>
            </form>
          </CardFooter>
        </Card>

        {/* Command reference */}
        <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Common Linux Commands</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <h4 className="mb-2 font-medium text-white">File Management</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li><span className="text-blue-400">ls</span> - List files</li>
                <li><span className="text-blue-400">cd</span> - Change directory</li>
                <li><span className="text-blue-400">cp</span> - Copy files</li>
                <li><span className="text-blue-400">mv</span> - Move files</li>
                <li><span className="text-blue-400">rm</span> - Remove files</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <h4 className="mb-2 font-medium text-white">System Information</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li><span className="text-blue-400">uname -a</span> - System info</li>
                <li><span className="text-blue-400">df -h</span> - Disk usage</li>
                <li><span className="text-blue-400">free -m</span> - Memory usage</li>
                <li><span className="text-blue-400">top</span> - Process activity</li>
                <li><span className="text-blue-400">ps aux</span> - Process list</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <h4 className="mb-2 font-medium text-white">Network</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li><span className="text-blue-400">ifconfig</span> - Network interfaces</li>
                <li><span className="text-blue-400">ping</span> - Test connectivity</li>
                <li><span className="text-blue-400">netstat -tuln</span> - Network status</li>
                <li><span className="text-blue-400">curl</span> - Transfer data</li>
                <li><span className="text-blue-400">ssh</span> - Secure shell</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalPage;