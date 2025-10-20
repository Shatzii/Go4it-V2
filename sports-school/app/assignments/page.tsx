'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Target,
  Upload,
  Download,
  Edit,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState('current');

  const currentAssignments = [
    {
      id: 1,
      title: 'Algebra Problem Set #12',
      subject: 'Mathematics',
      teacher: 'Professor Newton',
      dueDate: '2024-01-15',
      dueTime: '11:59 PM',
      status: 'pending',
      priority: 'high',
      description: 'Complete problems 1-25 on quadratic equations',
      estimatedTime: '45 mins',
    },
    {
      id: 2,
      title: 'Chemistry Lab Report',
      subject: 'Science',
      teacher: 'Dr. Curie',
      dueDate: '2024-01-18',
      dueTime: '3:00 PM',
      status: 'in-progress',
      priority: 'medium',
      description: 'Write lab report on chemical reactions experiment',
      estimatedTime: '90 mins',
    },
    {
      id: 3,
      title: 'Essay: To Kill a Mockingbird',
      subject: 'English',
      teacher: 'Ms. Shakespeare',
      dueDate: '2024-01-20',
      dueTime: '11:59 PM',
      status: 'pending',
      priority: 'high',
      description: 'Analyze themes of justice and morality in the novel',
      estimatedTime: '120 mins',
    },
  ];

  const completedAssignments = [
    {
      id: 4,
      title: 'World War II Timeline',
      subject: 'History',
      teacher: 'Professor Timeline',
      submittedDate: '2024-01-10',
      grade: 'A-',
      feedback: 'Excellent work on chronological accuracy!',
    },
    {
      id: 5,
      title: 'Geometry Proofs',
      subject: 'Mathematics',
      teacher: 'Professor Newton',
      submittedDate: '2024-01-08',
      grade: 'B+',
      feedback: 'Good understanding, but work on proof formatting.',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
              <p className="text-gray-600 mt-1">Manage your coursework and submissions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm text-gray-600">Due Soon</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Assignments</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentAssignments.map((assignment) => {
                const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                return (
                  <Card
                    key={assignment.id}
                    className={`border-l-4 ${getPriorityColor(assignment.priority)}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        {getStatusIcon(assignment.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4" />
                        <span>{assignment.subject}</span>
                        <span>•</span>
                        <span>{assignment.teacher}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-4">{assignment.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>
                            Due: {assignment.dueDate} at {assignment.dueTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Estimated time: {assignment.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span
                            className={`font-medium ${
                              daysUntilDue <= 1
                                ? 'text-red-600'
                                : daysUntilDue <= 3
                                  ? 'text-yellow-600'
                                  : 'text-green-600'
                            }`}
                          >
                            {daysUntilDue === 0
                              ? 'Due Today'
                              : daysUntilDue === 1
                                ? 'Due Tomorrow'
                                : daysUntilDue > 0
                                  ? `${daysUntilDue} days left`
                                  : 'Overdue'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            assignment.priority === 'high'
                              ? 'destructive'
                              : assignment.priority === 'medium'
                                ? 'default'
                                : 'secondary'
                          }
                        >
                          {assignment.priority} priority
                        </Badge>
                        <Badge variant="outline">{assignment.status}</Badge>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Work on it
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Completed Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedAssignments.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{assignment.title}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {assignment.grade}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{assignment.subject}</span>
                        <span>•</span>
                        <span>{assignment.teacher}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Feedback:</strong> {assignment.feedback}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Submitted: {assignment.submittedDate}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Assignment Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center mb-4">
                  <div className="font-medium text-sm py-2">Sun</div>
                  <div className="font-medium text-sm py-2">Mon</div>
                  <div className="font-medium text-sm py-2">Tue</div>
                  <div className="font-medium text-sm py-2">Wed</div>
                  <div className="font-medium text-sm py-2">Thu</div>
                  <div className="font-medium text-sm py-2">Fri</div>
                  <div className="font-medium text-sm py-2">Sat</div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 5; // Adjust for month start
                    const isToday = day === 12;
                    const hasAssignment = [15, 18, 20].includes(day);

                    return (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg ${
                          day < 1 || day > 31
                            ? 'text-gray-300'
                            : isToday
                              ? 'bg-blue-600 text-white font-medium'
                              : hasAssignment
                                ? 'bg-red-100 text-red-800 font-medium'
                                : 'hover:bg-gray-50'
                        }`}
                      >
                        {day > 0 && day <= 31 ? day : ''}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                    <span>Assignment Due</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
