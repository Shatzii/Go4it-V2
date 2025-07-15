'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Award, 
  Brain,
  BookOpen,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface LearningMetrics {
  totalHours: number;
  completedLessons: number;
  averageScore: number;
  streakDays: number;
  improvement: number;
  timeSpent: {
    subject: string;
    hours: number;
    color: string;
  }[];
  progressBySubject: {
    subject: string;
    progress: number;
    target: number;
    color: string;
  }[];
  weeklyActivity: {
    date: string;
    hours: number;
    lessons: number;
    score: number;
  }[];
  performanceByTopic: {
    topic: string;
    score: number;
    attempts: number;
    improvement: number;
  }[];
  learningGoals: {
    id: string;
    title: string;
    progress: number;
    target: number;
    deadline: string;
    status: 'on-track' | 'behind' | 'completed';
  }[];
}

export function LearningAnalytics() {
  const [metrics, setMetrics] = useState<LearningMetrics | null>(null);
  const [timeRange, setTimeRange] = useState('week');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, selectedSubject]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/learning?timeRange=${timeRange}&subject=${selectedSubject}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Load mock data for demo
      setMetrics(getMockMetrics());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockMetrics = (): LearningMetrics => ({
    totalHours: 145,
    completedLessons: 87,
    averageScore: 85,
    streakDays: 12,
    improvement: 15,
    timeSpent: [
      { subject: 'Mathematics', hours: 45, color: '#3b82f6' },
      { subject: 'Science', hours: 38, color: '#10b981' },
      { subject: 'English', hours: 32, color: '#8b5cf6' },
      { subject: 'History', hours: 30, color: '#f59e0b' }
    ],
    progressBySubject: [
      { subject: 'Mathematics', progress: 85, target: 90, color: '#3b82f6' },
      { subject: 'Science', progress: 78, target: 85, color: '#10b981' },
      { subject: 'English', progress: 92, target: 95, color: '#8b5cf6' },
      { subject: 'History', progress: 67, target: 80, color: '#f59e0b' }
    ],
    weeklyActivity: [
      { date: '2024-01-01', hours: 3.5, lessons: 4, score: 82 },
      { date: '2024-01-02', hours: 4.2, lessons: 5, score: 85 },
      { date: '2024-01-03', hours: 2.8, lessons: 3, score: 78 },
      { date: '2024-01-04', hours: 5.1, lessons: 6, score: 90 },
      { date: '2024-01-05', hours: 3.7, lessons: 4, score: 87 },
      { date: '2024-01-06', hours: 4.5, lessons: 5, score: 89 },
      { date: '2024-01-07', hours: 3.9, lessons: 4, score: 84 }
    ],
    performanceByTopic: [
      { topic: 'Algebra', score: 92, attempts: 45, improvement: 12 },
      { topic: 'Geometry', score: 78, attempts: 32, improvement: 8 },
      { topic: 'Chemistry', score: 85, attempts: 38, improvement: 15 },
      { topic: 'Physics', score: 81, attempts: 29, improvement: 10 },
      { topic: 'Literature', score: 89, attempts: 42, improvement: 7 }
    ],
    learningGoals: [
      { id: '1', title: 'Complete Algebra Course', progress: 85, target: 100, deadline: '2024-02-15', status: 'on-track' },
      { id: '2', title: 'Improve Science Grades', progress: 60, target: 100, deadline: '2024-01-30', status: 'behind' },
      { id: '3', title: 'Read 5 Classic Novels', progress: 100, target: 100, deadline: '2024-01-15', status: 'completed' }
    ]
  });

  const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${Math.round(hours * 10) / 10}h`;
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 10) return 'text-green-600';
    if (improvement > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'behind': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportData = () => {
    // Create and download CSV
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Subject,Hours,Progress,Score\n" +
      metrics?.timeSpent.map(item => 
        `${item.subject},${item.hours},${metrics.progressBySubject.find(p => p.subject === item.subject)?.progress || 0},${metrics.averageScore}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "learning_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Learning Analytics</h1>
          <p className="text-gray-600">Track your learning progress and performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadAnalytics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold">{formatHours(metrics.totalHours)}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
            <div className={`flex items-center mt-2 ${getImprovementColor(metrics.improvement)}`}>
              {getImprovementIcon(metrics.improvement)}
              <span className="text-sm ml-1">+{metrics.improvement}% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Lessons</p>
                <p className="text-2xl font-bold">{metrics.completedLessons}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm ml-1">Great progress!</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold">{metrics.averageScore}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-purple-600">
              <Award className="w-4 h-4" />
              <span className="text-sm ml-1">Above average</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Streak</p>
                <p className="text-2xl font-bold">{metrics.streakDays} days</p>
              </div>
              <Brain className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2 text-orange-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm ml-1">Keep it up!</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Spent by Subject</CardTitle>
                <CardDescription>Distribution of learning time across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics.timeSpent}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="hours"
                      label={({ subject, hours }) => `${subject}: ${formatHours(hours)}`}
                    >
                      {metrics.timeSpent.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress by Subject</CardTitle>
                <CardDescription>Current progress towards subject goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.progressBySubject.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{subject.subject}</span>
                      <span className="text-sm text-gray-600">{subject.progress}% / {subject.target}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Your learning activity over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value, name) => [
                      name === 'hours' ? formatHours(value as number) : value,
                      name === 'hours' ? 'Hours' : name === 'lessons' ? 'Lessons' : 'Score'
                    ]}
                  />
                  <Area type="monotone" dataKey="hours" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="lessons" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Topic</CardTitle>
              <CardDescription>Your performance across different learning topics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.performanceByTopic}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" name="Average Score" />
                  <Bar dataKey="improvement" fill="#10b981" name="Improvement" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Topic Performance Details</CardTitle>
              <CardDescription>Detailed breakdown of your performance by topic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.performanceByTopic.map((topic) => (
                  <div key={topic.topic} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{topic.topic}</h4>
                      <p className="text-sm text-gray-600">{topic.attempts} attempts</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{topic.score}%</div>
                      <div className={`text-sm flex items-center ${getImprovementColor(topic.improvement)}`}>
                        {getImprovementIcon(topic.improvement)}
                        <span className="ml-1">+{topic.improvement}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Goals</CardTitle>
              <CardDescription>Track your progress towards learning objectives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {metrics.learningGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{goal.title}</h4>
                    <Badge className={getGoalStatusColor(goal.status)}>
                      {goal.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}% / {goal.target}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                      <span>
                        {new Date(goal.deadline) > new Date() 
                          ? `${Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left`
                          : 'Overdue'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}