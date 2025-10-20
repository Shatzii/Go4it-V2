'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  Trash2,
  Save,
  Eye,
  Settings,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
  MoveUp,
  MoveDown,
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  image?: string;
  points: number;
  correctAnswer: string;
  explanation?: string;
  options?: string[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  instructions: string;
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showResults: boolean;
  questions: QuizQuestion[];
}

export default function QuizBuilder({ courseId, teacherId, quizId }: { courseId?: string; teacherId?: string; quizId?: string }) {
  const [quiz, setQuiz] = useState<Quiz>({
    id: quizId || '',
    title: '',
    description: '',
    instructions: '',
    timeLimit: 30,
    passingScore: 60,
    maxAttempts: 1,
    shuffleQuestions: false,
    shuffleAnswers: false,
    showResults: true,
    questions: [],
  });

  const [activeTab, setActiveTab] = useState('settings');
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId);
    }
  }, [quizId]);

  const loadQuiz = async (id: string) => {
    try {
      const response = await fetch(`/api/academy/assessment/quiz/${id}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    }
  };

  const addQuestion = (type: QuizQuestion['type']) => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      question: '',
      points: 1,
      correctAnswer: '',
      options: type === 'multiple-choice' ? ['', '', '', ''] : undefined,
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
    }));
  };

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const index = quiz.questions.findIndex(q => q.id === questionId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === quiz.questions.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newQuestions = [...quiz.questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];

    setQuiz(prev => ({ ...prev, questions: newQuestions }));
  };

  const addOption = (questionId: string) => {
    updateQuestion(questionId, {
      options: [...(quiz.questions.find(q => q.id === questionId)?.options || []), ''],
    });
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (!question?.options) return;

    const newOptions = [...question.options];
    newOptions[optionIndex] = value;

    updateQuestion(questionId, { options: newOptions });
  };

  const deleteOption = (questionId: string, optionIndex: number) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (!question?.options || question.options.length <= 2) return;

    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    updateQuestion(questionId, { options: newOptions });
  };

  const saveQuiz = async () => {
    setIsSaving(true);
    try {
      const method = quizId ? 'PUT' : 'POST';
      const url = quizId
        ? `/api/academy/assessment/quiz/${quizId}`
        : '/api/academy/assessment/quiz';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quiz,
          courseId,
          teacherId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!quizId) {
          setQuiz(prev => ({ ...prev, id: data.quizId }));
        }
        alert('Quiz saved successfully!');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Error saving quiz. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return '📝';
      case 'true-false': return '✓✗';
      case 'short-answer': return '💬';
      case 'essay': return '📄';
      default: return '❓';
    }
  };

  const calculateTotalPoints = () => {
    return quiz.questions.reduce((sum, q) => sum + q.points, 0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Target className="w-8 h-8 text-blue-400" />
            Quiz Builder
          </h2>
          <p className="text-slate-300">Create comprehensive assessments for your students</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewing(!isPreviewing)}
            className="border-slate-600 text-slate-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewing ? 'Edit' : 'Preview'}
          </Button>
          <Button
            onClick={saveQuiz}
            disabled={isSaving || !quiz.title}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Quiz
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quiz Overview */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quiz Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Questions</Label>
                <div className="text-2xl font-bold text-white">{quiz.questions.length}</div>
              </div>

              <div>
                <Label className="text-slate-300">Total Points</Label>
                <div className="text-2xl font-bold text-white">{calculateTotalPoints()}</div>
              </div>

              <div>
                <Label className="text-slate-300">Time Limit</Label>
                <div className="text-lg text-white">{quiz.timeLimit} minutes</div>
              </div>

              <div>
                <Label className="text-slate-300">Passing Score</Label>
                <div className="text-lg text-white">{quiz.passingScore}%</div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Question Types</Label>
                {['multiple-choice', 'true-false', 'short-answer', 'essay'].map(type => {
                  const count = quiz.questions.filter(q => q.type === type).length;
                  return count > 0 ? (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 capitalize">{type.replace('-', ' ')}</span>
                      <Badge className="bg-slate-600">{count}</Badge>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Add Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => addQuestion('multiple-choice')}
                className="w-full justify-start bg-slate-700 hover:bg-slate-600"
                variant="ghost"
              >
                <span className="mr-2">📝</span>
                Multiple Choice
              </Button>
              <Button
                onClick={() => addQuestion('true-false')}
                className="w-full justify-start bg-slate-700 hover:bg-slate-600"
                variant="ghost"
              >
                <span className="mr-2">✓✗</span>
                True/False
              </Button>
              <Button
                onClick={() => addQuestion('short-answer')}
                className="w-full justify-start bg-slate-700 hover:bg-slate-600"
                variant="ghost"
              >
                <span className="mr-2">💬</span>
                Short Answer
              </Button>
              <Button
                onClick={() => addQuestion('essay')}
                className="w-full justify-start bg-slate-700 hover:bg-slate-600"
                variant="ghost"
              >
                <span className="mr-2">📄</span>
                Essay
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="settings" className="text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="questions" className="text-white">
                <FileText className="w-4 h-4 mr-2" />
                Questions ({quiz.questions.length})
              </TabsTrigger>
            </TabsList>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-slate-300">Quiz Title</Label>
                    <Input
                      id="title"
                      value={quiz.title}
                      onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Chapter 5 Review Quiz"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-slate-300">Description</Label>
                    <Textarea
                      id="description"
                      value={quiz.description}
                      onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of what this quiz covers"
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instructions" className="text-slate-300">Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={quiz.instructions}
                      onChange={(e) => setQuiz(prev => ({ ...prev, instructions: e.target.value }))}
                      placeholder="Instructions for students taking the quiz"
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quiz Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timeLimit" className="text-slate-300">Time Limit (minutes)</Label>
                      <Input
                        id="timeLimit"
                        type="number"
                        value={quiz.timeLimit}
                        onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="passingScore" className="text-slate-300">Passing Score (%)</Label>
                      <Input
                        id="passingScore"
                        type="number"
                        value={quiz.passingScore}
                        onChange={(e) => setQuiz(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxAttempts" className="text-slate-300">Max Attempts</Label>
                      <Select
                        value={quiz.maxAttempts.toString()}
                        onValueChange={(value) => setQuiz(prev => ({ ...prev, maxAttempts: parseInt(value) }))}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 attempt</SelectItem>
                          <SelectItem value="2">2 attempts</SelectItem>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                          <SelectItem value="999">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shuffleQuestions"
                        checked={quiz.shuffleQuestions}
                        onCheckedChange={(checked) => setQuiz(prev => ({ ...prev, shuffleQuestions: !!checked }))}
                      />
                      <Label htmlFor="shuffleQuestions" className="text-slate-300">Shuffle question order</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shuffleAnswers"
                        checked={quiz.shuffleAnswers}
                        onCheckedChange={(checked) => setQuiz(prev => ({ ...prev, shuffleAnswers: !!checked }))}
                      />
                      <Label htmlFor="shuffleAnswers" className="text-slate-300">Shuffle answer options</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showResults"
                        checked={quiz.showResults}
                        onCheckedChange={(checked) => setQuiz(prev => ({ ...prev, showResults: !!checked }))}
                      />
                      <Label htmlFor="showResults" className="text-slate-300">Show results immediately after completion</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Questions Tab */}
            <TabsContent value="questions" className="space-y-4">
              {quiz.questions.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Questions Yet</h3>
                    <p className="text-slate-400 mb-4">Add your first question to get started</p>
                    <Button onClick={() => addQuestion('multiple-choice')} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                quiz.questions.map((question, index) => (
                  <Card key={question.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                          <CardTitle className="text-white">Question {index + 1}</CardTitle>
                          <Badge className="bg-slate-600 capitalize">{question.type.replace('-', ' ')}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveQuestion(question.id, 'up')}
                            disabled={index === 0}
                            className="text-slate-400 hover:text-white"
                          >
                            <MoveUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveQuestion(question.id, 'down')}
                            disabled={index === quiz.questions.length - 1}
                            className="text-slate-400 hover:text-white"
                          >
                            <MoveDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteQuestion(question.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-slate-300">Question Text</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                          placeholder="Enter your question here..."
                          className="bg-slate-700 border-slate-600 text-white"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-300">Points</Label>
                          <Input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>

                      {/* Question Type Specific Fields */}
                      {question.type === 'multiple-choice' && question.options && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-300">Answer Options</Label>
                            <Button
                              onClick={() => addOption(question.id)}
                              size="sm"
                              className="bg-slate-600 hover:bg-slate-500"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Option
                            </Button>
                          </div>
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === option}
                                onChange={() => updateQuestion(question.id, { correctAnswer: option })}
                                className="text-blue-600"
                              />
                              <Input
                                value={option}
                                onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                                className="bg-slate-700 border-slate-600 text-white flex-1"
                              />
                              {question.options!.length > 2 && (
                                <Button
                                  onClick={() => deleteOption(question.id, optionIndex)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === 'true-false' && (
                        <div className="space-y-2">
                          <Label className="text-slate-300">Correct Answer</Label>
                          <Select
                            value={question.correctAnswer}
                            onValueChange={(value) => updateQuestion(question.id, { correctAnswer: value })}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select correct answer" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">True</SelectItem>
                              <SelectItem value="false">False</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {(question.type === 'short-answer' || question.type === 'essay') && (
                        <div>
                          <Label className="text-slate-300">Sample Answer (for reference)</Label>
                          <Textarea
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                            placeholder="Enter a sample correct answer..."
                            className="bg-slate-700 border-slate-600 text-white"
                            rows={2}
                          />
                        </div>
                      )}

                      <div>
                        <Label className="text-slate-300">Explanation (optional)</Label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                          placeholder="Explain why this is the correct answer..."
                          className="bg-slate-700 border-slate-600 text-white"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}