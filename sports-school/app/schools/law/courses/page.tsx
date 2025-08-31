'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, Star, Scale, Gavel } from 'lucide-react';

export default function LawCoursesPage() {
  const [selectedGrade, setSelectedGrade] = useState('all');

  const courses = [
    {
      id: 'legal-foundations',
      title: 'Legal Foundations',
      grade: '11',
      description:
        'Introduction to legal systems, constitutional law, and fundamental legal principles.',
      teacher: 'Professor Justice',
      students: 18,
      duration: '90 min',
      difficulty: 'Advanced',
      subjects: ['Constitutional Law', 'Legal History', 'Court Systems'],
      color: 'bg-blue-600',
    },
    {
      id: 'criminal-law',
      title: 'Criminal Law & Justice',
      grade: '11',
      description: 'Study of criminal law, procedure, and the justice system.',
      teacher: 'Judge Martinez',
      students: 16,
      duration: '85 min',
      difficulty: 'Advanced',
      subjects: ['Criminal Law', 'Procedure', 'Ethics'],
      color: 'bg-red-600',
    },
    {
      id: 'civil-rights',
      title: 'Civil Rights & Liberties',
      grade: '12',
      description: 'Examination of civil rights, liberties, and constitutional protections.',
      teacher: 'Professor Justice',
      students: 19,
      duration: '80 min',
      difficulty: 'Expert',
      subjects: ['Civil Rights', 'Constitution', 'Advocacy'],
      color: 'bg-green-600',
    },
    {
      id: 'business-law',
      title: 'Business & Corporate Law',
      grade: '12',
      description: 'Corporate law, contracts, and business legal frameworks.',
      teacher: 'Attorney Chen',
      students: 17,
      duration: '85 min',
      difficulty: 'Expert',
      subjects: ['Corporate Law', 'Contracts', 'Business Ethics'],
      color: 'bg-purple-600',
    },
    {
      id: 'moot-court',
      title: 'Moot Court Competition',
      grade: '11-12',
      description: 'Competitive legal argumentation and courtroom simulation.',
      teacher: 'Judge Martinez',
      students: 22,
      duration: '120 min',
      difficulty: 'Expert',
      subjects: ['Advocacy', 'Research', 'Oral Argument'],
      color: 'bg-indigo-600',
    },
    {
      id: 'legal-research',
      title: 'Legal Research & Writing',
      grade: '11-12',
      description: 'Advanced legal research methods and legal writing skills.',
      teacher: 'Professor Justice',
      students: 20,
      duration: '75 min',
      difficulty: 'Advanced',
      subjects: ['Research', 'Writing', 'Citation'],
      color: 'bg-gray-600',
    },
    {
      id: 'internship',
      title: 'Legal Internship Program',
      grade: '12',
      description: 'Real-world experience in law firms, courts, and legal organizations.',
      teacher: 'Career Coordinator',
      students: 15,
      duration: '240 min',
      difficulty: 'Expert',
      subjects: ['Practice', 'Ethics', 'Professional Development'],
      color: 'bg-yellow-600',
    },
  ];

  const grades = ['all', '11', '12', '11-12'];

  const filteredCourses =
    selectedGrade === 'all'
      ? courses
      : courses.filter(
          (course) => course.grade === selectedGrade || course.grade.includes(selectedGrade),
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">⚖️ Future Legal Professionals</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive legal education preparing students for law school and legal careers
          </p>
        </div>

        {/* Grade Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {grades.map((grade) => (
            <Button
              key={grade}
              variant={selectedGrade === grade ? 'default' : 'outline'}
              onClick={() => setSelectedGrade(grade)}
              className="min-w-[80px]"
            >
              {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
            </Button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    Grade {course.grade}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{course.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students} students
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Instructor: {course.teacher}</p>
                  <div className="flex flex-wrap gap-1">
                    {course.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <Scale className="w-4 h-4 mr-2" />
                  Enter Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Scale className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{courses.length}</h3>
              <p className="text-gray-600">Legal Courses</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Gavel className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {courses.reduce((total, course) => total + course.students, 0)}
              </h3>
              <p className="text-gray-600">Future Lawyers</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">4.9/5</h3>
              <p className="text-gray-600">Course Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
