'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Zap,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Download,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface EnhancementJob {
  id: number;
  type: 'video' | 'profile' | 'image';
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  qualityBefore: number;
  qualityAfter?: number;
  createdAt: string;
  completedAt?: string;
}

export default function AIEnhancementPage() {
  const [jobs, setJobs] = useState<EnhancementJob[]>([
    {
      id: 1,
      type: 'video',
      name: 'QB Highlights - Jordan Matthews',
      status: 'completed',
      progress: 100,
      qualityBefore: 67,
      qualityAfter: 94,
      createdAt: '2025-11-03 14:23',
      completedAt: '2025-11-03 14:28',
    },
    {
      id: 2,
      type: 'profile',
      name: 'Marcus Johnson Profile',
      status: 'processing',
      progress: 73,
      qualityBefore: 52,
      createdAt: '2025-11-04 09:15',
    },
    {
      id: 3,
      type: 'video',
      name: 'WR Route Running Compilation',
      status: 'pending',
      progress: 0,
      qualityBefore: 71,
      createdAt: '2025-11-04 10:42',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const triggerEnhancement = async (type: string, itemId: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-enhancement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, itemId }),
      });
      if (response.ok) {
        const job = await response.json();
        setJobs([job, ...jobs]);
      }
    } catch (error) {
      // Failed to trigger enhancement
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending: { color: 'bg-slate-500', icon: Clock, text: 'Pending' },
    processing: { color: 'bg-blue-500', icon: Loader2, text: 'Processing' },
    completed: { color: 'bg-green-500', icon: CheckCircle, text: 'Completed' },
    failed: { color: 'bg-red-500', icon: AlertCircle, text: 'Failed' },
  };

  const completedJobs = jobs.filter((j) => j.status === 'completed');
  const avgImprovement =
    completedJobs.length > 0
      ? completedJobs.reduce((acc, j) => acc + ((j.qualityAfter || 0) - j.qualityBefore), 0) /
        completedJobs.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              AI <span className="text-[#00D4FF]">Enhancement</span> Engine
            </h1>
            <p className="text-slate-400">
              Automatically improve video quality, profiles, and images with AI
            </p>
          </div>
          <Button className="bg-[#00D4FF] text-slate-950 hover:bg-[#00D4FF]/90">
            <Sparkles className="w-4 h-4 mr-2" />
            New Enhancement
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Enhanced</p>
                  <p className="text-3xl font-black text-white mt-1">847</p>
                </div>
                <Zap className="w-8 h-8 text-[#00D4FF]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg Improvement</p>
                  <p className="text-3xl font-black text-white mt-1">+{avgImprovement.toFixed(0)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Processing</p>
                  <p className="text-3xl font-black text-white mt-1">
                    {jobs.filter((j) => j.status === 'processing').length}
                  </p>
                </div>
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Success Rate</p>
                  <p className="text-3xl font-black text-white mt-1">98.2%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="queue">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="queue">Enhancement Queue</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Queue Tab */}
          <TabsContent value="queue" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Active Enhancements</CardTitle>
                <CardDescription>Real-time AI processing queue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs
                    .filter((j) => j.status !== 'completed')
                    .map((job) => {
                      const config = statusConfig[job.status];
                      const Icon = config.icon;
                      return (
                        <div
                          key={job.id}
                          className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00D4FF]/20 to-purple-500/20 flex items-center justify-center">
                                {job.type === 'video' && <Video className="w-6 h-6 text-[#00D4FF]" />}
                                {job.type === 'image' && <ImageIcon className="w-6 h-6 text-purple-400" />}
                                {job.type === 'profile' && <Sparkles className="w-6 h-6 text-yellow-400" />}
                              </div>
                              <div>
                                <div className="font-bold text-white">{job.name}</div>
                                <div className="text-sm text-slate-400">
                                  Started: {job.createdAt} • Quality: {job.qualityBefore}%
                                </div>
                              </div>
                            </div>
                            <Badge className={`${config.color} text-white`}>
                              <Icon className="w-3 h-3 mr-1" />
                              {config.text}
                            </Badge>
                          </div>
                          {job.status === 'processing' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">Processing...</span>
                                <span className="text-white font-bold">{job.progress}%</span>
                              </div>
                              <Progress value={job.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {jobs.filter((j) => j.status !== 'completed').length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
                      <p className="text-slate-400">No pending enhancements in the queue</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Completed Enhancements</CardTitle>
                <CardDescription>View before/after comparisons and download results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedJobs.map((job) => {
                    const improvement = (job.qualityAfter || 0) - job.qualityBefore;
                    return (
                      <div
                        key={job.id}
                        className="p-4 bg-slate-800/50 rounded-lg border border-green-500/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                              {job.type === 'video' && <Video className="w-6 h-6 text-green-400" />}
                              {job.type === 'image' && <ImageIcon className="w-6 h-6 text-green-400" />}
                              {job.type === 'profile' && <Sparkles className="w-6 h-6 text-green-400" />}
                            </div>
                            <div>
                              <div className="font-bold text-white">{job.name}</div>
                              <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                <span>Completed: {job.completedAt}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-red-400 border-red-400/30">
                                    Before: {job.qualityBefore}%
                                  </Badge>
                                  <ArrowRight className="w-4 h-4 text-slate-500" />
                                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                                    After: {job.qualityAfter}%
                                  </Badge>
                                  <Badge className="bg-green-500/20 text-green-400">
                                    +{improvement}% improvement
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-slate-700">
                              <Play className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm" className="bg-[#00D4FF] text-slate-950">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Enhancement Analytics</CardTitle>
                <CardDescription>Performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">Videos Enhanced</div>
                    <div className="text-2xl font-black text-white">542</div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00D4FF]" style={{ width: '64%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">Profiles Enhanced</div>
                    <div className="text-2xl font-black text-white">231</div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '27%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">Images Enhanced</div>
                    <div className="text-2xl font-black text-white">74</div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: '9%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-[#00D4FF]/10 to-purple-500/10 rounded-lg border border-[#00D4FF]/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#00D4FF]/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#00D4FF]" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">AI Enhancement is Active</div>
                      <div className="text-sm text-slate-300 mt-1">
                        All videos, profiles, and images are automatically processed for maximum quality
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
