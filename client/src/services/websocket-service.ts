// WebSocket connection service for real-time features

type MessageListener = (message: any) => void;
type ConnectionListener = () => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageListeners: MessageListener[] = [];
  private connectionListeners: ConnectionListener[] = [];
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private userId: number | null = null;

  /**
   * Initialize the WebSocket connection
   * @param userId The current user ID for authentication
   */
  connect(userId: number | null = null): void {
    // Store userId for reconnection purposes regardless of connection state
    if (userId !== null) {
      this.userId = userId;
    }
    
    // Check if we already have an active connection
    if (this.socket) {
      const currentState = this.socket.readyState;
      
      if (currentState === WebSocket.OPEN) {
        console.log('WebSocket already connected');
        
        // If we already have an open connection but user ID changed, re-authenticate
        if (userId !== null && this.socket.readyState === WebSocket.OPEN) {
          this.authenticate(userId);
        }
        return;
      }
      
      // If socket exists but is in connecting state, don't create a new one
      if (currentState === WebSocket.CONNECTING) {
        console.log('WebSocket connection already in progress');
        return;
      }
      
      // For other states (closing, closed), close the existing socket before creating a new one
      if (currentState === WebSocket.CLOSING || currentState === WebSocket.CLOSED) {
        try {
          this.socket.close();
        } catch (err) {
          console.warn('Error closing existing socket:', err);
        }
        this.socket = null;
      }
    }
    
    // Determine the correct protocol and port based on the current environment
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let wsHost = window.location.host;
    
    // For production server at 5.161.99.81, we need to use port 81
    if (window.location.hostname === '5.161.99.81') {
      wsHost = '5.161.99.81:81';
    }
    
    const wsUrl = `${protocol}//${wsHost}/ws`;

    console.log(`Connecting to WebSocket at ${wsUrl}`);
    
    try {
      this.socket = new WebSocket(wsUrl);
      
      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
          console.warn('WebSocket connection timeout - closing socket');
          this.socket.close();
          this.socket = null;
          this.scheduleReconnect();
        }
      }, 10000); // 10 second connection timeout
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        clearTimeout(connectionTimeout);
        this.reconnectAttempts = 0;
        
        // Notify all connection listeners
        this.connectionListeners.forEach(listener => {
          try {
            listener();
          } catch (error) {
            console.error('Error in connection listener:', error);
          }
        });

        // Authenticate if we have a user ID
        if (this.userId !== null) {
          this.authenticate(this.userId);
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          // Notify all message listeners
          this.messageListeners.forEach(listener => {
            try {
              listener(data);
            } catch (error) {
              console.error('Error in message listener:', error);
            }
          });
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        clearTimeout(connectionTimeout);
        
        // Try to reconnect if it wasn't a clean close
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // The onclose handler will be called after this, which will handle reconnection
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Authenticate the WebSocket connection with the user ID
   * @param userId The user ID to authenticate with
   */
  authenticate(userId: number): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('Cannot authenticate: WebSocket not connected');
      return;
    }

    this.socket.send(JSON.stringify({
      type: 'auth',
      userId
    }));
  }

  /**
   * Send a chat message through the WebSocket
   * @param message The message text
   * @param recipientId The recipient user ID
   */
  sendChatMessage(message: string, recipientId: number): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send message: WebSocket not connected');
      return;
    }

    if (!this.userId) {
      console.warn('Cannot send message: Not authenticated');
      return;
    }

    this.socket.send(JSON.stringify({
      type: 'message',
      content: message,
      recipientId,
      senderId: this.userId,
      timestamp: new Date().toISOString()
    }));
  }
  
  /**
   * Send a whiteboard event through the WebSocket
   * @param sessionId The whiteboard session ID
   * @param event The whiteboard event data
   */
  sendWhiteboardEvent(sessionId: string, event: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send whiteboard event: WebSocket not connected');
      return;
    }

    if (!this.userId) {
      console.warn('Cannot send whiteboard event: Not authenticated');
      return;
    }

    this.socket.send(JSON.stringify({
      type: 'whiteboard_event',
      sessionId,
      event: {
        ...event,
        userId: this.userId,
        timestamp: new Date().toISOString()
      }
    }));
  }

  /**
   * Add a listener for WebSocket messages
   * @param listener The callback function to call when a message is received
   */
  addMessageListener(listener: MessageListener): void {
    this.messageListeners.push(listener);
  }

  /**
   * Remove a previously added message listener
   * @param listener The listener to remove
   */
  removeMessageListener(listener: MessageListener): void {
    this.messageListeners = this.messageListeners.filter(l => l !== listener);
  }

  /**
   * Add a listener for WebSocket connection events
   * @param listener The callback function to call when the connection is established
   */
  addConnectionListener(listener: ConnectionListener): void {
    this.connectionListeners.push(listener);
  }

  /**
   * Remove a previously added connection listener
   * @param listener The listener to remove
   */
  removeConnectionListener(listener: ConnectionListener): void {
    this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
  }

  /**
   * Schedule a reconnection attempt with exponential backoff
   */
  private scheduleReconnect(): void {
    // Clear any existing timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // If we've exceeded maximum attempts, log and give up
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn(`Maximum reconnect attempts (${this.maxReconnectAttempts}) reached, giving up`);
      return;
    }
    
    // Calculate delay with exponential backoff and some randomness to prevent thundering herd
    const baseDelay = 1000 * Math.pow(2, this.reconnectAttempts);
    const jitter = Math.random() * 1000; // Add up to 1 second of random jitter
    const delay = Math.min(baseDelay + jitter, 30000); // Cap at 30 seconds
    
    console.log(`Scheduling reconnect in ${Math.round(delay)}ms (attempt ${this.reconnectAttempts + 1} of ${this.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      
      // Re-use the stored userId for authentication after reconnection
      try {
        console.log(`Attempting reconnection #${this.reconnectAttempts}`);
        this.connect(this.userId);
      } catch (error) {
        console.error('Error during reconnection attempt:', error);
        // If the reconnection attempt itself throws, try again
        this.scheduleReconnect();
      }
    }, delay);
  }

  /**
   * Close the WebSocket connection and cleanup resources
   */
  disconnect(): void {
    // Cancel any pending reconnection attempts
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    // Reset reconnect counter
    this.reconnectAttempts = 0;

    // Close socket connection if it exists
    if (this.socket) {
      try {
        // Only attempt to close if the socket is still open or connecting
        if (this.socket.readyState === WebSocket.OPEN || 
            this.socket.readyState === WebSocket.CONNECTING) {
          console.log('Closing WebSocket connection...');
          
          // Set a timeout to force cleanup if close hangs
          const forceCloseTimeout = setTimeout(() => {
            console.warn('WebSocket close operation timed out, forcing cleanup');
            this.socket = null;
          }, 3000);
          
          // Setup onclose handler to clear the timeout
          const originalOnClose = this.socket.onclose;
          this.socket.onclose = (event) => {
            clearTimeout(forceCloseTimeout);
            console.log('WebSocket closed successfully');
            if (originalOnClose && this.socket) {
              try {
                // Safe call with proper this binding and null checking
                originalOnClose.call(this.socket, event);
              } catch (error) {
                console.error('Error in original onclose handler:', error);
              }
            }
          };
          
          // Perform the actual close
          this.socket.close(1000, 'Disconnection requested by client');
        }
      } catch (error) {
        console.error('Error closing WebSocket:', error);
      } finally {
        // Always reset the socket reference
        this.socket = null;
      }
    }
  }

  /**
   * Check if the WebSocket is currently connected
   */
  isConnected(): boolean {
    return !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService();
export default websocketService;