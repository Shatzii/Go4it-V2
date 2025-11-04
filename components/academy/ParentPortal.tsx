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
  Star,
  Trophy,
  Download,
} from 'lucide-react';
import StarPathWidget from '@/components/starpath/StarPathWidget';

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
  type: 'grade' | 'assignment' | 'attendance' | 'announcement' | 'message' | 'starpath' | 'ncaa';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  studentName?: string;
}

interface AcademyProgress {
  enrolledCourses: number;
  completedCourses: number;
  averageGrade: number;
  totalAssignments: number;
  completedAssignments: number;
  upcomingDeadlines: number;
}

interface StarPathData {
  starRating: number;
  currentLevel: number;
  ncaaEligibilityScore: number;
  avgGarScore: number;
  scholarshipOffers: number;
}

export default function ParentPortal({ parentId }: { parentId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [academyProgress, setAcademyProgress] = useState<AcademyProgress | null>(null);
  const [starPathData, setStarPathData] = useState<StarPathData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [emailReportFrequency, setEmailReportFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

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
      const [gradesRes, assignmentsRes, academyRes, starPathRes] = await Promise.all([
        fetch(`/api/academy/parent/students/${studentId}/grades?parentId=${parentId}`),
        fetch(`/api/academy/parent/students/${studentId}/assignments?parentId=${parentId}`),
        fetch(`/api/academy/parent/students/${studentId}/academy-progress?parentId=${parentId}`),
        fetch(`/api/academy/parent/students/${studentId}/starpath?parentId=${parentId}`),
      ]);

      if (gradesRes.ok) {
        const gradesData = await gradesRes.json();
        setGrades(gradesData.grades);
      }

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData.assignments);
      }

      if (academyRes.ok) {
        const academyData = await academyRes.json();
        setAcademyProgress(academyData.progress);
      }

      if (starPathRes.ok) {
        const starPathData = await starPathRes.json();
        setStarPathData(starPathData.data);
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
      case 'starpath': return <Star className="w-4 h-4" />;
      case 'ncaa': return <Trophy className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const setupEmailReports = async (frequency: 'daily' | 'weekly' | 'monthly') => {
    try {
      await fetch('/api/academy/parent/email-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId, frequency, studentId: selectedStudent?.id }),
      });
      setEmailReportFrequency(frequency);
      alert(`Email reports set to ${frequency}`);
    } catch (error) {
      console.error('Error setting up email reports:', error);
    }
  };

  const downloadProgressReport = async () => {
    try {
      const response = await fetch(
        `/api/academy/parent/students/${selectedStudent?.id}/report?parentId=${parentId}&format=pdf`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedStudent?.name}_progress_report.pdf`;
        a.click();
      }
    } catch (error) {
      console.error('Error downloading report:', error);
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
            <TabsTrigger value="starpath" className="data-[state=active]:bg-blue-600">
              StarPath Progress
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-600 min-w-[16px] h-4 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
              Settings & Reports
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

            {/* Academy Progress Summary */}
            {academyProgress && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      Academy Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Enrolled</span>
                        <span className="text-white font-medium">{academyProgress.enrolledCourses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Completed</span>
                        <span className="text-white font-medium">{academyProgress.completedCourses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Average Grade</span>
                        <span className={`font-medium ${getGradeColor(`${academyProgress.averageGrade}%`)}`}>
                          {academyProgress.averageGrade}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Assignment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Completion Rate</span>
                          <span className="text-white">
                            {academyProgress.totalAssignments > 0
                              ? Math.round((academyProgress.completedAssignments / academyProgress.totalAssignments) * 100)
                              : 0}%
                          </span>
                        </div>
                        <Progress
                          value={
                            academyProgress.totalAssignments > 0
                              ? (academyProgress.completedAssignments / academyProgress.totalAssignments) * 100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Completed</span>
                        <span className="text-white">{academyProgress.completedAssignments}/{academyProgress.totalAssignments}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      Upcoming Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-2">
                        {academyProgress.upcomingDeadlines}
                      </div>
                      <p className="text-slate-400 text-sm">assignments due this week</p>
                      {academyProgress.upcomingDeadlines > 5 && (
                        <Badge className="mt-2 bg-orange-600">High Priority</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* StarPath Widget */}
            {starPathData && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    StarPath Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StarPathWidget mode="full" />
                  <Button
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab('starpath')}
                  >
                    View Full StarPath Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}

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

          {/* StarPath Tab */}
          <TabsContent value="starpath" className="space-y-6">
            {starPathData ? (
              <>
                <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-400" />
                      StarPath Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-yellow-400 mb-2">
                          {starPathData.starRating.toFixed(1)} ⭐
                        </div>
                        <p className="text-slate-300">Star Rating</p>
                        <p className="text-slate-400 text-sm mt-1">of 5.0</p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-400 mb-2">
                          {starPathData.currentLevel}
                        </div>
                        <p className="text-slate-300">Current Level</p>
                        <p className="text-slate-400 text-sm mt-1">XP Based</p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">
                          {starPathData.ncaaEligibilityScore}%
                        </div>
                        <p className="text-slate-300">NCAA Eligible</p>
                        <p className="text-slate-400 text-sm mt-1">Progress</p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-400 mb-2">
                          {starPathData.avgGarScore}
                        </div>
                        <p className="text-slate-300">GAR Score</p>
                        <p className="text-slate-400 text-sm mt-1">Average</p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-400 mb-2">
                          {starPathData.scholarshipOffers}
                        </div>
                        <p className="text-slate-300">Scholarship Offers</p>
                        <p className="text-slate-400 text-sm mt-1">Received</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        NCAA Eligibility Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Core GPA Progress</span>
                            <span className="text-white">{starPathData.ncaaEligibilityScore}%</span>
                          </div>
                          <Progress value={starPathData.ncaaEligibilityScore} className="h-2" />
                        </div>
                        <div className="p-4 bg-slate-700 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Requirements Status</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-slate-300">Core courses in progress</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-slate-300">GPA tracking enabled</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-yellow-400" />
                              <span className="text-slate-300">NCAA registration pending</span>
                            </li>
                          </ul>
                        </div>
                        <p className="text-slate-400 text-sm">
                          NCAA eligibility is automatically tracked. You'll receive alerts for any issues or milestones achieved.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-400" />
                        GAR Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg">
                          <div className="text-3xl font-bold text-purple-400 mb-2">
                            {starPathData.avgGarScore}
                          </div>
                          <p className="text-slate-300">Average GAR Score</p>
                          <Badge className="mt-2 bg-purple-600">
                            {starPathData.avgGarScore >= 90 ? 'Elite' :
                             starPathData.avgGarScore >= 85 ? 'Advanced' :
                             starPathData.avgGarScore >= 75 ? 'Proficient' : 'Developing'}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm">
                          GAR (Game Analysis Rating) measures athletic performance across multiple skills. Higher scores indicate readiness for college-level competition.
                        </p>
                        <Button
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => window.open('/gar-analysis', '_blank')}
                        >
                          View Detailed GAR Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Path to 5-Star Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-slate-300">
                        Your child is working towards becoming a 5-star athlete through academic excellence, athletic performance, and recruiting visibility.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">Academic Excellence</span>
                            <Badge className={starPathData.ncaaEligibilityScore >= 80 ? 'bg-green-600' : 'bg-yellow-600'}>
                              {starPathData.ncaaEligibilityScore >= 80 ? 'On Track' : 'In Progress'}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm">Core GPA 3.0+ and NCAA eligible</p>
                        </div>
                        <div className="p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">Athletic Performance</span>
                            <Badge className={starPathData.avgGarScore >= 85 ? 'bg-green-600' : 'bg-yellow-600'}>
                              {starPathData.avgGarScore >= 85 ? 'On Track' : 'In Progress'}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm">GAR score 85+ (Advanced level)</p>
                        </div>
                        <div className="p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">Recruiting Visibility</span>
                            <Badge className={starPathData.scholarshipOffers >= 1 ? 'bg-green-600' : 'bg-yellow-600'}>
                              {starPathData.scholarshipOffers >= 1 ? 'Active' : 'Building'}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm">Scholarship offers and recruiter interest</p>
                        </div>
                        <div className="p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">Consistent Engagement</span>
                            <Badge className="bg-blue-600">Active</Badge>
                          </div>
                          <p className="text-slate-400 text-sm">Regular practice and progress tracking</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Star className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">StarPath Not Available</h3>
                  <p className="text-slate-400">
                    StarPath gamification data is not available for this student yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings & Reports Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  Email Report Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-300">
                    Receive automated progress reports via email for {selectedStudent.name}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant={emailReportFrequency === 'daily' ? 'default' : 'outline'}
                      onClick={() => setupEmailReports('daily')}
                      className={emailReportFrequency === 'daily' ? 'bg-blue-600' : 'border-slate-600 text-slate-300'}
                    >
                      Daily Reports
                    </Button>
                    <Button
                      variant={emailReportFrequency === 'weekly' ? 'default' : 'outline'}
                      onClick={() => setupEmailReports('weekly')}
                      className={emailReportFrequency === 'weekly' ? 'bg-blue-600' : 'border-slate-600 text-slate-300'}
                    >
                      Weekly Reports
                    </Button>
                    <Button
                      variant={emailReportFrequency === 'monthly' ? 'default' : 'outline'}
                      onClick={() => setupEmailReports('monthly')}
                      className={emailReportFrequency === 'monthly' ? 'bg-blue-600' : 'border-slate-600 text-slate-300'}
                    >
                      Monthly Reports
                    </Button>
                  </div>
                  <div className="p-4 bg-slate-700 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Current Setting</h4>
                    <p className="text-slate-300">
                      Reports are currently sent <span className="font-medium text-blue-400">{emailReportFrequency}</span>
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p>Reports include:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Recent grades and assignment completions</li>
                      <li>Attendance and participation summary</li>
                      <li>StarPath progress and achievements</li>
                      <li>NCAA eligibility updates</li>
                      <li>Upcoming assignments and deadlines</li>
                      <li>Teacher feedback and recommendations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-400" />
                  Download Progress Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-300">
                    Generate and download a comprehensive progress report for {selectedStudent.name}
                  </p>
                  <Button
                    onClick={downloadProgressReport}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Report
                  </Button>
                  <div className="p-4 bg-slate-700 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Report Includes</h4>
                    <ul className="space-y-1 text-sm text-slate-300">
                      <li>• Complete grade history</li>
                      <li>• Assignment completion status</li>
                      <li>• Attendance records</li>
                      <li>• StarPath progress metrics</li>
                      <li>• NCAA eligibility status</li>
                      <li>• GAR performance analysis</li>
                      <li>• Scholarship tracking</li>
                      <li>• Teacher comments and recommendations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-400" />
                  Alert Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-300 mb-4">
                    Choose which events trigger immediate email alerts
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: 'Low grades (below 70%)', enabled: true },
                      { label: 'Missing assignments', enabled: true },
                      { label: 'Attendance issues', enabled: true },
                      { label: 'NCAA eligibility changes', enabled: true },
                      { label: 'New scholarship offers', enabled: true },
                      { label: 'StarPath achievements', enabled: false },
                      { label: 'Teacher messages', enabled: true },
                      { label: 'Upcoming deadlines (24hrs)', enabled: false },
                    ].map((alert, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <span className="text-slate-300">{alert.label}</span>
                        <Badge className={alert.enabled ? 'bg-green-600' : 'bg-slate-600'}>
                          {alert.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}