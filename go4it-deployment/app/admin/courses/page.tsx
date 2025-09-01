'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Filter,
  Users,
  Clock,
  Star,
  Calendar,
  GraduationCap,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  instructor: string;
  grade: string;
  subject: string;
  enrolledStudents: number;
  maxCapacity: number;
  room: string;
  period: number;
  status: 'active' | 'draft' | 'archived';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  credits: number;
  createdDate: string;
  lastUpdated: string;
}

export default function AdminCourses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock course data
  const courses: Course[] = [
    {
      id: '1',
      title: 'Pre-Algebra',
      instructor: 'Ms. Rodriguez',
      grade: '7th',
      subject: 'Mathematics',
      enrolledStudents: 24,
      maxCapacity: 25,
      room: 'Math 101',
      period: 1,
      status: 'active',
      difficulty: 'intermediate',
      credits: 1,
      createdDate: '2024-08-01',
      lastUpdated: '2024-12-15',
    },
    {
      id: '2',
      title: 'AP Biology',
      instructor: 'Dr. Adams',
      grade: '12th',
      subject: 'Science',
      enrolledStudents: 18,
      maxCapacity: 20,
      room: 'AP Biology Lab',
      period: 2,
      status: 'active',
      difficulty: 'advanced',
      credits: 1,
      createdDate: '2024-07-15',
      lastUpdated: '2024-12-16',
    },
    {
      id: '3',
      title: 'American Literature',
      instructor: 'Ms. Roberts',
      grade: '11th',
      subject: 'English',
      enrolledStudents: 22,
      maxCapacity: 25,
      room: 'English 401',
      period: 3,
      status: 'active',
      difficulty: 'intermediate',
      credits: 1,
      createdDate: '2024-08-10',
      lastUpdated: '2024-12-14',
    },
    {
      id: '4',
      title: 'Advanced Chemistry Lab',
      instructor: 'Dr. Kim',
      grade: '10th',
      subject: 'Science',
      enrolledStudents: 15,
      maxCapacity: 16,
      room: 'Chemistry Lab',
      period: 4,
      status: 'active',
      difficulty: 'advanced',
      credits: 1,
      createdDate: '2024-09-01',
      lastUpdated: '2024-12-16',
    },
    {
      id: '5',
      title: 'Spanish I',
      instructor: 'Señora Morales',
      grade: '9th',
      subject: 'World Languages',
      enrolledStudents: 0,
      maxCapacity: 20,
      room: 'Language Lab',
      period: 7,
      status: 'draft',
      difficulty: 'beginner',
      credits: 1,
      createdDate: '2024-12-01',
      lastUpdated: '2024-12-10',
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || course.grade === filterGrade;
    const matchesSubject = filterSubject === 'all' || course.subject === filterSubject;
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;

    return matchesSearch && matchesGrade && matchesSubject && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600/20 text-green-400">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-600/20 text-yellow-400">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-600/20 text-gray-400">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return (
          <Badge variant="outline" className="text-green-400">
            Beginner
          </Badge>
        );
      case 'intermediate':
        return (
          <Badge variant="outline" className="text-blue-400">
            Intermediate
          </Badge>
        );
      case 'advanced':
        return (
          <Badge variant="outline" className="text-red-400">
            Advanced
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getEnrollmentStatus = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 95) return 'full';
    if (percentage >= 80) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Course Management</h1>
              <p className="text-slate-400">Manage Academy courses and curriculum</p>
            </div>
          </div>
          <Link href="/academy/create-class">
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              Create Course
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Courses</p>
                  <p className="text-2xl font-bold text-blue-400">{courses.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Courses</p>
                  <p className="text-2xl font-bold text-green-400">
                    {courses.filter((c) => c.status === 'active').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Enrollments</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Draft Courses</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {courses.filter((c) => c.status === 'draft').length}
                  </p>
                </div>
                <Edit className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600"
                />
              </div>

              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              >
                <option value="all">All Grades</option>
                <option value="7th">7th Grade</option>
                <option value="8th">8th Grade</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>

              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              >
                <option value="all">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Social Studies">Social Studies</option>
                <option value="World Languages">World Languages</option>
                <option value="Fine Arts">Fine Arts</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <Button variant="outline" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Courses List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Courses ({filteredCourses.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Course Info */}
                    <div className="lg:col-span-3">
                      <h3 className="text-white font-semibold">{course.title}</h3>
                      <p className="text-slate-400 text-sm">{course.instructor}</p>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(course.status)}
                        {getDifficultyBadge(course.difficulty)}
                      </div>
                    </div>

                    {/* Grade & Subject */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">{course.grade}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{course.subject}</p>
                    </div>

                    {/* Enrollment */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-medium">
                          {course.enrolledStudents}/{course.maxCapacity}
                        </span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-purple-400 h-2 rounded-full"
                          style={{
                            width: `${Math.min((course.enrolledStudents / course.maxCapacity) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">Period {course.period}</span>
                      </div>
                      <p className="text-slate-400 text-xs">{course.room}</p>
                    </div>

                    {/* Credits & Updates */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white text-sm">
                          {course.credits} credit{course.credits !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">
                        Updated: {new Date(course.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-1">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="p-2" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="p-2" title="Edit Course">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2 text-red-400 hover:text-red-300"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No courses found matching the current filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
