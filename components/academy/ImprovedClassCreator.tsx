'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Clock,
  Users,
  Calendar,
  Target,
  CheckCircle,
  Upload,
  Video,
  FileText,
  Link,
  Plus,
  Trash2,
  Save,
  Eye,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'assignment' | 'quiz' | 'discussion';
  content: string;
  duration: number;
  order: number;
}

interface ClassData {
  title: string;
  description: string;
  instructor: string;
  subject: string;
  gradeLevel: string;
  credits: number;
  capacity: number;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
  };
  objectives: string[];
  prerequisites: string[];
  lessons: Lesson[];
  assessments: {
    assignments: number;
    quizzes: number;
    midterm: boolean;
    final: boolean;
  };
}

export default function ImprovedClassCreator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [classData, setClassData] = useState<ClassData>({
    title: '',
    description: '',
    instructor: '',
    subject: '',
    gradeLevel: '',
    credits: 1,
    capacity: 25,
    schedule: {
      days: [],
      startTime: '',
      endTime: '',
      startDate: '',
      endDate: '',
    },
    objectives: [],
    prerequisites: [],
    lessons: [],
    assessments: {
      assignments: 5,
      quizzes: 3,
      midterm: true,
      final: true,
    },
  });

  const [newObjective, setNewObjective] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    id: '',
    title: '',
    description: '',
    type: 'video',
    content: '',
    duration: 45,
    order: 1,
  });

  const steps = [
    { title: 'Basic Info', icon: <BookOpen className="w-4 h-4" /> },
    { title: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { title: 'Content', icon: <FileText className="w-4 h-4" /> },
    { title: 'Assessments', icon: <CheckCircle className="w-4 h-4" /> },
    { title: 'Review', icon: <Eye className="w-4 h-4" /> },
  ];

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Foreign Language',
    'Arts',
    'Physical Education',
    'Technology',
    'Business',
    'Other',
  ];

  const gradeLevels = [
    '7th Grade',
    '8th Grade',
    '9th Grade',
    '10th Grade',
    '11th Grade',
    '12th Grade',
    'Mixed Grades',
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
  ];

  const lessonTypes = [
    { value: 'video', label: 'Video Lesson', icon: <Video className="w-4 h-4" /> },
    { value: 'reading', label: 'Reading Assignment', icon: <FileText className="w-4 h-4" /> },
    { value: 'assignment', label: 'Written Assignment', icon: <Upload className="w-4 h-4" /> },
    { value: 'quiz', label: 'Quiz/Test', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'discussion', label: 'Discussion Forum', icon: <Users className="w-4 h-4" /> },
  ];

  const addObjective = () => {
    if (newObjective.trim()) {
      setClassData({
        ...classData,
        objectives: [...classData.objectives, newObjective.trim()],
      });
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setClassData({
      ...classData,
      objectives: classData.objectives.filter((_, i) => i !== index),
    });
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setClassData({
        ...classData,
        prerequisites: [...classData.prerequisites, newPrerequisite.trim()],
      });
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index: number) => {
    setClassData({
      ...classData,
      prerequisites: classData.prerequisites.filter((_, i) => i !== index),
    });
  };

  const addLesson = () => {
    if (currentLesson.title.trim()) {
      const newLesson = {
        ...currentLesson,
        id: Date.now().toString(),
        order: classData.lessons.length + 1,
      };
      setClassData({
        ...classData,
        lessons: [...classData.lessons, newLesson],
      });
      setCurrentLesson({
        id: '',
        title: '',
        description: '',
        type: 'video',
        content: '',
        duration: 45,
        order: 1,
      });
    }
  };

  const removeLesson = (id: string) => {
    setClassData({
      ...classData,
      lessons: classData.lessons.filter((lesson) => lesson.id !== id),
    });
  };

  const toggleScheduleDay = (day: string) => {
    const days = classData.schedule.days.includes(day)
      ? classData.schedule.days.filter((d) => d !== day)
      : [...classData.schedule.days, day];

    setClassData({
      ...classData,
      schedule: { ...classData.schedule, days },
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/academy/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData),
      });

      if (response.ok) {
        alert('Class created successfully!');
        // Reset form or redirect
      } else {
        alert('Failed to create class. Please try again.');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
            Create New Class
          </h1>
          <p className="text-slate-400">
            Build comprehensive courses with integrated curriculum and assessments
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600 text-white'
                      : index < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {step.icon}
                  <span className="hidden md:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && <div className="w-8 h-0.5 bg-slate-600 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-6">
            {/* Step 0: Basic Info */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Class Title *
                    </Label>
                    <Input
                      id="title"
                      value={classData.title}
                      onChange={(e) => setClassData({ ...classData, title: e.target.value })}
                      placeholder="Advanced Biology with Lab"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="instructor" className="text-white">
                      Instructor *
                    </Label>
                    <Input
                      id="instructor"
                      value={classData.instructor}
                      onChange={(e) => setClassData({ ...classData, instructor: e.target.value })}
                      placeholder="Dr. Smith"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-white">
                      Subject *
                    </Label>
                    <Select
                      value={classData.subject}
                      onValueChange={(value) => setClassData({ ...classData, subject: value })}
                    >
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

                  <div>
                    <Label htmlFor="gradeLevel" className="text-white">
                      Grade Level *
                    </Label>
                    <Select
                      value={classData.gradeLevel}
                      onValueChange={(value) => setClassData({ ...classData, gradeLevel: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="credits" className="text-white">
                      Credits
                    </Label>
                    <Input
                      id="credits"
                      type="number"
                      min="0.5"
                      max="2"
                      step="0.5"
                      value={classData.credits}
                      onChange={(e) =>
                        setClassData({ ...classData, credits: parseFloat(e.target.value) })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="capacity" className="text-white">
                      Class Capacity
                    </Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="50"
                      value={classData.capacity}
                      onChange={(e) =>
                        setClassData({ ...classData, capacity: parseInt(e.target.value) })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={classData.description}
                    onChange={(e) => setClassData({ ...classData, description: e.target.value })}
                    placeholder="Comprehensive course description..."
                    className="bg-slate-700 border-slate-600 text-white h-24"
                  />
                </div>

                {/* Learning Objectives */}
                <div>
                  <Label className="text-white">Learning Objectives</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Add learning objective..."
                      className="bg-slate-700 border-slate-600 text-white flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                    />
                    <Button onClick={addObjective} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {classData.objectives.map((objective, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-600/20 text-blue-400"
                      >
                        {objective}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeObjective(index)}
                          className="ml-2 p-0 h-auto text-blue-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                <div>
                  <Label className="text-white">Prerequisites</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      placeholder="Add prerequisite..."
                      className="bg-slate-700 border-slate-600 text-white flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
                    />
                    <Button onClick={addPrerequisite} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {classData.prerequisites.map((prereq, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-yellow-600/20 text-yellow-400"
                      >
                        {prereq}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removePrerequisite(index)}
                          className="ml-2 p-0 h-auto text-yellow-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Schedule */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Class Schedule</h2>

                <div>
                  <Label className="text-white mb-3 block">Meeting Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <Button
                        key={day.value}
                        variant={
                          classData.schedule.days.includes(day.value) ? 'default' : 'outline'
                        }
                        onClick={() => toggleScheduleDay(day.value)}
                        className="flex-1 min-w-24"
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="startTime" className="text-white">
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={classData.schedule.startTime}
                      onChange={(e) =>
                        setClassData({
                          ...classData,
                          schedule: { ...classData.schedule, startTime: e.target.value },
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endTime" className="text-white">
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={classData.schedule.endTime}
                      onChange={(e) =>
                        setClassData({
                          ...classData,
                          schedule: { ...classData.schedule, endTime: e.target.value },
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="startDate" className="text-white">
                      Course Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={classData.schedule.startDate}
                      onChange={(e) =>
                        setClassData({
                          ...classData,
                          schedule: { ...classData.schedule, startDate: e.target.value },
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate" className="text-white">
                      Course End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={classData.schedule.endDate}
                      onChange={(e) =>
                        setClassData({
                          ...classData,
                          schedule: { ...classData.schedule, endDate: e.target.value },
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional steps would continue here... */}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Create Class
              </Button>
            ) : (
              <Button onClick={nextStep}>Next</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
