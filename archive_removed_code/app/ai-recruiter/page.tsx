'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bot,
  Search,
  Database,
  CheckCircle,
  Clock,
  Users,
  School,
  Zap,
  Target,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

interface DiscoveryStats {
  totalColleges: number;
  totalCoaches: number;
  aiDiscoveredCoaches: number;
  coveragePercentage: number;
}

interface DiscoveryJob {
  id: string;
  status: 'running' | 'completed' | 'failed';
  processed: number;
  discovered: number;
  updated: number;
  errors: number;
  colleges: Array<{
    id: string;
    name: string;
    contactsFound: number;
    status: string;
    error?: string;
  }>;
}

export default function AIRecruiterPage() {
  const [stats, setStats] = useState<DiscoveryStats | null>(null);
  const [currentJob, setCurrentJob] = useState<DiscoveryJob | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/ai-recruiter/discover');
      const data = await response.json();

      if (data.success) {
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const startDiscovery = async (options: { sports?: string[]; forceRefresh?: boolean } = {}) => {
    setIsRunning(true);
    setCurrentJob(null);

    try {
      const response = await fetch('/api/ai-recruiter/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sports: options.sports || ['football', 'basketball', 'baseball', 'softball'],
          forceRefresh: options.forceRefresh || false,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentJob({
          id: Date.now().toString(),
          status: 'completed',
          processed: data.results.processed,
          discovered: data.results.discovered,
          updated: data.results.updated,
          errors: data.results.errors,
          colleges: data.results.colleges,
        });

        // Refresh stats
        await fetchStats();
      } else {
        setCurrentJob({
          id: Date.now().toString(),
          status: 'failed',
          processed: 0,
          discovered: 0,
          updated: 0,
          errors: 1,
          colleges: [],
        });
      }
    } catch (error) {
      console.error('Discovery error:', error);
      setCurrentJob({
        id: Date.now().toString(),
        status: 'failed',
        processed: 0,
        discovered: 0,
        updated: 0,
        errors: 1,
        colleges: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20">
              <Bot className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Recruiting Helper</h1>
              <p className="text-slate-400">
                Automatically discover and populate coaching contacts across all college divisions
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <School className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.totalColleges}</div>
                      <div className="text-xs text-slate-400">Total Colleges</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.totalCoaches}</div>
                      <div className="text-xs text-slate-400">Total Coaches</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {stats.aiDiscoveredCoaches}
                      </div>
                      <div className="text-xs text-slate-400">AI Discovered</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-yellow-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {stats.coveragePercentage}%
                      </div>
                      <div className="text-xs text-slate-400">Coverage</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="discovery" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="discovery" className="data-[state=active]:bg-slate-700">
              <Search className="h-4 w-4 mr-2" />
              Contact Discovery
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-slate-700">
              <Database className="h-4 w-4 mr-2" />
              Progress & Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discovery" className="space-y-6">
            {/* Discovery Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI Contact Discovery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quick Discovery */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Quick Discovery</h3>
                    <p className="text-slate-400">
                      AI will discover coaching contacts for the next batch of colleges, focusing on
                      major sports programs.
                    </p>
                    <Button
                      onClick={() => startDiscovery()}
                      disabled={isRunning}
                      className="bg-purple-600 hover:bg-purple-700 w-full"
                    >
                      {isRunning ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Discovering Contacts...
                        </>
                      ) : (
                        <>
                          <Bot className="h-4 w-4 mr-2" />
                          Start AI Discovery
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Comprehensive Discovery */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Comprehensive Discovery</h3>
                    <p className="text-slate-400">
                      Full discovery including Olympic sports, assistant coaches, and specialized
                      recruiting coordinators.
                    </p>
                    <Button
                      onClick={() =>
                        startDiscovery({
                          sports: [
                            'football',
                            'basketball',
                            'baseball',
                            'softball',
                            'soccer',
                            'track',
                            'swimming',
                            'tennis',
                            'golf',
                            'volleyball',
                          ],
                          forceRefresh: true,
                        })
                      }
                      disabled={isRunning}
                      variant="outline"
                      className="border-slate-600 text-slate-300 w-full"
                    >
                      {isRunning ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Comprehensive Discovery
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* How It Works */}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">How AI Discovery Works</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• AI analyzes each college's athletic program structure</li>
                    <li>
                      • Generates realistic coaching staff profiles based on division and sport
                    </li>
                    <li>• Creates verified email formats using school domains</li>
                    <li>• Assigns appropriate recruiting territories and focus areas</li>
                    <li>• Continuously updates and maintains contact accuracy</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Current Job Progress */}
            {currentJob && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Discovery Results
                    <Badge className={getStatusColor(currentJob.status)}>
                      {currentJob.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{currentJob.processed}</div>
                      <div className="text-sm text-slate-400">Colleges Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {currentJob.discovered}
                      </div>
                      <div className="text-sm text-slate-400">New Contacts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{currentJob.updated}</div>
                      <div className="text-sm text-slate-400">Updated Contacts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{currentJob.errors}</div>
                      <div className="text-sm text-slate-400">Errors</div>
                    </div>
                  </div>

                  {currentJob.colleges.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Colleges Processed:</h4>
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {currentJob.colleges.map((college, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-slate-700/30 rounded px-3 py-2"
                          >
                            <span className="text-slate-300">{college.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-400">
                                {college.contactsFound} contacts
                              </span>
                              <Badge className={getStatusColor(college.status)} size="sm">
                                {college.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Discovery Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300">Overall Coverage</span>
                        <span className="text-white font-medium">{stats.coveragePercentage}%</span>
                      </div>
                      <Progress value={stats.coveragePercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Discovery Status</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-300">Total Institutions</span>
                            <span className="text-white">{stats.totalColleges}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">With Contact Data</span>
                            <span className="text-white">
                              {Math.round(stats.totalColleges * (stats.coveragePercentage / 100))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Remaining</span>
                            <span className="text-white">
                              {stats.totalColleges -
                                Math.round(stats.totalColleges * (stats.coveragePercentage / 100))}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Next Steps</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-300">
                            <CheckCircle className="h-4 w-4" />
                            Continue discovering remaining colleges
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <CheckCircle className="h-4 w-4" />
                            Verify and update existing contacts
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <CheckCircle className="h-4 w-4" />
                            Expand to Olympic sports coverage
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
