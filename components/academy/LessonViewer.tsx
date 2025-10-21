'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  Clock,
  CheckCircle,
  Video,
  FileText,
  Image,
  Link,
  ArrowLeft,
  ArrowRight,
  BookOpen,
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

interface LessonViewerProps {
  lessonId: string;
  courseId: string;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function LessonViewer({
  lessonId,
  courseId,
  onComplete,
  onNext,
  onPrevious
}: LessonViewerProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/academy/lessons/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setLesson(data.lesson);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    // Here you would call an API to mark the lesson as completed
    setIsCompleted(true);
    setProgress(100);
    onComplete?.();
  };

  const renderContent = (content: ContentItem) => {
    switch (content.content_type) {
      case 'video':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{content.title}</h3>
            {content.description && (
              <p className="text-slate-300">{content.description}</p>
            )}
            {content.url ? (
              <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-300 mb-4">Video Content</p>
                  <Button
                    onClick={() => window.open(content.url, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Video URL not provided</p>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{content.title}</h3>
            {content.description && (
              <p className="text-slate-300">{content.description}</p>
            )}
            {content.url ? (
              <img
                src={content.url}
                alt={content.title}
                className="max-w-full h-auto rounded-lg"
              />
            ) : (
              <p className="text-slate-400">Image not available</p>
            )}
          </div>
        );

      case 'document':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{content.title}</h3>
            {content.description && (
              <p className="text-slate-300">{content.description}</p>
            )}
            <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg">
              <FileText className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-white font-medium">{content.title}</p>
                <p className="text-slate-400 text-sm">Document</p>
              </div>
              {content.url && (
                <Button
                  onClick={() => window.open(content.url, '_blank')}
                  className="ml-auto bg-blue-600 hover:bg-blue-700"
                >
                  View Document
                </Button>
              )}
            </div>
          </div>
        );

      case 'link':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{content.title}</h3>
            {content.description && (
              <p className="text-slate-300">{content.description}</p>
            )}
            <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg">
              <Link className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-white font-medium">{content.title}</p>
                <p className="text-slate-400 text-sm">{content.url}</p>
              </div>
              {content.url && (
                <Button
                  onClick={() => window.open(content.url, '_blank')}
                  className="ml-auto bg-green-600 hover:bg-green-700"
                >
                  Open Link
                </Button>
              )}
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{content.title}</h3>
            {content.description && (
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content.description.replace(/\n/g, '<br>') }} />
              </div>
            )}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p>Lesson not found</p>
        </div>
      </div>
    );
  }

  const contentItems = lesson.content_items || [];
  const currentContent = contentItems[currentContentIndex];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>

          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              <Clock className="w-3 h-3 mr-1" />
              {lesson.duration_minutes} min
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-300">Lesson Progress</span>
            <span className="text-sm text-slate-300">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Lesson Title and Description */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{lesson.title}</CardTitle>
            {lesson.description && (
              <p className="text-slate-300">{lesson.description}</p>
            )}
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Area */}
          <div className="lg:col-span-2">
            {contentItems.length > 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  {renderContent(currentContent)}

                  {/* Content Navigation */}
                  {contentItems.length > 1 && (
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-700">
                      <Button
                        onClick={() => setCurrentContentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentContentIndex === 0}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>

                      <span className="text-slate-300">
                        {currentContentIndex + 1} of {contentItems.length}
                      </span>

                      <Button
                        onClick={() => setCurrentContentIndex(prev => Math.min(contentItems.length - 1, prev + 1))}
                        disabled={currentContentIndex === contentItems.length - 1}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Lesson Content (Markdown) */
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Content List */}
            {contentItems.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Lesson Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contentItems.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentContentIndex(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          index === currentContentIndex
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {item.content_type === 'video' && <Video className="w-4 h-4" />}
                          {item.content_type === 'image' && <Image className="w-4 h-4" />}
                          {item.content_type === 'document' && <FileText className="w-4 h-4" />}
                          {item.content_type === 'link' && <Link className="w-4 h-4" />}
                          {item.content_type === 'text' && <FileText className="w-4 h-4" />}
                          <span className="text-sm truncate">{item.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {!isCompleted ? (
                    <Button
                      onClick={handleMarkComplete}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Complete
                    </Button>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-400 font-medium">Lesson Completed!</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {onPrevious && (
                      <Button
                        onClick={onPrevious}
                        variant="outline"
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    {onNext && (
                      <Button
                        onClick={onNext}
                        variant="outline"
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}