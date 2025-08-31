'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, Star } from 'lucide-react';

export default function PrimaryCoursesPage() {
  const [selectedGrade, setSelectedGrade] = useState('all');

  const courses = [
    {
      id: 'math-k',
      title: 'SuperHero Math Adventures',
      grade: 'K',
      description: 'Learn counting, shapes, and basic math with your favorite superheroes!',
      teacher: 'Professor Newton',
      students: 25,
      duration: '45 min',
      difficulty: 'Beginner',
      subjects: ['Numbers', 'Shapes', 'Counting'],
      color: 'bg-blue-500',
    },
    {
      id: 'reading-k',
      title: 'Hero Reading Academy',
      grade: 'K',
      description: 'Develop reading skills through exciting superhero stories and adventures.',
      teacher: 'Ms. Shakespeare',
      students: 23,
      duration: '40 min',
      difficulty: 'Beginner',
      subjects: ['Phonics', 'Vocabulary', 'Comprehension'],
      color: 'bg-green-500',
    },
    {
      id: 'science-1',
      title: 'Super Science Lab',
      grade: '1',
      description: 'Explore the world of science with hands-on experiments and discoveries.',
      teacher: 'Dr. Curie',
      students: 28,
      duration: '50 min',
      difficulty: 'Beginner',
      subjects: ['Nature', 'Experiments', 'Discovery'],
      color: 'bg-purple-500',
    },
    {
      id: 'social-2',
      title: 'Community Heroes',
      grade: '2',
      description: 'Learn about communities, families, and helping others in our world.',
      teacher: 'Professor Timeline',
      students: 26,
      duration: '45 min',
      difficulty: 'Elementary',
      subjects: ['Community', 'History', 'Geography'],
      color: 'bg-orange-500',
    },
    {
      id: 'art-3',
      title: 'Creative Super Powers',
      grade: '3',
      description: 'Express creativity through art, music, and performance activities.',
      teacher: 'Maestro Picasso',
      students: 24,
      duration: '60 min',
      difficulty: 'Elementary',
      subjects: ['Drawing', 'Music', 'Drama'],
      color: 'bg-pink-500',
    },
    {
      id: 'advanced-math-4',
      title: 'Math Hero Training',
      grade: '4',
      description: 'Advanced math concepts including multiplication, division, and fractions.',
      teacher: 'Professor Newton',
      students: 22,
      duration: '50 min',
      difficulty: 'Intermediate',
      subjects: ['Multiplication', 'Division', 'Fractions'],
      color: 'bg-blue-600',
    },
    {
      id: 'writing-5',
      title: 'Heroic Writing Workshop',
      grade: '5',
      description: 'Develop writing skills through creative storytelling and essay writing.',
      teacher: 'Ms. Shakespeare',
      students: 25,
      duration: '55 min',
      difficulty: 'Intermediate',
      subjects: ['Creative Writing', 'Essays', 'Grammar'],
      color: 'bg-green-600',
    },
  ];

  const grades = ['all', 'K', '1', '2', '3', '4', '5'];

  const filteredCourses =
    selectedGrade === 'all' ? courses : courses.filter((course) => course.grade === selectedGrade);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🦸‍♂️ SuperHero Elementary Courses</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our exciting superhero-themed courses designed to make learning an adventure
            for grades K-5!
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
                  <p className="text-sm font-medium mb-2">Teacher: {course.teacher}</p>
                  <div className="flex flex-wrap gap-1">
                    {course.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{courses.length}</h3>
              <p className="text-gray-600">Total Courses</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {courses.reduce((total, course) => total + course.students, 0)}
              </h3>
              <p className="text-gray-600">Active Students</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">4.9/5</h3>
              <p className="text-gray-600">Student Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
