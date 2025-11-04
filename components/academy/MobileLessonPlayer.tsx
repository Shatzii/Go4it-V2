'use client';

import { useState, useEffect, useRef, TouchEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  BookOpen,
  Video,
  FileText,
  Download,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ArrowLeft,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz';
  content: string;
  videoUrl?: string;
  duration: number;
  completed: boolean;
  downloadedOffline?: boolean;
}

interface MobileLessonPlayerProps {
  courseId: string;
  lessons: Lesson[];
  currentLessonIndex: number;
  onComplete: (lessonId: string) => void;
  onNavigate: (index: number) => void;
  onExit: () => void;
}

export default function MobileLessonPlayer({
  courseId,
  lessons,
  currentLessonIndex,
  onComplete,
  onNavigate,
  onExit,
}: MobileLessonPlayerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentLesson = lessons[currentLessonIndex];
  const canGoBack = currentLessonIndex > 0;
  const canGoForward = currentLessonIndex < lessons.length - 1;

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track reading progress by scroll position
  useEffect(() => {
    if (currentLesson.type === 'reading' && contentRef.current) {
      const handleScroll = () => {
        const element = contentRef.current;
        if (element) {
          const scrollPercentage =
            (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
          setReadingProgress(Math.min(100, Math.max(0, scrollPercentage)));
          
          // Auto-complete at 95% scroll
          if (scrollPercentage >= 95 && !currentLesson.completed) {
            onComplete(currentLesson.id);
          }
        }
      };

      contentRef.current.addEventListener('scroll', handleScroll);
      return () => contentRef.current?.removeEventListener('scroll', handleScroll);
    }
  }, [currentLesson, onComplete]);

  // Video progress tracking
  useEffect(() => {
    if (currentLesson.type === 'video' && videoRef.current) {
      const video = videoRef.current;

      const handleTimeUpdate = () => {
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(progressPercent);

        // Auto-complete at 90% watched
        if (progressPercent >= 90 && !currentLesson.completed) {
          onComplete(currentLesson.id);
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, [currentLesson, onComplete]);

  // Swipe gesture detection
  const minSwipeDistance = 50;

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && canGoForward) {
      navigateLesson('next');
    }
    if (isRightSwipe && canGoBack) {
      navigateLesson('prev');
    }
  };

  const navigateLesson = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? currentLessonIndex + 1 
      : currentLessonIndex - 1;
    
    if (newIndex >= 0 && newIndex < lessons.length) {
      onNavigate(newIndex);
      setProgress(0);
      setReadingProgress(0);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const downloadForOffline = async () => {
    try {
      // In production, this would use Service Worker cache API
      console.log('Downloading lesson for offline use:', currentLesson.id);
      // Mock implementation
      alert('Lesson downloaded for offline viewing!');
    } catch (error) {
      console.error('Error downloading lesson:', error);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'reading': return <FileText className="w-5 h-5" />;
      case 'interactive': return <BookOpen className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-900 text-white flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Exit
          </Button>
          
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
            {!isOnline && currentLesson.downloadedOffline && (
              <Badge className="bg-blue-600">Offline</Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">
              Lesson {currentLessonIndex + 1} of {lessons.length}
            </span>
            <span className="text-slate-400">
              {lessons.filter(l => l.completed).length}/{lessons.length} completed
            </span>
          </div>
          <Progress 
            value={(lessons.filter(l => l.completed).length / lessons.length) * 100}
            className="h-2"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Lesson Title */}
        <div className="p-4 bg-slate-800/50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-blue-600/20 rounded">
              {getLessonIcon(currentLesson.type)}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white mb-1">
                {currentLesson.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentLesson.duration} min
                </span>
                {currentLesson.completed && (
                  <Badge className="bg-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>
            
            {isOnline && !currentLesson.downloadedOffline && (
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadForOffline}
                className="flex-shrink-0"
              >
                <Download className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Video Lesson */}
        {currentLesson.type === 'video' && (
          <div className="relative bg-black">
            <video
              ref={videoRef}
              src={currentLesson.videoUrl}
              className="w-full aspect-video"
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <Progress value={progress} className="h-1 mb-3" />
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="text-white"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white"
                  >
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reading Lesson */}
        {currentLesson.type === 'reading' && (
          <div 
            ref={contentRef}
            className="h-full overflow-y-auto p-6 space-y-4"
          >
            <Progress value={readingProgress} className="h-1 mb-4" />
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: currentLesson.content }}
            />
          </div>
        )}

        {/* Interactive Lesson */}
        {currentLesson.type === 'interactive' && (
          <div className="p-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="sticky bottom-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => navigateLesson('prev')}
            disabled={!canGoBack}
            className="flex-1 border-slate-600"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          {!currentLesson.completed && (
            <Button
              onClick={() => onComplete(currentLesson.id)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => navigateLesson('next')}
            disabled={!canGoForward}
            className="flex-1 border-slate-600"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Swipe Hint */}
        <p className="text-center text-slate-400 text-xs mt-2">
          Swipe left or right to navigate between lessons
        </p>
      </div>
    </div>
  );
}
