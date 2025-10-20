'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  BookOpen,
  Save,
  Eye,
  AlertTriangle,
} from 'lucide-react';

interface QuizResult {
  attempt: {
    id: string;
    quizTitle: string;
    quizDescription: string;
    courseTitle: string;
    studentName: string;
    startedAt: string;
    completedAt: string;
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    timeSpent: number;
    autoSubmitted: boolean;
  };
  answers: Array<{
    id: string;
    question: string;
    type: string;
    points: number;
    maxPoints: number;
    earnedPoints: number;
    studentAnswer: string;
    correctAnswer: string;
    options: string[] | null;
    isCorrect: boolean | null;
    needsGrading: boolean;
  }>;
  summary: {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    needsGrading: number;
    totalScore: number;
    maxScore: number;
    percentage: number;
  };
}

export default function QuizGrader({ attemptId }: { attemptId: string }) {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [grades, setGrades] = useState<{ [answerId: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/academy/assessment/attempt/${attemptId}/results`);
      if (response.ok) {
        const data = await response.json();
        setResult(data);

        // Initialize grades for questions that need grading
        const initialGrades: { [answerId: string]: number } = {};
        data.answers.forEach((answer: any) => {
          if (answer.needsGrading) {
            initialGrades[answer.id] = answer.earnedPoints || 0;
          }
        });
        setGrades(initialGrades);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGrade = (answerId: string, points: number, maxPoints: number) => {
    const clampedPoints = Math.max(0, Math.min(points, maxPoints));
    setGrades(prev => ({ ...prev, [answerId]: clampedPoints }));
  };

  const saveGrades = async () => {
    if (!result) return;

    setIsSaving(true);
    setSaveMessage('');

    try {
      const gradesToSave = result.answers
        .filter(answer => answer.needsGrading)
        .map(answer => ({
          answerId: answer.id,
          pointsEarned: grades[answer.id] || 0,
          maxPoints: answer.maxPoints,
        }));

      const response = await fetch(`/api/academy/assessment/attempt/${attemptId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grades: gradesToSave }),
      });

      if (response.ok) {
        const data = await response.json();
        setSaveMessage('Grades saved successfully!');
        // Reload results to get updated totals
        await loadResults();
      } else {
        setSaveMessage('Error saving grades. Please try again.');
      }
    } catch (error) {
      console.error('Error saving grades:', error);
      setSaveMessage('Error saving grades. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnswerStatus = (answer: any) => {
    if (answer.needsGrading) return 'needs-grading';
    if (answer.isCorrect === true) return 'correct';
    if (answer.isCorrect === false) return 'incorrect';
    return 'ungraded';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return 'bg-green-600';
      case 'incorrect': return 'bg-red-600';
      case 'needs-grading': return 'bg-yellow-600';
      default: return 'bg-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct': return <CheckCircle className="w-4 h-4" />;
      case 'incorrect': return <XCircle className="w-4 h-4" />;
      case 'needs-grading': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading quiz results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Results Not Found</h2>
          <p className="text-slate-400">Could not load quiz attempt results.</p>
        </div>
      </div>
    );
  }

  const { attempt, answers, summary } = result;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl">{attempt.quizTitle}</CardTitle>
              <p className="text-slate-300">{attempt.quizDescription}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {attempt.courseTitle}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {attempt.studentName}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">
                {summary.percentage}%
              </div>
              <div className="text-lg text-slate-300">
                {summary.totalScore} / {summary.maxScore} points
              </div>
              <Badge className={`mt-2 ${attempt.passed ? 'bg-green-600' : 'bg-red-600'}`}>
                {attempt.passed ? 'PASSED' : 'FAILED'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-700 rounded">
              <div className="text-xl font-bold text-green-400">{summary.correctAnswers}</div>
              <div className="text-xs text-slate-400">Correct</div>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded">
              <div className="text-xl font-bold text-red-400">{summary.incorrectAnswers}</div>
              <div className="text-xs text-slate-400">Incorrect</div>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded">
              <div className="text-xl font-bold text-yellow-400">{summary.needsGrading}</div>
              <div className="text-xs text-slate-400">Need Grading</div>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded">
              <div className="text-xl font-bold text-blue-400">{formatTime(attempt.timeSpent)}</div>
              <div className="text-xs text-slate-400">Time Spent</div>
            </div>
          </div>

          {summary.needsGrading > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <Alert className="bg-yellow-900/20 border-yellow-500 flex-1 mr-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-yellow-200">
                  {summary.needsGrading} question{summary.needsGrading !== 1 ? 's' : ''} need{summary.needsGrading === 1 ? 's' : ''} manual grading
                </AlertDescription>
              </Alert>
              <Button
                onClick={saveGrades}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Grades
                  </>
                )}
              </Button>
            </div>
          )}

          {saveMessage && (
            <Alert className={`mt-4 ${saveMessage.includes('Error') ? 'bg-red-900/20 border-red-500' : 'bg-green-900/20 border-green-500'}`}>
              <AlertDescription className={saveMessage.includes('Error') ? 'text-red-200' : 'text-green-200'}>
                {saveMessage}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {answers.map((answer, index) => {
          const status = getAnswerStatus(answer);
          return (
            <Card key={answer.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">
                    Question {index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(status)}>
                      {getStatusIcon(status)}
                      <span className="ml-1 capitalize">{status.replace('-', ' ')}</span>
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {answer.maxPoints} point{answer.maxPoints !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question */}
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: answer.question }} />
                </div>

                {/* Student Answer */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Student Answer:</h4>
                  <div className="p-4 bg-slate-700 rounded-lg">
                    {answer.type === 'multiple-choice' || answer.type === 'true-false' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-white">{answer.studentAnswer || 'No answer'}</span>
                        {answer.correctAnswer && (
                          <span className="text-slate-400">
                            (Correct: {answer.correctAnswer})
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-white whitespace-pre-wrap">
                        {answer.studentAnswer || 'No answer provided'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Correct Answer (for auto-graded) */}
                {(answer.type === 'multiple-choice' || answer.type === 'true-false') && answer.correctAnswer && (
                  <div className="space-y-2">
                    <h4 className="text-green-400 font-medium">Correct Answer:</h4>
                    <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg">
                      <span className="text-green-200">{answer.correctAnswer}</span>
                    </div>
                  </div>
                )}

                {/* Grading Input */}
                {answer.needsGrading && (
                  <div className="space-y-2">
                    <h4 className="text-yellow-400 font-medium">Assign Points:</h4>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max={answer.maxPoints}
                        value={grades[answer.id] || 0}
                        onChange={(e) => updateGrade(answer.id, parseFloat(e.target.value) || 0, answer.maxPoints)}
                        className="w-24 bg-slate-700 border-slate-600 text-white"
                      />
                      <span className="text-slate-400">/ {answer.maxPoints} points</span>
                    </div>
                  </div>
                )}

                {/* Points Earned */}
                {!answer.needsGrading && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">Points earned:</span>
                    <Badge className={answer.earnedPoints === answer.maxPoints ? 'bg-green-600' : 'bg-red-600'}>
                      {answer.earnedPoints} / {answer.maxPoints}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}