/**
 * WorkoutPlayer Component - Execute Multi-Drill Workouts
 * 
 * ZONE: RED (tracks athlete performance)
 * 
 * Features:
 * - Step-by-step workout execution
 * - Video playback for each drill
 * - Timer and rest period management
 * - Set/rep tracking
 * - Performance notes
 * - Completion tracking with XP rewards
 * - Self-assessment and reflection
 * 
 * Used in:
 * - /dashboard - Execute assigned workouts
 * - /m/workout - Mobile workout execution
 * - /starpath/training - Training session player
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Check, X, Clock, Award, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface WorkoutStep {
  id: string;
  drillId: string;
  drillTitle: string;
  drillDescription: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  type: 'warmup' | 'main' | 'cooldown';
  order: number;
  duration?: number; // minutes
  sets?: number;
  reps?: string;
  restPeriod?: number; // seconds
  notes?: string;
  xpReward: number;
}

interface WorkoutPlayerProps {
  assignmentId: string;
  athleteId: string;
  workoutTitle: string;
  workoutSteps: WorkoutStep[];
  totalDuration: number; // minutes
  onComplete?: (results: WorkoutResults) => void;
  onCancel?: () => void;
}

interface WorkoutResults {
  assignmentId: string;
  completedSteps: string[];
  skippedSteps: string[];
  totalTimeSpent: number; // seconds
  performanceNotes: Record<string, string>;
  selfRatings: Record<string, number>;
  selfReflection: string;
  xpEarned: number;
}

export function WorkoutPlayer({
  assignmentId,
  athleteId,
  workoutTitle,
  workoutSteps,
  totalDuration,
  onComplete,
  onCancel,
}: WorkoutPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // total elapsed seconds
  const [stepStartTime, setStepStartTime] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  
  // Performance tracking
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [skippedSteps, setSkippedSteps] = useState<string[]>([]);
  const [performanceNotes, setPerformanceNotes] = useState<Record<string, string>>({});
  const [selfRatings, setSelfRatings] = useState<Record<string, number>>({});
  
  // Completion modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selfReflection, setSelfReflection] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = workoutSteps[currentStepIndex];
  const progressPercent = ((currentStepIndex + 1) / workoutSteps.length) * 100;
  const totalXP = workoutSteps.reduce((sum, step) => sum + step.xpReward, 0);
  const earnedXP = completedSteps.reduce((sum, stepId) => {
    const step = workoutSteps.find(s => s.id === stepId);
    return sum + (step?.xpReward || 0);
  }, 0);

  // Main timer effect
  useEffect(() => {
    if (isPlaying && !isPaused && !isResting) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused, isResting]);

  // Rest timer effect
  useEffect(() => {
    if (isResting && restTimeRemaining > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimeRemaining(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    }

    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isResting, restTimeRemaining]);

  // Start workout
  function startWorkout() {
    setIsPlaying(true);
    setStepStartTime(Date.now());
  }

  // Pause/resume
  function togglePause() {
    setIsPaused(!isPaused);
  }

  // Complete current step
  function completeCurrentStep() {
    setCompletedSteps([...completedSteps, currentStep.id]);
    
    // Start rest period if specified and not last step
    if (currentStep.restPeriod && currentStepIndex < workoutSteps.length - 1) {
      setIsResting(true);
      setRestTimeRemaining(currentStep.restPeriod);
    } else {
      moveToNextStep();
    }
  }

  // Skip current step
  function skipCurrentStep() {
    setSkippedSteps([...skippedSteps, currentStep.id]);
    moveToNextStep();
  }

  // Move to next step
  function moveToNextStep() {
    if (currentStepIndex < workoutSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setStepStartTime(Date.now());
    } else {
      // Workout complete
      setShowCompletionModal(true);
    }
  }

  // Save performance note for current step
  function savePerformanceNote(note: string) {
    setPerformanceNotes({
      ...performanceNotes,
      [currentStep.id]: note,
    });
  }

  // Save self-rating for current step
  function saveSelfRating(rating: number) {
    setSelfRatings({
      ...selfRatings,
      [currentStep.id]: rating,
    });
  }

  // Submit workout completion
  async function submitWorkoutCompletion() {
    const results: WorkoutResults = {
      assignmentId,
      completedSteps,
      skippedSteps,
      totalTimeSpent: elapsedTime,
      performanceNotes,
      selfRatings,
      selfReflection,
      xpEarned: earnedXP,
    };

    try {
      // Submit to API
      const response = await fetch('/api/drills/complete-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId,
          ...results,
        }),
      });

      if (response.ok) {
        onComplete?.(results);
      } else {
        console.error('Failed to submit workout');
      }
    } catch (error) {
      console.error('Error submitting workout:', error);
    }
  }

  // Format time display
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{workoutTitle}</CardTitle>
              <p className="text-muted-foreground mt-2">
                {workoutSteps.length} drills • ~{totalDuration} minutes
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Step {currentStepIndex + 1} of {workoutSteps.length}</span>
              <span>{Math.round(progressPercent)}% Complete</span>
            </div>
            <Progress value={progressPercent} />
          </div>

          {/* Stats */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span>{earnedXP} / {totalXP} XP</span>
            </div>
            <div>
              <Badge variant="secondary">{completedSteps.length} completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rest Period Overlay */}
      {isResting && (
        <Card className="bg-blue-500/10 border-blue-500">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Rest Period</h3>
            <p className="text-4xl font-mono mb-4">{formatTime(restTimeRemaining)}</p>
            <Button onClick={() => setIsResting(false)} variant="outline">
              Skip Rest
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Step */}
      {!isResting && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge className="mb-2">
                  {currentStep.type.toUpperCase()}
                </Badge>
                <CardTitle className="text-xl">{currentStep.drillTitle}</CardTitle>
                <p className="text-muted-foreground mt-2">{currentStep.drillDescription}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Video Player */}
            {currentStep.videoUrl && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video controls className="w-full h-full" src={currentStep.videoUrl}>
                  Your browser does not support video playback.
                </video>
              </div>
            )}

            {/* Exercise Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentStep.duration && (
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{currentStep.duration} min</p>
                </div>
              )}
              {currentStep.sets && (
                <div>
                  <p className="text-sm text-muted-foreground">Sets</p>
                  <p className="font-semibold">{currentStep.sets}</p>
                </div>
              )}
              {currentStep.reps && (
                <div>
                  <p className="text-sm text-muted-foreground">Reps</p>
                  <p className="font-semibold">{currentStep.reps}</p>
                </div>
              )}
              {currentStep.restPeriod && (
                <div>
                  <p className="text-sm text-muted-foreground">Rest</p>
                  <p className="font-semibold">{currentStep.restPeriod}s</p>
                </div>
              )}
            </div>

            {/* Coach Notes */}
            {currentStep.notes && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Coach Notes:</p>
                <p className="text-sm">{currentStep.notes}</p>
              </div>
            )}

            {/* Self-Rating */}
            {!isPlaying && (
              <div className="space-y-2">
                <label className="text-sm font-medium">How did this feel? (1-5)</label>
                <Slider
                  value={[selfRatings[currentStep.id] || 3]}
                  onValueChange={([value]) => saveSelfRating(value)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Too Easy</span>
                  <span>Perfect</span>
                  <span>Too Hard</span>
                </div>
              </div>
            )}

            {/* Performance Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Performance Notes (optional)
              </label>
              <Textarea
                placeholder="How did it go? Any observations..."
                value={performanceNotes[currentStep.id] || ''}
                onChange={(e) => savePerformanceNote(e.target.value)}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isPlaying ? (
                <>
                  <Button onClick={startWorkout} className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Start Drill
                  </Button>
                  <Button variant="outline" onClick={skipCurrentStep}>
                    Skip
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={togglePause} variant="outline">
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button onClick={completeCurrentStep} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Complete & Continue
                  </Button>
                  <Button variant="outline" onClick={skipCurrentStep}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Modal */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎉 Workout Complete!</DialogTitle>
            <DialogDescription>
              Great job! You've completed {completedSteps.length} of {workoutSteps.length} drills.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold">{formatTime(elapsedTime)}</div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-yellow-500">+{earnedXP}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold">{completedSteps.length}</div>
                  <div className="text-sm text-muted-foreground">Drills Done</div>
                </CardContent>
              </Card>
            </div>

            {/* Self-Reflection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Workout Reflection (optional)</label>
              <Textarea
                placeholder="How did the workout go overall? What did you learn?"
                value={selfReflection}
                onChange={(e) => setSelfReflection(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={submitWorkoutCompletion} className="w-full">
              <Award className="h-4 w-4 mr-2" />
              Submit & Claim {earnedXP} XP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
