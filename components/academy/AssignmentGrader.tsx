'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Clock,
  FileText,
  Download,
  Save,
  User,
  Calendar,
  MessageSquare,
} from 'lucide-react';

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  content: string;
  submittedFiles: string[];
  submittedAt: string;
  status: string;
  grade?: number;
  feedback?: string;
}

interface Assignment {
  id: string;
  title: string;
  points: number;
  rubric: string;
}

interface AssignmentGraderProps {
  assignmentId: string;
  onGraded?: () => void;
}

export default function AssignmentGrader({ assignmentId, onGraded }: AssignmentGraderProps) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [gradeData, setGradeData] = useState({
    grade: '',
    feedback: '',
  });

  // Load assignment and submissions
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load assignment details
        const assignmentResponse = await fetch(`/api/academy/assignments/${assignmentId}`);
        if (assignmentResponse.ok) {
          const assignmentData = await assignmentResponse.json();
          setAssignment(assignmentData.assignment);
        }

        // Load submissions
        const submissionsResponse = await fetch(`/api/academy/submissions?assignmentId=${assignmentId}`);
        if (submissionsResponse.ok) {
          const submissionsData = await submissionsResponse.json();
          setSubmissions(submissionsData.submissions || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [assignmentId]);

  // Update grade data when submission changes
  useEffect(() => {
    if (selectedSubmission) {
      setGradeData({
        grade: selectedSubmission.grade?.toString() || '',
        feedback: selectedSubmission.feedback || '',
      });
    }
  }, [selectedSubmission]);

  const handleSaveGrade = async () => {
    if (!selectedSubmission) return;

    const grade = parseFloat(gradeData.grade);
    if (isNaN(grade) || grade < 0 || grade > (assignment?.points || 100)) {
      alert('Please enter a valid grade');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/academy/submissions/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          grade: grade,
          feedback: gradeData.feedback,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update the submission in the list
        setSubmissions(prev => prev.map(sub =>
          sub.id === selectedSubmission.id
            ? { ...sub, grade: grade, feedback: gradeData.feedback, status: 'graded' }
            : sub
        ));

        // Update selected submission
        setSelectedSubmission(prev => prev ? {
          ...prev,
          grade: grade,
          feedback: gradeData.feedback,
          status: 'graded'
        } : null);

        onGraded?.();
        alert('Grade saved successfully!');
      } else {
        throw new Error('Failed to save grade');
      }
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Failed to save grade');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'submitted': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'bg-green-600';
      case 'submitted': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getSubmissionStats = () => {
    const total = submissions.length;
    const graded = submissions.filter(s => s.status === 'graded').length;
    const submitted = submissions.filter(s => s.status === 'submitted').length;
    const pending = total - graded - submitted;

    return { total, graded, submitted, pending };
  };

  const stats = getSubmissionStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p>Assignment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Grade Assignment</h2>
          <p className="text-slate-300">{assignment.title}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{stats.graded}/{stats.total}</div>
          <div className="text-sm text-slate-400">Submissions graded</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-slate-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Graded</p>
                <p className="text-2xl font-bold text-green-400">{stats.graded}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-blue-400">{stats.submitted}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Ungraded</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {submissions.map(submission => (
                  <div
                    key={submission.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedSubmission?.id === submission.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(submission.status)}
                        <div>
                          <p className="font-medium">{submission.studentName || `Student ${submission.studentId}`}</p>
                          <p className="text-xs opacity-75">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {submission.grade !== undefined && (
                        <Badge className="bg-green-600">
                          {submission.grade}/{assignment.points}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grading Interface */}
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <div className="space-y-6">
              {/* Student Info */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {selectedSubmission.studentName || `Student ${selectedSubmission.studentId}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">
                        Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(selectedSubmission.status)}>
                        {selectedSubmission.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student Submission */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Student Submission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedSubmission.content && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Response:</h4>
                      <div className="bg-slate-700 p-4 rounded text-white whitespace-pre-wrap">
                        {selectedSubmission.content}
                      </div>
                    </div>
                  )}

                  {selectedSubmission.submittedFiles && selectedSubmission.submittedFiles.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Attached Files:</h4>
                      <div className="space-y-2">
                        {JSON.parse(selectedSubmission.submittedFiles).map((file: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-400" />
                              <span className="text-white text-sm">{file.name}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-600"
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Grading Rubric */}
              {assignment.rubric && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Grading Rubric</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-700 p-4 rounded text-slate-300 whitespace-pre-wrap">
                      {assignment.rubric}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Grade Input */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Grade & Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="grade" className="text-white">
                        Grade (out of {assignment.points})
                      </Label>
                      <Input
                        id="grade"
                        type="number"
                        value={gradeData.grade}
                        onChange={(e) => setGradeData(prev => ({ ...prev, grade: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                        min="0"
                        max={assignment.points}
                        step="0.5"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Percentage</Label>
                      <div className="bg-slate-700 p-2 rounded text-white">
                        {gradeData.grade && assignment.points
                          ? `${((parseFloat(gradeData.grade) / assignment.points) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="feedback" className="text-white">Feedback</Label>
                    <Textarea
                      id="feedback"
                      value={gradeData.feedback}
                      onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Provide constructive feedback..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveGrade}
                      disabled={isSaving || !gradeData.grade.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Grade
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Select a submission to grade</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}