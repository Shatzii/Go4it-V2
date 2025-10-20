'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  Flag,
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  image?: string;
  points: number;
  options?: string[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  instructions: string;
  timeLimit: number;
  questions: QuizQuestion[];
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
}

interface QuizAttempt {
  id: string;
  answers: { [questionId: string]: string };
  timeRemaining: number;
  currentQuestion: number;
  flaggedQuestions: string[];
}

export default function QuizPlayer({ quizId, studentId }: { quizId: string; studentId: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt>({
    id: '',
    answers: {},
    timeRemaining: 0,
    currentQuestion: 0,
    flaggedQuestions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quiz && attempt.timeRemaining > 0) {
      const timer = setInterval(() => {
        setAttempt(prev => {
          if (prev.timeRemaining <= 1) {
            // Auto-submit when time runs out
            handleSubmit(true);
            return prev;
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, attempt.timeRemaining]);

  const loadQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/academy/assessment/quiz/${quizId}/take?studentId=${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);

        // Initialize attempt
        setAttempt({
          id: data.attemptId,
          answers: {},
          timeRemaining: data.quiz.timeLimit * 60, // Convert minutes to seconds
          currentQuestion: 0,
          flaggedQuestions: [],
        });
      } else if (response.status === 403) {
        alert('You have already completed this quiz or exceeded the maximum attempts.');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnswer = (questionId: string, answer: string) => {
    setAttempt(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }));
  };

  const toggleFlag = (questionId: string) => {
    setAttempt(prev => ({
      ...prev,
      flaggedQuestions: prev.flaggedQuestions.includes(questionId)
        ? prev.flaggedQuestions.filter(id => id !== questionId)
        : [...prev.flaggedQuestions, questionId],
    }));
  };

  const navigateQuestion = (direction: 'prev' | 'next') => {
    if (!quiz) return;

    setAttempt(prev => ({
      ...prev,
      currentQuestion: direction === 'next'
        ? Math.min(prev.currentQuestion + 1, quiz.questions.length - 1)
        : Math.max(prev.currentQuestion - 1, 0),
    }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!quiz || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/academy/assessment/attempt/${attempt.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: attempt.answers,
          timeSpent: (quiz.timeLimit * 60) - attempt.timeRemaining,
          autoSubmit,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (questionId: string) => {
    if (attempt.flaggedQuestions.includes(questionId)) return 'flagged';
    if (attempt.answers[questionId]) return 'answered';
    return 'unanswered';
  };

  const getAnsweredCount = () => {
    return Object.keys(attempt.answers).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Quiz Not Available</h2>
          <p className="text-slate-400">This quiz may not exist or you may not have access to it.</p>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">{quiz.title} - Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">{results.percentage}%</div>
              <div className="text-xl text-slate-300 mb-4">
                {results.score} / {results.maxScore} points
              </div>
              <Badge className={`text-lg px-4 py-2 ${results.passed ? 'bg-green-600' : 'bg-red-600'}`}>
                {results.passed ? 'PASSED' : 'FAILED'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-700 rounded">
                <div className="text-2xl font-bold text-white">{results.correctAnswers}</div>
                <div className="text-sm text-slate-400">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-slate-700 rounded">
                <div className="text-2xl font-bold text-white">{results.incorrectAnswers}</div>
                <div className="text-sm text-slate-400">Incorrect Answers</div>
              </div>
              <div className="text-center p-4 bg-slate-700 rounded">
                <div className="text-2xl font-bold text-white">{formatTime(results.timeSpent)}</div>
                <div className="text-sm text-slate-400">Time Spent</div>
              </div>
            </div>

            {results.feedback && (
              <Alert className="bg-blue-900/20 border-blue-500">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-blue-200">
                  {results.feedback}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center">
              <Button onClick={() => window.history.back()} className="bg-blue-600 hover:bg-blue-700">
                Return to Course
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[attempt.currentQuestion];
  const progress = ((attempt.currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl">{quiz.title}</CardTitle>
              <p className="text-slate-300">{quiz.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4 text-lg font-mono">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className={`font-bold ${attempt.timeRemaining < 300 ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(attempt.timeRemaining)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-white">
                    {attempt.currentQuestion + 1} / {quiz.questions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between text-sm text-slate-400">
            <span>Question {attempt.currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{getAnsweredCount()} answered</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((question, index) => {
                  const status = getQuestionStatus(question.id);
                  return (
                    <button
                      key={question.id}
                      onClick={() => setAttempt(prev => ({ ...prev, currentQuestion: index }))}
                      className={`w-10 h-10 rounded border-2 text-sm font-medium transition-all ${
                        attempt.currentQuestion === index
                          ? 'border-blue-500 bg-blue-600 text-white'
                          : status === 'answered'
                          ? 'border-green-500 bg-green-600 text-white'
                          : status === 'flagged'
                          ? 'border-yellow-500 bg-yellow-600 text-white'
                          : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded"></div>
                  <span className="text-slate-300">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                  <span className="text-slate-300">Flagged</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-600 rounded"></div>
                  <span className="text-slate-300">Not answered</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Content */}
        <div className="lg:col-span-3">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  Question {attempt.currentQuestion + 1}
                  <Badge className="ml-2 bg-slate-600">
                    {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`${
                    attempt.flaggedQuestions.includes(currentQuestion.id)
                      ? 'text-yellow-400'
                      : 'text-slate-400'
                  }`}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Flag
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instructions */}
              {attempt.currentQuestion === 0 && quiz.instructions && (
                <Alert className="bg-blue-900/20 border-blue-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-blue-200">
                    {quiz.instructions}
                  </AlertDescription>
                </Alert>
              )}

              {/* Question Text */}
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
              </div>

              {/* Question Image */}
              {currentQuestion.image && (
                <div className="text-center">
                  <img
                    src={currentQuestion.image}
                    alt="Question illustration"
                    className="max-w-full h-auto rounded-lg mx-auto"
                  />
                </div>
              )}

              {/* Answer Input */}
              <div className="space-y-4">
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <label
                        key={index}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          attempt.answers[currentQuestion.id] === option
                            ? 'border-blue-500 bg-blue-600/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={option}
                          checked={attempt.answers[currentQuestion.id] === option}
                          onChange={(e) => updateAnswer(currentQuestion.id, e.target.value)}
                          className="mr-3 text-blue-600"
                        />
                        <span className="text-white flex-1">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'true-false' && (
                  <div className="space-y-3">
                    {['true', 'false'].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          attempt.answers[currentQuestion.id] === option
                            ? 'border-blue-500 bg-blue-600/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={option}
                          checked={attempt.answers[currentQuestion.id] === option}
                          onChange={(e) => updateAnswer(currentQuestion.id, e.target.value)}
                          className="mr-3 text-blue-600"
                        />
                        <span className="text-white capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay') && (
                  <textarea
                    value={attempt.answers[currentQuestion.id] || ''}
                    onChange={(e) => updateAnswer(currentQuestion.id, e.target.value)}
                    placeholder={currentQuestion.type === 'essay' ? 'Write your essay response here...' : 'Enter your answer...'}
                    className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    rows={currentQuestion.type === 'essay' ? 8 : 3}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  onClick={() => navigateQuestion('prev')}
                  disabled={attempt.currentQuestion === 0}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {attempt.currentQuestion === quiz.questions.length - 1 ? (
                    <Button
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Quiz
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigateQuestion('next')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}