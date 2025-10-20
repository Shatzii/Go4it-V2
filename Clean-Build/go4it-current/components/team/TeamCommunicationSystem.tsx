'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Send,
  Phone,
  Video,
  Upload,
  Paperclip,
  Smile,
  Calendar,
  MapPin,
  Users,
  MoreHorizontal,
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'coach' | 'athlete' | 'parent' | 'admin';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'video' | 'file' | 'announcement';
  attachments?: Attachment[];
  reactions?: Reaction[];
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

interface Team {
  id: string;
  name: string;
  sport: string;
  members: TeamMember[];
  channels: Channel[];
}

interface TeamMember {
  id: string;
  name: string;
  role: 'coach' | 'athlete' | 'parent' | 'admin';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface Channel {
  id: string;
  name: string;
  type: 'general' | 'announcements' | 'training' | 'parents' | 'coaches';
  isPrivate: boolean;
  members: string[];
  messages: Message[];
}

export function TeamCommunicationSystem() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTeamData();
    setupWebSocket();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChannel?.messages]);

  const fetchTeamData = async () => {
    try {
      const response = await fetch('/api/teams/communication');
      if (response.ok) {
        const data = await response.json();
        setSelectedTeam(data.team);
        if (data.team.channels.length > 0) {
          setSelectedChannel(data.team.channels[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch team data:', error);
    }
  };

  const setupWebSocket = () => {
    const ws = new WebSocket(
      `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`,
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        handleNewMessage(data.message);
      } else if (data.type === 'reaction') {
        handleNewReaction(data.reaction);
      }
    };

    return () => ws.close();
  };

  const handleNewMessage = (message: Message) => {
    if (selectedChannel && selectedTeam) {
      const updatedChannels = selectedTeam.channels.map((channel) =>
        channel.id === selectedChannel.id
          ? { ...channel, messages: [...channel.messages, message] }
          : channel,
      );
      setSelectedTeam({ ...selectedTeam, channels: updatedChannels });
      setSelectedChannel((prev) =>
        prev ? { ...prev, messages: [...prev.messages, message] } : null,
      );
    }
  };

  const handleNewReaction = (reaction: {
    messageId: string;
    emoji: string;
    userId: string;
    userName: string;
  }) => {
    if (selectedChannel && selectedTeam) {
      const updatedChannels = selectedTeam.channels.map((channel) =>
        channel.id === selectedChannel.id
          ? {
              ...channel,
              messages: channel.messages.map((msg) =>
                msg.id === reaction.messageId
                  ? {
                      ...msg,
                      reactions: [
                        ...(msg.reactions || []),
                        {
                          emoji: reaction.emoji,
                          userId: reaction.userId,
                          userName: reaction.userName,
                        },
                      ],
                    }
                  : msg,
              ),
            }
          : channel,
      );
      setSelectedTeam({ ...selectedTeam, channels: updatedChannels });
      setSelectedChannel((prev) =>
        prev
          ? {
              ...prev,
              messages: prev.messages.map((msg) =>
                msg.id === reaction.messageId
                  ? {
                      ...msg,
                      reactions: [
                        ...(msg.reactions || []),
                        {
                          emoji: reaction.emoji,
                          userId: reaction.userId,
                          userName: reaction.userName,
                        },
                      ],
                    }
                  : msg,
              ),
            }
          : null,
      );
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && uploadedFiles.length === 0) return;
    if (!selectedChannel || !selectedTeam) return;

    const messageData = {
      channelId: selectedChannel.id,
      content: newMessage,
      attachments: uploadedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    };

    try {
      const response = await fetch('/api/teams/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setNewMessage('');
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await fetch('/api/teams/messages/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, emoji }),
      });
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'coach':
        return 'text-blue-500';
      case 'athlete':
        return 'text-green-500';
      case 'parent':
        return 'text-purple-500';
      case 'admin':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  const startVideoCall = () => {
    setIsVideoCall(true);
    // Integration with video calling service would go here
  };

  if (!selectedTeam) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
        {/* Team Header */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">{selectedTeam.name}</h2>
          <p className="text-sm text-slate-400">{selectedTeam.sport}</p>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-2">CHANNELS</h3>
            <div className="space-y-1">
              {selectedTeam.channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedChannel?.id === channel.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  # {channel.name}
                </button>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="p-4 border-t border-slate-700">
            <h3 className="text-sm font-medium text-slate-400 mb-2">TEAM MEMBERS</h3>
            <div className="space-y-2">
              {selectedTeam.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{member.name.charAt(0)}</span>
                    </div>
                    {member.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{member.name}</p>
                    <p className={`text-xs ${getRoleColor(member.role)}`}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white"># {selectedChannel?.name}</h3>
            <span className="text-sm text-slate-400">
              {selectedChannel?.members.length} members
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={startVideoCall}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              onClick={() => {}}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedChannel?.messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">{message.senderName.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium ${getRoleColor(message.senderRole)}`}>
                    {message.senderName}
                  </span>
                  <span className="text-xs text-slate-400">{formatTime(message.timestamp)}</span>
                </div>

                {message.type === 'text' && <p className="text-white">{message.content}</p>}

                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg"
                      >
                        <Paperclip className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-white">{attachment.name}</span>
                        <span className="text-xs text-slate-400">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {message.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-full text-xs transition-colors"
                      >
                        {reaction.emoji} 1
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {}}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-slate-700">
          {uploadedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1"
                >
                  <span className="text-sm text-white">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Message # ${selectedChannel?.name}`}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() && uploadedFiles.length === 0}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
