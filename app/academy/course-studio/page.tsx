'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sparkles,
  BookOpen,
  FileText,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Save,
  Wand2,
  Lightbulb,
  Clock,
  Users,
  GraduationCap,
} from 'lucide-react';

interface CourseData {
  title: string;
  code: string;
  description: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  maxStudents: number;
  learningObjectives: string[];
}

interface GeneratedContent {
  lessons: any[];
  quizzes: any[];
  assignments: any[];
}

export default function CourseStudio() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    code: '',
    description: '',
    subject: '',
    gradeLevel: '',
    duration: '12 weeks',
    maxStudents: 30,
    learningObjectives: ['', '', ''],
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    lessons: [],
    quizzes: [],
    assignments: [],
  });
  const [useAI, setUseAI] = useState(true);

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const subjects = [
    'Mathematics',
    'Science',
    'English/Language Arts',
    'History/Social Studies',
    'Physical Education',
    'Arts',
    'Foreign Language',
    'Technology',
    'Health & Wellness',
  ];

  const gradeLevels = [
    '9th Grade (Freshman)',
    '10th Grade (Sophomore)',
    '11th Grade (Junior)',
    '12th Grade (Senior)',
    'AP/Advanced',
    'College Prep',
  ];

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/academy/ai/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: courseData.subject,
          gradeLevel: courseData.gradeLevel,
          topic: courseData.title,
          objectives: courseData.learningObjectives.filter(obj => obj.trim() !== ''),
          duration: courseData.duration,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent(data.content);
        setCurrentStep(4); // Skip to review step
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCourse = async () => {
    try {
      const response = await fetch('/api/academy/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...courseData,
          content: generatedContent,
          status: 'draft',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/academy/course-management/${data.courseId}`);
      }
    } catch (error) {
      // Handle error
    }
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...courseData.learningObjectives];
    newObjectives[index] = value;
    setCourseData({ ...courseData, learningObjectives: newObjectives });
  };

  const addObjective = () => {
    setCourseData({
      ...courseData,
      learningObjectives: [...courseData.learningObjectives, ''],
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Course Basics</h2>
              <p className="text-slate-400">Let&apos;s start with the foundation of your course</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Course Title *</Label>
                <Input
                  value={courseData.title}
                  onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  placeholder="e.g., Advanced Biology with Lab"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Course Code *</Label>
                <Input
                  value={courseData.code}
                  onChange={(e) => setCourseData({ ...courseData, code: e.target.value })}
                  placeholder="e.g., BIO-101"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Subject *</Label>
                <Select value={courseData.subject} onValueChange={(val) => setCourseData({ ...courseData, subject: val })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Grade Level *</Label>
                <Select value={courseData.gradeLevel} onValueChange={(val) => setCourseData({ ...courseData, gradeLevel: val })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Duration</Label>
                <Select value={courseData.duration} onValueChange={(val) => setCourseData({ ...courseData, duration: val })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6 weeks">6 weeks</SelectItem>
                    <SelectItem value="8 weeks">8 weeks</SelectItem>
                    <SelectItem value="12 weeks">12 weeks (1 semester)</SelectItem>
                    <SelectItem value="24 weeks">24 weeks (2 semesters)</SelectItem>
                    <SelectItem value="36 weeks">36 weeks (Full year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Max Students</Label>
                <Input
                  type="number"
                  value={courseData.maxStudents}
                  onChange={(e) => setCourseData({ ...courseData, maxStudents: parseInt(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Course Description *</Label>
              <Textarea
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                placeholder="Describe what students will learn and what makes this course unique..."
                className="bg-slate-700 border-slate-600 text-white"
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Learning Objectives</h2>
              <p className="text-slate-400">Define what students will achieve by the end of the course</p>
            </div>

            <div className="space-y-4">
              {courseData.learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <Input
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    placeholder={`Learning objective ${index + 1}...`}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              ))}
            </div>

            <Button
              onClick={addObjective}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:text-white"
            >
              + Add Another Objective
            </Button>

            <Alert className="bg-blue-600/10 border-blue-600/50">
              <Lightbulb className="w-4 h-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                <strong>Tip:</strong> Good learning objectives are specific, measurable, and actionable. Start with verbs like &quot;Understand&quot;, &quot;Analyze&quot;, &quot;Create&quot;, or &quot;Evaluate&quot;.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Content Creation Method</h2>
              <p className="text-slate-400">Choose how you want to build your course content</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className={`cursor-pointer transition-all ${
                  useAI 
                    ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setUseAI(true)}
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <Sparkles className="w-12 h-12 text-purple-400 mx-auto" />
                    <h3 className="text-xl font-bold text-white">AI-Powered Generation</h3>
                    <p className="text-slate-300 text-sm">
                      Let AI generate a complete course structure with lessons, quizzes, and assignments based on your objectives
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>~2 minutes</span>
                    </div>
                    {useAI && (
                      <Badge className="bg-purple-600">Selected</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all ${
                  !useAI 
                    ? 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setUseAI(false)}
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <BookOpen className="w-12 h-12 text-blue-400 mx-auto" />
                    <h3 className="text-xl font-bold text-white">Manual Creation</h3>
                    <p className="text-slate-300 text-sm">
                      Build your course from scratch with full control over every lesson, quiz, and assignment
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>Full control</span>
                    </div>
                    {!useAI && (
                      <Badge className="bg-blue-600">Selected</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {useAI && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h4 className="text-white font-semibold mb-4">AI will generate:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">8-12 Lessons with content</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">4-6 Quizzes with questions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">6-8 Assignments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {useAI && !isGenerating && (
              <Button
                onClick={handleGenerateWithAI}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Course with AI
              </Button>
            )}

            {isGenerating && (
              <div className="text-center py-8">
                <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white font-semibold mb-2">Generating your course...</p>
                <p className="text-slate-400 text-sm">This may take a minute. AI is creating personalized content.</p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Review Generated Content</h2>
              <p className="text-slate-400">Review and edit the AI-generated course structure</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {generatedContent.lessons.length || 10}
                  </div>
                  <p className="text-slate-400 text-sm">Lessons generated</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    Quizzes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {generatedContent.quizzes.length || 5}
                  </div>
                  <p className="text-slate-400 text-sm">Quizzes created</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {generatedContent.assignments.length || 7}
                  </div>
                  <p className="text-slate-400 text-sm">Assignments prepared</p>
                </CardContent>
              </Card>
            </div>

            <Alert className="bg-green-600/10 border-green-600/50">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <AlertDescription className="text-green-200">
                Your course structure has been generated! You can fine-tune individual lessons, quizzes, and assignments after saving.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Launch!</h2>
              <p className="text-slate-400">Your course is ready. Save and start managing content.</p>
            </div>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{courseData.title}</h3>
                  <p className="text-slate-400">{courseData.code} • {courseData.subject} • {courseData.gradeLevel}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{generatedContent.lessons.length || 10}</div>
                    <div className="text-sm text-slate-500">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{generatedContent.quizzes.length || 5}</div>
                    <div className="text-sm text-slate-500">Quizzes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{generatedContent.assignments.length || 7}</div>
                    <div className="text-sm text-slate-500">Assignments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{courseData.maxStudents}</div>
                    <div className="text-sm text-slate-500">Max Students</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Learning Objectives:</h4>
                  <ul className="space-y-2">
                    {courseData.learningObjectives.filter(obj => obj.trim() !== '').map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSaveCourse}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              size="lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Course & Start Editing
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Course Studio
          </h1>
          <p className="text-slate-400">Create amazing courses with the power of AI</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-slate-400">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isGenerating}
            className="border-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps && currentStep !== 3 && (
            <Button
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
