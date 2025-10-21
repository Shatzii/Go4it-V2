'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Scale,
  Gavel,
  BookOpen,
  FileText,
  Users,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Brain,
  Search,
  BarChart3,
  Award,
  Calendar,
  Briefcase,
  Library,
  Pen,
  CheckCircle,
} from 'lucide-react';

// Law School Student Data
const lawStudentData = {
  name: 'Marcus Thompson',
  year: '2L',
  school: 'The Lawyer Makers',
  avatar: 'MT',
  concentration: 'Criminal Law',
  currentGPA: 3.6,
  classRank: '25th percentile',
  barPrepProgress: 15,
  courses: [
    {
      name: 'Constitutional Law II',
      professor: 'Prof. Barrett',
      grade: 'A-',
      credits: 3,
      progress: 78,
    },
    {
      name: 'Criminal Procedure',
      professor: 'Prof. Martinez',
      grade: 'B+',
      credits: 4,
      progress: 85,
    },
    { name: 'Evidence Law', professor: 'Prof. Chen', grade: 'A', credits: 3, progress: 92 },
    { name: 'Legal Writing II', professor: 'Prof. Williams', grade: 'B', credits: 2, progress: 70 },
    {
      name: 'Contract Law Advanced',
      professor: 'Prof. Johnson',
      grade: 'A-',
      credits: 3,
      progress: 88,
    },
  ],
  recentCases: [
    {
      name: 'Miranda v. Arizona',
      subject: 'Criminal Procedure',
      briefed: true,
      score: 94,
      date: '2 days ago',
    },
    {
      name: 'Brown v. Board of Education',
      subject: 'Constitutional Law',
      briefed: true,
      score: 89,
      date: '1 week ago',
    },
    {
      name: 'Daubert v. Merrell Dow',
      subject: 'Evidence Law',
      briefed: false,
      score: null,
      date: 'Due tomorrow',
    },
  ],
  upcomingDeadlines: [
    {
      type: 'Case Brief',
      title: 'Daubert v. Merrell Dow',
      course: 'Evidence Law',
      due: 'Tomorrow 11:59 PM',
    },
    {
      type: 'Memo',
      title: 'Fourth Amendment Analysis',
      course: 'Criminal Procedure',
      due: 'Friday 5:00 PM',
    },
    {
      type: 'Exam',
      title: 'Constitutional Law Midterm',
      course: 'Constitutional Law II',
      due: 'Next Monday',
    },
  ],
  clinics: [
    { name: 'Criminal Defense Clinic', role: 'Student Attorney', hours: 45, cases: 3 },
    { name: 'Immigration Law Clinic', role: 'Research Assistant', hours: 20, cases: 1 },
  ],
  barPrep: {
    mbeScore: 145,
    targetScore: 175,
    studyHours: 45,
    completedTopics: 12,
    totalTopics: 30,
  },
};

// Law School Dashboard Header
function LawSchoolDashboardHeader() {
  return (
    <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-600 p-6 rounded-lg mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-4 border-white/30">
            <AvatarFallback className="bg-gradient-to-br from-amber-600 to-orange-600 text-white font-bold text-xl">
              {lawStudentData.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-white">{lawStudentData.name}</h2>
            <p className="text-amber-200">
              {lawStudentData.year} • {lawStudentData.school}
            </p>
            <p className="text-orange-200 font-semibold">{lawStudentData.concentration}</p>
            <div className="flex items-center gap-3 mt-2">
              <Badge className="bg-white/20 text-white">
                <Scale className="w-3 h-3 mr-1" />
                GPA: {lawStudentData.currentGPA}
              </Badge>
              <Badge className="bg-white/20 text-white">Rank: {lawStudentData.classRank}</Badge>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-white">{lawStudentData.barPrepProgress}%</div>
          <div className="text-amber-200">Bar Prep Progress</div>
          <Progress value={lawStudentData.barPrepProgress} className="w-32 mt-2" />
        </div>
      </div>
    </div>
  );
}

// Current Courses
function CurrentCourses() {
  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <BookOpen className="w-5 h-5" />
          Current Courses - Spring 2024
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lawStudentData.courses.map((course, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-blue-400/30"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{course.name}</h4>
                    <p className="text-sm text-gray-400">{course.professor}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${
                        course.grade.includes('A')
                          ? 'bg-green-500'
                          : course.grade.includes('B')
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                      }`}
                    >
                      {course.grade}
                    </Badge>
                    <span className="text-xs text-gray-400">{course.credits} Credits</span>
                  </div>
                </div>
                <Progress value={course.progress} className="h-2" />
                <div className="text-xs text-gray-400 mt-1">{course.progress}% Complete</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Case Studies and Legal Research
function CaseStudiesAndResearch() {
  return (
    <Tabs defaultValue="cases" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-gray-800">
        <TabsTrigger value="cases">Recent Cases</TabsTrigger>
        <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
      </TabsList>

      <TabsContent value="cases">
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Gavel className="w-5 h-5" />
              Case Brief Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lawStudentData.recentCases.map((caseStudy, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-purple-400/30"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    {caseStudy.briefed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Clock className="w-6 h-6 text-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{caseStudy.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-400">{caseStudy.subject}</span>
                      <div className="flex items-center gap-2">
                        {caseStudy.briefed ? (
                          <Badge className="bg-green-500">✓ Score: {caseStudy.score}%</Badge>
                        ) : (
                          <Badge className="bg-orange-500">📝 {caseStudy.date}</Badge>
                        )}
                        <span className="text-xs text-gray-400">{caseStudy.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="deadlines">
        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <Calendar className="w-5 h-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lawStudentData.upcomingDeadlines.map((deadline, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-orange-400/30"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      deadline.type === 'Exam'
                        ? 'bg-red-500'
                        : deadline.type === 'Memo'
                          ? 'bg-blue-500'
                          : 'bg-purple-500'
                    }`}
                  >
                    {deadline.type === 'Exam' && <BarChart3 className="w-6 h-6 text-white" />}
                    {deadline.type === 'Memo' && <FileText className="w-6 h-6 text-white" />}
                    {deadline.type === 'Case Brief' && <Gavel className="w-6 h-6 text-white" />}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{deadline.title}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-400">{deadline.course}</span>
                      <Badge
                        className={`${
                          deadline.due.includes('Tomorrow')
                            ? 'bg-red-500'
                            : deadline.due.includes('Friday')
                              ? 'bg-orange-500'
                              : 'bg-yellow-500'
                        }`}
                      >
                        {deadline.due}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// Clinical Experience and Bar Prep
function ClinicalAndBarPrep() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Briefcase className="w-5 h-5" />
            Clinical Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lawStudentData.clinics.map((clinic, i) => (
              <div key={i} className="p-4 bg-black/30 rounded-lg border border-green-400/30">
                <h4 className="font-semibold text-white">{clinic.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{clinic.role}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">{clinic.hours} Hours</span>
                  <span className="text-green-400">{clinic.cases} Active Cases</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Trophy className="w-5 h-5" />
            Bar Exam Preparation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {lawStudentData.barPrep.mbeScore}
                </div>
                <div className="text-xs text-gray-400">Current MBE</div>
              </div>
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <div className="text-2xl font-bold text-amber-400">
                  {lawStudentData.barPrep.targetScore}
                </div>
                <div className="text-xs text-gray-400">Target MBE</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Topics Completed</span>
                <span className="text-yellow-400">
                  {lawStudentData.barPrep.completedTopics}/{lawStudentData.barPrep.totalTopics}
                </span>
              </div>
              <Progress
                value={
                  (lawStudentData.barPrep.completedTopics / lawStudentData.barPrep.totalTopics) *
                  100
                }
                className="h-2"
              />
            </div>

            <div className="text-center text-sm text-gray-400">
              {lawStudentData.barPrep.studyHours} Study Hours Completed
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LawSchoolStudentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <LawSchoolDashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <CurrentCourses />
            <CaseStudiesAndResearch />
          </div>

          <div className="space-y-6">
            <ClinicalAndBarPrep />

            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Library className="w-5 h-5" />
                  Quick Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Users className="w-4 h-4 mr-2" />
                    Study Groups
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Trophy className="w-4 h-4 mr-2" />
                    Bar Prep Practice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
