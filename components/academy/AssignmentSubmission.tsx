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
  Upload,
  FileText,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Download,
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  points: number;
  allowFileUploads: number;
  maxFileSizeMb: number;
  allowedFileTypes: string;
  instructions: string;
  rubric: string;
  attachments?: Array<{
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
  }>;
}

interface Submission {
  id: string;
  assignmentId: string;
  content: string;
  submittedFiles: string[];
  submittedAt: string;
  status: string;
  grade?: number;
  feedback?: string;
}

interface AssignmentSubmissionProps {
  assignmentId: string;
  userId: string;
  onSubmitted?: () => void;
}

export default function AssignmentSubmission({
  assignmentId,
  userId,
  onSubmitted
}: AssignmentSubmissionProps) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [submissionData, setSubmissionData] = useState({
    content: '',
  });

  // Load assignment and existing submission
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

        // Load existing submission
        const submissionResponse = await fetch(`/api/academy/submissions?assignmentId=${assignmentId}&userId=${userId}`);
        if (submissionResponse.ok) {
          const submissionData = await submissionResponse.json();
          if (submissionData.submissions && submissionData.submissions.length > 0) {
            setExistingSubmission(submissionData.submissions[0]);
            setSubmissionData({
              content: submissionData.submissions[0].content || '',
            });
          }
        }
      } catch (error) {
        console.error('Error loading assignment data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [assignmentId, userId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = (assignment?.maxFileSizeMb || 10) * 1024 * 1024; // Convert to bytes

    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${assignment?.maxFileSizeMb}MB.`);
        return false;
      }

      // Check file type
      const allowedTypes = assignment?.allowedFileTypes?.split(',').map(type => type.trim().toLowerCase()) || [];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (allowedTypes.length > 0 && !allowedTypes.includes(fileExt || '')) {
        alert(`File type ${fileExt} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        return false;
      }

      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId);
      formData.append('studentId', userId);
      formData.append('content', submissionData.content);

      // Add files
      uploadedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const response = await fetch('/api/academy/submissions', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setExistingSubmission(data.submission);
        setUploadedFiles([]);
        onSubmitted?.();
        alert('Assignment submitted successfully!');
      } else {
        throw new Error('Failed to submit assignment');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      case 'txt': return '📄';
      default: return '📎';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'submitted': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'bg-green-600';
      case 'submitted': return 'bg-blue-600';
      default: return 'bg-yellow-600';
    }
  };

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
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p>Assignment not found</p>
        </div>
      </div>
    );
  }

  const isOverdue = new Date(assignment.dueDate) < new Date();
  const canSubmit = !existingSubmission || existingSubmission.status === 'draft';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Assignment Header */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-white">{assignment.title}</CardTitle>
              <p className="text-slate-300 mt-2">{assignment.description}</p>
            </div>
            <div className="text-right">
              <Badge className={`${getStatusColor(existingSubmission?.status || 'pending')} text-white`}>
                {existingSubmission?.status || 'Not Submitted'}
              </Badge>
              {existingSubmission && getStatusIcon(existingSubmission.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
              {isOverdue && !existingSubmission && (
                <Badge variant="destructive" className="ml-2">Overdue</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">{assignment.points} points</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{assignment.type}</Badge>
            </div>
          </div>

          {/* Assignment Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-2">Assignment Files:</h4>
              <div className="space-y-2">
                {assignment.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center gap-2 p-2 bg-slate-700 rounded">
                    <span className="text-lg">{getFileIcon(attachment.fileName)}</span>
                    <span className="text-white text-sm">{attachment.fileName}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-auto border-slate-600 text-slate-300 hover:bg-slate-600"
                      onClick={() => window.open(attachment.filePath, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Submission */}
      {existingSubmission && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Your Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                Submitted: {new Date(existingSubmission.submittedAt).toLocaleString()}
              </span>
              {existingSubmission.grade !== undefined && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    {existingSubmission.grade}/{assignment.points}
                  </div>
                  <div className="text-sm text-slate-400">
                    {((existingSubmission.grade / assignment.points) * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>

            {existingSubmission.content && (
              <div>
                <h4 className="text-white font-medium mb-2">Your Response:</h4>
                <div className="bg-slate-700 p-4 rounded text-white whitespace-pre-wrap">
                  {existingSubmission.content}
                </div>
              </div>
            )}

            {existingSubmission.feedback && (
              <div>
                <h4 className="text-white font-medium mb-2">Teacher Feedback:</h4>
                <div className="bg-slate-700 p-4 rounded text-slate-300 border-l-4 border-blue-500">
                  {existingSubmission.feedback}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submission Form */}
      {canSubmit && (
        <form onSubmit={handleSubmit}>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Submit Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instructions */}
              {assignment.instructions && (
                <div>
                  <h4 className="text-white font-medium mb-2">Instructions:</h4>
                  <div className="bg-slate-700 p-4 rounded text-slate-300 whitespace-pre-wrap">
                    {assignment.instructions}
                  </div>
                </div>
              )}

              {/* Text Response */}
              <div>
                <Label htmlFor="content" className="text-white">Your Response</Label>
                <Textarea
                  id="content"
                  value={submissionData.content}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Write your response here..."
                  rows={6}
                />
              </div>

              {/* File Upload */}
              {assignment.allowFileUploads ? (
                <div>
                  <Label className="text-white">Attach Files</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                      accept={assignment.allowedFileTypes.split(',').map(type => `.${type.trim()}`).join(',')}
                    />
                    <Label htmlFor="file-upload">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Files
                      </Button>
                    </Label>
                    <p className="text-sm text-slate-400 mt-1">
                      Max file size: {assignment.maxFileSizeMb}MB. Allowed types: {assignment.allowedFileTypes}
                    </p>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-white font-medium">Files to upload:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getFileIcon(file.name)}</span>
                            <span className="text-white text-sm">{file.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-900 border border-yellow-600 p-4 rounded">
                  <p className="text-yellow-200">File uploads are not allowed for this assignment.</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Assignment
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}