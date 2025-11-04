'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import StarPathWidget from '@/components/starpath/StarPathWidget';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  Play,
  Trophy,
  TrendingUp,
  Target,
  Bell,
  MessageSquare,
  Video,
  FileText,
  Star,
} from 'lucide-react';

interface StudentCourse {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  nextLesson: string;
  nextClass: string;
  currentGrade: number;
  totalLessons: number;
  completedLessons: number;
  status: 'active' | 'completed' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  type: 'homework' | 'quiz' | 'project' | 'exam';
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

export default function StudentDashboard() {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    // Sample data - would come from API
    const sampleCourses: StudentCourse[] = [
      {
        id: '1',
        title: 'Advanced Biology',
        instructor: 'Dr. Chen',
        progress: 75,
        nextLesson: 'Cellular Respiration',
        nextClass: '2025-01-24T09:00:00',
        currentGrade: 87,
        totalLessons: 20,
        completedLessons: 15,
        status: 'active',
        priority: 'high',
      },
      {
        id: '2',
        title: 'AP Calculus',
        instructor: 'Prof. Rodriguez',
        progress: 60,
        nextLesson: 'Integration Techniques',
        nextClass: '2025-01-24T11:00:00',
        currentGrade: 92,
        totalLessons: 25,
        completedLessons: 15,
        status: 'active',
        priority: 'medium',
      },
      {
        id: '3',
        title: 'Digital Media',
        instructor: 'Ms. Park',
        progress: 45,
        nextLesson: 'Video Editing Basics',
        nextClass: '2025-01-25T14:00:00',
        currentGrade: 89,
        totalLessons: 15,
        completedLessons: 7,
        status: 'active',
        priority: 'low',
      },
    ];

    const sampleAssignments: Assignment[] = [
      {
        id: '1',
        title: 'Photosynthesis Lab Report',
        course: 'Advanced Biology',
        dueDate: '2025-01-26T23:59:00',
        type: 'homework',
        status: 'pending',
      },
      {
        id: '2',
        title: 'Derivative Applications Quiz',
        course: 'AP Calculus',
        dueDate: '2025-01-27T14:00:00',
        type: 'quiz',
        status: 'pending',
      },
      {
        id: '3',
        title: 'Personal Brand Video',
        course: 'Digital Media',
        dueDate: '2025-01-30T17:00:00',
        type: 'project',
        status: 'submitted',
        grade: 95,
      },
    ];

    setCourses(sampleCourses);
    setAssignments(sampleAssignments);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600/20 text-green-400">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-600/20 text-blue-400">Completed</Badge>;
      case 'upcoming':
        return <Badge className="bg-yellow-600/20 text-yellow-400">Upcoming</Badge>;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-400';
      case 'medium':
        return 'border-l-yellow-400';
      case 'low':
        return 'border-l-green-400';
      default:
        return 'border-l-slate-400';
    }
  };

  const getAssignmentIcon = (type: string) => {
    switch (type) {
      case 'homework':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      case 'project':
        return <Trophy className="w-4 h-4" />;
      case 'exam':
        return <Target className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffHours < 24) {
      return 'Today at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 48) {
      return 'Tomorrow at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return (
        date.toLocaleDateString() +
        ' at ' +
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    }
  };

  const upcomingAssignments = assignments
    .filter((a) => a.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const avgGrade = Math.round(
    courses.reduce((sum, course) => sum + course.currentGrade, 0) / courses.length,
  );
  const totalProgress = Math.round(
    courses.reduce((sum, course) => sum + course.progress, 0) / courses.length,
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Courses</p>
                <p className="text-2xl font-bold text-white">
                  {courses.filter((c) => c.status === 'active').length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Average Grade</p>
                <p className="text-2xl font-bold text-white">{avgGrade}%</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Overall Progress</p>
                <p className="text-2xl font-bold text-white">{totalProgress}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Tasks</p>
                <p className="text-2xl font-bold text-white">{upcomingAssignments.length}</p>
              </div>
              <Bell className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* StarPath Widget - New Addition */}
      <StarPathWidget />

      {/* Today&apos;s Schedule */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today&apos;s Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courses
              .filter((course) => course.status === 'active')
              .sort((a, b) => new Date(a.nextClass).getTime() - new Date(b.nextClass).getTime())
              .map((course) => (
                <div
                  key={course.id}
                  className={`flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border-l-4 ${getPriorityColor(course.priority)}`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">{course.title}</p>
                      <p className="text-slate-400 text-sm">{formatDateTime(course.nextClass)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Play className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{course.title}</h3>
                        <p className="text-slate-400 text-sm">{course.instructor}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(course.status)}
                        <span className="text-sm font-semibold text-white">
                          {course.currentGrade}%
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-slate-300">
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Next: {course.nextLesson}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Continue
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Video className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-3 bg-slate-700/30 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getAssignmentIcon(assignment.type)}
                      <span className="text-white font-medium">{assignment.title}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {assignment.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">{assignment.course}</span>
                    <span className="text-slate-300 text-sm">
                      Due {formatDateTime(assignment.dueDate)}
                    </span>
                  </div>
                  {assignment.status === 'pending' && (
                    <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
                      Start Assignment
                    </Button>
                  )}
                </div>
              ))}

              {upcomingAssignments.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-white font-medium">All caught up!</p>
                  <p className="text-slate-400 text-sm">No pending assignments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
