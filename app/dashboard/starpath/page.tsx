'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Award,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface StarPathData {
  athleteInfo: {
    name: string;
    sport: string;
    gradYear: number;
    starRating: number;
  };
  currentMetrics: {
    ari: number;
    garScore: number;
    behaviorScore: number;
    ncaaStatus: string;
  };
  latestAudit: {
    date: string;
    coreGpa: number;
    coreCoursesCompleted: number;
    coreCoursesRequired: number;
    subjectGaps: string[];
    ncaaRiskLevel: string;
  } | null;
  improvementPlan: {
    currentWeek: number;
    totalWeeks: number;
    tasksComplete: number;
    tasksTotal: number;
    upcomingTasks: Array<{
      id: string;
      title: string;
      category: string;
      dueDate: string;
      priority: string;
    }>;
  };
  nextSteps: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    estimatedTime: string;
  }>;
  recommendations: {
    nbaReadiness: string;
    nflReadiness: string;
    academicFocus: string[];
    athleticFocus: string[];
  };
}

export default function AthleteStarPathDashboard() {
  const [data, setData] = useState<StarPathData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStarPathSummary();
  }, []);

  const fetchStarPathSummary = async () => {
    try {
      setLoading(true);
      // In production, get athleteId from auth session
      const athleteId = 'current-user-id';
      const response = await fetch(`/api/starpath/summary?athleteId=${athleteId}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      // Failed to fetch StarPath summary
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getNcaaStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'needs-review':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <FileText className="w-4 h-4" />;
      case 'athletic':
        return <Award className="w-4 h-4" />;
      case 'behavioral':
        return <Target className="w-4 h-4" />;
      default:
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your StarPath...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
          <Button onClick={fetchStarPathSummary} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {data.athleteInfo.name}&apos;s StarPath
          </h1>
          <p className="text-gray-600 mt-1">
            {data.athleteInfo.sport} • Class of {data.athleteInfo.gradYear} •{' '}
            {'⭐'.repeat(data.athleteInfo.starRating)} Star Rating
          </p>
        </div>
        <Badge className={getNcaaStatusColor(data.currentMetrics.ncaaStatus)}>
          NCAA: {data.currentMetrics.ncaaStatus.replace('-', ' ').toUpperCase()}
        </Badge>
      </div>

      {/* Three Meters - Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ARI Meter */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-sm font-medium text-gray-600">
              Academic Rigor Index
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 56 * (1 - data.currentMetrics.ari / 100)
                  }`}
                  className={getScoreBgColor(data.currentMetrics.ari).replace('bg-', 'text-')}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(
                      data.currentMetrics.ari
                    )}`}
                  >
                    {data.currentMetrics.ari}
                  </div>
                  <div className="text-xs text-gray-600">/ 100</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-center text-gray-600">
              GPA + Course Completion + Subject Balance
            </p>
          </CardContent>
        </Card>

        {/* GAR Meter */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-sm font-medium text-gray-600">
              Game Athletic Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 56 * (1 - data.currentMetrics.garScore / 100)
                  }`}
                  className={getScoreBgColor(data.currentMetrics.garScore).replace(
                    'bg-',
                    'text-'
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(
                      data.currentMetrics.garScore
                    )}`}
                  >
                    {data.currentMetrics.garScore}
                  </div>
                  <div className="text-xs text-gray-600">/ 100</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-center text-gray-600">
              Pro Potential + Skills + Measurables
            </p>
          </CardContent>
        </Card>

        {/* Behavior Meter */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-sm font-medium text-gray-600">
              Behavior Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 56 * (1 - data.currentMetrics.behaviorScore / 100)
                  }`}
                  className={getScoreBgColor(data.currentMetrics.behaviorScore).replace(
                    'bg-',
                    'text-'
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(
                      data.currentMetrics.behaviorScore
                    )}`}
                  >
                    {data.currentMetrics.behaviorScore}
                  </div>
                  <div className="text-xs text-gray-600">/ 100</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-center text-gray-600">
              Discipline + Leadership + Character
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Audit Summary */}
      {data.latestAudit && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Transcript Audit</CardTitle>
            <CardDescription>
              Completed on {new Date(data.latestAudit.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Core GPA</div>
                <div className="text-2xl font-bold">{data.latestAudit.coreGpa}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Core Courses</div>
                <div className="text-2xl font-bold">
                  {data.latestAudit.coreCoursesCompleted} /{' '}
                  {data.latestAudit.coreCoursesRequired}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">NCAA Risk</div>
                <Badge
                  className={
                    data.latestAudit.ncaaRiskLevel === 'low'
                      ? 'bg-green-500'
                      : data.latestAudit.ncaaRiskLevel === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }
                >
                  {data.latestAudit.ncaaRiskLevel}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600">Course Progress</div>
                <Progress
                  value={
                    (data.latestAudit.coreCoursesCompleted /
                      data.latestAudit.coreCoursesRequired) *
                    100
                  }
                  className="mt-2"
                />
              </div>
            </div>

            {data.latestAudit.subjectGaps.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Subject Areas Needing Attention:
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.latestAudit.subjectGaps.map((gap, index) => (
                    <Badge key={index} variant="outline" className="bg-yellow-50">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {gap}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              View Full Audit Report
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 30-Day Improvement Plan Progress */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Improvement Plan</CardTitle>
          <CardDescription>
            Week {data.improvementPlan.currentWeek} of {data.improvementPlan.totalWeeks}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {data.improvementPlan.tasksComplete} / {data.improvementPlan.tasksTotal}{' '}
                tasks complete
              </span>
            </div>
            <Progress
              value={
                (data.improvementPlan.tasksComplete / data.improvementPlan.tasksTotal) *
                100
              }
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mb-3">
              Upcoming Tasks This Week:
            </div>
            {data.improvementPlan.upcomingTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 border-l-4 rounded ${getPriorityColor(task.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {getCategoryIcon(task.category)}
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {task.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
          <CardDescription>
            Priority actions to improve your StarPath scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.nextSteps.map((step) => (
              <div
                key={step.id}
                className={`p-4 border rounded-lg ${getPriorityColor(step.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(step.category)}
                    <div className="font-medium">{step.title}</div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {step.estimatedTime}
                    </Badge>
                    <Badge
                      className={
                        step.priority === 'high'
                          ? 'bg-red-500'
                          : step.priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }
                    >
                      {step.priority}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-700 ml-6">{step.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pro Readiness Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Pro Readiness Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">NBA Readiness:</div>
              <p className="text-sm text-gray-600">{data.recommendations.nbaReadiness}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">NFL Readiness:</div>
              <p className="text-sm text-gray-600">{data.recommendations.nflReadiness}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Academic Focus:
              </div>
              <div className="space-y-1">
                {data.recommendations.academicFocus.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Athletic Focus:
              </div>
              <div className="space-y-1">
                {data.recommendations.athleticFocus.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Ready to Accelerate Your Progress?
              </h3>
              <p className="text-blue-100">
                Schedule a 1-on-1 coaching session to create a personalized strategy
              </p>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Calendar className="w-4 h-4 mr-2" />
              Book Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Your StarPath data is updated in real-time as you
            complete courses, GAR assessments, and behavioral milestones. Check back
            regularly to track your progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
