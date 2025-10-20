'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleBlock {
  id: string;
  courseId: string;
  courseName: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  type: string;
  gradeLevel: string;
}

interface CourseSchedulerProps {
  studentId?: string;
  grade?: string;
}

export default function CourseScheduler({ studentId, grade = '9' }: CourseSchedulerProps) {
  const [schedule, setSchedule] = useState<any>(null);
  const [calendar, setCalendar] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [view, setView] = useState<'week' | 'day' | 'list'>('week');
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchScheduleData();
    fetchAllCourses();
  }, [studentId, grade]);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (studentId) params.append('studentId', studentId);
      if (grade) params.append('grade', grade);

      const response = await fetch(`/api/academy/scheduling?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSchedule(data.schedule || data.masterSchedule);
        setCalendar(data.calendar);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      // Fetch all integrated courses
      const [khanRes, ccRes, openstaxRes, mitRes, sportsRes] = await Promise.all([
        fetch('/api/academy/khan-integration?subject=all'),
        fetch('/api/academy/common-core?grade=all'),
        fetch('/api/academy/openstax?subject=all'),
        fetch('/api/academy/mit-ocw?subject=all'),
        fetch(`/api/academy/curriculum-sync?grade=${grade}`),
      ]);

      const [khan, cc, openstax, mit, sports] = await Promise.all([
        khanRes.json(),
        ccRes.json(),
        openstaxRes.json(),
        mitRes.json(),
        sportsRes.json(),
      ]);

      // Combine all courses
      const combinedCourses = [
        ...(sports.sportsCourses || []),
        { id: 'khan', title: 'Khan Academy Courses', type: 'khan', data: khan.content },
        { id: 'cc', title: 'Common Core Standards', type: 'cc', data: cc.standards },
        { id: 'openstax', title: 'OpenStax Textbooks', type: 'openstax', data: openstax.content },
        { id: 'mit', title: 'MIT OpenCourseWare', type: 'mit', data: mit.content },
      ];

      setAllCourses(combinedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  const getScheduleForDay = (day: string) => {
    if (!schedule) return [];

    if (schedule.blocks) {
      // Student schedule format
      return schedule.blocks.filter(
        (block: ScheduleBlock) => block.day.toLowerCase() === day.toLowerCase(),
      );
    } else if (schedule[day.toLowerCase()]) {
      // Master schedule format
      return schedule[day.toLowerCase()];
    }

    return [];
  };

  const renderWeekView = () => (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Time slots header */}
        <div className="grid grid-cols-6 gap-2 mb-2">
          <div className="text-sm font-medium text-muted-foreground">Time</div>
          {days.map((day) => (
            <div key={day} className="text-sm font-medium text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Schedule grid */}
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-6 gap-2 mb-2">
            <div className="text-sm text-muted-foreground py-2">{time}</div>
            {days.map((day) => {
              const daySchedule = getScheduleForDay(day);
              const block = daySchedule.find(
                (b: any) => b.startTime === time || b.time?.startsWith(time),
              );

              if (block) {
                return (
                  <Card key={`${day}-${time}`} className="p-2 bg-primary/10 border-primary/20">
                    <div className="text-xs font-medium">{block.courseName || block.subject}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {block.room}
                    </div>
                  </Card>
                );
              }

              return <div key={`${day}-${time}`} className="p-2" />;
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {days.map((day) => {
        const daySchedule = getScheduleForDay(day);

        return (
          <Card key={day}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {daySchedule.length > 0 ? (
                daySchedule.map((block: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">
                        {block.time || `${block.startTime}-${block.endTime}`}
                      </div>
                      <div>
                        <div className="font-medium">{block.subject || block.courseName}</div>
                        <div className="text-sm text-muted-foreground">Room {block.room}</div>
                      </div>
                    </div>
                    <Badge variant={block.type === 'lab' ? 'secondary' : 'default'}>
                      {block.type || 'Lecture'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No classes scheduled</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderAllCourses = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sports-Focused Courses */}
        {allCourses
          .filter((c) => c.gradeLevel)
          .map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <Badge>Grade {course.gradeLevel}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Credits: {course.credits}</div>
                  <div className="flex flex-wrap gap-1">
                    {course.subjects?.map((subject: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="w-full mt-2">
                    Enroll in Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* External Course Integrations */}
      <div className="space-y-4">
        {allCourses
          .filter((c) => c.type)
          .map((source) => (
            <Card key={source.id}>
              <CardHeader>
                <CardTitle>{source.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {source.type === 'khan' &&
                    source.data &&
                    Object.entries(source.data)
                      .slice(0, 6)
                      .map(([key, value]: [string, any]) => (
                        <div key={key} className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-sm">{value.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {value.topics?.length || 0} topics
                          </div>
                        </div>
                      ))}
                  {source.type === 'openstax' &&
                    source.data &&
                    Object.entries(source.data)
                      .slice(0, 6)
                      .map(([key, value]: [string, any]) => (
                        <div key={key} className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-sm">{value.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Grade {value.gradeLevel}
                          </div>
                        </div>
                      ))}
                  {source.type === 'mit' &&
                    source.data &&
                    Object.entries(source.data)
                      .slice(0, 3)
                      .map(([key, value]: [string, any]) => (
                        <div key={key} className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-sm capitalize">{key}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {value.courses?.length || 0} courses available
                          </div>
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList>
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          <TabsTrigger value="courses">All Courses</TabsTrigger>
          <TabsTrigger value="calendar">Academic Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Weekly Schedule</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView('week')}
                className={view === 'week' ? 'bg-primary text-primary-foreground' : ''}
              >
                Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView('list')}
                className={view === 'list' ? 'bg-primary text-primary-foreground' : ''}
              >
                List
              </Button>
            </div>
          </div>

          {view === 'week' ? renderWeekView() : renderListView()}
        </TabsContent>

        <TabsContent value="courses">{renderAllCourses()}</TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          {calendar && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Academic Year 2024-2025</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Semesters</h4>
                    {calendar.semesters?.map((sem: any, idx: number) => (
                      <div key={idx} className="flex justify-between p-2 bg-muted/50 rounded mb-2">
                        <span>{sem.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {sem.start} to {sem.end}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Important Dates</h4>
                    {calendar.events?.map((event: any, idx: number) => (
                      <div key={idx} className="flex justify-between p-2 hover:bg-muted/50 rounded">
                        <span>{event.name}</span>
                        <span className="text-sm text-muted-foreground">{event.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
