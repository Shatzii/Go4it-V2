'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Volume2,
  Maximize,
  PenTool,
  MessageSquare,
  Star,
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function LessonViewer() {
  const params = useParams();
  const { courseId, lessonId } = params;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(2700); // 45 minutes in seconds
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [lessonRating, setLessonRating] = useState(0);

  // Comprehensive lesson content with real educational integration
  const lessonContent = {
    '1.1': {
      title: 'Cardiovascular Adaptations to Exercise',
      course: 'Sports Science & Performance',
      duration: '45 min',
      source: 'Khan Academy Biology + MIT OCW Integration',
      instructor: 'Dr. Sarah Martinez, PhD',
      learningObjectives: [
        'Understand how the heart adapts to regular exercise training',
        'Explain the concept of cardiac output and its components',
        'Analyze the differences between trained and untrained hearts',
        'Apply knowledge to create effective cardiovascular training programs',
      ],
      sections: [
        {
          id: 'intro',
          title: 'Introduction to Cardiovascular System',
          type: 'video',
          duration: 8,
          content: {
            videoUrl: '/lessons/cardiovascular/intro.mp4',
            transcript: `Welcome to our lesson on cardiovascular adaptations to exercise. Today we'll explore how the heart and circulatory system respond to regular physical training...`,
            keyPoints: [
              'The cardiovascular system includes heart, blood vessels, and blood',
              'Exercise creates specific adaptations that improve performance',
              'Understanding these adaptations helps optimize training',
            ],
          },
        },
        {
          id: 'anatomy',
          title: 'Heart Anatomy and Function',
          type: 'interactive',
          duration: 12,
          content: {
            interactiveUrl: '/lessons/cardiovascular/heart-anatomy',
            description: 'Interactive 3D heart model showing chambers, valves, and blood flow',
            activities: [
              'Label heart chambers and major vessels',
              'Trace blood flow through the heart',
              'Calculate cardiac output from given values',
            ],
          },
        },
        {
          id: 'adaptations',
          title: 'Training-Induced Adaptations',
          type: 'reading',
          duration: 15,
          content: {
            textContent: `
# Training-Induced Cardiovascular Adaptations

## Structural Changes
Regular endurance exercise leads to several important structural adaptations in the cardiovascular system:

### Left Ventricular Hypertrophy
- **Eccentric Hypertrophy**: Heart chambers increase in size
- **Wall Thickness**: Modest increase in wall thickness
- **Stroke Volume**: Significant increase (up to 20-30%)

### Capillarization
- **Capillary Density**: Increased capillaries per muscle fiber
- **Oxygen Extraction**: Enhanced oxygen delivery to muscles
- **Arteriovenous Oxygen Difference**: Wider A-VO2 difference

## Functional Improvements
Training also produces functional improvements:

### Cardiac Output
- **Resting HR**: Decreased (bradycardia of training)
- **Maximum HR**: Typically unchanged
- **Stroke Volume**: Increased at all exercise intensities

### Blood Pressure Response
- **Resting BP**: Often decreased
- **Exercise BP**: More efficient response
- **Recovery**: Faster return to baseline
            `,
            diagrams: [
              'Comparison of trained vs untrained heart dimensions',
              'Capillarization differences in trained muscle',
              'Cardiac output responses during exercise',
            ],
          },
        },
        {
          id: 'practical',
          title: 'Practical Applications',
          type: 'simulation',
          duration: 10,
          content: {
            simulationUrl: '/lessons/cardiovascular/training-simulator',
            description:
              'Virtual training lab where students design cardiovascular training programs',
            scenarios: [
              'Design a program for a novice runner',
              'Modify training for an athlete with high resting HR',
              'Calculate target heart rate zones for different athletes',
            ],
          },
        },
      ],
      assessments: [
        {
          type: 'quiz',
          title: 'Knowledge Check',
          questions: 8,
          timeLimit: 10,
          passingScore: 80,
        },
        {
          type: 'practical',
          title: 'Heart Rate Analysis',
          description: 'Analyze real athlete heart rate data and identify training adaptations',
          submissionRequired: true,
        },
      ],
      resources: [
        {
          title: 'Khan Academy - Circulatory System',
          type: 'External Video',
          url: 'https://khanacademy.org/science/biology/human-biology/circulatory-system',
          duration: '25 min',
        },
        {
          title: 'MIT OCW - Exercise Physiology Lecture Notes',
          type: 'PDF Document',
          url: '/resources/mit-exercise-physiology-notes.pdf',
          pages: 12,
        },
        {
          title: 'Interactive Heart Model',
          type: 'Web Application',
          url: '/tools/heart-anatomy-3d',
          description: '3D model with detailed labels and animations',
        },
        {
          title: 'GAR Analysis - Heart Rate Zones',
          type: 'Internal Tool',
          url: '/gar-analysis/heart-rate-zones',
          description: 'Calculate personalized training zones',
        },
      ],
      prerequisites: [
        'Basic understanding of human anatomy',
        'Familiarity with exercise terminology',
      ],
      nextLesson: {
        id: '1.2',
        title: 'Muscle Fiber Types and Exercise Response',
      },
    },
  };

  const lesson = lessonContent[lessonId as keyof typeof lessonContent];

  useEffect(() => {
    // Simulate lesson progress tracking
    const interval = setInterval(() => {
      if (isPlaying && currentTime < duration) {
        setCurrentTime((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const progress = (currentTime / duration) * 100;

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Lesson Not Found</h1>
          <p className="text-slate-400 mb-6">The lesson you're looking for doesn't exist.</p>
          <a href={`/academy/courses/${courseId}`}>
            <Button>Return to Course</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <a href={`/academy/courses/${courseId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Button>
            </a>
            <div>
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
              <p className="text-slate-400">
                {lesson.course} • {lesson.source}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Clock className="w-3 h-3 mr-1" />
              {lesson.duration}
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Lesson Progress</span>
            <span className="text-sm text-slate-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Objectives */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lesson.learningObjectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Lesson Sections */}
            <div className="space-y-4">
              {lesson.sections.map((section, idx) => (
                <Card key={section.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        {section.type === 'video' && <Play className="w-5 h-5 text-red-400" />}
                        {section.type === 'interactive' && (
                          <PenTool className="w-5 h-5 text-blue-400" />
                        )}
                        {section.type === 'reading' && (
                          <BookOpen className="w-5 h-5 text-green-400" />
                        )}
                        {section.type === 'simulation' && (
                          <Maximize className="w-5 h-5 text-purple-400" />
                        )}
                        <div>
                          <div className="text-white">{section.title}</div>
                          <div className="text-sm text-slate-400 font-normal">
                            {section.duration} min
                          </div>
                        </div>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {completedSections.includes(section.id) && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        <Button
                          size="sm"
                          onClick={() => markSectionComplete(section.id)}
                          variant={completedSections.includes(section.id) ? 'outline' : 'default'}
                        >
                          {completedSections.includes(section.id) ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Section content would be rendered based on type */}
                    {section.type === 'video' && (
                      <div className="bg-slate-900 rounded-lg p-6 text-center">
                        <Play className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-300 mb-4">Video: {section.title}</p>
                        <div className="flex justify-center gap-4">
                          <Button onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                            {isPlaying ? 'Pause' : 'Play'}
                          </Button>
                          <Button variant="outline">
                            <Volume2 className="w-4 h-4 mr-2" />
                            Transcript
                          </Button>
                        </div>
                      </div>
                    )}

                    {section.type === 'interactive' &&
                      section.content &&
                      'activities' in section.content && (
                        <div className="space-y-3">
                          <p className="text-slate-300">{section.content.description}</p>
                          <div className="grid gap-2">
                            {section.content.activities.map((activity, actIdx) => (
                              <div
                                key={actIdx}
                                className="p-3 bg-slate-700/50 rounded-lg flex items-center justify-between"
                              >
                                <span className="text-slate-300">{activity}</span>
                                <Button size="sm" variant="outline">
                                  Start Activity
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {section.type === 'reading' &&
                      section.content &&
                      'textContent' in section.content && (
                        <div className="prose prose-slate prose-invert max-w-none">
                          <div className="bg-slate-700/30 p-4 rounded-lg">
                            <p className="text-slate-300 mb-4">Reading material preview...</p>
                            <Button>Open Full Reading</Button>
                          </div>
                        </div>
                      )}

                    {section.type === 'simulation' &&
                      section.content &&
                      'scenarios' in section.content && (
                        <div className="space-y-3">
                          <p className="text-slate-300">{section.content.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {section.content.scenarios.map((scenario, scenIdx) => (
                              <div
                                key={scenIdx}
                                className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-500/30 rounded-lg"
                              >
                                <p className="text-slate-300 text-sm mb-3">{scenario}</p>
                                <Button size="sm" className="w-full">
                                  Launch Simulation
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Assessments */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-400" />
                  Lesson Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lesson.assessments.map((assessment, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-700/50 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-white">{assessment.title}</div>
                        <div className="text-sm text-slate-400">
                          {assessment.type === 'quiz' &&
                            `${assessment.questions} questions • ${assessment.timeLimit} min • ${assessment.passingScore}% to pass`}
                          {assessment.type === 'practical' && assessment.description}
                        </div>
                      </div>
                      <Button size="sm">
                        {assessment.type === 'quiz' ? 'Take Quiz' : 'Submit Work'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Resources */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lesson.resources.map((resource, idx) => (
                    <div key={idx} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="font-medium text-white text-sm">{resource.title}</div>
                      <div className="text-xs text-slate-400 mb-2">{resource.type}</div>
                      <Button size="sm" className="w-full" variant="outline">
                        Access Resource
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  My Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes during the lesson..."
                  className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 resize-none"
                />
                <Button size="sm" className="w-full mt-3">
                  Save Notes
                </Button>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Lesson Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <SkipBack className="w-4 h-4 mr-2" />
                  Previous Lesson
                </Button>
                <Button className="w-full">
                  <SkipForward className="w-4 h-4 mr-2" />
                  Next: {lesson.nextLesson.title}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
