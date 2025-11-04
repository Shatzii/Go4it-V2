'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Award,
  AlertTriangle,
  BookOpen,
  BarChart3,
  Calendar,
  Activity,
  FileText,
} from 'lucide-react';

interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  courseCode: string;
  overallProgress: number;
  currentGrade: number;
  predictedGrade: number;
  letterGrade: string;
  trend: 'improving' | 'stable' | 'declining';
  timeSpent: number; // hours
  lessonsCompleted: number;
  totalLessons: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  quizzesCompleted: number;
  totalQuizzes: number;
  strengths: string[];
  weaknesses: string[];
  recentActivity: ActivityItem[];
  gradeHistory: GradePoint[];
  timeByWeek: WeeklyTime[];
}

interface ActivityItem {
  date: string;
  type: 'lesson' | 'quiz' | 'assignment';
  title: string;
  score?: number;
  maxScore?: number;
}

interface GradePoint {
  date: string;
  grade: number;
  assignment: string;
}

interface WeeklyTime {
  week: string;
  hours: number;
}

export default function StudentAnalyticsDashboard() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get('userId') || 'current-user';
  
  const [analytics, setAnalytics] = useState<CourseAnalytics[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/academy/analytics/student?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data.courses || generateDemoData());
          if (data.courses && data.courses.length > 0) {
            setSelectedCourse(data.courses[0]);
          } else {
            const demo = generateDemoData();
            setAnalytics(demo);
            setSelectedCourse(demo[0]);
          }
        } else {
          const demo = generateDemoData();
          setAnalytics(demo);
          setSelectedCourse(demo[0]);
        }
      } catch (error) {
        const demo = generateDemoData();
        setAnalytics(demo);
        setSelectedCourse(demo[0]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalytics();
  }, [userId]);

  const generateDemoData = (): CourseAnalytics[] => {
    return [
      {
        courseId: '1',
        courseTitle: 'Advanced Biology',
        courseCode: 'BIO-101',
        overallProgress: 75,
        currentGrade: 87,
        predictedGrade: 89,
        letterGrade: 'B+',
        trend: 'improving',
        timeSpent: 42.5,
        lessonsCompleted: 18,
        totalLessons: 24,
        assignmentsCompleted: 12,
        totalAssignments: 16,
        quizzesCompleted: 5,
        totalQuizzes: 8,
        strengths: ['Cell Biology', 'Genetics', 'Lab Work'],
        weaknesses: ['Ecology', 'Evolution Theory'],
        recentActivity: [
          { date: '2025-01-20', type: 'quiz', title: 'Chapter 5 Quiz', score: 92, maxScore: 100 },
          { date: '2025-01-18', type: 'assignment', title: 'Lab Report #3', score: 88, maxScore: 100 },
          { date: '2025-01-15', type: 'lesson', title: 'Genetic Mutations' },
        ],
        gradeHistory: [
          { date: '2024-12-01', grade: 82, assignment: 'Quiz 1' },
          { date: '2024-12-08', grade: 85, assignment: 'Lab 1' },
          { date: '2024-12-15', grade: 84, assignment: 'Quiz 2' },
          { date: '2025-01-05', grade: 88, assignment: 'Mid-term' },
          { date: '2025-01-12', grade: 87, assignment: 'Quiz 3' },
          { date: '2025-01-18', grade: 88, assignment: 'Lab 3' },
          { date: '2025-01-20', grade: 92, assignment: 'Quiz 5' },
        ],
        timeByWeek: [
          { week: 'Week 1', hours: 3.5 },
          { week: 'Week 2', hours: 4.2 },
          { week: 'Week 3', hours: 5.1 },
          { week: 'Week 4', hours: 4.8 },
          { week: 'Week 5', hours: 6.2 },
          { week: 'Week 6', hours: 5.5 },
          { week: 'Week 7', hours: 4.9 },
          { week: 'Week 8', hours: 8.3 },
        ],
      },
      {
        courseId: '2',
        courseTitle: 'AP Calculus',
        courseCode: 'CALC-201',
        overallProgress: 60,
        currentGrade: 92,
        predictedGrade: 93,
        letterGrade: 'A-',
        trend: 'stable',
        timeSpent: 38.2,
        lessonsCompleted: 14,
        totalLessons: 24,
        assignmentsCompleted: 10,
        totalAssignments: 18,
        quizzesCompleted: 4,
        totalQuizzes: 10,
        strengths: ['Derivatives', 'Integration', 'Problem Solving'],
        weaknesses: ['Word Problems', 'Applied Calculus'],
        recentActivity: [
          { date: '2025-01-19', type: 'assignment', title: 'Integration Practice', score: 95, maxScore: 100 },
          { date: '2025-01-17', type: 'quiz', title: 'Derivatives Quiz', score: 90, maxScore: 100 },
          { date: '2025-01-14', type: 'lesson', title: 'Advanced Integration' },
        ],
        gradeHistory: [
          { date: '2024-12-02', grade: 90, assignment: 'Quiz 1' },
          { date: '2024-12-09', grade: 92, assignment: 'HW Set 1' },
          { date: '2024-12-16', grade: 91, assignment: 'Quiz 2' },
          { date: '2025-01-06', grade: 93, assignment: 'Mid-term' },
          { date: '2025-01-13', grade: 94, assignment: 'Quiz 3' },
          { date: '2025-01-19', grade: 95, assignment: 'Integration' },
        ],
        timeByWeek: [
          { week: 'Week 1', hours: 4.0 },
          { week: 'Week 2', hours: 4.5 },
          { week: 'Week 3', hours: 5.5 },
          { week: 'Week 4', hours: 5.2 },
          { week: 'Week 5', hours: 5.8 },
          { week: 'Week 6', hours: 4.9 },
          { week: 'Week 7', hours: 4.3 },
          { week: 'Week 8', hours: 4.0 },
        ],
      },
    ];
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-400';
      case 'declining':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Academic Analytics
          </h1>
          <p className="text-slate-400">Detailed insights into your learning progress and performance</p>
        </div>

        {/* Course Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {analytics.map((course) => (
            <Card
              key={course.courseId}
              className={`cursor-pointer transition-all ${
                selectedCourse?.courseId === course.courseId
                  ? 'bg-blue-600/20 border-blue-500'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => setSelectedCourse(course)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{course.courseTitle}</h3>
                    <p className="text-sm text-slate-400">{course.courseCode}</p>
                  </div>
                  <Badge className={`${course.trend === 'improving' ? 'bg-green-600/20 text-green-400' : course.trend === 'declining' ? 'bg-red-600/20 text-red-400' : 'bg-blue-600/20 text-blue-400'}`}>
                    {course.letterGrade}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">{course.overallProgress}%</span>
                  </div>
                  <Progress value={course.overallProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCourse && (
          <>
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Current Grade</span>
                    {getTrendIcon(selectedCourse.trend)}
                  </div>
                  <div className={`text-3xl font-bold ${getTrendColor(selectedCourse.trend)}`}>
                    {selectedCourse.currentGrade}%
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Predicted: {selectedCourse.predictedGrade}%
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Time Invested</span>
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-blue-400">
                    {Math.round(selectedCourse.timeSpent)}h
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Avg: {(selectedCourse.timeSpent / 8).toFixed(1)}h/week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Completion Rate</span>
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-purple-400">
                    {Math.round((selectedCourse.assignmentsCompleted / selectedCourse.totalAssignments) * 100)}%
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedCourse.assignmentsCompleted}/{selectedCourse.totalAssignments} completed
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Quiz Average</span>
                    <Award className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-orange-400">
                    {selectedCourse.currentGrade}%
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedCourse.quizzesCompleted}/{selectedCourse.totalQuizzes} taken
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics Tabs */}
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 mb-6">
                <TabsTrigger value="performance">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="time">
                  <Clock className="w-4 h-4 mr-2" />
                  Time Analysis
                </TabsTrigger>
                <TabsTrigger value="strengths">
                  <Target className="w-4 h-4 mr-2" />
                  Strengths/Weaknesses
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Calendar className="w-4 h-4 mr-2" />
                  Recent Activity
                </TabsTrigger>
              </TabsList>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Grade Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCourse.gradeHistory.map((point, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-24 text-sm text-slate-400">
                            {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-slate-300">{point.assignment}</span>
                              <span className="text-sm font-bold text-white">{point.grade}%</span>
                            </div>
                            <Progress value={point.grade} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Lessons</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-2">
                        {selectedCourse.lessonsCompleted}/{selectedCourse.totalLessons}
                      </div>
                      <Progress value={(selectedCourse.lessonsCompleted / selectedCourse.totalLessons) * 100} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-2">
                        {selectedCourse.assignmentsCompleted}/{selectedCourse.totalAssignments}
                      </div>
                      <Progress value={(selectedCourse.assignmentsCompleted / selectedCourse.totalAssignments) * 100} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Quizzes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-2">
                        {selectedCourse.quizzesCompleted}/{selectedCourse.totalQuizzes}
                      </div>
                      <Progress value={(selectedCourse.quizzesCompleted / selectedCourse.totalQuizzes) * 100} className="h-2" />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Time Analysis Tab */}
              <TabsContent value="time" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Weekly Time Investment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCourse.timeByWeek.map((week, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-20 text-sm text-slate-400">{week.week}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <Progress value={(week.hours / 10) * 100} className="h-3 flex-1 mr-3" />
                              <span className="text-sm font-bold text-white w-12 text-right">
                                {week.hours}h
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Clock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-white mb-1">
                          {formatTime(selectedCourse.timeSpent)}
                        </div>
                        <p className="text-slate-400">Total Time Invested</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Calendar className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-white mb-1">
                          {formatTime(selectedCourse.timeSpent / 8)}
                        </div>
                        <p className="text-slate-400">Average per Week</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Strengths/Weaknesses Tab */}
              <TabsContent value="strengths" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-green-600/10 border-green-600/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-400" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {selectedCourse.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center gap-3 text-green-300">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-600/10 border-red-600/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {selectedCourse.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-center gap-3 text-red-300">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Recent Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCourse.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              activity.type === 'lesson' ? 'bg-blue-600/20' : 
                              activity.type === 'quiz' ? 'bg-green-600/20' : 'bg-purple-600/20'
                            }`}>
                              {activity.type === 'lesson' && <BookOpen className="w-5 h-5 text-blue-400" />}
                              {activity.type === 'quiz' && <Target className="w-5 h-5 text-green-400" />}
                              {activity.type === 'assignment' && <FileText className="w-5 h-5 text-purple-400" />}
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{activity.title}</h4>
                              <p className="text-sm text-slate-400">
                                {new Date(activity.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          {activity.score !== undefined && (
                            <Badge className={`${
                              activity.score >= 90 ? 'bg-green-600/20 text-green-400' :
                              activity.score >= 80 ? 'bg-blue-600/20 text-blue-400' :
                              'bg-yellow-600/20 text-yellow-400'
                            }`}>
                              {activity.score}/{activity.maxScore}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
