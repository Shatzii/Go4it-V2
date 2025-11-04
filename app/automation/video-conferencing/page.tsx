'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Video,
  Calendar,
  Clock,
  Users,
  Plus,
  Play,
  Download,
  Copy,
  CheckCircle,
  Loader2,
  Camera,
  Mic,
  Monitor,
} from 'lucide-react';

interface Session {
  id: number;
  title: string;
  participant: string;
  scheduledAt: string;
  duration: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  recordingUrl?: string;
  meetingUrl: string;
}

export default function VideoConferencingPage() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      title: 'QB Technique Review',
      participant: 'Jordan Matthews',
      scheduledAt: '2025-11-05 14:00',
      duration: 60,
      status: 'scheduled',
      meetingUrl: 'https://meet.go4it.app/qb-review-123',
    },
    {
      id: 2,
      title: 'Film Analysis Session',
      participant: 'Marcus Johnson',
      scheduledAt: '2025-11-04 10:30',
      duration: 45,
      status: 'completed',
      recordingUrl: 'https://recordings.go4it.app/film-analysis-456.mp4',
      meetingUrl: 'https://meet.go4it.app/film-456',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const createSession = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/video-conferencing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Coaching Session',
          scheduledAt: new Date().toISOString(),
          duration: 60,
        }),
      });
      if (response.ok) {
        const newSession = await response.json();
        setSessions([newSession, ...sessions]);
      }
    } catch (error) {
      // Failed to create session
    } finally {
      setLoading(false);
    }
  };

  const copyMeetingLink = (sessionId: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statusConfig = {
    scheduled: { color: 'bg-blue-500', text: 'Scheduled' },
    live: { color: 'bg-red-500', text: 'Live', pulse: true },
    completed: { color: 'bg-green-500', text: 'Completed' },
    cancelled: { color: 'bg-slate-500', text: 'Cancelled' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              Video <span className="text-[#00D4FF]">Conferencing</span>
            </h1>
            <p className="text-slate-400">
              Remote coaching sessions with built-in recording and screen sharing
            </p>
          </div>
          <Button
            onClick={createSession}
            disabled={loading}
            className="bg-[#00D4FF] text-slate-950 hover:bg-[#00D4FF]/90"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Schedule Session
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Sessions</p>
                  <p className="text-3xl font-black text-white mt-1">342</p>
                </div>
                <Video className="w-8 h-8 text-[#00D4FF]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Upcoming</p>
                  <p className="text-3xl font-black text-white mt-1">
                    {sessions.filter((s) => s.status === 'scheduled').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Hours</p>
                  <p className="text-3xl font-black text-white mt-1">487</p>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Athletes Coached</p>
                  <p className="text-3xl font-black text-white mt-1">127</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upcoming">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Upcoming Sessions Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Scheduled Coaching Sessions</CardTitle>
                <CardDescription>Manage and join upcoming video sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions
                    .filter((s) => s.status === 'scheduled' || s.status === 'live')
                    .map((session) => {
                      const config = statusConfig[session.status];
                      return (
                        <div
                          key={session.id}
                          className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-[#00D4FF]/30 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00D4FF]/20 to-purple-500/20 flex items-center justify-center">
                                <Video className="w-6 h-6 text-[#00D4FF]" />
                              </div>
                              <div>
                                <div className="font-bold text-white">{session.title}</div>
                                <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {session.participant}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {session.scheduledAt}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {session.duration} min
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={`${config.color} text-white ${config.pulse ? 'animate-pulse' : ''}`}>
                                {config.text}
                              </Badge>
                              <Button
                                size="sm"
                                onClick={() => copyMeetingLink(session.id, session.meetingUrl)}
                                variant="outline"
                                className="border-slate-700"
                              >
                                {copiedId === session.id ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy Link
                                  </>
                                )}
                              </Button>
                              {session.status === 'live' ? (
                                <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                                  <Play className="w-4 h-4 mr-1" />
                                  Join Now
                                </Button>
                              ) : (
                                <Button size="sm" className="bg-[#00D4FF] text-slate-950">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {sessions.filter((s) => s.status === 'scheduled' || s.status === 'live').length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No Upcoming Sessions</h3>
                      <p className="text-slate-400 mb-4">Schedule a new coaching session to get started</p>
                      <Button onClick={createSession} className="bg-[#00D4FF] text-slate-950">
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule Session
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recordings Tab */}
          <TabsContent value="recordings" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Session Recordings</CardTitle>
                <CardDescription>Access past coaching session recordings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions
                    .filter((s) => s.status === 'completed' && s.recordingUrl)
                    .map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <Video className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <div className="font-bold text-white">{session.title}</div>
                            <div className="text-sm text-slate-400 mt-1">
                              {session.participant} • {session.scheduledAt} • {session.duration} min
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="border-slate-700">
                            <Play className="w-4 h-4 mr-1" />
                            Watch
                          </Button>
                          <Button size="sm" className="bg-[#00D4FF] text-slate-950">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Video Conferencing Settings</CardTitle>
                <CardDescription>Configure default settings for coaching sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white">Default Session Duration</Label>
                  <Input
                    type="number"
                    defaultValue={60}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Auto-Record Sessions</Label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-slate-400">
                      Automatically record all coaching sessions
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Default Video Quality</Label>
                  <select className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                    <option>1080p HD</option>
                    <option>720p</option>
                    <option>480p</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                  <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                    <Camera className="w-8 h-8 text-[#00D4FF] mx-auto mb-2" />
                    <div className="text-sm font-medium text-white">Camera</div>
                    <div className="text-xs text-slate-400 mt-1">HD Video Enabled</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                    <Mic className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-sm font-medium text-white">Microphone</div>
                    <div className="text-xs text-slate-400 mt-1">Noise Cancellation On</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                    <Monitor className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-sm font-medium text-white">Screen Share</div>
                    <div className="text-xs text-slate-400 mt-1">Ready</div>
                  </div>
                </div>

                <Button className="w-full bg-[#00D4FF] text-slate-950 hover:bg-[#00D4FF]/90 mt-4">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
