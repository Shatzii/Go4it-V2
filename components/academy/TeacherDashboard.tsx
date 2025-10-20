'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Users,
  Calendar,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Video,
  Upload,
  Settings,
} from 'lucide-react';

interface TeacherClass {
  id: string;
  title: string;
  subject: string;
  enrolledStudents: number;
  maxStudents: number;
  nextClass: string;
  completionRate: number;
  avgGrade: number;
  status: 'active' | 'draft' | 'completed';
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  color: string;
}

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeClasses: 0,
    avgCompletion: 0,
    pendingGrades: 0,
  });

  useEffect(() => {
    // Sample data - would come from API
    const sampleClasses: TeacherClass[] = [
      {
        id: '1',
        title: 'Advanced Biology',
        subject: 'Science',
        enrolledStudents: 24,
        maxStudents: 30,
        nextClass: '2025-01-24T09:00:00',
        completionRate: 78,
        avgGrade: 87,
        status: 'active',
      },
      {
        id: '2',
        title: 'AP Chemistry',
        subject: 'Science',
        enrolledStudents: 18,
        maxStudents: 25,
        nextClass: '2025-01-24T11:00:00',
        completionRate: 65,
        avgGrade: 82,
        status: 'active',
      },
      {
        id: '3',
        title: 'Environmental Science',
        subject: 'Science',
        enrolledStudents: 0,
        maxStudents: 20,
        nextClass: '2025-02-01T14:00:00',
        completionRate: 0,
        avgGrade: 0,
        status: 'draft',
      },
    ];

    setClasses(sampleClasses);

    // Calculate stats
    const totalStudents = sampleClasses.reduce((sum, cls) => sum + cls.enrolledStudents, 0);
    const activeClasses = sampleClasses.filter((cls) => cls.status === 'active').length;
    const avgCompletion = Math.round(
      sampleClasses.reduce((sum, cls) => sum + cls.completionRate, 0) / sampleClasses.length,
    );

    setStats({
      totalStudents,
      activeClasses,
      avgCompletion,
      pendingGrades: 12,
    });
  }, []);

  const quickActions: QuickAction[] = [
    {
      title: 'Create New Course',
      description: 'Build a course from curriculum templates',
      icon: <Plus className="w-5 h-5" />,
      action: '/academy/create-class',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Upload Content',
      description: 'Add videos, documents, and assignments',
      icon: <Upload className="w-5 h-5" />,
      action: '/academy/content-upload',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Grade Assignments',
      description: 'Review and grade pending submissions',
      icon: <FileText className="w-5 h-5" />,
      action: '/academy/grading',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Schedule Classes',
      description: 'Set up live sessions and office hours',
      icon: <Calendar className="w-5 h-5" />,
      action: '/academy/schedule',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600/20 text-green-400">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-600/20 text-yellow-400">Draft</Badge>;
      case 'completed':
        return <Badge className="bg-gray-600/20 text-gray-400">Completed</Badge>;
      default:
        return null;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' at ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Classes</p>
                <p className="text-2xl font-bold text-white">{stats.activeClasses}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Completion</p>
                <p className="text-2xl font-bold text-white">{stats.avgCompletion}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Grades</p>
                <p className="text-2xl font-bold text-white">{stats.pendingGrades}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                className={`${action.color} h-auto p-4 flex flex-col items-center gap-2`}
                onClick={() => (window.location.href = action.action)}
              >
                {action.icon}
                <div className="text-center">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Classes */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>My Classes</span>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Class
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classes.map((cls) => (
              <Card key={cls.id} className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{cls.title}</h3>
                      <p className="text-slate-400">{cls.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(cls.status)}
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">
                        {cls.enrolledStudents}/{cls.maxStudents} students
                      </span>
                    </div>

                    {cls.status === 'active' && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-300">
                          Next: {formatDateTime(cls.nextClass)}
                        </span>
                      </div>
                    )}

                    {cls.avgGrade > 0 && (
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-300">Avg Grade: {cls.avgGrade}%</span>
                      </div>
                    )}
                  </div>

                  {cls.status === 'active' && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Course Progress</span>
                        <span className="text-slate-300">{cls.completionRate}%</span>
                      </div>
                      <Progress value={cls.completionRate} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                    {cls.status === 'active' && (
                      <>
                        <Button size="sm" variant="outline">
                          Start Class
                        </Button>
                        <Button size="sm" variant="outline">
                          Message Students
                        </Button>
                      </>
                    )}
                    {cls.status === 'draft' && (
                      <Button size="sm" variant="outline">
                        Continue Setup
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
