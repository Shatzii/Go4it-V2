'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  BookOpen,
  Play,
  CheckCircle,
  AlertCircle,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  Target,
} from 'lucide-react';

export default function DailySchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(0);

  const getWeekDays = (weekOffset = 0) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + weekOffset * 7));
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);

  // Comprehensive daily schedule with integrated lesson access
  const dailySchedule = {
    Monday: [
      {
        time: '8:00 - 8:50 AM',
        period: 1,
        subject: 'Study Hall / Morning Prep',
        instructor: 'Ms. Adams',
        room: 'Library',
        type: 'study',
        color: 'bg-gray-600',
        lessons: [],
        status: 'completed',
      },
      {
        time: '9:00 - 9:50 AM',
        period: 2,
        subject: 'Algebra II',
        instructor: 'Mrs. Parker',
        room: 'Math 202',
        type: 'core-math',
        color: 'bg-blue-600',
        lessons: [
          { id: 'math-2.3', title: 'Quadratic Functions', duration: '45 min', status: 'available' },
          { id: 'math-2.4', title: 'Graphing Parabolas', duration: '40 min', status: 'locked' },
        ],
        assignments: [{ title: 'Problem Set 2.3', due: 'Today', status: 'pending' }],
        status: 'current',
      },
      {
        time: '10:00 - 10:50 AM',
        period: 3,
        subject: 'Chemistry',
        instructor: 'Dr. Kim',
        room: 'Chemistry Lab',
        type: 'core-science',
        color: 'bg-green-600',
        lessons: [
          { id: 'chem-5.1', title: 'Chemical Bonding', duration: '50 min', status: 'available' },
          {
            id: 'chem-lab-3',
            title: 'Lab: Ionic Compounds',
            duration: '45 min',
            status: 'available',
          },
        ],
        assignments: [
          { title: 'Lab Report - Ionic Bonding', due: 'Wednesday', status: 'not_started' },
        ],
        status: 'upcoming',
      },
      {
        time: '11:00 - 11:50 AM',
        period: 4,
        subject: 'English 10',
        instructor: 'Mr. White',
        room: 'English 302',
        type: 'core-english',
        color: 'bg-purple-600',
        lessons: [
          { id: 'eng-4.2', title: 'Shakespeare Analysis', duration: '50 min', status: 'available' },
          { id: 'eng-writing', title: 'Essay Structure', duration: '35 min', status: 'available' },
        ],
        assignments: [{ title: 'Romeo & Juliet Essay', due: 'Friday', status: 'in_progress' }],
        status: 'upcoming',
      },
      {
        time: '11:50 AM - 12:30 PM',
        period: 'Lunch',
        subject: 'Lunch Break',
        instructor: '',
        room: 'Cafeteria',
        type: 'break',
        color: 'bg-orange-500',
        lessons: [],
        status: 'break',
      },
      {
        time: '12:35 - 1:25 PM',
        period: 5,
        subject: 'Modern World Studies',
        instructor: 'Ms. Turner',
        room: 'Social Studies 402',
        type: 'core-history',
        color: 'bg-indigo-600',
        lessons: [
          { id: 'hist-8.1', title: 'World War I Causes', duration: '45 min', status: 'available' },
          {
            id: 'hist-doc-analysis',
            title: 'Primary Source Analysis',
            duration: '30 min',
            status: 'available',
          },
        ],
        assignments: [{ title: 'WWI Timeline Project', due: 'Next Monday', status: 'not_started' }],
        status: 'upcoming',
      },
      {
        time: '1:30 - 2:20 PM',
        period: 6,
        subject: 'Sports Science & Performance',
        instructor: 'Dr. Martinez',
        room: 'Science Lab C',
        type: 'specialty',
        color: 'bg-red-600',
        lessons: [
          { id: 'ss-3.2', title: 'Biomechanics Analysis', duration: '50 min', status: 'available' },
          {
            id: 'ss-lab-gar',
            title: 'GAR System Tutorial',
            duration: '40 min',
            status: 'available',
          },
        ],
        assignments: [
          { title: 'Personal Movement Analysis', due: 'Thursday', status: 'in_progress' },
        ],
        status: 'upcoming',
      },
      {
        time: '2:25 - 3:15 PM',
        period: 7,
        subject: 'Athletic Development',
        instructor: 'Coach Thompson',
        room: 'Gymnasium',
        type: 'athletic',
        color: 'bg-yellow-600',
        lessons: [
          {
            id: 'ad-strength',
            title: 'Strength Training Principles',
            duration: '45 min',
            status: 'available',
          },
          {
            id: 'ad-conditioning',
            title: 'Sport-Specific Conditioning',
            duration: '40 min',
            status: 'locked',
          },
        ],
        assignments: [],
        status: 'upcoming',
      },
      {
        time: '3:20 - 4:10 PM',
        period: 8,
        subject: 'Study Hall / Tutorial',
        instructor: 'Various',
        room: 'Multiple Rooms',
        type: 'study',
        color: 'bg-gray-600',
        lessons: [
          {
            id: 'tutorial-math',
            title: 'Math Help Session',
            duration: '50 min',
            status: 'available',
          },
          {
            id: 'tutorial-science',
            title: 'Science Lab Makeup',
            duration: '50 min',
            status: 'available',
          },
        ],
        status: 'upcoming',
      },
    ],
  };

  const todaySchedule = dailySchedule.Monday; // Would be dynamic based on selected day

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'current':
        return <Play className="w-4 h-4 text-blue-400" />;
      case 'upcoming':
        return <Clock className="w-4 h-4 text-slate-400" />;
      case 'break':
        return <Users className="w-4 h-4 text-orange-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getLessonStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <Badge variant="outline" className="text-green-400 border-green-400">
            Ready
          </Badge>
        );
      case 'locked':
        return (
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
            Locked
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            Done
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Daily Class Schedule & Lessons</h1>
            <p className="text-slate-400 mt-2">
              Access your daily classes and start lessons directly
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Target className="w-3 h-3 mr-1" />
              NCAA Compliant
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              7.0 Credits Enrolled
            </Badge>
          </div>
        </div>

        {/* Week Navigator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek - 1)}>
              <ChevronLeft className="w-4 h-4" />
              Previous Week
            </Button>
            <div className="text-lg font-semibold">
              Week of{' '}
              {weekDays[0].toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek + 1)}>
              Next Week
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            {weekDays.map((day, idx) => (
              <Button
                key={idx}
                variant={day.toDateString() === selectedDate.toDateString() ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDate(day)}
                className="min-w-[60px]"
              >
                <div className="text-center">
                  <div className="text-xs">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-sm font-bold">{day.getDate()}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="grid grid-cols-1 gap-4">
          {todaySchedule.map((classItem, idx) => (
            <Card
              key={idx}
              className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-colors"
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Class Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(classItem.status)}
                      <div className={`w-3 h-3 rounded-full ${classItem.color}`} />
                      <span className="font-bold text-white">Period {classItem.period}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{classItem.subject}</h3>
                    <div className="space-y-1 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {classItem.time}
                      </div>
                      {classItem.instructor && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          {classItem.instructor}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {classItem.room}
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  {classItem.lessons.length > 0 && (
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Today's Lessons
                      </h4>
                      <div className="space-y-2">
                        {classItem.lessons.map((lesson, lessonIdx) => (
                          <div
                            key={lessonIdx}
                            className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-white">{lesson.title}</span>
                                {getLessonStatusBadge(lesson.status)}
                              </div>
                              <div className="text-sm text-slate-400">{lesson.duration}</div>
                            </div>
                            <Button
                              size="sm"
                              disabled={lesson.status === 'locked'}
                              onClick={() =>
                                (window.location.href = `/academy/courses/sports-science/lessons/${lesson.id}`)
                              }
                            >
                              {lesson.status === 'locked' ? 'Locked' : 'Start Lesson'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="lg:col-span-1">
                    <div className="space-y-3">
                      {classItem.assignments && classItem.assignments.length > 0 && (
                        <div>
                          <h5 className="font-medium text-white mb-2">Assignments</h5>
                          {classItem.assignments.map((assignment, assignIdx) => (
                            <div key={assignIdx} className="p-2 bg-slate-700/30 rounded text-sm">
                              <div className="text-white">{assignment.title}</div>
                              <div className="text-slate-400 text-xs">Due: {assignment.due}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {classItem.status === 'current' && (
                        <Button className="w-full" size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Join Class Now
                        </Button>
                      )}

                      {classItem.lessons.length > 0 && (
                        <Button variant="outline" className="w-full" size="sm">
                          <Star className="w-4 h-4 mr-2" />
                          View All Lessons
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Summary */}
        <Card className="mt-8 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Today's Progress Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">4</div>
                <div className="text-sm text-slate-400">Lessons Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">2</div>
                <div className="text-sm text-slate-400">Lessons Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">3</div>
                <div className="text-sm text-slate-400">Assignments Due</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">7.5h</div>
                <div className="text-sm text-slate-400">Study Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
