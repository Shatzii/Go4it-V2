'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Plus,
  Clock,
  Users,
  MapPin,
  Target,
  CheckCircle,
  Calendar,
  ArrowLeft,
  Search,
  Filter,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateClass() {
  const router = useRouter();
  const [selectedCurriculum, setSelectedCurriculum] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [classForm, setClassForm] = useState({
    title: '',
    description: '',
    instructor: '',
    room: '',
    credits: '1.0',
    gradeLevel: '',
    duration: '',
    schedule: {
      days: [],
      startTime: '',
      endTime: '',
    },
  });

  // Comprehensive curriculum content database
  const curriculumSources = {
    'khan-academy': {
      name: 'Khan Academy',
      description: 'Free world-class education for anyone, anywhere',
      subjects: [
        { id: 'math-algebra', title: 'Algebra Basics', lessons: 45, duration: '30 hours' },
        { id: 'math-geometry', title: 'Geometry', lessons: 38, duration: '25 hours' },
        { id: 'math-algebra2', title: 'Algebra II', lessons: 52, duration: '35 hours' },
        { id: 'math-precalc', title: 'Precalculus', lessons: 41, duration: '28 hours' },
        { id: 'math-calculus', title: 'AP Calculus AB', lessons: 48, duration: '32 hours' },
        { id: 'science-biology', title: 'Biology', lessons: 67, duration: '45 hours' },
        { id: 'science-chemistry', title: 'Chemistry', lessons: 59, duration: '40 hours' },
        { id: 'science-physics', title: 'Physics', lessons: 44, duration: '30 hours' },
        { id: 'history-us', title: 'US History', lessons: 72, duration: '48 hours' },
        { id: 'history-world', title: 'World History', lessons: 68, duration: '45 hours' },
      ],
    },
    openstax: {
      name: 'OpenStax',
      description: 'Peer-reviewed, openly licensed textbooks',
      subjects: [
        { id: 'math-algebra', title: 'College Algebra', chapters: 12, sections: 156 },
        { id: 'math-precalc', title: 'Precalculus', chapters: 13, sections: 178 },
        { id: 'math-calculus1', title: 'Calculus Volume 1', chapters: 6, sections: 89 },
        { id: 'math-calculus2', title: 'Calculus Volume 2', chapters: 7, sections: 94 },
        { id: 'science-biology', title: 'Biology 2e', chapters: 47, sections: 312 },
        { id: 'science-chemistry', title: 'Chemistry 2e', chapters: 21, sections: 189 },
        { id: 'science-physics1', title: 'University Physics Vol 1', chapters: 17, sections: 145 },
        {
          id: 'english-literature',
          title: 'Literature and Composition',
          chapters: 15,
          sections: 123,
        },
        { id: 'history-us', title: 'U.S. History', chapters: 32, sections: 278 },
        {
          id: 'economics-macro',
          title: 'Principles of Macroeconomics',
          chapters: 17,
          sections: 134,
        },
      ],
    },
    'mit-ocw': {
      name: 'MIT OpenCourseWare',
      description: 'Undergraduate and graduate courses from MIT',
      subjects: [
        {
          id: 'math-calculus',
          title: '18.01 Single Variable Calculus',
          lectures: 35,
          assignments: 25,
        },
        { id: 'math-linear', title: '18.06 Linear Algebra', lectures: 34, assignments: 20 },
        { id: 'physics-mech', title: '8.01 Classical Mechanics', lectures: 32, assignments: 24 },
        {
          id: 'physics-em',
          title: '8.02 Electricity and Magnetism',
          lectures: 30,
          assignments: 22,
        },
        {
          id: 'chemistry-general',
          title: '3.091 Introduction to Materials',
          lectures: 38,
          assignments: 28,
        },
        {
          id: 'biology-intro',
          title: '7.012 Introduction to Biology',
          lectures: 33,
          assignments: 18,
        },
        {
          id: 'computer-science',
          title: '6.001 Structure and Interpretation',
          lectures: 26,
          assignments: 15,
        },
        {
          id: 'economics-micro',
          title: '14.01 Principles of Microeconomics',
          lectures: 25,
          assignments: 16,
        },
      ],
    },
    'common-core': {
      name: 'Common Core Standards',
      description: 'State standards for K-12 education',
      subjects: [
        { id: 'math-k5', title: 'Elementary Mathematics K-5', standards: 28, assessments: 45 },
        { id: 'math-6-8', title: 'Middle School Mathematics', standards: 32, assessments: 52 },
        { id: 'math-hs', title: 'High School Mathematics', standards: 24, assessments: 38 },
        { id: 'ela-k5', title: 'Elementary English Language Arts', standards: 35, assessments: 48 },
        { id: 'ela-6-8', title: 'Middle School ELA', standards: 28, assessments: 42 },
        {
          id: 'ela-hs',
          title: 'High School English Language Arts',
          standards: 22,
          assessments: 35,
        },
      ],
    },
  };

  const addCurriculumContent = (sourceId: string, subjectId: string) => {
    const contentId = `${sourceId}-${subjectId}`;
    if (!selectedCurriculum.includes(contentId)) {
      setSelectedCurriculum([...selectedCurriculum, contentId]);
    }
  };

  const removeCurriculumContent = (contentId: string) => {
    setSelectedCurriculum(selectedCurriculum.filter((id) => id !== contentId));
  };

  const handleCreateClass = async () => {
    if (!classForm.title || !classForm.instructor) {
      alert('Please fill in the required fields: Title and Instructor');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/academy/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...classForm,
          selectedCurriculum,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Class created successfully! Students have been automatically enrolled.');
        router.push('/academy/schedule');
      } else {
        alert('Failed to create class: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <a href="/academy/schedule">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schedule
            </Button>
          </a>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Create New Class
            </h1>
            <p className="text-slate-400 mt-2">
              Design a custom class with integrated curriculum content
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Class Configuration */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Class Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Class Title
                  </Label>
                  <Input
                    id="title"
                    value={classForm.title}
                    onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                    placeholder="Advanced Biology with Lab"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={classForm.description}
                    onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                    placeholder="Comprehensive biology course integrating laboratory work and research"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instructor" className="text-white">
                      Instructor
                    </Label>
                    <Input
                      id="instructor"
                      value={classForm.instructor}
                      onChange={(e) => setClassForm({ ...classForm, instructor: e.target.value })}
                      placeholder="Dr. Smith"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="room" className="text-white">
                      Room
                    </Label>
                    <Input
                      id="room"
                      value={classForm.room}
                      onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                      placeholder="Lab 301"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="credits" className="text-white">
                      Credits
                    </Label>
                    <Input
                      id="credits"
                      value={classForm.credits}
                      onChange={(e) => setClassForm({ ...classForm, credits: e.target.value })}
                      placeholder="1.0"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gradeLevel" className="text-white">
                      Grade Level
                    </Label>
                    <Input
                      id="gradeLevel"
                      value={classForm.gradeLevel}
                      onChange={(e) => setClassForm({ ...classForm, gradeLevel: e.target.value })}
                      placeholder="11-12"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Curriculum */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Selected Curriculum ({selectedCurriculum.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedCurriculum.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">No curriculum selected yet</p>
                  ) : (
                    selectedCurriculum.map((contentId) => {
                      const [sourceId, subjectId] = contentId.split('-', 2);
                      const source = curriculumSources[sourceId as keyof typeof curriculumSources];
                      const subject = source?.subjects.find((s) => s.id === subjectId);

                      return (
                        <div
                          key={contentId}
                          className="flex items-center justify-between p-2 bg-slate-700/50 rounded"
                        >
                          <div>
                            <div className="font-semibold text-white">{subject?.title}</div>
                            <div className="text-sm text-slate-400">{source?.name}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeCurriculumContent(contentId)}
                          >
                            Remove
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Curriculum Selection */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Available Curriculum Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(curriculumSources).map(([sourceId, source]) => (
                    <div key={sourceId} className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-400" />
                          {source.name}
                        </h3>
                        <p className="text-sm text-slate-400">{source.description}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                        {source.subjects.map((subject) => {
                          const isSelected = selectedCurriculum.includes(
                            `${sourceId}-${subject.id}`,
                          );
                          return (
                            <div
                              key={subject.id}
                              className="flex items-center justify-between p-2 bg-slate-700/30 rounded"
                            >
                              <div>
                                <div className="font-medium text-white text-sm">
                                  {subject.title}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {'lessons' in subject &&
                                    `${subject.lessons} lessons • ${subject.duration}`}
                                  {'chapters' in subject &&
                                    `${subject.chapters} chapters • ${subject.sections} sections`}
                                  {'lectures' in subject &&
                                    `${subject.lectures} lectures • ${subject.assignments} assignments`}
                                  {'standards' in subject &&
                                    `${subject.standards} standards • ${subject.assessments} assessments`}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant={isSelected ? 'outline' : 'default'}
                                onClick={() =>
                                  isSelected
                                    ? removeCurriculumContent(`${sourceId}-${subject.id}`)
                                    : addCurriculumContent(sourceId, subject.id)
                                }
                              >
                                {isSelected ? 'Remove' : 'Add'}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-8">
          <Button variant="outline">Save as Draft</Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleCreateClass}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Class'}
          </Button>
        </div>
      </div>
    </div>
  );
}
