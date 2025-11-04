'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Clock,
  CheckCircle,
  Trophy,
  TrendingUp,
  Calendar,
  GraduationCap,
  Star,
  Play,
} from 'lucide-react';

interface EnrolledCourse {
  id: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  instructor: string;
  credits: number;
  progress: number;
  currentGrade: number;
  isActive: boolean;
  enrolledAt: Date;
}

interface AcademyStats {
  totalCourses: number;
  completedCourses: number;
  averageGrade: number;
  totalCredits: number;
  studyStreak: number;
}

export default function AcademyDashboardFull() {
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState<AcademyStats>({
    totalCourses: 0,
    completedCourses: 0,
    averageGrade: 0,
    totalCredits: 0,
    studyStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch current user
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        const currentUserId = authData?.user?.id;

        if (currentUserId) {
          setUserId(currentUserId);
          await fetchEnrollments(currentUserId);
        } else {
          // Demo mode
          setEnrollments(getDemoEnrollments());
          setStats(getDemoStats());
        }
      } catch {
        setEnrollments(getDemoEnrollments());
        setStats(getDemoStats());
      } finally {
        setLoading(false);
      }
    };

    // Get user ID from session/auth
    fetchUserData();
  }, []);

  const fetchEnrollments = async (uid: string) => {
    try {
      const response = await fetch(`/api/academy/enroll?userId=${uid}`);
      const data = await response.json();
      setEnrollments(data.enrollments || []);
      
      // Calculate stats
      const total = data.enrollments.length;
      const completed = data.enrollments.filter((e: EnrolledCourse) => e.progress === 100).length;
      const avgGrade =
        total > 0
          ? data.enrollments.reduce((sum: number, e: EnrolledCourse) => sum + e.currentGrade, 0) / total
          : 0;
      const credits = data.enrollments.reduce((sum: number, e: EnrolledCourse) => sum + e.credits, 0);

      setStats({
        totalCourses: total,
        completedCourses: completed,
        averageGrade: Math.round(avgGrade * 10) / 10,
        totalCredits: credits,
        studyStreak: 12, // TODO: Calculate from activity
      });
    } catch {
      setEnrollments([]);
    }
  };

  const getDemoEnrollments = (): EnrolledCourse[] => [
    {
      id: '1',
      courseId: 'bio-101',
      courseTitle: 'Advanced Biology',
      courseCode: 'BIO-101',
      instructor: 'Dr. Sarah Chen',
      credits: 4,
      progress: 75,
      currentGrade: 87,
      isActive: true,
      enrolledAt: new Date(),
    },
    {
      id: '2',
      courseId: 'calc-201',
      courseTitle: 'AP Calculus',
      courseCode: 'CALC-201',
      instructor: 'Prof. James Rodriguez',
      credits: 4,
      progress: 60,
      currentGrade: 92,
      isActive: true,
      enrolledAt: new Date(),
    },
    {
      id: '3',
      courseId: 'eng-301',
      courseTitle: 'English Literature',
      courseCode: 'ENG-301',
      instructor: 'Ms. Emily Thompson',
      credits: 3,
      progress: 85,
      currentGrade: 89,
      isActive: true,
      enrolledAt: new Date(),
    },
  ];

  const getDemoStats = (): AcademyStats => ({
    totalCourses: 3,
    completedCourses: 0,
    averageGrade: 89.3,
    totalCredits: 11,
    studyStreak: 12,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-lime-400 border-r-transparent"></div>
          <p className="text-slate-400 mt-4">Loading your academy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-lime-400 to-emerald-500 bg-clip-text text-transparent mb-2">
              Academy Dashboard
            </h1>
            <p className="text-slate-400">Track your academic progress and course performance</p>
          </div>
          <Button className="bg-lime-400 hover:bg-lime-500 text-slate-900">
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-5 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Enrolled Courses</p>
                  <p className="text-3xl font-bold text-lime-400">{stats.totalCourses}</p>
                </div>
                <BookOpen className="w-10 h-10 text-lime-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Average Grade</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.averageGrade}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Credits</p>
                  <p className="text-3xl font-bold text-purple-400">{stats.totalCredits}</p>
                </div>
                <GraduationCap className="w-10 h-10 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-emerald-400">{stats.completedCourses}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-emerald-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Study Streak</p>
                  <p className="text-3xl font-bold text-orange-400">{stats.studyStreak} days</p>
                </div>
                <Trophy className="w-10 h-10 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Courses */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-lime-400" />
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="bg-slate-900/50 border-slate-700 hover:border-lime-400/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {enrollment.courseCode}
                        </Badge>
                        <h3 className="font-bold text-white">{enrollment.courseTitle}</h3>
                        <p className="text-sm text-slate-400 mt-1">{enrollment.instructor}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-lime-400">
                          {enrollment.currentGrade}
                        </div>
                        <p className="text-xs text-slate-500">Grade</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white font-medium">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span>{enrollment.credits} Credits</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>12 weeks</span>
                        </div>
                      </div>

                      <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-lime-500/10 to-emerald-500/10 border-lime-400/30 cursor-pointer hover:border-lime-400 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lime-400">
                <Calendar className="w-5 h-5" />
                View Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">See your complete course schedule and upcoming classes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-400/30 cursor-pointer hover:border-blue-400 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <BookOpen className="w-5 h-5" />
                Course Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">Browse and enroll in new courses</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/30 cursor-pointer hover:border-purple-400 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Trophy className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">View your academic achievements and certificates</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
