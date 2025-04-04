import React, { useState, useEffect, useRef } from 'react';
import { useMessaging, Message } from '@/contexts/messaging-context';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, User, UserCheck, Clock, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

interface UserItem {
  id: number;
  name: string;
  username: string;
  profileImage?: string;
  role: string;
}

export const MessagingInterface: React.FC = () => {
  const { user } = useAuth();
  const { connected, messages, sendMessage, markAsRead, getConversation, unreadCount } = useMessaging();
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [userList, setUserList] = useState<UserItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch available users to message
  const { data: athletes } = useQuery({
    queryKey: ['/api/admin/athletes'],
    enabled: user?.role === 'coach' || user?.role === 'admin',
  });
  
  const { data: coaches } = useQuery({
    queryKey: ['/api/admin/coaches'],
    enabled: user?.role === 'athlete' || user?.role === 'admin',
  });

  // Set up available users to chat with based on role
  useEffect(() => {
    if (!user) return;
    
    let availableUsers: UserItem[] = [];
    
    if (user.role === 'athlete' && coaches) {
      availableUsers = coaches;
    } else if (user.role === 'coach' && athletes) {
      availableUsers = athletes;
    } else if (user.role === 'admin' && coaches && athletes) {
      availableUsers = [...coaches, ...athletes];
    }
    
    setUserList(availableUsers);
  }, [user, athletes, coaches]);

  // Auto scroll to bottom of message list
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation, messages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (!activeConversation) return;
    
    const conversation = getConversation(activeConversation);
    conversation.forEach(msg => {
      if (msg.recipientId === user?.id && !msg.isRead) {
        markAsRead(msg.id);
      }
    });
  }, [activeConversation, getConversation, markAsRead, user]);

  // Handle message submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !newMessage.trim() || !connected) return;
    
    sendMessage(activeConversation, newMessage.trim());
    setNewMessage('');
  };

  // Calculate unread messages per conversation
  const getUnreadCountForUser = (userId: number): number => {
    const conversation = getConversation(userId);
    return conversation.filter(msg => msg.senderId === userId && !msg.isRead).length;
  };

  // Find user details
  const getUserDetails = (userId: number): UserItem | undefined => {
    return userList.find(u => u.id === userId);
  };

  // Render message status icon
  const MessageStatus: React.FC<{ message: Message }> = ({ message }) => {
    if (message.id < 0) {
      // Temporary message, not yet confirmed by server
      return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
    
    if (message.isRead) {
      return <CheckCheck className="h-3 w-3 text-primary" />;
    }
    
    return <UserCheck className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <Card className="h-[650px] w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Messaging</span>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} new</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Real-time communication with coaches and athletes
          {!connected && (
            <Badge variant="outline" className="ml-2 bg-destructive/20">Disconnected</Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[520px]">
        <Tabs defaultValue="conversations" className="h-full">
          <TabsList className="grid grid-cols-2 mx-6">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversations" className="h-[calc(100%-40px)]">
            <div className="grid grid-cols-12 h-full border-t">
              {/* Conversation List */}
              <div className="col-span-4 border-r h-full">
                <ScrollArea className="h-full">
                  {Array.from(messages.keys()).map(userId => {
                    const conversation = getConversation(userId);
                    if (conversation.length === 0) return null;
                    
                    const lastMessage = conversation[conversation.length - 1];
                    const userInfo = getUserDetails(userId);
                    const unreadCount = getUnreadCountForUser(userId);
                    
                    return (
                      <div 
                        key={userId}
                        className={`flex p-3 hover:bg-accent cursor-pointer ${activeConversation === userId ? 'bg-accent' : ''}`}
                        onClick={() => setActiveConversation(userId)}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={userInfo?.profileImage} alt={userInfo?.name || 'User'} />
                          <AvatarFallback>
                            {userInfo?.name?.[0]?.toUpperCase() || <User />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{userInfo?.name || 'Unknown User'}</h3>
                            {unreadCount > 0 && (
                              <Badge variant="default" className="ml-2">{unreadCount}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {lastMessage.content}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(lastMessage.createdAt), 'MMM d, p')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
              </div>
              
              {/* Message View */}
              <div className="col-span-8 flex flex-col h-full">
                {activeConversation ? (
                  <>
                    {/* Conversation Header */}
                    <div className="p-3 border-b flex items-center">
                      <Avatar className="h-9 w-9 mr-2">
                        <AvatarImage 
                          src={getUserDetails(activeConversation)?.profileImage} 
                          alt={getUserDetails(activeConversation)?.name || 'User'} 
                        />
                        <AvatarFallback>
                          {getUserDetails(activeConversation)?.name?.[0]?.toUpperCase() || <User />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{getUserDetails(activeConversation)?.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {getUserDetails(activeConversation)?.role}
                        </p>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      {getConversation(activeConversation).map(message => {
                        const isOutgoing = message.senderId === user?.id;
                        
                        return (
                          <div
                            key={message.id} 
                            className={`mb-4 flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${isOutgoing ? 'bg-primary text-primary-foreground' : 'bg-accent'} p-3 rounded-lg`}>
                              <p>{message.content}</p>
                              <div className="text-xs mt-1 flex justify-between items-center">
                                <span>{format(new Date(message.createdAt), 'p')}</span>
                                {isOutgoing && (
                                  <MessageStatus message={message} />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </ScrollArea>
                    
                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={!connected}
                      />
                      <Button type="submit" disabled={!connected || !newMessage.trim()}>
                        <Send size={18} />
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a conversation to start messaging
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="contacts" className="h-[calc(100%-40px)]">
            <ScrollArea className="h-full">
              {userList.map(contact => (
                <div key={contact.id}>
                  <div 
                    className="flex p-4 hover:bg-accent cursor-pointer"
                    onClick={() => setActiveConversation(contact.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={contact.profileImage} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{contact.name}</h3>
                        <Badge variant="outline">{contact.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">@{contact.username}</p>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          {connected ? 'Connected to messaging service' : 'Disconnected from messaging service'}
        </p>
      </CardFooter>
    </Card>
  );
};