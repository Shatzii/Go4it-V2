import { useState, useEffect, useRef, useCallback } from 'react';

type MessageData = {
  type: string;
  [key: string]: any;
};

interface CollaborationUser {
  userId: string;
  joinedAt: string;
  lastActivity: string;
}

interface UseWebSocketOptions {
  onMessage?: (data: MessageData) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectOnClose?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  autoReconnect?: boolean;
}

export const useWebSocket = (
  wsPath = '/ws', 
  options: UseWebSocketOptions = {}
) => {
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<CollaborationUser[]>([]);
  const [lastMessage, setLastMessage] = useState<MessageData | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectOnClose = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    autoReconnect = true
  } = options;
  
  const connect = useCallback(() => {
    // Close existing connection if any
    if (socket.current) {
      socket.current.close();
    }
    
    // Create protocol based on current connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}${wsPath}`;
    
    // Create new WebSocket connection
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      
      // Send user presence information
      send({
        type: 'presence',
        status: 'online',
        userId: getOrCreateUserId()
      });
      
      if (onOpen) onOpen();
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        
        // Handle specific message types
        if (data.type === 'presence_update') {
          setActiveUsers(data.users || []);
        }
        
        if (onMessage) onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket connection closed', event.code, event.reason);
      setIsConnected(false);
      
      if (onClose) onClose();
      
      // Attempt to reconnect if enabled
      if (reconnectOnClose && autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        
        console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
        
        if (reconnectTimeoutRef.current) {
          window.clearTimeout(reconnectTimeoutRef.current);
        }
        
        // Schedule reconnection
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connect();
        }, reconnectInterval);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };
    
    socket.current = ws;
  }, [wsPath, onMessage, onOpen, onClose, onError, reconnectOnClose, reconnectInterval, maxReconnectAttempts, autoReconnect]);
  
  const send = useCallback((data: MessageData): boolean => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);
  
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (socket.current) {
      socket.current.close();
      socket.current = null;
      setIsConnected(false);
    }
  }, []);
  
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);
  
  // Generate or retrieve user ID for collaboration
  const getOrCreateUserId = (): string => {
    let userId = localStorage.getItem('rhythm_user_id');
    
    if (!userId) {
      userId = `user_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('rhythm_user_id', userId);
    }
    
    return userId;
  };
  
  // Initialize connection
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  return {
    isConnected,
    send,
    disconnect,
    reconnect,
    activeUsers,
    lastMessage
  };
};