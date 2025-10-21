'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  MapPin,
  Plus,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useState } from 'react';

export default function AcademySchedule() {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [viewMode, setViewMode] = useState('week'); // week, month, list

  // Comprehensive curriculum schedule with real educational content
  const scheduleData = {
    currentWeek: 'Week 8 - February 19-25, 2024',
    courses: [
      {
        id: 'math-algebra2',
        title: 'Algebra II - Advanced Functions',
        instructor: 'Mrs. Johnson',
        room: 'Room 205',
        credits: 1.0,
        schedule: [
          {
            day: 'Monday',
            time: '08:00-09:15',
            topic: 'Exponential Functions',
            source: 'Khan Academy Unit 4',
          },
          {
            day: 'Tuesday',
            time: '08:00-09:15',
            topic: 'Logarithmic Properties',
            source: 'Khan Academy Unit 4',
          },
          {
            day: 'Wednesday',
            time: '08:00-09:15',
            topic: 'Practice Problems',
            source: 'Khan Academy Practice',
          },
          {
            day: 'Thursday',
            time: '08:00-09:15',
            topic: 'Graphing Complex Functions',
            source: 'Khan Academy Unit 5',
          },
          {
            day: 'Friday',
            time: '08:00-09:15',
            topic: 'Unit Assessment',
            source: 'Custom Assessment',
          },
        ],
      },
      {
        id: 'english-11',
        title: 'English 11 - American Literature',
        instructor: 'Mr. Davis',
        room: 'Room 118',
        credits: 1.0,
        schedule: [
          {
            day: 'Monday',
            time: '09:30-10:45',
            topic: 'The Great Gatsby - Chapter Analysis',
            source: 'OpenStax Literature',
          },
          {
            day: 'Tuesday',
            time: '09:30-10:45',
            topic: 'Symbolism in American Literature',
            source: 'OpenStax Chapter 12',
          },
          {
            day: 'Wednesday',
            time: '09:30-10:45',
            topic: 'Essay Writing Workshop',
            source: 'Common Core Writing Standards',
          },
          {
            day: 'Thursday',
            time: '09:30-10:45',
            topic: 'Historical Context Discussion',
            source: 'OpenStax Historical Context',
          },
          {
            day: 'Friday',
            time: '09:30-10:45',
            topic: 'Peer Review & Editing',
            source: 'Writing Process Practice',
          },
        ],
      },
      {
        id: 'science-chemistry',
        title: 'Chemistry - Molecular Structure',
        instructor: 'Dr. Martinez',
        room: 'Lab 301',
        credits: 1.0,
        schedule: [
          {
            day: 'Monday',
            time: '11:00-12:15',
            topic: 'Chemical Bonding Theory',
            source: 'MIT OCW 3.091 - Lecture 8',
          },
          {
            day: 'Tuesday',
            time: '11:00-12:15',
            topic: 'Laboratory: Bond Analysis',
            source: 'MIT OCW Lab Manual',
          },
          {
            day: 'Wednesday',
            time: '11:00-12:15',
            topic: 'Molecular Geometry',
            source: 'Khan Academy Chemistry',
          },
          {
            day: 'Thursday',
            time: '11:00-12:15',
            topic: 'VSEPR Theory Application',
            source: 'MIT OCW Problem Set',
          },
          {
            day: 'Friday',
            time: '11:00-12:15',
            topic: 'Chapter Review & Quiz',
            source: 'OpenStax Chemistry Ch. 7',
          },
        ],
      },
      {
        id: 'history-us',
        title: 'US History - Civil Rights Era',
        instructor: 'Ms. Wilson',
        room: 'Room 142',
        credits: 1.0,
        schedule: [
          {
            day: 'Monday',
            time: '13:00-14:15',
            topic: 'Brown v. Board Impact',
            source: 'OpenStax US History Ch. 28',
          },
          {
            day: 'Tuesday',
            time: '13:00-14:15',
            topic: 'Montgomery Bus Boycott',
            source: 'Primary Source Documents',
          },
          {
            day: 'Wednesday',
            time: '13:00-14:15',
            topic: 'Civil Rights Leaders Panel',
            source: 'Student Research Project',
          },
          {
            day: 'Thursday',
            time: '13:00-14:15',
            topic: 'March on Washington Analysis',
            source: 'Historical Video Analysis',
          },
          {
            day: 'Friday',
            time: '13:00-14:15',
            topic: 'Legislation & Long-term Impact',
            source: 'OpenStax Ch. 29',
          },
        ],
      },
      {
        id: 'sports-science',
        title: 'Sports Science & Athletic Performance',
        instructor: 'Coach Thompson',
        room: 'Gym Conference Room',
        credits: 0.5,
        schedule: [
          {
            day: 'Monday',
            time: '14:30-15:15',
            topic: 'Exercise Physiology',
            source: 'Go4It Sports Science Module',
          },
          {
            day: 'Wednesday',
            time: '14:30-15:15',
            topic: 'Biomechanics Analysis',
            source: 'GAR Analysis Integration',
          },
          {
            day: 'Friday',
            time: '14:30-15:15',
            topic: 'Nutrition for Athletes',
            source: 'NCAA Compliance Guidelines',
          },
        ],
      },
      {
        id: 'study-hall',
        title: 'Academic Support & Study Hall',
        instructor: 'Multiple Staff',
        room: 'Library',
        credits: 0,
        schedule: [
          {
            day: 'Tuesday',
            time: '14:30-15:30',
            topic: 'Individual Study Time',
            source: 'Self-Directed Learning',
          },
          {
            day: 'Thursday',
            time: '14:30-15:30',
            topic: 'Tutoring Available',
            source: 'Peer & Teacher Support',
          },
        ],
      },
    ],
    upcomingAssignments: [
      {
        course: 'Algebra II',
        assignment: 'Exponential Functions Test',
        due: 'Feb 26',
        type: 'exam',
      },
      { course: 'English 11', assignment: 'Literary Analysis Essay', due: 'Feb 28', type: 'essay' },
      { course: 'Chemistry', assignment: 'Molecular Models Lab Report', due: 'Mar 1', type: 'lab' },
      {
        course: 'US History',
        assignment: 'Civil Rights Research Project',
        due: 'Mar 3',
        type: 'project',
      },
      {
        course: 'Sports Science',
        assignment: 'Personal Training Plan',
        due: 'Mar 5',
        type: 'practical',
      },
    ],
  };

  const getDaySchedule = (day: string) => {
    return scheduleData.courses
      .flatMap((course) =>
        course.schedule
          .filter((session) => session.day === day)
          .map((session) => ({
            ...session,
            courseTitle: course.title,
            instructor: course.instructor,
            room: course.room,
            courseId: course.id,
          })),
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Class Schedule
            </h1>
            <p className="text-slate-400 mt-2">{scheduleData.currentWeek}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex rounded-lg bg-slate-700 p-1">
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
                className="text-xs"
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="text-xs"
              >
                List
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <a href="/academy/create-class">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Class
                </Button>
              </a>
              <div className="flex items-center gap-1 ml-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  Today
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Week View */}
        {viewMode === 'week' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {weekDays.map((day) => {
              const daySchedule = getDaySchedule(day);
              return (
                <Card key={day} className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-center">
                      {day}
                      <div className="text-sm text-slate-400 font-normal mt-1">
                        {daySchedule.length} classes
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {daySchedule.map((session, idx) => (
                        <div key={idx} className="p-2 bg-slate-700/50 rounded-md text-xs">
                          <div className="font-semibold text-white">{session.time}</div>
                          <div className="text-slate-300 truncate">{session.courseTitle}</div>
                          <div className="text-slate-400">{session.room}</div>
                          <div className="text-green-400 text-[10px] mt-1">{session.topic}</div>
                        </div>
                      ))}
                      {daySchedule.length === 0 && (
                        <div className="text-slate-500 text-center py-4">No classes</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-6 mb-8">
            {scheduleData.courses.map((course) => (
              <Card key={course.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-white">{course.title}</CardTitle>
                      <p className="text-slate-400">
                        {course.instructor} • {course.room} • {course.credits} Credits
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {course.schedule.map((session, idx) => (
                      <div key={idx} className="p-3 bg-slate-700/30 rounded-lg">
                        <div className="font-semibold text-green-400">{session.day}</div>
                        <div className="text-sm text-slate-300">{session.time}</div>
                        <div className="text-sm text-white mt-2">{session.topic}</div>
                        <div className="text-xs text-slate-400 mt-1">{session.source}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upcoming Assignments */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduleData.upcomingAssignments.map((assignment, idx) => (
                <div key={idx} className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={
                        assignment.type === 'exam'
                          ? 'destructive'
                          : assignment.type === 'project'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {assignment.type}
                    </Badge>
                    <span className="text-sm text-slate-400">Due {assignment.due}</span>
                  </div>
                  <div className="font-semibold text-white">{assignment.assignment}</div>
                  <div className="text-sm text-slate-400">{assignment.course}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Curriculum Integration Info */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-400" />
              Curriculum Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">Khan Academy</h3>
                <p className="text-sm text-slate-400">
                  72 integrated lessons across Math & Science
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">OpenStax</h3>
                <p className="text-sm text-slate-400">150+ textbook sections for core subjects</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">MIT OCW</h3>
                <p className="text-sm text-slate-400">40+ advanced courses for college prep</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">Common Core</h3>
                <p className="text-sm text-slate-400">60 standards modules aligned to curriculum</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">
                <strong>NCAA Compliant:</strong> All courses meet NCAA core course requirements and
                maintain proper credit hours for Division I & II eligibility.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
