'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  GraduationCap,
  MapPin,
  Clock,
  ArrowLeft,
  User,
  Star,
  Award,
  Target,
  Phone,
  Mail,
  School,
  Calendar,
} from 'lucide-react';

interface StudentAthlete {
  id: string;
  name: string;
  email: string;
  sport: string;
  position: string;
  grade: string;
  gpa: number;
  garScore: number;
  enrolledAt: string;
  progress: number;
  currentGrade: string;
  height: string;
  weight: number;
  teamAffiliation: string;
  coachName: string;
  school: string;
  graduationYear: number;
  recruitingStatus: string;
  interestedColleges: string[];
  scholarshipOffers: any[];
}

interface ClassWithStudents {
  id: string;
  title: string;
  description: string;
  code: string;
  instructor: string;
  credits: number;
  gradeLevel: string;
  students: StudentAthlete[];
  enrollmentCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function ClassesWithStudents() {
  const [classes, setClasses] = useState<ClassWithStudents[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassWithStudents | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentAthlete | null>(null);

  useEffect(() => {
    loadClassesWithStudents();
  }, []);

  const loadClassesWithStudents = async () => {
    try {
      const response = await fetch('/api/academy/classes?includeStudents=true');
      const result = await response.json();
      if (result.success) {
        setClasses(result.classes);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecruitingStatusColor = (status: string) => {
    switch (status) {
      case 'committed':
        return 'bg-green-500';
      case 'exploring':
        return 'bg-blue-500';
      case 'signed':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-400';
      case 'A-':
      case 'B+':
        return 'text-blue-400';
      case 'B':
      case 'B-':
        return 'text-yellow-400';
      case 'C+':
      case 'C':
        return 'text-orange-400';
      default:
        return 'text-red-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mb-4"></div>
          <p className="text-xl">Loading classes and student information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <a href="/academy">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Academy
            </Button>
          </a>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Classes & Student Athletes
            </h1>
            <p className="text-slate-400 mt-2">
              Manage classes and view detailed student athlete information
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{classes.length}</p>
                  <p className="text-sm text-slate-400">Active Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {classes.reduce((sum, c) => sum + c.enrollmentCount, 0)}
                  </p>
                  <p className="text-sm text-slate-400">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {classes.reduce(
                      (sum, c) => sum + c.students.filter((s) => s.garScore > 80).length,
                      0,
                    )}
                  </p>
                  <p className="text-sm text-slate-400">Elite Athletes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {(
                      classes.reduce(
                        (sum, c) => sum + c.students.reduce((s, st) => s + (st.gpa || 0), 0),
                        0,
                      ) /
                      Math.max(
                        classes.reduce((sum, c) => sum + c.enrollmentCount, 0),
                        1,
                      )
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-400">Average GPA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
            <TabsTrigger value="classes">Class Overview</TabsTrigger>
            <TabsTrigger value="students">Student Details</TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {classes.map((classItem) => (
                <Card key={classItem.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-white">{classItem.title}</CardTitle>
                        <p className="text-slate-400 text-sm mt-1">{classItem.code}</p>
                      </div>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {classItem.credits} Credits
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <User className="w-4 h-4" />
                        <span>Instructor: {classItem.instructor}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Users className="w-4 h-4" />
                        <span>{classItem.enrollmentCount} Students Enrolled</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <GraduationCap className="w-4 h-4" />
                        <span>Grade Level: {classItem.gradeLevel}</span>
                      </div>

                      {classItem.description && (
                        <p className="text-slate-400 text-sm">{classItem.description}</p>
                      )}

                      {/* Student Preview */}
                      {classItem.students.length > 0 && (
                        <div className="border-t border-slate-700 pt-4">
                          <p className="text-sm font-semibold text-white mb-2">Student Athletes:</p>
                          <div className="space-y-2">
                            {classItem.students.slice(0, 3).map((student) => (
                              <div
                                key={student.id}
                                className="flex items-center justify-between bg-slate-700/30 p-2 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-slate-400" />
                                  <span className="text-sm text-white">{student.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {student.position}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-sm font-semibold ${getGradeColor(student.currentGrade)}`}
                                  >
                                    {student.currentGrade}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    GAR: {student.garScore}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {classItem.students.length > 3 && (
                              <p className="text-xs text-slate-400 text-center">
                                +{classItem.students.length - 3} more students
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedClass(classItem)}
                      >
                        View Full Class Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {classes
                .flatMap((c) => c.students)
                .map((student) => (
                  <Card key={student.id} className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-white">{student.name}</CardTitle>
                          <p className="text-slate-400 text-sm">
                            {student.position} • {student.sport}
                          </p>
                        </div>
                        <Badge
                          className={`${getRecruitingStatusColor(student.recruitingStatus)} text-white`}
                        >
                          {student.recruitingStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Academic Info */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">GPA:</span>
                          <span className="text-sm font-semibold text-white">
                            {student.gpa.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">GAR Score:</span>
                          <span className="text-sm font-semibold text-green-400">
                            {student.garScore}
                          </span>
                        </div>

                        {/* Physical Stats */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Height/Weight:</span>
                          <span className="text-sm text-white">
                            {student.height} / {student.weight}lbs
                          </span>
                        </div>

                        {/* Team Info */}
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Users className="w-4 h-4" />
                          <span>{student.teamAffiliation}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <School className="w-4 h-4" />
                          <span>{student.school}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="w-4 h-4" />
                          <span>Class of {student.graduationYear}</span>
                        </div>

                        {/* College Interest */}
                        {student.interestedColleges.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Interested Colleges:</p>
                            <div className="flex flex-wrap gap-1">
                              {student.interestedColleges.slice(0, 3).map((college, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {college}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedStudent(student)}
                        >
                          View Full Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Student Detail Modal (simplified for demo) */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">{selectedStudent.name}</CardTitle>
                    <p className="text-slate-400">
                      {selectedStudent.position} • {selectedStudent.sport}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-white mb-2">Academic Information</p>
                    <div className="space-y-1 text-slate-300">
                      <p>GPA: {selectedStudent.gpa.toFixed(2)}</p>
                      <p>School: {selectedStudent.school}</p>
                      <p>Graduation: {selectedStudent.graduationYear}</p>
                      <p>Grade: {selectedStudent.grade}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-2">Athletic Information</p>
                    <div className="space-y-1 text-slate-300">
                      <p>GAR Score: {selectedStudent.garScore}</p>
                      <p>Height: {selectedStudent.height}</p>
                      <p>Weight: {selectedStudent.weight}lbs</p>
                      <p>Team: {selectedStudent.teamAffiliation}</p>
                      <p>Coach: {selectedStudent.coachName}</p>
                    </div>
                  </div>
                </div>

                {selectedStudent.interestedColleges.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-white mb-2">College Interest</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.interestedColleges.map((college, index) => (
                        <Badge key={index} variant="outline">
                          {college}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
