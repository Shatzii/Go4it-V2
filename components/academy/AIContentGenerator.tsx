'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sparkles,
  BookOpen,
  FileText,
  Brain,
  Target,
  Users,
  Clock,
  Star,
  Save,
  Download,
  Edit,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  gradeLevel: string;
  templateType: string;
  templateData: any;
  rating: number;
  usageCount: number;
}

interface GeneratedContent {
  id: string;
  content: string;
  contentType: string;
  metadata: any;
  rating?: number;
  approved?: boolean;
}

export default function AIContentGenerator({ courseId, teacherId }: { courseId?: string; teacherId?: string }) {
  const [activeTab, setActiveTab] = useState('lesson');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [recentContent, setRecentContent] = useState<GeneratedContent[]>([]);

  // Form states
  const [lessonForm, setLessonForm] = useState({
    subject: '',
    gradeLevel: '',
    topic: '',
    learningObjectives: '',
    difficulty: 'intermediate',
    learningStyle: 'mixed',
    accommodations: [] as string[],
    duration: 45,
  });

  const [assignmentForm, setAssignmentForm] = useState({
    subject: '',
    gradeLevel: '',
    topic: '',
    instructions: '',
    points: 100,
    difficulty: 'intermediate',
    dueDate: '',
    rubric: '',
  });

  const [quizForm, setQuizForm] = useState({
    subject: '',
    gradeLevel: '',
    topic: '',
    questionCount: 10,
    difficulty: 'intermediate',
    questionTypes: ['multiple-choice', 'true-false'],
    timeLimit: 30,
  });

  useEffect(() => {
    loadTemplates();
    loadRecentContent();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/academy/ai/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadRecentContent = async () => {
    try {
      const response = await fetch(`/api/academy/ai/recent?teacherId=${teacherId}`);
      if (response.ok) {
        const data = await response.json();
        setRecentContent(data.content || []);
      }
    } catch (error) {
      console.error('Error loading recent content:', error);
    }
  };

  const generateLesson = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/academy/ai/generate/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lessonForm,
          courseId,
          teacherId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent({
          id: data.id,
          content: data.content,
          contentType: 'lesson',
          metadata: data.metadata,
        });
      }
    } catch (error) {
      console.error('Error generating lesson:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAssignment = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/academy/ai/generate/assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...assignmentForm,
          courseId,
          teacherId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent({
          id: data.id,
          content: data.content,
          contentType: 'assignment',
          metadata: data.metadata,
        });
      }
    } catch (error) {
      console.error('Error generating assignment:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateQuiz = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/academy/ai/generate/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quizForm,
          courseId,
          teacherId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent({
          id: data.id,
          content: data.content,
          contentType: 'quiz',
          metadata: data.metadata,
        });
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveContent = async () => {
    if (!generatedContent) return;

    try {
      const response = await fetch('/api/academy/ai/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: generatedContent.id,
          courseId,
          teacherId,
        }),
      });

      if (response.ok) {
        alert('Content saved successfully!');
        loadRecentContent();
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const rateContent = async (rating: number) => {
    if (!generatedContent) return;

    try {
      await fetch('/api/academy/ai/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: generatedContent.id,
          rating,
          teacherId,
        }),
      });
    } catch (error) {
      console.error('Error rating content:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            AI Content Generator
          </h2>
          <p className="text-slate-300">Generate high-quality educational content with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Brain className="w-4 h-4 mr-2" />
            View Templates
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Star className="w-4 h-4 mr-2" />
            My Favorites
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Generation Form */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Generate Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                  <TabsTrigger value="lesson" className="text-white">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Lesson
                  </TabsTrigger>
                  <TabsTrigger value="assignment" className="text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Assignment
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="text-white">
                    <Target className="w-4 h-4 mr-2" />
                    Quiz
                  </TabsTrigger>
                </TabsList>

                {/* Lesson Generation */}
                <TabsContent value="lesson" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                      <Input
                        id="subject"
                        value={lessonForm.subject}
                        onChange={(e) => setLessonForm({...lessonForm, subject: e.target.value})}
                        placeholder="e.g., Biology, Mathematics"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gradeLevel" className="text-slate-300">Grade Level</Label>
                      <Select value={lessonForm.gradeLevel} onValueChange={(value) => setLessonForm({...lessonForm, gradeLevel: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="k-2">K-2</SelectItem>
                          <SelectItem value="3-5">3-5</SelectItem>
                          <SelectItem value="6-8">6-8</SelectItem>
                          <SelectItem value="9-12">9-12</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="topic" className="text-slate-300">Topic</Label>
                    <Input
                      id="topic"
                      value={lessonForm.topic}
                      onChange={(e) => setLessonForm({...lessonForm, topic: e.target.value})}
                      placeholder="e.g., Photosynthesis, Quadratic Equations"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="objectives" className="text-slate-300">Learning Objectives</Label>
                    <Textarea
                      id="objectives"
                      value={lessonForm.learningObjectives}
                      onChange={(e) => setLessonForm({...lessonForm, learningObjectives: e.target.value})}
                      placeholder="What should students learn from this lesson?"
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-300">Difficulty</Label>
                      <Select value={lessonForm.difficulty} onValueChange={(value) => setLessonForm({...lessonForm, difficulty: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300">Learning Style</Label>
                      <Select value={lessonForm.learningStyle} onValueChange={(value) => setLessonForm({...lessonForm, learningStyle: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visual">Visual</SelectItem>
                          <SelectItem value="auditory">Auditory</SelectItem>
                          <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300">Duration (min)</Label>
                      <Input
                        type="number"
                        value={lessonForm.duration}
                        onChange={(e) => setLessonForm({...lessonForm, duration: parseInt(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={generateLesson}
                    disabled={isGenerating || !lessonForm.subject || !lessonForm.topic}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Lesson...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Lesson
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* Assignment Generation */}
                <TabsContent value="assignment" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Subject</Label>
                      <Input
                        value={assignmentForm.subject}
                        onChange={(e) => setAssignmentForm({...assignmentForm, subject: e.target.value})}
                        placeholder="e.g., Biology, Mathematics"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Grade Level</Label>
                      <Select value={assignmentForm.gradeLevel} onValueChange={(value) => setAssignmentForm({...assignmentForm, gradeLevel: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="k-2">K-2</SelectItem>
                          <SelectItem value="3-5">3-5</SelectItem>
                          <SelectItem value="6-8">6-8</SelectItem>
                          <SelectItem value="9-12">9-12</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Topic</Label>
                    <Input
                      value={assignmentForm.topic}
                      onChange={(e) => setAssignmentForm({...assignmentForm, topic: e.target.value})}
                      placeholder="e.g., Research Paper, Lab Report"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Instructions</Label>
                    <Textarea
                      value={assignmentForm.instructions}
                      onChange={(e) => setAssignmentForm({...assignmentForm, instructions: e.target.value})}
                      placeholder="Describe what students need to do..."
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-300">Points</Label>
                      <Input
                        type="number"
                        value={assignmentForm.points}
                        onChange={(e) => setAssignmentForm({...assignmentForm, points: parseInt(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Difficulty</Label>
                      <Select value={assignmentForm.difficulty} onValueChange={(value) => setAssignmentForm({...assignmentForm, difficulty: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300">Due Date</Label>
                      <Input
                        type="date"
                        value={assignmentForm.dueDate}
                        onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={generateAssignment}
                    disabled={isGenerating || !assignmentForm.subject || !assignmentForm.topic}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Assignment...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Assignment
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* Quiz Generation */}
                <TabsContent value="quiz" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Subject</Label>
                      <Input
                        value={quizForm.subject}
                        onChange={(e) => setQuizForm({...quizForm, subject: e.target.value})}
                        placeholder="e.g., Biology, Mathematics"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Grade Level</Label>
                      <Select value={quizForm.gradeLevel} onValueChange={(value) => setQuizForm({...quizForm, gradeLevel: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="k-2">K-2</SelectItem>
                          <SelectItem value="3-5">3-5</SelectItem>
                          <SelectItem value="6-8">6-8</SelectItem>
                          <SelectItem value="9-12">9-12</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Topic</Label>
                    <Input
                      value={quizForm.topic}
                      onChange={(e) => setQuizForm({...quizForm, topic: e.target.value})}
                      placeholder="e.g., Photosynthesis, Algebra"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-300">Questions</Label>
                      <Input
                        type="number"
                        value={quizForm.questionCount}
                        onChange={(e) => setQuizForm({...quizForm, questionCount: parseInt(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Difficulty</Label>
                      <Select value={quizForm.difficulty} onValueChange={(value) => setQuizForm({...quizForm, difficulty: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300">Time Limit (min)</Label>
                      <Input
                        type="number"
                        value={quizForm.timeLimit}
                        onChange={(e) => setQuizForm({...quizForm, timeLimit: parseInt(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={generateQuiz}
                    disabled={isGenerating || !quizForm.subject || !quizForm.topic}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Quiz...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Generate Quiz
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Generated Content Preview */}
        <div className="lg:col-span-1">
          {generatedContent ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Generated Content
                  <Badge className="bg-purple-600">{generatedContent.contentType}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-96 overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: generatedContent.content }} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveContent} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="border-slate-600">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-300 text-sm">Rate this content:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => rateContent(star)}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Generated content will appear here</p>
              </CardContent>
            </Card>
          )}

          {/* Recent Content */}
          <Card className="bg-slate-800 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Recent Generations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentContent.slice(0, 5).map((content) => (
                  <div key={content.id} className="p-3 bg-slate-700 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="text-xs">{content.contentType}</Badge>
                      {content.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-slate-300">{content.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 truncate">
                      {content.content.substring(0, 50)}...
                    </p>
                  </div>
                ))}
                {recentContent.length === 0 && (
                  <p className="text-slate-400 text-center py-4">No recent content</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}