import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAiStatus } from '@/lib/ai-service';

interface AIStatus {
  isReady: boolean;
  model: string;
  memoryUsage: {
    used: number; // in MB
    total: number; // in MB
  };
  message?: string;
}

interface AIContextType {
  aiStatus: AIStatus;
  refreshStatus: () => Promise<void>;
}

const defaultStatus: AIStatus = {
  isReady: false,
  model: 'Connecting...',
  memoryUsage: {
    used: 0,
    total: 0,
  },
};

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aiStatus, setAiStatus] = useState<AIStatus>(defaultStatus);
  
  const refreshStatus = useCallback(async () => {
    try {
      const status = await getAiStatus();
      setAiStatus(status);
    } catch (error) {
      console.error('Failed to get AI status:', error);
      setAiStatus({
        isReady: false,
        model: 'Error',
        memoryUsage: { used: 0, total: 0 },
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, []);
  
  useEffect(() => {
    // Initial fetch
    refreshStatus();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(refreshStatus, 5000);
    
    return () => clearInterval(interval);
  }, [refreshStatus]);
  
  return (
    <AIContext.Provider value={{ aiStatus, refreshStatus }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
