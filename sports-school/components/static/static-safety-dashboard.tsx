'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function StaticSafetyDashboard() {
  // Mock static data for demonstration
  const staticStats = {
    overallSafetyScore: 85,
    totalPlatforms: 5,
    activePlatforms: 3,
    recentAlerts: 2,
    resolvedIssues: 8,
  };

  const staticRecentActivity = [
    {
      id: '1',
      platform: 'Instagram',
      activity: 'Posted a photo with friends',
      timestamp: '2024-01-15T14:30:00Z',
      riskLevel: 'low',
      status: 'approved',
    },
    {
      id: '2',
      platform: 'TikTok',
      activity: 'Watched educational videos',
      timestamp: '2024-01-15T12:45:00Z',
      riskLevel: 'low',
      status: 'approved',
    },
    {
      id: '3',
      platform: 'Discord',
      activity: 'Joined a gaming server',
      timestamp: '2024-01-15T09:15:00Z',
      riskLevel: 'medium',
      status: 'flagged',
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'flagged':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Safety Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Safety Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-green-600">
                {staticStats.overallSafetyScore}%
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <Progress value={staticStats.overallSafetyScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {staticStats.activePlatforms}/{staticStats.totalPlatforms}
            </div>
            <p className="text-sm text-gray-600 mt-1">Monitored platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{staticStats.recentAlerts}</div>
            <p className="text-sm text-gray-600 mt-1">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Resolved Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{staticStats.resolvedIssues}</div>
            <p className="text-sm text-gray-600 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staticRecentActivity.map((activity) => {
              const StatusIcon = getStatusIcon(activity.status);

              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <StatusIcon
                      className={`w-5 h-5 ${
                        activity.status === 'approved'
                          ? 'text-green-500'
                          : activity.status === 'flagged'
                            ? 'text-orange-500'
                            : 'text-gray-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{activity.platform}</span>
                      <Badge variant="outline" className="text-xs">
                        {activity.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{activity.activity}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <Badge variant={activity.status === 'approved' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
