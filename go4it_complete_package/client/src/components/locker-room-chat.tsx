import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { User, MessageSquare, Send } from 'lucide-react';
import websocketService from '@/services/websocket-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id?: number;
  senderId: number;
  content: string;
  timestamp: string;
  senderName?: string;
  senderAvatar?: string;
}

export function LockerRoomChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (user) {
      websocketService.connect(user.id);
      
      // Add connection listener
      const connectionListener = () => {
        setIsConnected(true);
        console.log('Connected to chat server');
      };
      
      websocketService.addConnectionListener(connectionListener);
      
      // Add message listener
      const messageListener = (data: any) => {
        if (data.type === 'message' || data.type === 'chat_message') {
          setMessages(prev => [...prev, {
            senderId: data.data.senderId || data.senderId,
            content: data.data.content || data.content,
            timestamp: data.timestamp,
            senderName: data.data.senderName || data.senderName
          }]);
        }
      };
      
      websocketService.addMessageListener(messageListener);
      
      // Clean up on unmount
      return () => {
        websocketService.removeConnectionListener(connectionListener);
        websocketService.removeMessageListener(messageListener);
      };
    }
  }, [user]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;
    
    const message: Message = {
      senderId: user.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      senderName: user.name
    };
    
    // For group chat, we don't specify a recipient
    websocketService.sendChatMessage(newMessage, 0); // 0 indicates broadcast to all
    
    // Optimistically add message to UI
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="bg-blue-950 text-white">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Locker Room Chat
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <MessageSquare className="h-12 w-12 mb-2" />
              <p>No messages yet. Be the first to say something!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${message.senderId === user?.id ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback>{message.senderName ? getInitials(message.senderName) : 'U'}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div 
                      className={`p-3 rounded-lg ${
                        message.senderId === user?.id 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-gray-200 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      {message.content}
                    </div>
                    
                    <div 
                      className={`text-xs mt-1 text-gray-500 ${
                        message.senderId === user?.id ? 'text-right' : ''
                      }`}
                    >
                      {message.senderName && message.senderId !== user?.id && (
                        <span className="font-medium mr-2">{message.senderName}</span>
                      )}
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected || !user}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!isConnected || !user || !newMessage.trim()}
            size="icon"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default LockerRoomChat;