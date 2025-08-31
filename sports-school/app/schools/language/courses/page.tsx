'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, Star, Globe, Languages } from 'lucide-react';

export default function LanguageCoursesPage() {
  const [selectedGrade, setSelectedGrade] = useState('all');

  const courses = [
    {
      id: 'spanish-9',
      title: 'Spanish I - Foundations',
      grade: '9',
      description: 'Introduction to Spanish language and Latin American culture.',
      teacher: 'Señora Rodriguez',
      students: 24,
      duration: '60 min',
      difficulty: 'Beginner',
      subjects: ['Grammar', 'Vocabulary', 'Culture'],
      color: 'bg-red-500',
      flag: '🇪🇸',
    },
    {
      id: 'french-9',
      title: 'French I - Bonjour!',
      grade: '9',
      description: 'Beginning French language with focus on Francophone cultures.',
      teacher: 'Madame Dubois',
      students: 22,
      duration: '60 min',
      difficulty: 'Beginner',
      subjects: ['Pronunciation', 'Grammar', 'Culture'],
      color: 'bg-blue-500',
      flag: '🇫🇷',
    },
    {
      id: 'mandarin-10',
      title: 'Mandarin Chinese II',
      grade: '10',
      description: 'Intermediate Chinese language with cultural immersion.',
      teacher: 'Teacher Li',
      students: 18,
      duration: '65 min',
      difficulty: 'Intermediate',
      subjects: ['Characters', 'Conversation', 'Culture'],
      color: 'bg-red-600',
      flag: '🇨🇳',
    },
    {
      id: 'german-10',
      title: 'German II - Deutsch',
      grade: '10',
      description: 'Intermediate German with focus on European culture.',
      teacher: 'Herr Schmidt',
      students: 19,
      duration: '60 min',
      difficulty: 'Intermediate',
      subjects: ['Grammar', 'Literature', 'History'],
      color: 'bg-yellow-600',
      flag: '🇩🇪',
    },
    {
      id: 'spanish-11',
      title: 'Spanish III - Advanced',
      grade: '11',
      description: 'Advanced Spanish with literature and advanced conversation.',
      teacher: 'Professor Martinez',
      students: 21,
      duration: '65 min',
      difficulty: 'Advanced',
      subjects: ['Literature', 'Composition', 'Culture'],
      color: 'bg-orange-600',
      flag: '🇪🇸',
    },
    {
      id: 'japanese-11',
      title: 'Japanese III - 日本語',
      grade: '11',
      description: 'Advanced Japanese language and cultural studies.',
      teacher: 'Tanaka-sensei',
      students: 16,
      duration: '70 min',
      difficulty: 'Advanced',
      subjects: ['Kanji', 'Culture', 'Literature'],
      color: 'bg-pink-600',
      flag: '🇯🇵',
    },
    {
      id: 'ap-spanish',
      title: 'AP Spanish Language',
      grade: '12',
      description: 'College-level Spanish language and culture preparation.',
      teacher: 'Professor Martinez',
      students: 17,
      duration: '80 min',
      difficulty: 'Expert',
      subjects: ['AP Prep', 'Literature', 'Culture'],
      color: 'bg-purple-600',
      flag: '🇪🇸',
    },
    {
      id: 'cultural-exchange',
      title: 'Global Cultural Exchange',
      grade: '9-12',
      description: 'Cross-cultural communication and international partnerships.',
      teacher: 'Director Global',
      students: 35,
      duration: '90 min',
      difficulty: 'Variable',
      subjects: ['Culture', 'Communication', 'Leadership'],
      color: 'bg-green-600',
      flag: '🌍',
    },
  ];

  const grades = ['all', '9', '10', '11', '12', '9-12'];

  const filteredCourses =
    selectedGrade === 'all'
      ? courses
      : courses.filter(
          (course) => course.grade === selectedGrade || course.grade.includes(selectedGrade),
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🌍 Global Language Academy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Multilingual education and cultural immersion for global citizenship
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
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="text-2xl">{course.flag}</span>
                  {course.title}
                </CardTitle>
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
                  <Languages className="w-4 h-4 mr-2" />
                  Join Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">6</h3>
              <p className="text-gray-600">Languages Offered</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {courses.reduce((total, course) => total + course.students, 0)}
              </h3>
              <p className="text-gray-600">Global Students</p>
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
