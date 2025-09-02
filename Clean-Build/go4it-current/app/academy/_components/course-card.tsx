'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { EnrollButton } from './enroll-button';
import { Button as UIButton } from '@/components/ui/button';

interface DisplayCourse {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  subjects: string[];
  progress: number;
  nextLesson: string;
  estimatedTime: string;
  enrolled: boolean;
  instructor: string;
}

export function CourseCard({ course }: { course: DisplayCourse }) {
  const [enrolled, setEnrolled] = useState(course.enrolled);
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-white text-lg leading-tight">{course.title}</CardTitle>
          <Badge
            variant={
              course.difficulty === 'Advanced'
                ? 'destructive'
                : course.difficulty === 'Intermediate'
                  ? 'default'
                  : 'secondary'
            }
          >
            {course.difficulty}
          </Badge>
        </div>
        <p className="text-slate-400 text-sm line-clamp-3">{course.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Instructor: {course.instructor}</span>
            <span className="text-slate-400">{course.estimatedTime}</span>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">Progress</span>
              <span className="text-green-400">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
          {!!course.subjects?.length && (
            <div className="flex flex-wrap gap-2">
              {course.subjects.map((s, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          )}
          {enrolled && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md flex items-center gap-2">
              <Star className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">Next: {course.nextLesson}</span>
            </div>
          )}
          <div className="flex gap-2">
            <EnrollButton
              courseId={course.id}
              initialEnrolled={enrolled}
              onEnrolled={() => setEnrolled(true)}
            />
            {enrolled && (
              <a href="/academy/daily-schedule">
                <UIButton variant="outline" size="sm" className="px-3">
                  Schedule
                </UIButton>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
