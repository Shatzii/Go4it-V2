'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Target, TrendingUp, Clock, Award } from 'lucide-react';

interface DashboardData {
  user: {
    id: number;
    username: string;
    sport: string;
    role: string;
  };
  statistics: {
    total_analyses: number;
    average_gar_score: number;
    total_xp: number;
    completed_skills: number;
    current_tier: number;
  };
  recent_analyses: Array<{
    id: number;
    sport: string;
    gar_score: string;
    created_at: string;
    feedback: string;
  }>;
  recent_achievements: Array<{
    title: string;
    description: string;
    type: string;
    earned_at: string;
    icon: string;
  }>;
  upcoming_goals: Array<{
    title: string;
    description: string;
    target?: number;
    current?: number;
    type: string;
    estimated_time: string;
    icon: string;
  }>;
}

export function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/auth';
        return;
      }

      const response = await fetch('/api/dashboard/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Error loading dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="p-6">No dashboard data available</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {dashboardData.user.username}!
        </h1>
        <p className="text-muted-foreground">
          Ready to elevate your {dashboardData.user.sport} performance today?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GAR Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.statistics.average_gar_score}</div>
            <p className="text-xs text-muted-foreground">Average performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.statistics.total_xp}</div>
            <p className="text-xs text-muted-foreground">Tier {dashboardData.statistics.current_tier}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.statistics.total_analyses}</div>
            <p className="text-xs text-muted-foreground">Videos analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.statistics.completed_skills}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Video Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.recent_analyses.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recent_analyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{analysis.sport} Analysis</div>
                    <div className="text-sm text-muted-foreground">{analysis.feedback}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{analysis.gar_score}/100</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No video analyses yet</p>
              <button
                onClick={() => window.location.href = '/upload'}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Upload Your First Video
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.recent_achievements.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recent_achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {achievement.type}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Keep training to unlock achievements!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.upcoming_goals.map((goal, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{goal.icon}</div>
                    <div className="font-medium">{goal.title}</div>
                  </div>
                  <Badge variant="outline">{goal.estimated_time}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                {goal.target && goal.current && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.current}/{goal.target}</span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}