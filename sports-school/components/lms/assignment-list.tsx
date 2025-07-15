'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface Assignment {
  id: string;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  maxPoints: number;
  courseId: string;
  status?: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  score?: number;
}

interface AssignmentListProps {
  userId?: string;
  courseId?: string;
  schoolTheme?: 'superhero' | 'mature' | 'professional' | 'cultural' | 'athletic';
}

const themeColors = {
  superhero: 'bg-blue-500 text-white',
  mature: 'bg-purple-500 text-white',
  professional: 'bg-gray-700 text-white',
  cultural: 'bg-green-500 text-white',
  athletic: 'bg-orange-500 text-white'
};

const themeIcons = {
  superhero: '🦸‍♂️',
  mature: '🎭',
  professional: '⚖️',
  cultural: '🌍',
  athletic: '🏃‍♂️'
};

export default function AssignmentList({ userId, courseId, schoolTheme = 'superhero' }: AssignmentListProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['assignments', courseId, userId],
    queryFn: async () => {
      let url = '/api/assignments';
      if (courseId) url += `/course/${courseId}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch assignments');
      return response.json();
    }
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`/api/submissions/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch submissions');
      return response.json();
    },
    enabled: !!userId
  });

  const { data: grades = [] } = useQuery({
    queryKey: ['grades', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`/api/grades/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch grades');
      return response.json();
    },
    enabled: !!userId
  });

  const getAssignmentStatus = (assignment: Assignment) => {
    const submission = submissions.find(s => s.assignmentId === assignment.id);
    const grade = grades.find(g => g.assignmentId === assignment.id);
    
    if (grade) return 'graded';
    if (submission) return 'submitted';
    if (new Date(assignment.dueDate) < new Date()) return 'overdue';
    return 'not_started';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded': return <CheckCircle className="w-4 h-4" />;
      case 'submitted': return <FileText className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const filteredAssignments = assignments.filter(assignment => 
    selectedType === 'all' || assignment.type === selectedType
  );

  const assignmentTypes = [...new Set(assignments.map(a => a.type))];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Theme */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{themeIcons[schoolTheme]}</span>
          <h2 className="text-2xl font-bold">
            {schoolTheme === 'superhero' && 'Hero Missions'}
            {schoolTheme === 'mature' && 'Stage Assignments'}
            {schoolTheme === 'professional' && 'Legal Briefs'}
            {schoolTheme === 'cultural' && 'Cultural Projects'}
            {schoolTheme === 'athletic' && 'Training Challenges'}
          </h2>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            All
          </Button>
          {assignmentTypes.map(type => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.map(assignment => {
          const status = getAssignmentStatus(assignment);
          const grade = grades.find(g => g.assignmentId === assignment.id);
          const daysUntilDue = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">
                    {assignment.title}
                  </CardTitle>
                  <Badge className={getStatusColor(status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(status)}
                      <span className="capitalize">{status.replace('_', ' ')}</span>
                    </div>
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {format(new Date(assignment.dueDate), 'MMM d, yyyy')}</span>
                  {daysUntilDue > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {daysUntilDue} days left
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {assignment.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Type: {assignment.type}</span>
                  </div>
                  <span className="font-medium">
                    {assignment.maxPoints} points
                  </span>
                </div>
                
                {grade && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Score:</span>
                      <span className="font-bold text-lg">
                        {grade.points}/{assignment.maxPoints}
                      </span>
                    </div>
                    <Progress 
                      value={(grade.points / assignment.maxPoints) * 100} 
                      className="h-2"
                    />
                    {grade.letterGrade && (
                      <div className="text-center">
                        <Badge className={`${themeColors[schoolTheme]} text-lg font-bold`}>
                          {grade.letterGrade}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.location.href = `/assignments/${assignment.id}`}
                  >
                    {status === 'not_started' ? 'Start' : 'View'}
                  </Button>
                  {status === 'graded' && grade?.feedback && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/assignments/${assignment.id}/feedback`}
                    >
                      Feedback
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredAssignments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl">{themeIcons[schoolTheme]}</div>
              <h3 className="text-lg font-semibold">
                {schoolTheme === 'superhero' && 'No missions available yet!'}
                {schoolTheme === 'mature' && 'No assignments posted yet!'}
                {schoolTheme === 'professional' && 'No cases assigned yet!'}
                {schoolTheme === 'cultural' && 'No projects available yet!'}
                {schoolTheme === 'athletic' && 'No challenges posted yet!'}
              </h3>
              <p className="text-gray-600">
                Check back soon for new assignments from your teachers.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}