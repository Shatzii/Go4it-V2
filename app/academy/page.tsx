// Clean rebuilt Academy page (server component) after prior corruption
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Users, Calendar, BookOpen, Star, CheckCircle } from 'lucide-react';
import { CourseCard } from './_components/course-card';

interface DisplayCourse {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  subjects: string[];
  progress: number;
  nextLesson: string;
  estimatedTime: string;
  enrolled: boolean;
  instructor: string;
}

async function loadCourses(): Promise<DisplayCourse[]> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || '';
    const res = await fetch(`${base}/api/academy/courses`, { cache: 'no-store' });
    if (!res.ok) throw new Error('failed');
    const data = await res.json();
    return (data.courses || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description || 'Course description pending',
      difficulty: c.difficulty || 'Intermediate',
      subjects: Array.isArray(c.subjects) ? c.subjects : [],
      progress: 0,
      nextLesson: 'Introduction',
      estimatedTime: '45 mins',
      enrolled: false,
      instructor: c.instructor || 'Staff',
    }));
  } catch {
    return [];
  }
}

export const dynamic = 'force-dynamic';

async function loadEnrollments(studentId: string) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || '';
    const res = await fetch(
      `${base}/api/academy/enrollments?studentId=${encodeURIComponent(studentId)}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return new Set<string>();
    const data = await res.json();
    return new Set<string>(data.courseIds || []);
  } catch {
    return new Set<string>();
  }
}

async function getCurrentUserId() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/auth/me`, {
      cache: 'no-store',
    });
    if (!res.ok) return undefined;
    const data = await res.json();
    return data?.user?.id as string | undefined;
  } catch {
    return undefined;
  }
}

export default async function AcademyPage() {
  const [courses, userId] = await Promise.all([loadCourses(), getCurrentUserId()]);
  const enrolledIds = userId ? await loadEnrollments(userId) : new Set<string>();
  const merged = courses.map((c) => ({ ...c, enrolled: enrolledIds.has(c.id) }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
            Go4It Academy
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Dynamic curriculum for student athletes. Real courses will appear below once seeded.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <a href="/academy/dashboard">
            <Card className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <GraduationCap className="w-5 h-5" /> My Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-indigo-100">
                  Personalized dashboard with courses, assignments, and progress tracking.
                </p>
                <Button className="w-full mt-4 bg-indigo-800 hover:bg-indigo-900">
                  Open Dashboard
                </Button>
              </CardContent>
            </Card>
          </a>
          <a href="/academy/enroll">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5" /> Course Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-100">
                  Browse and enroll in courses with smart filtering and recommendations.
                </p>
                <Button className="w-full mt-4 bg-blue-800 hover:bg-blue-900">
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          </a>
          <a href="/academy/create-class">
            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="w-5 h-5" /> Create Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-100">
                  Advanced course builder with curriculum templates and assessment tools.
                </p>
                <Button className="w-full mt-4 bg-purple-800 hover:bg-purple-900">
                  Start Creating
                </Button>
              </CardContent>
            </Card>
          </a>
          <a href="/academy/daily-schedule">
            <Card className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5" /> Schedule & Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-100">
                  Live class sessions, office hours, and interactive learning experiences.
                </p>
                <Button className="w-full mt-4 bg-green-800 hover:bg-green-900">
                  View Schedule
                </Button>
              </CardContent>
            </Card>
          </a>
        </div>

        {/* AI Study Companion Feature Highlight */}
        <div className="mb-16">
          <a href="/academy/ai-companion">
            <Card className="bg-gradient-to-r from-purple-800 via-purple-700 to-blue-800 hover:from-purple-900 hover:via-purple-800 hover:to-blue-900 transition-all cursor-pointer border border-purple-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl flex items-center gap-2">
                        🤖 AI Study Companion
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                          NEW
                        </Badge>
                      </CardTitle>
                      <p className="text-purple-100 text-sm mt-1">
                        Your intelligent learning partner powered by advanced AI
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-purple-100">
                    <p className="text-sm font-medium">Personalized tutoring</p>
                    <p className="text-xs opacity-80">Study recommendations</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-purple-100">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">24/7 homework help</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-100">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Personalized study plans</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-100">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Smart progress tracking</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                  Start Learning with AI →
                </Button>
              </CardContent>
            </Card>
          </a>
        </div>

        {/* Quick Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Enhanced Student Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Smart course recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Progress tracking with analytics</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Interactive assignment submission</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Real-time grade updates</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Powerful Course Creation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Curriculum template library</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Multimedia content integration</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Automated assessment tools</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Student progress monitoring</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Streamlined Administration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Bulk student enrollment</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Automated scheduling</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Performance analytics</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">Communication tools</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Courses */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {merged.length === 0 && (
              <div className="col-span-2 text-center text-slate-400 text-sm">
                No courses yet. Seeding…
              </div>
            )}
            {merged.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Optionally reused later for Suspense fallback
export function CoursesSkeleton() {
  return (
    <div className="mb-10 animate-pulse">
      <h2 className="text-2xl font-semibold mb-6">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 rounded-lg bg-slate-800/40 border border-slate-700" />
        ))}
      </div>
    </div>
  );
}
