import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Define message types
export interface Message {
  id: number;
  senderId: number;
  senderName?: string;
  recipientId: number;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

interface MessagingContextType {
  connected: boolean;
  messages: Map<number, Message[]>; // Map of conversations by userId
  sendMessage: (recipientId: number, content: string) => Promise<boolean>;
  markAsRead: (messageId: number) => Promise<boolean>;
  getConversation: (userId: number) => Message[];
  unreadCount: number;
}

export const MessagingContext = createContext<MessagingContextType | null>(null);

export const MessagingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Map<number, Message[]>>(new Map());
  const [unreadCount, setUnreadCount] = useState(0);

  // Connect to WebSocket
  useEffect(() => {
    if (!user) return;

    // Try a more reliable way to connect to WebSocket
    // Use a standard HTTP/HTTPS connection first and avoid WebSocket for now
    console.log('Initializing messaging without WebSocket temporarily');
    
    // Create a dummy socket object that simulates the WebSocket interface
    // but doesn't actually connect, to avoid connection errors
    const newSocket = {
      readyState: 0,
      send: (message: string) => {
        console.log('Message queued (WebSocket disabled):', message);
        return true;
      },
      close: () => {
        console.log('WebSocket simulation closed');
      },
      onopen: () => {},
      onclose: () => {},
      onerror: () => {},
      onmessage: () => {}
    } as unknown as WebSocket;

    // Socket event handlers
    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      // Authenticate with the WebSocket server
      setTimeout(() => {
        try {
          console.log('Sending auth message with userId:', user.id);
          newSocket.send(JSON.stringify({
            type: 'auth',
            userId: user.id
          }));
        } catch (error) {
          console.error('Error sending auth message:', error);
        }
      }, 500); // Small delay to ensure connection is fully established
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
      setConnected(false);
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
      toast({
        title: 'Connection error',
        description: 'Could not connect to messaging service. Please try again later.',
        variant: 'destructive',
      });
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle auth success
        if (data.type === 'auth_success') {
          setConnected(true);
          toast({
            title: 'Connected',
            description: 'Messaging service connected successfully',
          });
        }
        
        // Handle unread messages
        if (data.type === 'unread_messages') {
          setUnreadCount(data.count);
          
          // Process messages
          const newMessages = new Map(messages);
          
          data.messages.forEach((msg: Message) => {
            const conversation = newMessages.get(msg.senderId) || [];
            conversation.push({
              ...msg,
              createdAt: new Date(msg.createdAt)
            });
            conversation.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            newMessages.set(msg.senderId, conversation);
          });
          
          setMessages(newMessages);
        }
        
        // Handle new incoming message
        if (data.type === 'new_message') {
          const msg = data.message;
          setUnreadCount(prev => prev + 1);
          
          // Update conversations
          setMessages(prev => {
            const newMessages = new Map(prev);
            const conversation = newMessages.get(msg.senderId) || [];
            conversation.push({
              ...msg,
              createdAt: new Date(msg.createdAt)
            });
            conversation.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            newMessages.set(msg.senderId, conversation);
            return newMessages;
          });
          
          // Show notification
          toast({
            title: `New message from ${msg.senderName}`,
            description: msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content,
          });
        }
        
        // Handle sent message confirmation
        if (data.type === 'message_sent') {
          // We could update UI to show the message was delivered
          console.log('Message sent successfully', data.messageId);
        }
        
        // Handle read receipts
        if (data.type === 'message_read_receipt') {
          // Update message read status
          console.log('Message read by recipient', data.messageId);
        }
        
        // Handle errors
        if (data.type === 'error') {
          toast({
            title: 'Messaging error',
            description: data.message,
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [user, toast]);

  // Function to send a message
  const sendMessage = useCallback(async (recipientId: number, content: string): Promise<boolean> => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !connected) {
      toast({
        title: 'Connection error',
        description: 'Not connected to messaging service',
        variant: 'destructive',
      });
      return false;
    }

    try {
      socket.send(JSON.stringify({
        type: 'message',
        recipientId,
        content
      }));
      
      // Optimistically update local messages
      setMessages(prev => {
        const newMessages = new Map(prev);
        const conversation = newMessages.get(recipientId) || [];
        const tempMessage: Message = {
          id: -Date.now(), // Temporary negative ID until server confirms
          senderId: user!.id,
          recipientId,
          content,
          createdAt: new Date(),
          isRead: false
        };
        conversation.push(tempMessage);
        conversation.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        newMessages.set(recipientId, conversation);
        return newMessages;
      });
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Message not sent',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [socket, connected, toast, user]);

  // Function to mark a message as read
  const markAsRead = useCallback(async (messageId: number): Promise<boolean> => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !connected) {
      return false;
    }

    try {
      socket.send(JSON.stringify({
        type: 'message_read',
        messageId
      }));
      
      // Optimistically update read status
      setMessages(prev => {
        const newMessages = new Map(prev);
        
        // Find the message in all conversations
        newMessages.forEach((convo, userId) => {
          const msgIndex = convo.findIndex(m => m.id === messageId);
          if (msgIndex >= 0 && !convo[msgIndex].isRead) {
            // Update the message
            const updatedConvo = [...convo];
            updatedConvo[msgIndex] = { ...updatedConvo[msgIndex], isRead: true };
            newMessages.set(userId, updatedConvo);
            
            // Decrement unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        });
        
        return newMessages;
      });
      
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }, [socket, connected]);

  // Function to get conversation with a specific user
  const getConversation = useCallback((userId: number): Message[] => {
    return messages.get(userId) || [];
  }, [messages]);

  // Update context value
  const contextValue: MessagingContextType = {
    connected,
    messages,
    sendMessage,
    markAsRead,
    getConversation,
    unreadCount
  };

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};