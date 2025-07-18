'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, BarChart3, Star, Award } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface PerformanceAnalytics {
  overall_progress: number;
  average_gar_score: number;
  improvement_trend: string;
  recent_scores: number[];
  strengths: string[];
  areas_for_improvement: string[];
  total_sessions: number;
  score_distribution: {
    excellent: number;
    good: number;
    average: number;
    needs_improvement: number;
  };
}

function PerformancePageComponent() {
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30');

  useEffect(() => {
    loadPerformanceAnalytics();
  }, [timeframe]);

  const loadPerformanceAnalytics = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        window.location.href = '/auth';
        return;
      }

      const response = await fetch(`/api/performance/analytics?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to load performance analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading performance analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-6">No performance data available</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
          <p className="text-muted-foreground">
            Track your athletic development and improvement over time
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="strengths">Strengths & Areas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average GAR Score</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.average_gar_score}</div>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overall_progress}%</div>
                  <p className="text-xs text-muted-foreground">improvement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.total_sessions}</div>
                  <p className="text-xs text-muted-foreground">analyzed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Trend</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{analytics.improvement_trend}</div>
                  <p className="text-xs text-muted-foreground">direction</p>
                </CardContent>
              </Card>
            </div>

            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Excellent (90-100)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(analytics.score_distribution.excellent / analytics.total_sessions) * 100} className="w-32" />
                      <span className="text-sm font-medium">{analytics.score_distribution.excellent}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Good (75-89)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(analytics.score_distribution.good / analytics.total_sessions) * 100} className="w-32" />
                      <span className="text-sm font-medium">{analytics.score_distribution.good}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average (60-74)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(analytics.score_distribution.average / analytics.total_sessions) * 100} className="w-32" />
                      <span className="text-sm font-medium">{analytics.score_distribution.average}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Needs Improvement (0-59)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(analytics.score_distribution.needs_improvement / analytics.total_sessions) * 100} className="w-32" />
                      <span className="text-sm font-medium">{analytics.score_distribution.needs_improvement}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.recent_scores.map((score, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Session {analytics.recent_scores.length - index}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={score} className="w-32" />
                        <span className="text-sm font-medium">{score.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strengths" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.strengths.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.strengths.map((strength, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No strengths identified yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.areas_for_improvement.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.areas_for_improvement.map((area, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No areas for improvement identified</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function PerformancePage() {
  return (
    <ErrorBoundary>
      <PerformancePageComponent />
    </ErrorBoundary>
  );
}