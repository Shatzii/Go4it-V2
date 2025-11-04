'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Users,
  FileText,
  Target,
  Sparkles,
  Settings,
  BarChart3,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';

// Import all the existing components
import LessonManager from '@/components/academy/LessonManager';
import QuizBuilder from '@/components/academy/QuizBuilder';
import AssignmentCreator from '@/components/academy/AssignmentCreator';
import AIContentGenerator from '@/components/academy/AIContentGenerator';
import DiscussionForum from '@/components/academy/DiscussionForum';
import ProgressDashboard from '@/components/academy/ProgressDashboard';

interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  subject: string;
  gradeLevel: string;
  enrolledStudents: number;
  status: 'active' | 'draft' | 'completed';
}

export default function CourseManagementPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('lessons');
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'teacher' | 'student'>('teacher');

  useEffect(() => {
    const loadCourse = async () => {
      try {
        // Check user role
        const roleRes = await fetch('/api/auth/me');
        if (roleRes.ok) {
          const userData = await roleRes.json();
          setUserRole(userData.user?.publicMetadata?.role || 'student');
        }

        // Load course data
        const courseRes = await fetch(`/api/academy/courses/${courseId}`);
        if (courseRes.ok) {
          const data = await courseRes.json();
          setCourse(data.course);
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading course management...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-400 mb-4">Course not found</p>
          <Button onClick={() => router.push('/academy/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (course.status) {
      case 'active':
        return <Badge className="bg-green-600/20 text-green-400">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-600/20 text-yellow-400">Draft</Badge>;
      case 'completed':
        return <Badge className="bg-gray-600/20 text-gray-400">Completed</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/academy/dashboard')}
            className="mb-4 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                {getStatusBadge()}
              </div>
              <p className="text-slate-400 mb-2">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.code}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.enrolledStudents} students
                </span>
                <span>{course.subject} • Grade {course.gradeLevel}</span>
              </div>
            </div>

            <Button
              onClick={() => router.push(`/academy/course-management/${courseId}/settings`)}
              variant="outline"
              className="border-slate-600"
            >
              <Settings className="w-4 h-4 mr-2" />
              Course Settings
            </Button>
          </div>
        </div>

        {/* Course Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-slate-800/50 p-1">
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="ai-generator" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Generator
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="discussion" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Discussion
            </TabsTrigger>
          </TabsList>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Lesson Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LessonManager courseId={courseId} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Assignment Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userRole === 'teacher' ? (
                  <AssignmentCreator onAssignmentCreated={() => {
                    console.log('Assignment created successfully');
                  }} />
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>Teacher access required to manage assignments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Quiz Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userRole === 'teacher' ? (
                  <QuizBuilder courseId={courseId} teacherId="current-teacher-id" />
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>Teacher access required to create quizzes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Generator Tab */}
          <TabsContent value="ai-generator" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  AI Content Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userRole === 'teacher' ? (
                  <AIContentGenerator courseId={courseId} teacherId="current-teacher-id" />
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>Teacher access required to generate content</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Student Progress Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userRole === 'teacher' ? (
                  <ProgressDashboard userId="current-user-id" />
                ) : (
                  <ProgressDashboard userId="current-user-id" />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discussion Tab */}
          <TabsContent value="discussion" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                  Course Discussion Forum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DiscussionForum courseId={courseId} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
