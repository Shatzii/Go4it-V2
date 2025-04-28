/**
 * WebSocket Service for Go4It Sports
 * 
 * This service manages WebSocket connections for real-time features
 * including chat messaging and collaborative whiteboard.
 */

class WebSocketService {
  public socket: WebSocket | null = null;
  private messageListeners: Array<(message: any) => void> = [];
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isAuthenticated: boolean = false;
  private userId: number | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  
  /**
   * Connect to the WebSocket server
   */
  public connect(userId: number): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }
    
    this.userId = userId;
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    
    this.socket = new WebSocket(wsUrl);
    
    this.socket.onopen = this.handleOpen.bind(this);
    this.socket.onmessage = this.handleMessage.bind(this);
    this.socket.onclose = this.handleClose.bind(this);
    this.socket.onerror = this.handleError.bind(this);
  }
  
  /**
   * Authenticate with the WebSocket server
   */
  public authenticate(userId: number): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot authenticate: WebSocket not connected');
      return;
    }
    
    if (this.isAuthenticated) {
      console.log('WebSocket already authenticated');
      return;
    }
    
    this.socket.send(JSON.stringify({
      type: 'auth',
      userId
    }));
  }
  
  /**
   * Send a chat message
   */
  public sendMessage(recipientId: number, content: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message: WebSocket not connected');
      return;
    }
    
    if (!this.isAuthenticated || !this.userId) {
      console.error('Cannot send message: Not authenticated');
      return;
    }
    
    this.socket.send(JSON.stringify({
      type: 'chat_message',
      senderId: this.userId,
      recipientId,
      content,
      timestamp: new Date().toISOString()
    }));
  }
  
  /**
   * Mark a message as read
   */
  public markMessageAsRead(messageId: number): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot mark message: WebSocket not connected');
      return;
    }
    
    this.socket.send(JSON.stringify({
      type: 'mark_read',
      messageId
    }));
  }
  
  /**
   * Send a whiteboard event
   */
  public sendWhiteboardEvent(sessionId: string, event: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send whiteboard event: WebSocket not connected');
      return;
    }
    
    if (!this.isAuthenticated) {
      console.error('Cannot send whiteboard event: Not authenticated');
      return;
    }
    
    this.socket.send(JSON.stringify({
      type: 'whiteboard_event',
      sessionId,
      event
    }));
  }
  
  /**
   * Close the WebSocket connection
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.isAuthenticated = false;
    this.reconnectAttempts = 0;
  }
  
  /**
   * Add a message listener
   */
  public addMessageListener(listener: (message: any) => void): void {
    this.messageListeners.push(listener);
  }
  
  /**
   * Remove a message listener
   */
  public removeMessageListener(listener: (message: any) => void): void {
    const index = this.messageListeners.indexOf(listener);
    if (index !== -1) {
      this.messageListeners.splice(index, 1);
    }
  }
  
  /**
   * Handle WebSocket open event
   */
  private handleOpen(): void {
    console.log('WebSocket connection opened');
    this.reconnectAttempts = 0;
    
    // Authenticate immediately after connection
    if (this.userId) {
      this.authenticate(this.userId);
    }
  }
  
  /**
   * Handle WebSocket message event
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data);
      
      // Handle authentication response
      if (message.type === 'auth_success') {
        this.isAuthenticated = true;
        console.log('WebSocket authenticated successfully');
      }
      
      // Notify all message listeners
      this.messageListeners.forEach(listener => {
        try {
          listener(message);
        } catch (error) {
          console.error('Error in message listener:', error);
        }
      });
    } catch (error) {
      console.error('Error parsing WebSocket message:', error, event.data);
    }
  }
  
  /**
   * Handle WebSocket close event
   */
  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    this.socket = null;
    this.isAuthenticated = false;
    
    // Attempt to reconnect if not a normal closure
    if (event.code !== 1000 && event.code !== 1001) {
      this.attemptReconnect();
    }
  }
  
  /**
   * Handle WebSocket error event
   */
  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
  }
  
  /**
   * Attempt to reconnect to the WebSocket server
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnect attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId);
      }
    }, delay);
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService();

// Also export as default for backward compatibility
export default websocketService;