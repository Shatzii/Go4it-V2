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
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.userId = userId;
    
    // Determine the correct protocol based on the current page protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    console.log(`Connecting to WebSocket at ${wsUrl}`);
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.reconnectAttempts = 0;
      
      // Notify all connection listeners
      this.connectionListeners.forEach(listener => listener());

      // Authenticate if we have a user ID
      if (userId) {
        this.authenticate(userId);
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        // Notify all message listeners
        this.messageListeners.forEach(listener => listener(data));
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
      
      // Try to reconnect if it wasn't a clean close
      if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
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
      type: 'chat_message',
      content: message,
      recipientId,
      senderId: this.userId,
      timestamp: new Date().toISOString()
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
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff, max 30s
    console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect(this.userId);
    }, delay);
  }

  /**
   * Close the WebSocket connection
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
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