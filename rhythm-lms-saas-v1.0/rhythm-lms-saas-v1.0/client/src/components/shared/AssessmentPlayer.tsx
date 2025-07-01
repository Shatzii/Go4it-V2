import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Question types
export type AssessmentQuestionType = 
  | 'multiple_choice' 
  | 'multiple_select' 
  | 'true_false' 
  | 'short_answer' 
  | 'long_answer'
  | 'matching'
  | 'sequencing';

export interface AssessmentQuestion {
  id: string;
  type: AssessmentQuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  hint?: string;
  explanation?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  adaptationType?: string; // Specific adaptation for neurodivergent students
}

export interface AssessmentMetadata {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number; // in minutes
  passingScore?: number; // percentage
  totalPoints?: number;
  adaptationType?: string; // e.g., 'ADHD', 'Autism', 'Dyslexia', etc.
  superheroTheme?: string;
  showCorrectAnswers?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
}

export interface AssessmentResult {
  studentId: string;
  assessmentId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  answers: Record<string, any>; // Question ID -> answer
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

interface AssessmentPlayerProps {
  questions: AssessmentQuestion[];
  metadata: AssessmentMetadata;
  studentId: string;
  onComplete: (result: AssessmentResult) => void;
  onExit?: () => void;
}

const AssessmentPlayer: React.FC<AssessmentPlayerProps> = ({
  questions,
  metadata,
  studentId,
  onComplete,
  onExit
}) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    metadata.timeLimit ? metadata.timeLimit * 60 : null
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(new Date());
  const [score, setScore] = useState<number | null>(null);
  
  // Process questions according to metadata settings
  const processedQuestions = React.useMemo(() => {
    let qs = [...questions];
    
    // Shuffle questions if needed
    if (metadata.shuffleQuestions) {
      qs = shuffleArray(qs);
    }
    
    // Shuffle options for multiple choice/select questions if needed
    if (metadata.shuffleOptions) {
      qs = qs.map(q => {
        if ((q.type === 'multiple_choice' || q.type === 'multiple_select') && q.options) {
          return {
            ...q,
            options: shuffleArray([...q.options])
          };
        }
        return q;
      });
    }
    
    return qs;
  }, [questions, metadata.shuffleQuestions, metadata.shuffleOptions]);
  
  const currentQuestion = processedQuestions[currentQuestionIndex];
  const totalQuestions = processedQuestions.length;
  
  // Timer effect
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (timeRemaining !== null && !showResults) {
      timerId = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(timerId);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timeRemaining, showResults]);
  
  // Handle time up
  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: "Your assessment will be submitted with your current answers.",
      variant: "destructive"
    });
    
    handleComplete();
  };
  
  // Format time remaining
  const formatTimeRemaining = () => {
    if (timeRemaining === null) return '--:--';
    
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle answer change
  const handleAnswerChange = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };
  
  // Handle multiple select answer change
  const handleMultipleSelectChange = (option: string, checked: boolean) => {
    setAnswers(prev => {
      const currentAnswers = prev[currentQuestion.id] || [];
      
      if (checked) {
        return {
          ...prev,
          [currentQuestion.id]: [...currentAnswers, option]
        };
      } else {
        return {
          ...prev,
          [currentQuestion.id]: currentAnswers.filter((a: string) => a !== option)
        };
      }
    });
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Calculate assessment results
  const calculateResults = (): AssessmentResult => {
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    
    processedQuestions.forEach(question => {
      totalPoints += question.points;
      
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer;
      
      if (userAnswer !== undefined) {
        let isCorrect = false;
        
        // Check if answer is correct based on question type
        if (question.type === 'multiple_select' && Array.isArray(correctAnswer)) {
          // For multiple select, all correct options must be selected
          const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
          isCorrect = 
            userAnswerArray.length === correctAnswer.length && 
            userAnswerArray.every(a => correctAnswer.includes(a));
        } else if (question.type === 'multiple_choice' || question.type === 'true_false') {
          // For single selection questions
          isCorrect = userAnswer === correctAnswer;
        } else if (question.type === 'short_answer' || question.type === 'long_answer') {
          // For text answers, we'll consider them correct as they need manual grading
          // In a real implementation, these would be marked for review
          isCorrect = true;
        }
        
        if (isCorrect) {
          correctCount++;
          earnedPoints += question.points;
        }
      }
    });
    
    const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const endTime = new Date();
    const timeTaken = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    
    return {
      studentId,
      assessmentId: metadata.id,
      score: scorePercentage,
      correctAnswers: correctCount,
      totalQuestions: totalQuestions,
      timeTaken,
      answers,
      completed: true,
      startedAt: startTime.toISOString(),
      completedAt: endTime.toISOString()
    };
  };
  
  // Handle assessment completion
  const handleComplete = () => {
    setIsCompleting(true);
    
    // Calculate results
    const result = calculateResults();
    setScore(result.score);
    
    // Show results screen
    setShowResults(true);
    
    // Call onComplete callback
    onComplete(result);
    
    setIsCompleting(false);
  };
  
  // Confirmation dialog for completing assessment
  const confirmComplete = () => {
    // Check for unanswered questions
    const answeredCount = Object.keys(answers).length;
    
    if (answeredCount < totalQuestions) {
      const unansweredCount = totalQuestions - answeredCount;
      
      toast({
        title: `${unansweredCount} unanswered ${unansweredCount === 1 ? 'question' : 'questions'}`,
        description: "Are you sure you want to submit with unanswered questions?",
        action: (
          <Button variant="default" className="bg-indigo-600" onClick={handleComplete}>
            Submit Anyway
          </Button>
        ),
      });
    } else {
      handleComplete();
    }
  };
  
  // Render question based on type
  const renderQuestion = () => {
    const question = currentQuestion;
    if (!question) return null;
    
    const currentAnswer = answers[question.id];
    
    switch (question.type) {
      case 'multiple_choice':
        return (
          <RadioGroup 
            value={currentAnswer} 
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case 'multiple_select':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => {
              const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option);
              
              return (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`option-${index}`} 
                    checked={isSelected}
                    onCheckedChange={(checked) => handleMultipleSelectChange(option, checked === true)}
                  />
                  <Label htmlFor={`option-${index}`} className="text-base">{option}</Label>
                </div>
              );
            })}
          </div>
        );
        
      case 'true_false':
        return (
          <RadioGroup 
            value={currentAnswer} 
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="option-true" />
              <Label htmlFor="option-true" className="text-base">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="option-false" />
              <Label htmlFor="option-false" className="text-base">False</Label>
            </div>
          </RadioGroup>
        );
        
      case 'short_answer':
        return (
          <Textarea
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="h-20"
          />
        );
        
      case 'long_answer':
        return (
          <Textarea
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="h-40"
          />
        );
        
      default:
        return (
          <div className="text-yellow-500">
            Question type '{question.type}' is not supported yet.
          </div>
        );
    }
  };
  
  // Render results screen
  const renderResults = () => {
    if (score === null) return null;
    
    const isPassing = metadata.passingScore ? score >= metadata.passingScore : score >= 70;
    const getScoreColor = () => {
      if (score >= 90) return 'text-green-500';
      if (score >= 70) return 'text-blue-500';
      if (score >= 60) return 'text-yellow-500';
      return 'text-red-500';
    };
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mb-8">
          <div className="text-2xl font-semibold mb-2">Assessment Complete!</div>
          <div className="text-gray-400">Thank you for completing this assessment.</div>
        </div>
        
        <div className="mb-8">
          <div className="text-4xl font-bold mb-1">
            <span className={getScoreColor()}>{score}%</span>
          </div>
          <div className={`font-medium ${isPassing ? 'text-green-500' : 'text-red-500'}`}>
            {isPassing ? 'Passed' : 'Not Passed'}
          </div>
          
          <div className="my-6">
            <Progress 
              value={score} 
              className="h-3 w-48 mx-auto bg-dark-700"
              indicatorClassName={isPassing ? 'bg-green-600' : 'bg-red-600'}
            />
          </div>
          
          <div className="flex justify-center space-x-6 text-gray-300">
            <div>
              <div className="text-lg font-semibold">{Object.keys(answers).length}</div>
              <div className="text-sm text-gray-400">Answered</div>
            </div>
            <Separator orientation="vertical" />
            <div>
              <div className="text-lg font-semibold">{totalQuestions}</div>
              <div className="text-sm text-gray-400">Questions</div>
            </div>
            <Separator orientation="vertical" />
            <div>
              <div className="text-lg font-semibold">
                {formatTimeTaken((new Date(startTime)).getTime())}
              </div>
              <div className="text-sm text-gray-400">Time Taken</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-3">
          <Button variant="outline" onClick={onExit}>
            Exit
          </Button>
          {metadata.showCorrectAnswers && (
            <Button className="bg-indigo-600" onClick={() => setShowResults(false)}>
              Review Answers
            </Button>
          )}
        </div>
      </motion.div>
    );
  };
  
  // Format time taken
  const formatTimeTaken = (startTimeMs: number) => {
    const timeTakenMs = new Date().getTime() - startTimeMs;
    const minutes = Math.floor(timeTakenMs / (1000 * 60));
    const seconds = Math.floor((timeTakenMs % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };
  
  // Helper function to shuffle array
  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  // Get superhero theme styling
  const getThemeStyles = () => {
    if (!metadata.superheroTheme) return {};
    
    switch (metadata.superheroTheme.toLowerCase()) {
      case 'focus force':
        return {
          headerBg: 'bg-gradient-to-r from-purple-800 to-indigo-800',
          accentColor: 'text-purple-500',
          accentBg: 'bg-purple-800',
        };
      case 'pattern pioneers':
        return {
          headerBg: 'bg-gradient-to-r from-blue-800 to-cyan-800',
          accentColor: 'text-blue-500',
          accentBg: 'bg-blue-800',
        };
      case 'sensory squad':
        return {
          headerBg: 'bg-gradient-to-r from-teal-800 to-emerald-800',
          accentColor: 'text-teal-500',
          accentBg: 'bg-teal-800',
        };
      case 'vision voyagers':
        return {
          headerBg: 'bg-gradient-to-r from-amber-800 to-orange-800',
          accentColor: 'text-amber-500',
          accentBg: 'bg-amber-800',
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-indigo-800 to-violet-800',
          accentColor: 'text-indigo-500',
          accentBg: 'bg-indigo-800',
        };
    }
  };
  
  const themeStyles = getThemeStyles();
  
  return (
    <Card className="w-full max-w-3xl mx-auto bg-dark-800 border-dark-700">
      {!showResults ? (
        <>
          <CardHeader className={`${themeStyles.headerBg || 'bg-dark-800'}`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">{metadata.title}</CardTitle>
              {timeRemaining !== null && (
                <div className={`px-3 py-1 rounded-md bg-dark-800/40 ${
                  timeRemaining < 60 ? 'text-red-400' : 'text-white'
                }`}>
                  <i className="ri-time-line mr-1"></i>
                  {formatTimeRemaining()}
                </div>
              )}
            </div>
            {metadata.description && (
              <p className="text-gray-200 mt-1">{metadata.description}</p>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-200">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
              <div className="text-sm text-gray-200">
                {question.points} {question.points === 1 ? 'point' : 'points'}
              </div>
            </div>
            
            <Progress 
              value={(currentQuestionIndex + 1) / totalQuestions * 100} 
              className="h-1 mt-2 bg-dark-700"
              indicatorClassName="bg-white/50"
            />
          </CardHeader>
          
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentQuestion.mediaUrl && (
                  <div className="mb-4">
                    {currentQuestion.mediaType === 'image' && (
                      <img 
                        src={currentQuestion.mediaUrl} 
                        alt="Question media" 
                        className="max-h-48 max-w-full mx-auto rounded-md"
                      />
                    )}
                    {currentQuestion.mediaType === 'video' && (
                      <video 
                        src={currentQuestion.mediaUrl} 
                        controls 
                        className="max-h-48 max-w-full mx-auto rounded-md"
                      />
                    )}
                    {currentQuestion.mediaType === 'audio' && (
                      <audio 
                        src={currentQuestion.mediaUrl} 
                        controls 
                        className="w-full mx-auto"
                      />
                    )}
                  </div>
                )}
                
                <div className="text-xl font-medium mb-6">
                  {currentQuestion.text}
                </div>
                
                {renderQuestion()}
                
                {currentQuestion.hint && (
                  <div className="mt-6 p-3 rounded-md bg-dark-900">
                    <div className="flex items-center text-yellow-500 font-medium mb-1">
                      <i className="ri-lightbulb-line mr-1"></i> Hint
                    </div>
                    <div className="text-sm text-gray-300">
                      {currentQuestion.hint}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2 border-t border-dark-700">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <i className="ri-arrow-left-line mr-1"></i>
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button 
                  className={`${themeStyles.accentBg || 'bg-indigo-600'} hover:bg-opacity-90`}
                  onClick={confirmComplete}
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <>
                      <i className="ri-loader-2-line animate-spin mr-1"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="ri-check-line mr-1"></i>
                      Complete
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  className={`${themeStyles.accentBg || 'bg-indigo-600'} hover:bg-opacity-90`}
                  onClick={handleNextQuestion}
                >
                  Next
                  <i className="ri-arrow-right-line ml-1"></i>
                </Button>
              )}
            </div>
          </CardFooter>
        </>
      ) : (
        <CardContent className="py-8">
          {renderResults()}
        </CardContent>
      )}
    </Card>
  );
};

export default AssessmentPlayer;