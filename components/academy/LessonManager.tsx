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
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Video,
  FileText,
  Image,
  Link,
  Save,
  X,
  Upload,
  Play,
} from 'lucide-react';

interface Lesson {
  id: string;
  course_id: number;
  title: string;
  description: string;
  content: string;
  order_index: number;
  duration_minutes: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  content_items?: ContentItem[];
}

interface ContentItem {
  id: string;
  lesson_id: number;
  content_type: 'video' | 'image' | 'document' | 'link' | 'text';
  title: string;
  url?: string;
  file_path?: string;
  description?: string;
  order_index: number;
  is_active: number;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  code: string;
  grade_level: string;
  department: string;
}

interface LessonManagerProps {
  courseId?: string;
}

export default function LessonManager({ courseId }: LessonManagerProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courseId || '');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    content: '',
    orderIndex: 0,
    durationMinutes: 45,
  });

  const [contentForm, setContentForm] = useState({
    contentType: 'text' as ContentItem['content_type'],
    title: '',
    url: '',
    filePath: '',
    description: '',
    orderIndex: 0,
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

  // Load lessons when course is selected
  useEffect(() => {
    if (selectedCourseId) {
      loadLessons(selectedCourseId);
    } else {
      setLessons([]);
    }
  }, [selectedCourseId]);

  const loadLessons = async (courseId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/academy/lessons?courseId=${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLesson = async () => {
    if (!selectedCourseId || !lessonForm.title.trim()) return;

    try {
      const response = await fetch('/api/academy/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourseId,
          ...lessonForm,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLessons(prev => [...prev, data.lesson]);
        setLessonForm({
          title: '',
          description: '',
          content: '',
          orderIndex: lessons.length,
          durationMinutes: 45,
        });
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;

    try {
      const response = await fetch(`/api/academy/lessons/${editingLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonForm),
      });

      if (response.ok) {
        const data = await response.json();
        setLessons(prev => prev.map(l => l.id === editingLesson.id ? data.lesson : l));
        setEditingLesson(null);
        setLessonForm({
          title: '',
          description: '',
          content: '',
          orderIndex: 0,
          durationMinutes: 45,
        });
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const response = await fetch(`/api/academy/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLessons(prev => prev.filter(l => l.id !== lessonId));
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const handleAddContent = async (lessonId: string) => {
    try {
      const response = await fetch(`/api/academy/lessons/${lessonId}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentForm),
      });

      if (response.ok) {
        const data = await response.json();
        setLessons(prev => prev.map(l =>
          l.id === lessonId
            ? { ...l, content_items: [...(l.content_items || []), data.content] }
            : l
        ));
        setContentForm({
          contentType: 'text',
          title: '',
          url: '',
          filePath: '',
          description: '',
          orderIndex: 0,
        });
      }
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };

  const startEditing = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      orderIndex: lesson.order_index,
      durationMinutes: lesson.duration_minutes,
    });
  };

  const cancelEditing = () => {
    setEditingLesson(null);
    setLessonForm({
      title: '',
      description: '',
      content: '',
      orderIndex: 0,
      durationMinutes: 45,
    });
  };

  const getContentIcon = (type: ContentItem['content_type']) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'link': return <Link className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Lesson Content Manager</h2>
          <p className="text-slate-300">Create and manage lesson content for your courses</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          disabled={!selectedCourseId}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Lesson
        </Button>
      </div>

      {/* Course Selector */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Select Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <Card
                key={course.id}
                className={`cursor-pointer transition-all ${
                  selectedCourseId === course.id
                    ? 'bg-blue-600 border-blue-500'
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }`}
                onClick={() => setSelectedCourseId(course.id)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white">{course.title}</h3>
                  <p className="text-sm text-slate-300">{course.code}</p>
                  <Badge variant="secondary" className="mt-2">
                    Grade {course.grade_level}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Form */}
      {(isCreating || editingLesson) && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Lesson title"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-white">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={lessonForm.durationMinutes}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={lessonForm.description}
                onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Brief description of the lesson"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-white">Lesson Content (Markdown)</Label>
              <Textarea
                id="content"
                value={lessonForm.content}
                onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white font-mono"
                placeholder="Lesson content in Markdown format"
                rows={10}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingLesson ? handleUpdateLesson : handleCreateLesson}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingLesson ? 'Update' : 'Create'} Lesson
              </Button>
              <Button
                onClick={cancelEditing}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lessons List */}
      {selectedCourseId && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-300">Loading lessons...</p>
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-300">No lessons created yet</p>
                <Button
                  onClick={() => setIsCreating(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Lesson
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map(lesson => (
                  <Card key={lesson.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
                          <p className="text-slate-300 text-sm mt-1">{lesson.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary">
                              <Clock className="w-3 h-3 mr-1" />
                              {lesson.duration_minutes} min
                            </Badge>
                            <Badge variant="outline" className="text-slate-300">
                              Order: {lesson.order_index}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(lesson)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Content Items */}
                      {lesson.content_items && lesson.content_items.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-white mb-2">Content Items:</h4>
                          <div className="space-y-2">
                            {lesson.content_items.map(item => (
                              <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-600 rounded">
                                {getContentIcon(item.content_type)}
                                <span className="text-sm text-white">{item.title}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {item.content_type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add Content Form */}
                      <div className="mt-4 pt-4 border-t border-slate-600">
                        <h4 className="text-sm font-medium text-white mb-2">Add Content:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <select
                            value={contentForm.contentType}
                            onChange={(e) => setContentForm(prev => ({ ...prev, contentType: e.target.value as ContentItem['content_type'] }))}
                            className="bg-slate-600 border-slate-500 text-white rounded px-3 py-2"
                          >
                            <option value="text">Text</option>
                            <option value="video">Video</option>
                            <option value="image">Image</option>
                            <option value="document">Document</option>
                            <option value="link">Link</option>
                          </select>
                          <Input
                            placeholder="Title"
                            value={contentForm.title}
                            onChange={(e) => setContentForm(prev => ({ ...prev, title: e.target.value }))}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddContent(lesson.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        {(contentForm.contentType === 'video' || contentForm.contentType === 'link') && (
                          <Input
                            placeholder="URL"
                            value={contentForm.url}
                            onChange={(e) => setContentForm(prev => ({ ...prev, url: e.target.value }))}
                            className="mt-2 bg-slate-600 border-slate-500 text-white"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}