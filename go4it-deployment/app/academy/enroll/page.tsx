'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  ArrowLeft,
  Search,
  Plus,
  UserPlus,
  GraduationCap,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function StudentEnrollment() {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollmentStep, setEnrollmentStep] = useState('grade-selection'); // grade-selection, core-assignment, elective-selection, confirmation

  const gradeOptions = [
    { value: '7th', label: '7th Grade', description: 'Middle School - Foundation Year' },
    { value: '8th', label: '8th Grade', description: 'Middle School - Pre-High School' },
    { value: '9th', label: '9th Grade', description: 'Freshman - High School Entry' },
    { value: '10th', label: '10th Grade', description: 'Sophomore - Building Year' },
    { value: '11th', label: '11th Grade', description: 'Junior - College Prep' },
    { value: '12th', label: '12th Grade', description: 'Senior - Graduation Year' },
  ];

  const coreClassesByGrade = {
    '7th': [
      {
        id: 'math-7-pre-algebra',
        title: 'Pre-Algebra',
        instructor: 'Ms. Rodriguez',
        period: 1,
        room: 'Math 101',
      },
      {
        id: 'science-7-life-science',
        title: 'Life Science',
        instructor: 'Mr. Thompson',
        period: 2,
        room: 'Science Lab A',
      },
      {
        id: 'english-7-language-arts',
        title: 'English Language Arts 7',
        instructor: 'Mrs. Johnson',
        period: 3,
        room: 'English 201',
      },
      {
        id: 'social-7-world-geography',
        title: 'World Geography',
        instructor: 'Mr. Davis',
        period: 4,
        room: 'Social Studies 301',
      },
    ],
    '8th': [
      {
        id: 'math-8-algebra1',
        title: 'Algebra I',
        instructor: 'Ms. Chen',
        period: 1,
        room: 'Math 102',
      },
      {
        id: 'science-8-physical-science',
        title: 'Physical Science',
        instructor: 'Dr. Martinez',
        period: 2,
        room: 'Science Lab B',
      },
      {
        id: 'english-8-language-arts',
        title: 'English Language Arts 8',
        instructor: 'Mr. Wilson',
        period: 3,
        room: 'English 202',
      },
      {
        id: 'social-8-american-history',
        title: 'American History',
        instructor: 'Mrs. Brown',
        period: 4,
        room: 'Social Studies 302',
      },
    ],
    '9th': [
      {
        id: 'math-9-geometry',
        title: 'Geometry',
        instructor: 'Mr. Anderson',
        period: 2,
        room: 'Math 201',
      },
      {
        id: 'science-9-biology',
        title: 'Biology',
        instructor: 'Dr. Taylor',
        period: 3,
        room: 'Biology Lab',
      },
      {
        id: 'english-9-literature',
        title: 'English 9',
        instructor: 'Ms. Garcia',
        period: 4,
        room: 'English 301',
      },
      {
        id: 'social-9-world-history',
        title: 'World History',
        instructor: 'Mr. Lee',
        period: 5,
        room: 'Social Studies 401',
      },
    ],
    '10th': [
      {
        id: 'math-10-algebra2',
        title: 'Algebra II',
        instructor: 'Mrs. Parker',
        period: 1,
        room: 'Math 202',
      },
      {
        id: 'science-10-chemistry',
        title: 'Chemistry',
        instructor: 'Dr. Kim',
        period: 2,
        room: 'Chemistry Lab',
      },
      {
        id: 'english-10-literature',
        title: 'English 10',
        instructor: 'Mr. White',
        period: 3,
        room: 'English 302',
      },
      {
        id: 'social-10-world-studies',
        title: 'Modern World Studies',
        instructor: 'Ms. Turner',
        period: 4,
        room: 'Social Studies 402',
      },
    ],
    '11th': [
      {
        id: 'math-11-precalculus',
        title: 'Pre-Calculus',
        instructor: 'Dr. Singh',
        period: 1,
        room: 'Math 301',
      },
      {
        id: 'science-11-physics',
        title: 'Physics',
        instructor: 'Mr. Jackson',
        period: 2,
        room: 'Physics Lab',
      },
      {
        id: 'english-11-american-lit',
        title: 'American Literature',
        instructor: 'Ms. Roberts',
        period: 3,
        room: 'English 401',
      },
      {
        id: 'social-11-us-history',
        title: 'U.S. History',
        instructor: 'Mr. Cooper',
        period: 4,
        room: 'Social Studies 501',
      },
    ],
    '12th': [
      {
        id: 'math-12-calculus',
        title: 'AP Calculus AB',
        instructor: 'Dr. Patel',
        period: 1,
        room: 'Math 401',
      },
      {
        id: 'science-12-ap-bio',
        title: 'AP Biology',
        instructor: 'Dr. Adams',
        period: 2,
        room: 'AP Biology Lab',
      },
      {
        id: 'english-12-british-lit',
        title: 'British Literature',
        instructor: 'Mrs. Miller',
        period: 3,
        room: 'English 501',
      },
      {
        id: 'social-12-government',
        title: 'Government & Economics',
        instructor: 'Mr. Hayes',
        period: 4,
        room: 'Social Studies 601',
      },
    ],
  };

  const electiveOptions = [
    {
      id: 'art-visual-arts',
      title: 'Visual Arts',
      instructor: 'Ms. Parker',
      period: 5,
      room: 'Art Studio',
      description: 'Drawing, painting, and design fundamentals',
      credits: 0.5,
      category: 'Fine Arts',
    },
    {
      id: 'music-band',
      title: 'Concert Band',
      instructor: 'Mr. Miller',
      period: 6,
      room: 'Band Hall',
      description: 'Instrumental music performance and music theory',
      credits: 1.0,
      category: 'Fine Arts',
    },
    {
      id: 'music-choir',
      title: 'Choir',
      instructor: 'Mrs. Davis',
      period: 6,
      room: 'Choir Room',
      description: 'Vocal music performance and sight-reading',
      credits: 1.0,
      category: 'Fine Arts',
    },
    {
      id: 'cs-programming',
      title: 'Computer Programming',
      instructor: 'Ms. Kim',
      period: 7,
      room: 'Computer Lab',
      description: 'Introduction to coding in Python and JavaScript',
      credits: 1.0,
      category: 'Technology',
    },
    {
      id: 'pe-health',
      title: 'Physical Education & Health',
      instructor: 'Coach Williams',
      period: 6,
      room: 'Gymnasium',
      description: 'Physical fitness, health education, and wellness',
      credits: 1.0,
      category: 'Health & PE',
    },
    {
      id: 'lang-spanish1',
      title: 'Spanish I',
      instructor: 'Señora Morales',
      period: 7,
      room: 'Language Lab',
      description: 'Beginning Spanish language and culture',
      credits: 1.0,
      category: 'World Languages',
    },
    {
      id: 'lang-spanish2',
      title: 'Spanish II',
      instructor: 'Señora Morales',
      period: 7,
      room: 'Language Lab',
      description: 'Intermediate Spanish language and culture',
      credits: 1.0,
      category: 'World Languages',
      prerequisite: 'Spanish I',
    },
    {
      id: 'bus-entrepreneurship',
      title: 'Entrepreneurship',
      instructor: 'Mr. Johnson',
      period: 5,
      room: 'Business Lab',
      description: 'Business planning, marketing, and financial literacy',
      credits: 0.5,
      category: 'Business',
    },
    {
      id: 'eng-journalism',
      title: 'Journalism',
      instructor: 'Ms. Taylor',
      period: 5,
      room: 'Media Center',
      description: 'News writing, media literacy, and digital publishing',
      credits: 0.5,
      category: 'English',
    },
    {
      id: 'sci-environmental',
      title: 'Environmental Science',
      instructor: 'Dr. Green',
      period: 7,
      room: 'Science Lab C',
      description: 'Ecology, sustainability, and environmental issues',
      credits: 0.5,
      category: 'Science',
    },
  ];

  const [selectedElectives, setSelectedElectives] = useState<string[]>([]);

  const handleGradeSelection = (grade: string) => {
    setSelectedGrade(grade);
    setEnrollmentStep('core-assignment');
  };

  const handleElectiveToggle = (electiveId: string) => {
    setSelectedElectives((prev) =>
      prev.includes(electiveId) ? prev.filter((id) => id !== electiveId) : [...prev, electiveId],
    );
  };

  const proceedToElectives = () => {
    setEnrollmentStep('elective-selection');
  };

  const finalizeEnrollment = () => {
    setEnrollmentStep('confirmation');
    // Here you would normally save the enrollment data
  };

  const getCoreClasses = () => {
    return coreClassesByGrade[selectedGrade as keyof typeof coreClassesByGrade] || [];
  };

  const getSelectedElectives = () => {
    return electiveOptions.filter((elective) => selectedElectives.includes(elective.id));
  };

  const getTotalCredits = () => {
    const coreCredits = getCoreClasses().length; // Each core class is 1 credit
    const electiveCredits = getSelectedElectives().reduce(
      (sum, elective) => sum + elective.credits,
      0,
    );
    return coreCredits + electiveCredits;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/academy">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Academy
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Student Enrollment</h1>
              <p className="text-slate-400">Enroll students in classes and create schedules</p>
            </div>
          </div>
        </div>

        {/* Enrollment Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                enrollmentStep === 'grade-selection' ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Grade Selection
            </div>
            <div className="w-8 h-0.5 bg-slate-600"></div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                enrollmentStep === 'core-assignment' ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Core Classes
            </div>
            <div className="w-8 h-0.5 bg-slate-600"></div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                enrollmentStep === 'elective-selection' ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              Electives
            </div>
            <div className="w-8 h-0.5 bg-slate-600"></div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                enrollmentStep === 'confirmation' ? 'bg-green-600' : 'bg-slate-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Confirmation
            </div>
          </div>
        </div>

        {/* Grade Selection Step */}
        {enrollmentStep === 'grade-selection' && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Select Grade Level</CardTitle>
                <p className="text-slate-400">
                  Choose the student's grade level to automatically assign core classes
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gradeOptions.map((grade) => (
                    <Card
                      key={grade.value}
                      className="bg-slate-700/50 border-slate-600 hover:border-blue-400 cursor-pointer transition-colors"
                      onClick={() => handleGradeSelection(grade.value)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-white">{grade.label}</CardTitle>
                        <p className="text-sm text-slate-400">{grade.description}</p>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" variant="outline">
                          Select Grade
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Core Classes Assignment */}
        {enrollmentStep === 'core-assignment' && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Core Classes - {selectedGrade} Grade
                </CardTitle>
                <p className="text-slate-400">
                  These core classes are automatically assigned for {selectedGrade} grade students
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getCoreClasses().map((coreClass) => (
                    <div
                      key={coreClass.id}
                      className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[60px]">
                            <div className="text-sm font-semibold text-blue-400">
                              Period {coreClass.period}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{coreClass.title}</h3>
                            <div className="text-sm text-slate-300 flex items-center gap-4">
                              <span>{coreClass.instructor}</span>
                              <span>{coreClass.room}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <Badge className="bg-blue-600/20 text-blue-400">Required</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-600">
                  <div className="text-slate-400">
                    Core Credits:{' '}
                    <span className="text-white font-semibold">{getCoreClasses().length}.0</span>
                  </div>
                  <Button onClick={proceedToElectives} className="bg-blue-600 hover:bg-blue-700">
                    Continue to Electives
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Elective Selection */}
        {enrollmentStep === 'elective-selection' && (
          <div className="max-w-6xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Choose Electives</CardTitle>
                <p className="text-slate-400">Select elective courses to complete your schedule</p>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search electives..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {electiveOptions
                    .filter(
                      (elective) =>
                        elective.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        elective.category.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((elective) => (
                      <Card
                        key={elective.id}
                        className={`bg-slate-700/30 border-slate-600 cursor-pointer transition-colors ${
                          selectedElectives.includes(elective.id)
                            ? 'border-green-400 bg-green-900/20'
                            : 'hover:border-blue-400'
                        }`}
                        onClick={() => handleElectiveToggle(elective.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-white">{elective.title}</CardTitle>
                            {selectedElectives.includes(elective.id) && (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {elective.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Period {elective.period}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-300 mb-3">{elective.description}</p>
                          <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>{elective.instructor}</span>
                            <span>
                              {elective.credits} credit{elective.credits !== 1 ? 's' : ''}
                            </span>
                          </div>
                          {elective.prerequisite && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs text-yellow-400">
                                Requires: {elective.prerequisite}
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-600">
                  <div className="text-slate-400">
                    Selected Electives:{' '}
                    <span className="text-white font-semibold">{selectedElectives.length}</span>
                    <span className="ml-4">
                      Total Credits:{' '}
                      <span className="text-white font-semibold">{getTotalCredits()}</span>
                    </span>
                  </div>
                  <Button
                    onClick={finalizeEnrollment}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={selectedElectives.length === 0}
                  >
                    Finalize Enrollment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Confirmation */}
        {enrollmentStep === 'confirmation' && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  Enrollment Complete!
                </CardTitle>
                <p className="text-slate-400">
                  Student has been successfully enrolled in all selected classes
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Core Classes Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Core Classes</h3>
                    <div className="space-y-2">
                      {getCoreClasses().map((coreClass) => (
                        <div
                          key={coreClass.id}
                          className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                        >
                          <div>
                            <div className="text-white font-medium">{coreClass.title}</div>
                            <div className="text-sm text-slate-400">
                              Period {coreClass.period} • {coreClass.instructor}
                            </div>
                          </div>
                          <Badge className="bg-blue-600/20 text-blue-400">Core</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Electives Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Selected Electives</h3>
                    <div className="space-y-2">
                      {getSelectedElectives().map((elective) => (
                        <div
                          key={elective.id}
                          className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                        >
                          <div>
                            <div className="text-white font-medium">{elective.title}</div>
                            <div className="text-sm text-slate-400">
                              Period {elective.period} • {elective.instructor}
                            </div>
                          </div>
                          <Badge className="bg-green-600/20 text-green-400">Elective</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-400 font-semibold">
                        Total Credits: {getTotalCredits()}
                      </div>
                      <div className="text-sm text-slate-300">NCAA Compliant Schedule</div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Link href="/academy/student-schedule">
                    <Button className="bg-blue-600 hover:bg-blue-700">View Student Schedule</Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEnrollmentStep('grade-selection');
                      setSelectedGrade('');
                      setSelectedElectives([]);
                    }}
                  >
                    Enroll Another Student
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
