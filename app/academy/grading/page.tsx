'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Target,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

// Import existing grading components
import QuizGrader from '@/components/academy/QuizGrader';
import AssignmentGrader from '@/components/academy/AssignmentGrader';

interface PendingItem {
  id: string;
  type: 'quiz' | 'assignment';
  studentName: string;
  studentId: string;
  courseName: string;
  courseId: string;
  title: string;
  submittedAt: string;
  dueDate: string;
  status: 'pending' | 'late';
}

export default function GradingDashboard() {
  const router = useRouter();
  const [pendingGrades, setPendingGrades] = useState<PendingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'graded'>('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPendingGrades();
  }, []);

  const loadPendingGrades = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/academy/grading/pending');
      if (response.ok) {
        const data = await response.json();
        setPendingGrades(data.pending || []);
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleGradeComplete = () => {
    setSelectedItem(null);
    loadPendingGrades();
  };

  if (selectedItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedItem(null)}
            className="mb-4 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Grading Queue
          </Button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {selectedItem.studentName}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {selectedItem.courseName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Submitted {formatDateTime(selectedItem.submittedAt)}
              </span>
              {selectedItem.status === 'late' && (
                <Badge className="bg-red-600/20 text-red-400">Late Submission</Badge>
              )}
            </div>
          </div>

          {selectedItem.type === 'quiz' ? (
            <QuizGrader attemptId={selectedItem.id} />
          ) : (
            <AssignmentGrader 
              assignmentId={selectedItem.id}
              onGradeComplete={handleGradeComplete}
            />
          )}
        </div>
      </div>
    );
  }

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

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Grading Dashboard</h1>
              <p className="text-slate-400">Review and grade student submissions</p>
            </div>
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {pendingGrades.length}
                </div>
                <div className="text-sm text-slate-400">Pending Grades</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Pending</p>
                  <p className="text-2xl font-bold text-white">{pendingGrades.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Quizzes</p>
                  <p className="text-2xl font-bold text-white">
                    {pendingGrades.filter(item => item.type === 'quiz').length}
                  </p>
                </div>
                <Target className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Assignments</p>
                  <p className="text-2xl font-bold text-white">
                    {pendingGrades.filter(item => item.type === 'assignment').length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Late Submissions</p>
                  <p className="text-2xl font-bold text-white">
                    {pendingGrades.filter(item => item.status === 'late').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grading Queue */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'pending' | 'graded')}>
          <TabsList className="bg-slate-800/50 mb-6">
            <TabsTrigger value="pending">
              <AlertCircle className="w-4 h-4 mr-2" />
              Pending ({pendingGrades.length})
            </TabsTrigger>
            <TabsTrigger value="graded">
              <CheckCircle className="w-4 h-4 mr-2" />
              Recently Graded
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Pending Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading submissions...</p>
                  </div>
                ) : pendingGrades.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-xl text-white mb-2">All caught up!</p>
                    <p className="text-slate-400">No pending submissions to grade</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingGrades.map((item) => (
                      <Card key={item.id} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {item.type === 'quiz' ? (
                                  <Target className="w-5 h-5 text-green-400" />
                                ) : (
                                  <FileText className="w-5 h-5 text-purple-400" />
                                )}
                                <h3 className="text-white font-semibold">{item.title}</h3>
                                {item.status === 'late' && (
                                  <Badge className="bg-red-600/20 text-red-400">Late</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {item.studentName}
                                </span>
                                <span>{item.courseName}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatDateTime(item.submittedAt)}
                                </span>
                              </div>
                            </div>
                            <Button
                              onClick={() => setSelectedItem(item)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Grade Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="graded">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recently Graded Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                  <p>Recently graded submissions will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
