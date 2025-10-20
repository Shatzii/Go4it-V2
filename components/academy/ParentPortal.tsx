'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  User,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Bell,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  overallProgress: number;
  attendanceRate: number;
  lastActivity: string;
}

interface Grade {
  id: string;
  courseName: string;
  assignmentName: string;
  grade: string;
  points: number;
  maxPoints: number;
  percentage: number;
  submittedAt: string;
  feedback?: string;
}

interface Assignment {
  id: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
  submittedAt?: string;
}

interface Notification {
  id: string;
  type: 'grade' | 'assignment' | 'attendance' | 'announcement' | 'message';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  studentName?: string;
}

export default function ParentPortal({ parentId }: { parentId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadStudents();
    loadNotifications();
  }, [parentId]);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentData(selectedStudent.id);
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    try {
      const response = await fetch(`/api/academy/parent/students?parentId=${parentId}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
        if (data.students.length > 0 && !selectedStudent) {
          setSelectedStudent(data.students[0]);
        }
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadStudentData = async (studentId: string) => {
    try {
      const [gradesRes, assignmentsRes] = await Promise.all([
        fetch(`/api/academy/parent/students/${studentId}/grades?parentId=${parentId}`),
        fetch(`/api/academy/parent/students/${studentId}/assignments?parentId=${parentId}`),
      ]);

      if (gradesRes.ok) {
        const gradesData = await gradesRes.json();
        setGrades(gradesData.grades);
      }

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData.assignments);
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await fetch(`/api/academy/parent/notifications?parentId=${parentId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    try {
      await fetch(`/api/academy/parent/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId }),
      });
      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getGradeColor = (grade: string) => {
    const percentage = parseFloat(grade.replace('%', ''));
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-blue-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'bg-green-600';
      case 'submitted': return 'bg-blue-600';
      case 'pending': return 'bg-yellow-600';
      case 'overdue': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'grade': return <Award className="w-4 h-4" />;
      case 'assignment': return <BookOpen className="w-4 h-4" />;
      case 'attendance': return <Calendar className="w-4 h-4" />;
      case 'message': return <Mail className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading parent portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Parent Portal</h1>
          <p className="text-slate-400">Monitor your children's academic progress</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-slate-600 text-slate-300 relative">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-600 min-w-[20px] h-5 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Student Selector */}
      {students.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {students.map(student => (
            <Card
              key={student.id}
              className={`bg-slate-800 border-2 cursor-pointer transition-all flex-shrink-0 ${
                selectedStudent?.id === student.id
                  ? 'border-blue-500 bg-slate-700'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => setSelectedStudent(student)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-slate-600">
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-medium">{student.name}</h3>
                    <p className="text-slate-400 text-sm">Grade {student.grade}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">{student.overallProgress}%</span>
                  </div>
                  <Progress value={student.overallProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedStudent && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
            <TabsTrigger value="grades" className="data-[state=active]:bg-blue-600">Grades</TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-blue-600">Assignments</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-600 min-w-[16px] h-4 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Overall Progress */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {selectedStudent.overallProgress}%
                  </div>
                  <Progress value={selectedStudent.overallProgress} className="h-2 mb-2" />
                  <p className="text-slate-400 text-sm">Across all courses</p>
                </CardContent>
              </Card>

              {/* Attendance */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {selectedStudent.attendanceRate}%
                  </div>
                  <Progress value={selectedStudent.attendanceRate} className="h-2 mb-2" />
                  <p className="text-slate-400 text-sm">This semester</p>
                </CardContent>
              </Card>

              {/* Recent Grades */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Recent Grades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {grades.slice(0, 3).map(grade => (
                      <div key={grade.id} className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm truncate">{grade.assignmentName}</span>
                        <span className={`text-sm font-medium ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Assignments */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assignments.filter(a => a.status === 'pending').slice(0, 3).map(assignment => (
                      <div key={assignment.id} className="text-sm">
                        <p className="text-white truncate">{assignment.title}</p>
                        <p className="text-slate-400">Due: {formatDate(assignment.dueDate)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grades.slice(0, 5).map(grade => (
                    <div key={grade.id} className="flex items-center gap-4 p-3 bg-slate-700 rounded">
                      <div className="flex-shrink-0">
                        <Award className="w-8 h-8 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white">
                          Received <span className={`font-medium ${getGradeColor(grade.grade)}`}>{grade.grade}</span> on {grade.assignmentName}
                        </p>
                        <p className="text-slate-400 text-sm">in {grade.courseName} • {formatDate(grade.submittedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-6">
            <div className="space-y-4">
              {grades.map(grade => (
                <Card key={grade.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-medium">{grade.assignmentName}</h3>
                        <p className="text-slate-400">{grade.courseName}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {grade.points}/{grade.maxPoints} points
                        </div>
                      </div>
                    </div>
                    {grade.feedback && (
                      <div className="mt-4 p-4 bg-slate-700 rounded">
                        <h4 className="text-white font-medium mb-2">Teacher Feedback</h4>
                        <p className="text-slate-300">{grade.feedback}</p>
                      </div>
                    )}
                    <div className="mt-4 text-sm text-slate-400">
                      Submitted: {formatDate(grade.submittedAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="space-y-4">
              {assignments.map(assignment => (
                <Card key={assignment.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-medium">{assignment.title}</h3>
                        <p className="text-slate-400">{assignment.courseName}</p>
                      </div>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-slate-300 mb-4">{assignment.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-4 h-4" />
                          Due: {formatDate(assignment.dueDate)}
                        </div>
                        {assignment.submittedAt && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <CheckCircle className="w-4 h-4" />
                            Submitted: {formatDate(assignment.submittedAt)}
                          </div>
                        )}
                      </div>
                      {assignment.grade && (
                        <span className={`font-medium ${getGradeColor(assignment.grade)}`}>
                          Grade: {assignment.grade}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              {notifications.map(notification => (
                <Card
                  key={notification.id}
                  className={`bg-slate-800 border-slate-700 cursor-pointer transition-all ${
                    !notification.isRead ? 'border-blue-500 bg-slate-700/50' : ''
                  }`}
                  onClick={() => !notification.isRead && markNotificationRead(notification.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-medium">{notification.title}</h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-slate-300 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>{formatDate(notification.createdAt)}</span>
                          {notification.studentName && (
                            <span>Regarding: {notification.studentName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}