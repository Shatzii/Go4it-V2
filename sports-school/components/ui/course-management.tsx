'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  GraduationCap,
  Star,
  Award,
  CheckCircle,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  teacher: string;
  enrolled: number;
  capacity: number;
  schedule: string;
  semester: string;
  prerequisites: string[];
  credits: number;
  status: 'active' | 'inactive' | 'full';
}

interface Student {
  id: string;
  name: string;
  grade: string;
  email: string;
  enrolledCourses: string[];
  gpa: number;
}

const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced Algebra II',
    subject: 'Mathematics',
    grade: '10',
    description:
      'Comprehensive algebra course covering quadratic functions, polynomials, and logarithms',
    teacher: 'Professor Newton',
    enrolled: 24,
    capacity: 30,
    schedule: 'MWF 9:00-10:00 AM',
    semester: 'Fall 2024',
    prerequisites: ['Algebra I', 'Geometry'],
    credits: 1.0,
    status: 'active',
  },
  {
    id: '2',
    title: 'AP Chemistry',
    subject: 'Science',
    grade: '11-12',
    description: 'College-level chemistry with laboratory experiments and advanced concepts',
    teacher: 'Dr. Curie',
    enrolled: 18,
    capacity: 20,
    schedule: 'TTH 10:00-11:30 AM',
    semester: 'Fall 2024',
    prerequisites: ['Chemistry Honors', 'Pre-Calculus'],
    credits: 1.5,
    status: 'active',
  },
  {
    id: '3',
    title: 'Creative Writing Workshop',
    subject: 'English',
    grade: '9-12',
    description:
      'Explore various forms of creative writing including poetry, short stories, and screenwriting',
    teacher: 'Ms. Shakespeare',
    enrolled: 20,
    capacity: 20,
    schedule: 'MW 2:00-3:30 PM',
    semester: 'Fall 2024',
    prerequisites: ['English I'],
    credits: 0.5,
    status: 'full',
  },
  {
    id: '4',
    title: 'World History: Ancient Civilizations',
    subject: 'Social Studies',
    grade: '9',
    description: 'Journey through ancient civilizations from Mesopotamia to the Roman Empire',
    teacher: 'Professor Timeline',
    enrolled: 28,
    capacity: 32,
    schedule: 'Daily 11:00-12:00 PM',
    semester: 'Fall 2024',
    prerequisites: [],
    credits: 1.0,
    status: 'active',
  },
  {
    id: '5',
    title: 'Digital Art & Design',
    subject: 'Arts',
    grade: '10-12',
    description: 'Learn digital art techniques using industry-standard software and tools',
    teacher: 'Maestro Picasso',
    enrolled: 15,
    capacity: 25,
    schedule: 'TTH 1:00-2:30 PM',
    semester: 'Fall 2024',
    prerequisites: ['Art Fundamentals'],
    credits: 1.0,
    status: 'active',
  },
];

const sampleStudents: Student[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    grade: '10',
    email: 'sarah.johnson@student.school.edu',
    enrolledCourses: ['1', '4'],
    gpa: 3.8,
  },
  {
    id: '2',
    name: 'Michael Chen',
    grade: '11',
    email: 'michael.chen@student.school.edu',
    enrolledCourses: ['2', '3', '5'],
    gpa: 3.9,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    grade: '9',
    email: 'emily.rodriguez@student.school.edu',
    enrolledCourses: ['4'],
    gpa: 3.7,
  },
];

export default function CourseManagement() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || course.grade.includes(selectedGrade);
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;

    return matchesSearch && matchesGrade && matchesSubject;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'full':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnrollmentPercentage = (enrolled: number, capacity: number) => {
    return Math.round((enrolled / capacity) * 100);
  };

  const enrollStudent = async (courseId: string, studentId: string) => {
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          studentId,
          semester: 'Fall 2024',
        }),
      });

      if (response.ok) {
        // Update local state
        setCourses((prev) =>
          prev.map((course) =>
            course.id === courseId ? { ...course, enrolled: course.enrolled + 1 } : course,
          ),
        );
        setStudents((prev) =>
          prev.map((student) =>
            student.id === studentId
              ? { ...student, enrolledCourses: [...student.enrolledCourses, courseId] }
              : student,
          ),
        );
        setShowEnrollDialog(false);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Course Management</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Course Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search Courses</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by title or teacher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="grade">Grade Level</Label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Social Studies">Social Studies</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    Export Courses
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-sm text-gray-600">{course.teacher}</p>
                    </div>
                    <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.subject}</span>
                    <span>•</span>
                    <GraduationCap className="h-4 w-4" />
                    <span>Grade {course.grade}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">{course.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Enrollment
                      </span>
                      <span className="font-medium">
                        {course.enrolled}/{course.capacity}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${getEnrollmentPercentage(course.enrolled, course.capacity)}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Schedule
                      </span>
                      <span>{course.schedule}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        Credits
                      </span>
                      <span>{course.credits}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowEnrollDialog(true);
                      }}
                      disabled={course.status === 'full'}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Enroll Student
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-gray-600">
                        Grade {student.grade} • GPA: {student.gpa}
                      </p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{student.enrolledCourses.length} Courses</p>
                      <div className="flex gap-1 mt-2">
                        {student.enrolledCourses.map((courseId) => {
                          const course = courses.find((c) => c.id === courseId);
                          return course ? (
                            <Badge key={courseId} variant="secondary" className="text-xs">
                              {course.subject}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2 text-center">
                <div className="font-medium">Time</div>
                <div className="font-medium">Monday</div>
                <div className="font-medium">Tuesday</div>
                <div className="font-medium">Wednesday</div>
                <div className="font-medium">Thursday</div>
                <div className="font-medium">Friday</div>

                {/* Sample schedule grid */}
                <div className="p-2 text-sm">9:00 AM</div>
                <div className="p-2 bg-blue-100 rounded text-xs">Advanced Algebra II</div>
                <div className="p-2"></div>
                <div className="p-2 bg-blue-100 rounded text-xs">Advanced Algebra II</div>
                <div className="p-2"></div>
                <div className="p-2 bg-blue-100 rounded text-xs">Advanced Algebra II</div>

                <div className="p-2 text-sm">10:00 AM</div>
                <div className="p-2"></div>
                <div className="p-2 bg-green-100 rounded text-xs">AP Chemistry</div>
                <div className="p-2"></div>
                <div className="p-2 bg-green-100 rounded text-xs">AP Chemistry</div>
                <div className="p-2"></div>

                <div className="p-2 text-sm">11:00 AM</div>
                <div className="p-2 bg-orange-100 rounded text-xs">World History</div>
                <div className="p-2 bg-orange-100 rounded text-xs">World History</div>
                <div className="p-2 bg-orange-100 rounded text-xs">World History</div>
                <div className="p-2 bg-orange-100 rounded text-xs">World History</div>
                <div className="p-2 bg-orange-100 rounded text-xs">World History</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enrollment Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Course: {selectedCourse?.title}</h4>
              <p className="text-sm text-gray-600">Teacher: {selectedCourse?.teacher}</p>
            </div>

            <div>
              <Label htmlFor="student-select">Select Student</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students
                    .filter(
                      (student) => !student.enrolledCourses.includes(selectedCourse?.id || ''),
                    )
                    .map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} (Grade {student.grade})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  // Implementation would go here
                  setShowEnrollDialog(false);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Enroll Student
              </Button>
              <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
