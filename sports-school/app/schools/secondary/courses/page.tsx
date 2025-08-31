'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, Star, Theater, Palette } from 'lucide-react';

export default function SecondaryCoursesPage() {
  const [selectedGrade, setSelectedGrade] = useState('all');

  const courses = [
    {
      id: 'theater-7',
      title: 'Stage Foundation',
      grade: '7',
      description: 'Introduction to theater arts, basic acting techniques, and stage presence.',
      teacher: 'Director Hamilton',
      students: 22,
      duration: '60 min',
      difficulty: 'Beginner',
      subjects: ['Acting', 'Voice', 'Movement'],
      color: 'bg-purple-500',
    },
    {
      id: 'english-8',
      title: 'Dramatic Literature',
      grade: '8',
      description: 'Study classic and contemporary plays while developing reading comprehension.',
      teacher: 'Ms. Shakespeare',
      students: 24,
      duration: '55 min',
      difficulty: 'Intermediate',
      subjects: ['Literature', 'Analysis', 'Writing'],
      color: 'bg-blue-500',
    },
    {
      id: 'math-9',
      title: 'Applied Mathematics',
      grade: '9',
      description: 'Algebra and geometry with practical applications in theater production.',
      teacher: 'Professor Newton',
      students: 26,
      duration: '50 min',
      difficulty: 'Intermediate',
      subjects: ['Algebra', 'Geometry', 'Problem Solving'],
      color: 'bg-green-500',
    },
    {
      id: 'science-10',
      title: 'Science & Technology',
      grade: '10',
      description: 'Physics of sound, lighting, and chemistry in stage effects.',
      teacher: 'Dr. Curie',
      students: 23,
      duration: '60 min',
      difficulty: 'Advanced',
      subjects: ['Physics', 'Chemistry', 'Technology'],
      color: 'bg-orange-500',
    },
    {
      id: 'history-11',
      title: 'Historical Performance',
      grade: '11',
      description: 'World history through the lens of theater and cultural expression.',
      teacher: 'Professor Timeline',
      students: 21,
      duration: '55 min',
      difficulty: 'Advanced',
      subjects: ['History', 'Culture', 'Performance'],
      color: 'bg-red-500',
    },
    {
      id: 'arts-12',
      title: 'Advanced Arts Integration',
      grade: '12',
      description: 'Master-level course combining all arts with academic excellence.',
      teacher: 'Maestro Picasso',
      students: 19,
      duration: '90 min',
      difficulty: 'Expert',
      subjects: ['Arts Integration', 'Leadership', 'Portfolio'],
      color: 'bg-pink-500',
    },
    {
      id: 'production-9-12',
      title: 'Theater Production',
      grade: '9-12',
      description: 'Hands-on experience in all aspects of theater production.',
      teacher: 'Director Hamilton',
      students: 35,
      duration: '120 min',
      difficulty: 'Variable',
      subjects: ['Directing', 'Design', 'Management'],
      color: 'bg-indigo-500',
    },
  ];

  const grades = ['all', '7', '8', '9', '10', '11', '12', '9-12'];

  const filteredCourses =
    selectedGrade === 'all'
      ? courses
      : courses.filter(
          (course) => course.grade === selectedGrade || course.grade.includes(selectedGrade),
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎭 S.T.A.G.E Prep Academy Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Academic excellence meets theatrical arts in our comprehensive curriculum for grades
            7-12
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
                  <Theater className="w-4 h-4 mr-2" />
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
              <Theater className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{courses.length}</h3>
              <p className="text-gray-600">Theater Courses</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {courses.reduce((total, course) => total + course.students, 0)}
              </h3>
              <p className="text-gray-600">Active Students</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">4.8/5</h3>
              <p className="text-gray-600">Course Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
