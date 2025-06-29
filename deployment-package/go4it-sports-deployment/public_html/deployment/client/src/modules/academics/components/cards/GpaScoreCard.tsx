import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Subject {
  name: string;
  grade: string;
  score: number; // Numeric equivalent of the grade (e.g., A = 4.0)
}

interface GpaScoreCardProps {
  overallGpa: number;
  subjects: Subject[];
  term?: string;
  maxGpa?: number;
  className?: string;
}

/**
 * GpaScoreCard component
 * 
 * Displays a student athlete's GPA and subject breakdown
 * This is a modular component that can be dropped into the CMS
 */
export const GpaScoreCard: React.FC<GpaScoreCardProps> = ({
  overallGpa,
  subjects,
  term,
  maxGpa = 4.0,
  className = ''
}) => {
  // Calculate percentage of max GPA for progress bars
  const gpaPercentage = (overallGpa / maxGpa) * 100;
  
  // Get color based on GPA range
  const getGpaColor = (score: number): string => {
    if (score >= 3.5) return 'bg-green-500';
    if (score >= 3.0) return 'bg-lime-500';
    if (score >= 2.5) return 'bg-yellow-500';
    if (score >= 2.0) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Get letter grade from numeric score
  const getLetterGrade = (score: number): string => {
    if (score >= 3.7) return 'A';
    if (score >= 3.3) return 'A-';
    if (score >= 3.0) return 'B+';
    if (score >= 2.7) return 'B';
    if (score >= 2.3) return 'B-';
    if (score >= 2.0) return 'C+';
    if (score >= 1.7) return 'C';
    if (score >= 1.3) return 'C-';
    if (score >= 1.0) return 'D';
    return 'F';
  };

  return (
    <Card className={`w-full shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">
          Academic Performance
          {term && <span className="ml-2 text-lg font-normal">({term})</span>}
        </CardTitle>
        <CardDescription>
          GPA and subject breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall GPA */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{overallGpa.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Overall GPA</div>
            </div>
            <div className="flex-1">
              <Progress value={gpaPercentage} className="h-4" />
              <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                <span>0.0</span>
                <span>{maxGpa.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Subject Breakdown */}
          <div className="space-y-3">
            <h3 className="font-medium">Subject Breakdown</h3>
            {subjects.map((subject, index) => {
              const subjectPercentage = (subject.score / maxGpa) * 100;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{subject.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{subject.grade}</span>
                      <span className="text-xs text-muted-foreground">({subject.score.toFixed(1)})</span>
                    </div>
                  </div>
                  <Progress value={subjectPercentage} className="h-2" />
                </div>
              );
            })}
          </div>
          
          {/* ADHD-focused study tips */}
          <div className="bg-muted p-3 rounded-lg text-sm">
            <h4 className="font-medium mb-2">ADHD Focus Tips</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Break study sessions into 25-minute blocks with 5-minute breaks</li>
              <li>Create visual aids for complex subjects</li>
              <li>Use color-coding for notes and flashcards</li>
              <li>Track progress and celebrate small wins</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};