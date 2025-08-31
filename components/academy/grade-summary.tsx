'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Award, BookOpen } from 'lucide-react';

interface Grade {
  id: string;
  points: number;
  maxPoints: number;
  percentage: number;
  letterGrade: string;
  courseId: string;
  assignmentId: string;
  createdAt: string;
}

interface GradeSummaryProps {
  userId: string;
  courseId?: string;
  schoolTheme?: 'superhero' | 'mature' | 'professional' | 'cultural' | 'athletic';
}

const themeColors = {
  superhero: {
    primary: 'bg-blue-500',
    secondary: 'bg-blue-100 text-blue-800',
    accent: 'text-blue-600',
  },
  mature: {
    primary: 'bg-purple-500',
    secondary: 'bg-purple-100 text-purple-800',
    accent: 'text-purple-600',
  },
  professional: {
    primary: 'bg-gray-700',
    secondary: 'bg-gray-100 text-gray-800',
    accent: 'text-gray-600',
  },
  cultural: {
    primary: 'bg-green-500',
    secondary: 'bg-green-100 text-green-800',
    accent: 'text-green-600',
  },
  athletic: {
    primary: 'bg-orange-500',
    secondary: 'bg-orange-100 text-orange-800',
    accent: 'text-orange-600',
  },
};

const gradeLabels = {
  superhero: {
    A: 'Super Hero',
    B: 'Hero',
    C: 'Sidekick',
    D: 'Trainee',
    F: 'Civilian',
  },
  mature: {
    A: 'Leading Actor',
    B: 'Supporting Actor',
    C: 'Ensemble',
    D: 'Understudy',
    F: 'Audience',
  },
  professional: {
    A: 'Senior Partner',
    B: 'Associate',
    C: 'Junior Associate',
    D: 'Paralegal',
    F: 'Law Student',
  },
  cultural: {
    A: 'Cultural Ambassador',
    B: 'Cultural Guide',
    C: 'Cultural Explorer',
    D: 'Cultural Learner',
    F: 'Cultural Tourist',
  },
  athletic: {
    A: 'Champion',
    B: 'All-Star',
    C: 'Varsity',
    D: 'JV',
    F: 'Bench',
  },
};

export default function GradeSummary({
  userId,
  courseId,
  schoolTheme = 'superhero',
}: GradeSummaryProps) {
  const { data: grades = [], isLoading } = useQuery({
    queryKey: ['grades', userId, courseId],
    queryFn: async () => {
      let url = `/api/grades/user/${userId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch grades');
      const allGrades = await response.json();

      return courseId ? allGrades.filter((g: Grade) => g.courseId === courseId) : allGrades;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (grades.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No grades yet</h3>
          <p className="text-sm text-gray-500">
            Complete some assignments to see your progress here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const totalPoints = grades.reduce((sum, grade) => sum + grade.points, 0);
  const totalMaxPoints = grades.reduce((sum, grade) => sum + grade.maxPoints, 0);
  const overallPercentage = totalMaxPoints > 0 ? (totalPoints / totalMaxPoints) * 100 : 0;

  const recentGrades = grades
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Calculate trend
  const recent5 = recentGrades.slice(0, 5);
  const previous5 = grades.slice(5, 10);
  const recentAvg = recent5.reduce((sum, g) => sum + g.percentage, 0) / recent5.length;
  const previousAvg = previous5.reduce((sum, g) => sum + g.percentage, 0) / previous5.length;
  const trend = recentAvg - previousAvg;

  // Get overall letter grade
  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const overallLetterGrade = getLetterGrade(overallPercentage);
  const themeGradeLabel =
    gradeLabels[schoolTheme][overallLetterGrade as keyof typeof gradeLabels.superhero];

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Overall Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{overallPercentage.toFixed(1)}%</span>
                <Badge className={`${themeColors[schoolTheme].primary} text-white`}>
                  {overallLetterGrade}
                </Badge>
              </div>
              <Progress value={overallPercentage} className="h-2" />
              <p className="text-xs text-gray-500">{themeGradeLabel}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{totalPoints}</span>
              <Target className={`w-6 h-6 ${themeColors[schoolTheme].accent}`} />
            </div>
            <p className="text-xs text-gray-500">out of {totalMaxPoints}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{grades.length}</span>
              <Award className={`w-6 h-6 ${themeColors[schoolTheme].accent}`} />
            </div>
            <p className="text-xs text-gray-500">completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {trend > 0 ? '+' : ''}
                {trend.toFixed(1)}%
              </span>
              {trend > 0 ? (
                <TrendingUp className="w-6 h-6 text-green-500" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">{trend > 0 ? 'Improving' : 'Declining'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentGrades.map((grade, index) => (
              <div
                key={grade.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Assignment #{grade.assignmentId}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(grade.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold">
                      {grade.points}/{grade.maxPoints}
                    </p>
                    <p className="text-sm text-gray-600">{grade.percentage.toFixed(1)}%</p>
                  </div>
                  <Badge className={themeColors[schoolTheme].secondary}>{grade.letterGrade}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
