'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Plus,
  MessageCircle,
  UserPlus,
  Settings,
  Crown,
  Shield,
  Lock,
  Globe,
} from 'lucide-react';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  maxMembers: number;
  isPrivate: boolean;
  memberCount: number;
  isMember: boolean;
  role: 'member' | 'moderator' | 'admin';
  createdBy: string;
  createdAt: string;
  lastActivity: string;
}

interface GroupMessage {
  id: string;
  content: string;
  authorName: string;
  authorInitials: string;
  createdAt: string;
  messageType: 'text' | 'file' | 'image';
  fileUrl?: string;
}

export default function StudyGroups({ courseId, studentId }: { courseId: string; studentId: string }) {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    maxMembers: 10,
    isPrivate: false,
  });
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadGroups();
  }, [courseId]);

  useEffect(() => {
    if (selectedGroup) {
      loadMessages(selectedGroup.id);
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/academy/collaboration/groups?courseId=${courseId}&studentId=${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (groupId: string) => {
    try {
      const response = await fetch(`/api/academy/collaboration/groups/${groupId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.description.trim()) return;

    try {
      const response = await fetch('/api/academy/collaboration/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGroup,
          courseId,
          studentId,
        }),
      });

      if (response.ok) {
        setNewGroup({ name: '', description: '', maxMembers: 10, isPrivate: false });
        setShowCreateDialog(false);
        loadGroups();
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/academy/collaboration/groups/${groupId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });

      if (response.ok) {
        loadGroups();
        setShowJoinDialog(false);
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const sendMessage = async (groupId: string) => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/academy/collaboration/groups/${groupId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          studentId,
          messageType: 'text',
        }),
      });

      if (response.ok) {
        setNewMessage('');
        loadMessages(groupId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'moderator': return <Shield className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  const myGroups = groups.filter(group => group.isMember);
  const availableGroups = groups.filter(group => !group.isMember);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Study Groups</h1>
          <p className="text-slate-400">Collaborate with classmates in focused study groups</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <UserPlus className="w-4 h-4 mr-2" />
                Browse Groups
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Available Study Groups</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {availableGroups.length > 0 ? (
                  availableGroups.map(group => (
                    <Card key={group.id} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">{group.name}</h3>
                          <div className="flex items-center gap-2">
                            {group.isPrivate ? (
                              <Lock className="w-4 h-4 text-red-400" />
                            ) : (
                              <Globe className="w-4 h-4 text-green-400" />
                            )}
                            <Badge variant="outline" className="border-slate-500 text-slate-300">
                              {group.memberCount}/{group.maxMembers}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{group.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Created by {group.createdBy}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => joinGroup(group.id)}
                            disabled={group.memberCount >= group.maxMembers}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {group.memberCount >= group.maxMembers ? 'Full' : 'Join'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">No available groups to join.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create Study Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Group Name</label>
                  <Input
                    value={newGroup.name}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter group name..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <Textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the group's focus and goals..."
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Max Members</label>
                    <Input
                      type="number"
                      min="2"
                      max="50"
                      value={newGroup.maxMembers}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 10 }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    <input
                      type="checkbox"
                      id="private"
                      checked={newGroup.isPrivate}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, isPrivate: e.target.checked }))}
                      className="text-blue-600"
                    />
                    <label htmlFor="private" className="text-sm text-slate-300">
                      Private Group
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={createGroup} className="bg-blue-600 hover:bg-blue-700">
                    Create Group
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    className="border-slate-600 text-slate-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* My Groups */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">My Study Groups</h2>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">Loading groups...</p>
          </div>
        ) : myGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map(group => (
              <Card
                key={group.id}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 cursor-pointer transition-colors"
                onClick={() => setSelectedGroup(group)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{group.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(group.role)}
                      {group.isPrivate ? (
                        <Lock className="w-4 h-4 text-red-400" />
                      ) : (
                        <Globe className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">{group.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Users className="w-4 h-4" />
                        {group.memberCount}/{group.maxMembers}
                      </div>
                      <div className="text-slate-400">
                        {formatDate(group.lastActivity)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="text-center py-8">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">You haven't joined any study groups yet.</p>
              <Button onClick={() => setShowJoinDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                Browse Available Groups
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Group Chat Modal */}
      {selectedGroup && (
        <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-white text-xl">{selectedGroup.name}</DialogTitle>
                  <p className="text-slate-400 text-sm">{selectedGroup.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getRoleIcon(selectedGroup.role)}
                  <Badge variant="outline" className="border-slate-500 text-slate-300">
                    {selectedGroup.memberCount} members
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="flex flex-col h-96">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.length > 0 ? (
                  messages.map(message => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-slate-600 text-xs">
                          {message.authorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{message.authorName}</span>
                          <span className="text-slate-400 text-xs">{formatDate(message.createdAt)}</span>
                        </div>
                        <p className="text-slate-300">{message.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="border-t border-slate-700 p-4">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(selectedGroup.id);
                      }
                    }}
                  />
                  <Button
                    onClick={() => sendMessage(selectedGroup.id)}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}