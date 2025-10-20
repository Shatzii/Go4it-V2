'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Users, BookOpen } from 'lucide-react';
import StudentDashboard from '../../../components/academy/StudentDashboard';
import TeacherDashboard from '../../../components/academy/TeacherDashboard';
import CourseDiscovery from '../../../components/academy/CourseDiscovery';

export default function AcademyDashboard() {
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user role from API
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          // Determine role based on user data
          // For demo purposes, we'll check if user is admin or has teacher permissions
          setUserRole(userData.user?.isAdmin ? 'admin' : 'student');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('student'); // Default to student
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
            Academy Dashboard
          </h1>
          <p className="text-slate-400">
            {userRole === 'teacher' || userRole === 'admin'
              ? 'Manage your courses and track student progress'
              : 'Access your courses and track your academic progress'}
          </p>
        </div>

        {/* Role Switcher for Admin/Teachers */}
        {(userRole === 'admin' || userRole === 'teacher') && (
          <div className="flex justify-center mb-6">
            <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setUserRole('student')}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Student View
              </Button>
              <Button
                size="sm"
                variant={userRole === 'teacher' ? 'default' : 'ghost'}
                onClick={() => setUserRole('teacher')}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Teacher View
              </Button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="courses">
              {userRole === 'teacher' ? 'My Classes' : 'Browse Courses'}
            </TabsTrigger>
            <TabsTrigger value="discovery">Course Discovery</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {userRole === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
          </TabsContent>

          <TabsContent value="courses">
            {userRole === 'teacher' ? <TeacherDashboard /> : <CourseDiscovery />}
          </TabsContent>

          <TabsContent value="discovery">
            <CourseDiscovery />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
