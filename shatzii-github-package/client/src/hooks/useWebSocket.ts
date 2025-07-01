import { useState, useEffect, useRef } from 'react';

export interface WebSocketMessage {
  type: 'subscribe' | 'unsubscribe' | 'ping' | 'update' | 'notification';
  channel?: string;
  data?: any;
  timestamp?: string;
}

export function useWebSocket(url?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const wsUrl = url || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;

  const connect = () => {
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        setConnectionError('WebSocket connection failed');
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      setConnectionError('Failed to create WebSocket connection');
      console.error('WebSocket creation error:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  const subscribe = (channel: string) => {
    sendMessage({ type: 'subscribe', channel });
  };

  const unsubscribe = (channel: string) => {
    sendMessage({ type: 'unsubscribe', channel });
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    lastMessage,
    connectionError,
    sendMessage,
    subscribe,
    unsubscribe,
    reconnect: connect
  };
}