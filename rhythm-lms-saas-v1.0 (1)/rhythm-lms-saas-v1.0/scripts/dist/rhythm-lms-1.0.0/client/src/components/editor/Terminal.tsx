import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

type LogLevel = 'info' | 'success' | 'warning' | 'error';

interface LogEntry {
  message: string;
  level: LogLevel;
  timestamp: Date;
}

const Terminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'problems' | 'output'>('terminal');
  const [logs, setLogs] = useState<LogEntry[]>([
    { message: 'Rhythm Engine started', level: 'success', timestamp: new Date() },
    { message: 'Starting local AI model...', level: 'info', timestamp: new Date() },
    { message: 'Model loaded: rhythm-core-v0.1.0', level: 'info', timestamp: new Date() },
    { message: 'AI engine ready', level: 'success', timestamp: new Date() },
    { message: 'Watching for file changes...', level: 'info', timestamp: new Date() },
    { message: 'Memory usage: 1.2GB (80% of allocated)', level: 'warning', timestamp: new Date() },
    { message: 'Press Ctrl+C to stop the server', level: 'info', timestamp: new Date() },
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const [problems, setProblems] = useState<{ message: string; file: string; line: number }[]>([]);
  
  // Set up WebSocket for terminal updates
  const { lastMessage } = useWebSocket('/ws/terminal');
  
  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.type === 'log') {
          setLogs(prev => [...prev, {
            message: data.message,
            level: data.level || 'info',
            timestamp: new Date()
          }]);
        } else if (data.type === 'clear') {
          setLogs([]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]);
  
  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);
  
  // Clear terminal
  const clearTerminal = () => {
    setLogs([]);
  };
  
  const getLogClass = (level: LogLevel) => {
    switch (level) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-white';
    }
  };
  
  return (
    <div className="h-64 border-t border-dark-700 bg-dark-900 flex flex-col">
      <div className="px-4 py-2 border-b border-dark-700 flex justify-between items-center">
        <div className="flex space-x-4">
          <button 
            className={activeTab === 'terminal' ? "text-white font-medium text-sm" : "text-dark-400 hover:text-white text-sm"}
            onClick={() => setActiveTab('terminal')}
          >
            Terminal
          </button>
          <button 
            className={activeTab === 'problems' ? "text-white font-medium text-sm" : "text-dark-400 hover:text-white text-sm"}
            onClick={() => setActiveTab('problems')}
          >
            Problems
          </button>
          <button 
            className={activeTab === 'output' ? "text-white font-medium text-sm" : "text-dark-400 hover:text-white text-sm"}
            onClick={() => setActiveTab('output')}
          >
            Output
          </button>
        </div>
        <div>
          <button 
            className="text-dark-400 hover:text-white mr-2"
            onClick={clearTerminal}
            title="Clear Terminal"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
          <button className="text-dark-400 hover:text-white">
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>
      
      {activeTab === 'terminal' && (
        <div ref={terminalRef} className="flex-1 p-4 overflow-auto terminal font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index} className={getLogClass(log.level)}>
              {log.level === 'success' && '✓ '}
              {log.level === 'warning' && '⚠ '}
              {log.level === 'error' && '✗ '}
              {log.message}
            </div>
          ))}
          <div className="text-white mt-2 flex items-center">
            <span className="text-green-500 mr-2">$</span> <span className="animate-pulse">|</span>
          </div>
        </div>
      )}
      
      {activeTab === 'problems' && (
        <div className="flex-1 p-4 overflow-auto terminal font-mono text-sm">
          {problems.length === 0 ? (
            <div className="text-dark-400">No problems detected</div>
          ) : (
            problems.map((problem, index) => (
              <div key={index} className="text-red-500">
                {problem.file}:{problem.line} - {problem.message}
              </div>
            ))
          )}
        </div>
      )}
      
      {activeTab === 'output' && (
        <div className="flex-1 p-4 overflow-auto terminal font-mono text-sm text-dark-400">
          Run a command to see output
        </div>
      )}
    </div>
  );
};

export default Terminal;
