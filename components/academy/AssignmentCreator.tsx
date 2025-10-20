'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Save,
  Upload,
  FileText,
  X,
  Calendar,
  Clock,
  Users,
  CheckCircle,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  code: string;
  grade_level: string;
}

interface AssignmentFormData {
  courseId: string;
  title: string;
  description: string;
  type: 'homework' | 'quiz' | 'project' | 'exam';
  dueDate: string;
  points: number;
  allowFileUploads: boolean;
  maxFileSize: number;
  allowedFileTypes: string;
  instructions: string;
  rubric: string;
}

interface AssignmentCreatorProps {
  onAssignmentCreated?: () => void;
}

export default function AssignmentCreator({ onAssignmentCreated }: AssignmentCreatorProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const [formData, setFormData] = useState<AssignmentFormData>({
    courseId: '',
    title: '',
    description: '',
    type: 'homework',
    dueDate: '',
    points: 100,
    allowFileUploads: true,
    maxFileSize: 10,
    allowedFileTypes: 'pdf,doc,docx,txt,jpg,jpeg,png',
    instructions: '',
    rubric: '',
  });

  // Load courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch('/api/academy/courses');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    };

    loadCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseId || !formData.title.trim()) return;

    setIsLoading(true);
    try {
      // Create the assignment
      const assignmentResponse = await fetch('/api/academy/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: formData.courseId,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          dueDate: formData.dueDate,
          points: formData.points,
          allowFileUploads: formData.allowFileUploads,
          maxFileSizeMb: formData.maxFileSize,
          allowedFileTypes: formData.allowedFileTypes,
          instructions: formData.instructions,
          rubric: formData.rubric,
        }),
      });

      if (!assignmentResponse.ok) {
        throw new Error('Failed to create assignment');
      }

      const assignmentData = await assignmentResponse.json();
      const assignmentId = assignmentData.assignment.id;

      // Upload attachments if any
      if (attachments.length > 0) {
        for (const file of attachments) {
          const formDataUpload = new FormData();
          formDataUpload.append('file', file);
          formDataUpload.append('assignmentId', assignmentId);

          await fetch('/api/academy/assignments/attachments', {
            method: 'POST',
            body: formDataUpload,
          });
        }
      }

      // Reset form
      setFormData({
        courseId: '',
        title: '',
        description: '',
        type: 'homework',
        dueDate: '',
        points: 100,
        allowFileUploads: true,
        maxFileSize: 10,
        allowedFileTypes: 'pdf,doc,docx,txt,jpg,jpeg,png',
        instructions: '',
        rubric: '',
      });
      setAttachments([]);

      onAssignmentCreated?.();
      alert('Assignment created successfully!');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Create Assignment</h2>
          <p className="text-slate-300">Design assignments with file uploads and detailed instructions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course" className="text-white">Course</Label>
                <select
                  id="course"
                  value={formData.courseId}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                  className="w-full bg-slate-700 border-slate-600 text-white rounded px-3 py-2"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="type" className="text-white">Assignment Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AssignmentFormData['type'] }))}
                  className="w-full bg-slate-700 border-slate-600 text-white rounded px-3 py-2"
                >
                  <option value="homework">Homework</option>
                  <option value="quiz">Quiz</option>
                  <option value="project">Project</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="text-white">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Assignment title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Brief description of the assignment"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dueDate" className="text-white">Due Date</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="points" className="text-white">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="maxFileSize" className="text-white">Max File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={formData.maxFileSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxFileSize: parseFloat(e.target.value) }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">File Upload Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowFileUploads"
                checked={formData.allowFileUploads}
                onChange={(e) => setFormData(prev => ({ ...prev, allowFileUploads: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="allowFileUploads" className="text-white">Allow file uploads</Label>
            </div>

            {formData.allowFileUploads && (
              <div>
                <Label htmlFor="allowedFileTypes" className="text-white">Allowed File Types</Label>
                <Input
                  id="allowedFileTypes"
                  value={formData.allowedFileTypes}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="pdf,doc,docx,txt,jpg,jpeg,png"
                />
                <p className="text-sm text-slate-400 mt-1">Comma-separated list of file extensions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Instructions */}
        <Tabs defaultValue="instructions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="instructions" className="text-white">Instructions</TabsTrigger>
            <TabsTrigger value="rubric" className="text-white">Rubric</TabsTrigger>
          </TabsList>

          <TabsContent value="instructions">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Assignment Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Detailed instructions for students..."
                  rows={8}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rubric">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Grading Rubric</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.rubric}
                  onChange={(e) => setFormData(prev => ({ ...prev, rubric: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Define grading criteria and point breakdown..."
                  rows={8}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Attachments */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Assignment Attachments</CardTitle>
            <p className="text-sm text-slate-400">Upload files that students will need for this assignment</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept={formData.allowFileUploads ? formData.allowedFileTypes.split(',').map(type => `.${type.trim()}`).join(',') : undefined}
              />
              <Label htmlFor="file-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Files
                </Button>
              </Label>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-medium">Attached Files:</h4>
                {attachments.map((file, index) => (
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
                      onClick={() => removeAttachment(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || !formData.courseId || !formData.title.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Assignment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}