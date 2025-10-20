'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  BookOpen,
  CheckCircle,
  Clock,
  Target,
  Award,
  Calendar,
  BarChart3,
  Trophy,
  Star,
} from 'lucide-react';

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  courseCode: string;
  overallProgress: number;
  lessonsCompleted: number;
  totalLessons: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  currentGrade: number;
  letterGrade: string;
  timeSpent: number; // minutes
  lastActivity: string;
  gradeHistory: Array<{
    assignment: string;
    grade: number;
    maxPoints: number;
    date: string;
  }>;
}

interface ProgressDashboardProps {
  userId: string;
}

export default function ProgressDashboard({ userId }: ProgressDashboardProps) {
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('month');

  useEffect(() => {
    loadProgressData();
  }, [userId]);

  const loadProgressData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/academy/progress?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
        if (data.courses && data.courses.length > 0) {
          setSelectedCourse(data.courses[0]);
        }
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  };

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'text-green-400';
    if (grade.startsWith('B')) return 'text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-400';
    if (grade.startsWith('D')) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getOverallStats = () => {
    if (courses.length === 0) return null;

    const totalCourses = courses.length;
    const completedCourses = courses.filter(c => c.overallProgress === 100).length;
    const avgGrade = courses.reduce((sum, c) => sum + c.currentGrade, 0) / totalCourses;
    const totalTime = courses.reduce((sum, c) => sum + c.timeSpent, 0);

    return {
      totalCourses,
      completedCourses,
      avgGrade,
      totalTime,
      completionRate: (completedCourses / totalCourses) * 100,
    };
  };

  const stats = getOverallStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Progress Dashboard</h2>
          <p className="text-slate-300">Track your academic journey and achievements</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeRange('week')}
            className="border-slate-600 text-slate-300"
          >
            This Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeRange('month')}
            className="border-slate-600 text-slate-300"
          >
            This Month
          </Button>
          <Button
            variant={timeRange === 'semester' ? 'default' : 'outline'}
            onClick={() => setTimeRange('semester')}
            className="border-slate-600 text-slate-300"
          >
            This Semester
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Courses Completed</p>
                  <p className="text-2xl font-bold text-white">{stats.completedCourses}/{stats.totalCourses}</p>
                </div>
                <Trophy className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 border-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Average Grade</p>
                  <p className="text-2xl font-bold text-white">{stats.avgGrade.toFixed(1)}%</p>
                  <p className="text-green-200 text-sm">{getLetterGrade(stats.avgGrade)}</p>
                </div>
                <Award className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Time Studied</p>
                  <p className="text-2xl font-bold text-white">{formatTime(stats.totalTime)}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-600 to-orange-700 border-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.completionRate.toFixed(1)}%</p>
                </div>
                <Target className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Course Selection and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courses.map(course => (
                  <div
                    key={course.courseId}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedCourse?.courseId === course.courseId
                        ? 'bg-blue-600 border border-blue-500'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{course.courseTitle}</h3>
                        <p className="text-sm text-slate-300">{course.courseCode}</p>
                      </div>
                      <Badge className={`${getGradeColor(course.letterGrade)} bg-slate-700`}>
                        {course.letterGrade}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white">{course.overallProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={course.overallProgress} className="h-2" />
                    </div>

                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>{course.lessonsCompleted}/{course.totalLessons} lessons</span>
                      <span>{course.assignmentsCompleted}/{course.totalAssignments} assignments</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Details */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <div className="space-y-6">
              {/* Course Overview */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{selectedCourse.courseTitle}</CardTitle>
                  <p className="text-slate-300">{selectedCourse.courseCode}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{selectedCourse.overallProgress.toFixed(1)}%</div>
                      <div className="text-sm text-slate-400">Overall Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{selectedCourse.currentGrade.toFixed(1)}%</div>
                      <div className="text-sm text-slate-400">Current Grade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{selectedCourse.lessonsCompleted}</div>
                      <div className="text-sm text-slate-400">Lessons Done</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{formatTime(selectedCourse.timeSpent)}</div>
                      <div className="text-sm text-slate-400">Time Spent</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300">Course Progress</span>
                      <span className="text-white">{selectedCourse.overallProgress.toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={selectedCourse.overallProgress}
                      className={`h-3 ${getProgressColor(selectedCourse.overallProgress)}`}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Breakdown */}
              <Tabs defaultValue="assignments" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                  <TabsTrigger value="assignments" className="text-white">Assignments</TabsTrigger>
                  <TabsTrigger value="grades" className="text-white">Grade History</TabsTrigger>
                </TabsList>

                <TabsContent value="assignments">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Assignment Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Completed Assignments</span>
                          <span className="text-white">{selectedCourse.assignmentsCompleted}/{selectedCourse.totalAssignments}</span>
                        </div>
                        <Progress
                          value={(selectedCourse.assignmentsCompleted / selectedCourse.totalAssignments) * 100}
                          className="h-2"
                        />

                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Completed Lessons</span>
                          <span className="text-white">{selectedCourse.lessonsCompleted}/{selectedCourse.totalLessons}</span>
                        </div>
                        <Progress
                          value={(selectedCourse.lessonsCompleted / selectedCourse.totalLessons) * 100}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="grades">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Grade History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedCourse.gradeHistory.map((grade, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                            <div>
                              <p className="text-white font-medium">{grade.assignment}</p>
                              <p className="text-sm text-slate-400">{new Date(grade.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-bold">{grade.grade}/{grade.maxPoints}</p>
                              <p className="text-sm text-slate-400">
                                {((grade.grade / grade.maxPoints) * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        ))}
                        {selectedCourse.gradeHistory.length === 0 && (
                          <p className="text-slate-400 text-center py-4">No grades recorded yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Select a course to view detailed progress</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}