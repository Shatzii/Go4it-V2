import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { dashboardConnector } from '@/services/dataConnector';

/**
 * Hook for using WebSocket connection in components
 * 
 * Manages connection state and provides methods for interacting
 * with the real-time data system
 */
export function useWebSocket() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(dashboardConnector.isConnected());
  
  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (user) {
      // Set up connection state listeners
      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);
      
      // Add listeners
      dashboardConnector.addConnectionListener(handleConnect, handleDisconnect);
      
      // Connect to WebSocket
      dashboardConnector.connect(user.id, user.clientId || 1);
      
      // Clean up on unmount
      return () => {
        dashboardConnector.removeConnectionListener(handleConnect, handleDisconnect);
      };
    } else {
      // Disconnect if not authenticated
      dashboardConnector.disconnect();
      setIsConnected(false);
    }
  }, [user]);
  
  // Subscribe to specific topics
  const subscribe = (topics: string[]) => {
    dashboardConnector.subscribe(topics);
  };
  
  // Unsubscribe from specific topics
  const unsubscribe = (topics: string[]) => {
    dashboardConnector.unsubscribe(topics);
  };
  
  // Request immediate data sync
  const requestSync = () => {
    dashboardConnector.requestSync();
  };
  
  return {
    isConnected,
    subscribe,
    unsubscribe,
    requestSync
  };
}