import React, { useEffect } from 'react';
import { useSocketStore } from '../../lib/socketClient';
import { useToast } from '../../hooks/use-toast';
import { AlertTriangle, Bell, CheckCircle } from 'lucide-react';

interface SystemAlert {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
}

/**
 * Toast container that listens for real-time system alerts via WebSocket
 * and displays them as toasts
 */
const SystemToastContainer: React.FC = () => {
  const socket = useSocketStore((state) => state.socket);
  const connected = useSocketStore((state) => state.connected);
  const connect = useSocketStore((state) => state.connect);
  const systemAlerts = useSocketStore((state) => state.systemAlerts);
  const { toast } = useToast();

  // Connect to socket if not already connected
  useEffect(() => {
    if (!socket) {
      connect();
    }
  }, [socket, connect]);

  // Show toasts for new system alerts
  useEffect(() => {
    if (systemAlerts && systemAlerts.length > 0) {
      // Get the latest alert
      const latestAlert = systemAlerts[systemAlerts.length - 1];
      
      // Show a toast for the alert
      toast({
        title: latestAlert.title,
        description: latestAlert.message,
        variant: latestAlert.type === 'error' ? 'destructive' : 'default'
      });
    }
  }, [systemAlerts, toast]);

  // When connected/disconnected, show a toast
  useEffect(() => {
    if (socket) {
      if (connected) {
        toast({
          title: 'Connected to Server',
          description: 'Real-time updates are now active',
          variant: 'default'
        });
      } else {
        toast({
          title: 'Disconnected from Server',
          description: 'Attempting to reconnect...',
          variant: 'destructive'
        });
      }
    }
  }, [connected, socket, toast]);

  // This component doesn't render anything
  return null;
};

export default SystemToastContainer;