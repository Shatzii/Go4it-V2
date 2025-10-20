'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Users,
  Trophy,
  Target,
  Calendar,
  GraduationCap,
  Brain,
  Clock,
  Award,
  CheckCircle,
  Star,
  TrendingUp,
  School,
} from 'lucide-react';
import Link from 'next/link';

export default function StagePrep() {
  const [selectedGrade, setSelectedGrade] = useState('9');

  const academicPrograms = [
    {
      name: 'Advanced Placement Program',
      description: 'Rigorous college-level courses for high achievers',
      icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
      courses: ['AP Mathematics', 'AP Sciences', 'AP Literature', 'AP History', 'AP Languages'],
    },
    {
      name: 'STEM Excellence Track',
      description: 'Science, Technology, Engineering, and Mathematics focus',
      icon: <Brain className="w-6 h-6 text-green-600" />,
      courses: ['Advanced Chemistry', 'Physics', 'Computer Science', 'Engineering', 'Statistics'],
    },
    {
      name: 'College Preparatory Program',
      description: 'Comprehensive preparation for higher education',
      icon: <School className="w-6 h-6 text-purple-600" />,
      courses: ['Advanced English', 'Pre-Calculus', 'World History', 'Biology', 'Foreign Language'],
    },
    {
      name: 'Leadership Development',
      description: "Building tomorrow's leaders through practical experience",
      icon: <Trophy className="w-6 h-6 text-orange-600" />,
      courses: [
        'Student Government',
        'Community Service',
        'Public Speaking',
        'Ethics',
        'Project Management',
      ],
    },
  ];

  const gradePrograms = {
    '7': {
      title: 'Foundation Year',
      description: 'Building strong academic foundations',
      keySubjects: ['Mathematics', 'English Language Arts', 'Science', 'Social Studies', 'Health'],
      specialPrograms: ['Study Skills', 'Time Management', 'Academic Writing'],
    },
    '8': {
      title: 'Preparation Year',
      description: 'Preparing for high school academics',
      keySubjects: ['Pre-Algebra', 'Literature', 'Physical Science', 'American History', 'Arts'],
      specialPrograms: ['High School Readiness', 'Research Skills', 'Critical Thinking'],
    },
    '9': {
      title: 'Freshman Excellence',
      description: 'Strong start to high school academics',
      keySubjects: ['Algebra I', 'English I', 'Biology', 'World Geography', 'Health'],
      specialPrograms: ['Academic Planning', 'College Exploration', 'Leadership Skills'],
    },
    '10': {
      title: 'Sophomore Achievement',
      description: 'Expanding academic horizons',
      keySubjects: ['Geometry', 'English II', 'Chemistry', 'World History', 'Foreign Language'],
      specialPrograms: ['Career Exploration', 'Advanced Study Skills', 'Community Service'],
    },
    '11': {
      title: 'Junior Preparation',
      description: 'Intensive college preparation',
      keySubjects: ['Algebra II', 'English III', 'Physics', 'US History', 'Advanced Arts'],
      specialPrograms: ['College Prep', 'SAT/ACT Preparation', 'Advanced Placement'],
    },
    '12': {
      title: 'Senior Excellence',
      description: 'Graduation and beyond preparation',
      keySubjects: ['Pre-Calculus', 'English IV', 'Advanced Science', 'Government', 'Economics'],
      specialPrograms: ['College Applications', 'Career Readiness', 'Leadership Capstone'],
    },
  };

  const achievements = [
    { title: 'Honor Roll', students: '1,200+', icon: <Award className="w-5 h-5" /> },
    { title: 'AP Scholars', students: '450+', icon: <Star className="w-5 h-5" /> },
    { title: 'College Acceptances', students: '98%', icon: <GraduationCap className="w-5 h-5" /> },
    { title: 'Scholarship Recipients', students: '320+', icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">S.T.A.G.E Prep School</h1>
            <p className="text-xl text-purple-100 mb-2">
              Strategic Teaching for Academic Growth & Excellence
            </p>
            <p className="text-lg text-purple-200">Grades 7-12 • Academic Excellence Program</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {achievements.map((achievement, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-3 text-purple-600">
                  {achievement.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{achievement.students}</div>
                <div className="text-sm text-gray-600">{achievement.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Academic Programs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
              Academic Programs
            </CardTitle>
            <CardDescription>
              Comprehensive academic pathways designed for student success
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {academicPrograms.map((program, index) => (
                <Card key={index} className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {program.icon}
                      {program.name}
                    </CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {program.courses.map((course, courseIndex) => (
                        <div key={courseIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {course}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grade Level Programs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              Grade Level Programs
            </CardTitle>
            <CardDescription>Tailored academic programs for each grade level</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedGrade} onValueChange={setSelectedGrade}>
              <TabsList className="grid w-full grid-cols-6">
                {Object.keys(gradePrograms).map((grade) => (
                  <TabsTrigger key={grade} value={grade}>
                    Grade {grade}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(gradePrograms).map(([grade, program]) => (
                <TabsContent key={grade} value={grade}>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          Core Subjects
                        </h4>
                        <div className="space-y-2">
                          {program.keySubjects.map((subject, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {subject}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-orange-600" />
                          Special Programs
                        </h4>
                        <div className="space-y-2">
                          {program.specialPrograms.map((program, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Star className="w-4 h-4 text-purple-500" />
                              {program}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Access Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/schools/stage-prep/student-dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>Student Dashboard</CardTitle>
                <CardDescription>Access your academic progress and resources</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full">Student Portal</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/schools/stage-prep/teacher-dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Teacher Dashboard</CardTitle>
                <CardDescription>Manage classes and track student progress</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full">Teacher Portal</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/schools/stage-prep/parent-dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <School className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <CardTitle>Parent Dashboard</CardTitle>
                <CardDescription>Monitor your student's academic journey</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full">Parent Portal</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
