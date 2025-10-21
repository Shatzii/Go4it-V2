'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Play,
  Clock,
  CheckCircle,
  FileText,
  Video,
  Users,
  Target,
  Award,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function CourseDetail() {
  const params = useParams();
  const courseId = params.courseId;

  // Comprehensive course content with integrated curriculum
  const courseDetails = {
    'sports-science': {
      title: 'Sports Science & Performance',
      description:
        'Advanced sports science curriculum designed for student athletes with comprehensive analysis tools',
      instructor: 'Dr. Sarah Martinez, PhD in Exercise Physiology',
      credits: 1.0,
      duration: '16 weeks',
      difficulty: 'Advanced',
      progress: 75,
      modules: [
        {
          id: 1,
          title: 'Exercise Physiology Fundamentals',
          lessons: [
            {
              id: '1.1',
              title: 'Cardiovascular Adaptations',
              source: 'Khan Academy Biology',
              duration: '45 min',
              completed: true,
            },
            {
              id: '1.2',
              title: 'Muscle Fiber Types',
              source: 'MIT OCW 7.016',
              duration: '60 min',
              completed: true,
            },
            {
              id: '1.3',
              title: 'Energy Systems',
              source: 'OpenStax Anatomy Ch. 10',
              duration: '50 min',
              completed: true,
            },
            {
              id: '1.4',
              title: 'VO2 Max Testing',
              source: 'GAR Analysis Integration',
              duration: '40 min',
              completed: false,
            },
          ],
        },
        {
          id: 2,
          title: 'Sports Psychology',
          lessons: [
            {
              id: '2.1',
              title: 'Mental Training Basics',
              source: 'Sports Psychology Research',
              duration: '35 min',
              completed: true,
            },
            {
              id: '2.2',
              title: 'Performance Anxiety',
              source: 'Applied Psychology Studies',
              duration: '45 min',
              completed: true,
            },
            {
              id: '2.3',
              title: 'Goal Setting Strategies',
              source: 'Achievement Psychology',
              duration: '30 min',
              completed: false,
            },
            {
              id: '2.4',
              title: 'Visualization Techniques',
              source: 'Cognitive Training Methods',
              duration: '40 min',
              completed: false,
            },
          ],
        },
        {
          id: 3,
          title: 'Biomechanics Analysis',
          lessons: [
            {
              id: '3.1',
              title: 'Motion Analysis Principles',
              source: 'Physics Applications',
              duration: '55 min',
              completed: true,
            },
            {
              id: '3.2',
              title: 'Force Vector Analysis',
              source: 'MIT OCW Physics 8.01',
              duration: '65 min',
              completed: false,
            },
            {
              id: '3.3',
              title: 'GAR System Integration',
              source: 'Go4It Analysis Tools',
              duration: '70 min',
              completed: false,
            },
            {
              id: '3.4',
              title: 'Performance Optimization',
              source: 'Biomechanics Research',
              duration: '45 min',
              completed: false,
            },
          ],
        },
        {
          id: 4,
          title: 'Nutrition for Athletes',
          lessons: [
            {
              id: '4.1',
              title: 'Macronutrient Balance',
              source: 'Sports Nutrition Science',
              duration: '40 min',
              completed: false,
            },
            {
              id: '4.2',
              title: 'Hydration Strategies',
              source: 'Exercise Science Research',
              duration: '35 min',
              completed: false,
            },
            {
              id: '4.3',
              title: 'Supplement Science',
              source: 'Nutrition Research',
              duration: '50 min',
              completed: false,
            },
            {
              id: '4.4',
              title: 'Recovery Nutrition',
              source: 'Sports Medicine Studies',
              duration: '45 min',
              completed: false,
            },
          ],
        },
      ],
      upcomingAssignments: [
        { title: 'Biomechanical Analysis Report', due: 'March 1, 2024', type: 'Lab Report' },
        { title: 'Personal Training Plan', due: 'March 5, 2024', type: 'Project' },
        { title: 'Sports Psychology Case Study', due: 'March 10, 2024', type: 'Essay' },
      ],
      resources: [
        { title: 'Khan Academy - Human Biology', type: 'Video Series', url: 'External Link' },
        { title: 'MIT OCW - Physics for Athletes', type: 'Course Material', url: 'External Link' },
        { title: 'OpenStax - Anatomy & Physiology', type: 'Textbook', url: 'External Link' },
        { title: 'GAR Analysis Software', type: 'Interactive Tool', url: 'Internal Tool' },
      ],
    },
    'ncaa-compliance': {
      title: 'NCAA Compliance & Eligibility',
      description:
        'Understanding NCAA requirements and maintaining eligibility for Division I & II athletics',
      instructor: 'Coach Michael Thompson, NCAA Compliance Officer',
      credits: 0.5,
      duration: '8 weeks',
      difficulty: 'Intermediate',
      progress: 60,
      modules: [
        {
          id: 1,
          title: 'Academic Standards',
          lessons: [
            {
              id: '1.1',
              title: 'Core Course Requirements',
              source: 'NCAA Official Guidelines',
              duration: '30 min',
              completed: true,
            },
            {
              id: '1.2',
              title: 'GPA Calculations',
              source: 'NCAA Eligibility Center',
              duration: '25 min',
              completed: true,
            },
            {
              id: '1.3',
              title: 'Test Score Requirements',
              source: 'SAT/ACT Standards',
              duration: '35 min',
              completed: false,
            },
          ],
        },
        {
          id: 2,
          title: 'Amateurism Rules',
          lessons: [
            {
              id: '2.1',
              title: 'Professional Activity Rules',
              source: 'NCAA Compliance Manual',
              duration: '40 min',
              completed: true,
            },
            {
              id: '2.2',
              title: 'Benefits & Payments',
              source: 'NCAA Regulations',
              duration: '35 min',
              completed: false,
            },
            {
              id: '2.3',
              title: 'Social Media Guidelines',
              source: 'NCAA Digital Guidelines',
              duration: '30 min',
              completed: false,
            },
          ],
        },
      ],
      upcomingAssignments: [
        { title: 'Eligibility Self-Assessment', due: 'February 28, 2024', type: 'Assessment' },
        { title: 'Academic Plan Review', due: 'March 3, 2024', type: 'Planning' },
      ],
      resources: [
        { title: 'NCAA Eligibility Center', type: 'Official Portal', url: 'External Link' },
        { title: 'Core Course Database', type: 'Search Tool', url: 'External Link' },
        { title: 'Compliance Checklist', type: 'Document', url: 'Internal Resource' },
      ],
    },
  };

  const course = courseDetails[courseId as keyof typeof courseDetails];

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Course Not Found</h1>
          <p className="text-slate-400 mb-6">The course you're looking for doesn't exist.</p>
          <a href="/academy">
            <Button>Return to Academy</Button>
          </a>
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
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{course.title}</h1>
            <p className="text-slate-400 mt-2">{course.description}</p>
          </div>
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="font-semibold text-white">{course.instructor}</div>
                <div className="text-sm text-slate-400">Instructor</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="font-semibold text-white">{course.duration}</div>
                <div className="text-sm text-slate-400">{course.credits} Credits</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="font-semibold text-white">{course.progress}%</div>
                <div className="text-sm text-slate-400">Progress</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={course.progress} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {course.modules.map((module) => {
                const completedLessons = module.lessons.filter((l) => l.completed).length;
                const totalLessons = module.lessons.length;
                const moduleProgress = (completedLessons / totalLessons) * 100;

                return (
                  <div key={module.id} className="text-center">
                    <div className="text-lg font-bold text-green-400">
                      {completedLessons}/{totalLessons}
                    </div>
                    <div className="text-sm text-slate-400">Module {module.id}</div>
                    <div className="text-xs text-slate-500">
                      {Math.round(moduleProgress)}% Complete
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Course Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Course Modules</h2>
            {course.modules.map((module) => (
              <Card key={module.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    Module {module.id}: {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Play className="w-5 h-5 text-slate-400" />
                          )}
                          <div>
                            <div className="font-semibold text-white">{lesson.title}</div>
                            <div className="text-sm text-slate-400">
                              {lesson.source} • {lesson.duration}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant={lesson.completed ? 'outline' : 'default'}>
                          {lesson.completed ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            {/* Upcoming Assignments */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-400" />
                  Upcoming Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.upcomingAssignments.map((assignment, idx) => (
                    <div key={idx} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-white">{assignment.title}</div>
                        <Badge variant="outline">{assignment.type}</Badge>
                      </div>
                      <div className="text-sm text-slate-400">Due: {assignment.due}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Course Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.resources.map((resource, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-white">{resource.title}</div>
                        <div className="text-sm text-slate-400">{resource.type}</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Access
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/academy/schedule">
                  <Button className="w-full" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Schedule
                  </Button>
                </a>
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Study Group
                </Button>
                <Button className="w-full" variant="outline">
                  <Award className="w-4 h-4 mr-2" />
                  View Grades
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
