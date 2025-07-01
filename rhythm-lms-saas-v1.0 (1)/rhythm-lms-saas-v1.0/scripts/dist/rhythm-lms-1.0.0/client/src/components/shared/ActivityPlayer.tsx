import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export interface ActivityStep {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  interactionType?: 'read' | 'watch' | 'listen' | 'interact' | 'respond' | 'move';
  duration?: number; // in seconds
  adaptations?: {
    type: string; // e.g., 'ADHD', 'Autism', 'Dyslexia'
    description: string;
  }[];
  superheroThemeElements?: string[];
}

export interface ActivityMetadata {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  standardsAddressed?: string[];
  learningObjectives?: string[];
  adaptationType?: string;
  superheroTheme?: string;
  estimatedDuration?: number; // in minutes
  pointsAvailable?: number;
  prerequisiteActivities?: string[];
}

export interface ActivityResult {
  studentId: string;
  activityId: string;
  completed: boolean;
  timeSpent: number; // in seconds
  stepsCompleted: number;
  totalSteps: number;
  pointsEarned: number;
  startedAt: string;
  completedAt?: string;
  achievements?: string[];
}

interface ActivityPlayerProps {
  steps: ActivityStep[];
  metadata: ActivityMetadata;
  studentId: string;
  onComplete: (result: ActivityResult) => void;
  onExit?: () => void;
  autoAdvance?: boolean;
  adaptations?: Record<string, boolean>;
}

const ActivityPlayer: React.FC<ActivityPlayerProps> = ({
  steps,
  metadata,
  studentId,
  onComplete,
  onExit,
  autoAdvance = false,
  adaptations = {}
}) => {
  const { toast } = useToast();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [startTime] = useState(new Date());
  const [autoAdvanceTimeout, setAutoAdvanceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const completedCount = Object.keys(completedSteps).length;
  
  // Timer effect to track time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Auto-advance effect
  useEffect(() => {
    if (autoAdvance && currentStep?.duration && !completedSteps[currentStep.id]) {
      // Clear any existing timeout
      if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
      }
      
      // Set new timeout for auto-advancing
      const timeout = setTimeout(() => {
        markCurrentStepComplete();
        if (currentStepIndex < totalSteps - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          handleComplete();
        }
      }, currentStep.duration * 1000);
      
      setAutoAdvanceTimeout(timeout);
      
      return () => clearTimeout(timeout);
    }
    
    return () => {
      if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
      }
    };
  }, [currentStepIndex, autoAdvance, currentStep]);
  
  // Format time spent
  const formatTimeSpent = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  // Mark current step as complete
  const markCurrentStepComplete = () => {
    if (!currentStep) return;
    
    setCompletedSteps(prev => ({
      ...prev,
      [currentStep.id]: true
    }));
    
    // Add points for completing this step (simplified calculation)
    const basePoints = 10;
    const newPoints = basePoints * (currentStepIndex + 1);
    setPointsEarned(prev => prev + newPoints);
    
    toast({
      title: 'Step Completed!',
      description: `You earned ${newPoints} points!`,
    });
    
    // Check for achievements
    checkForAchievements();
  };
  
  // Check if user has earned any achievements
  const checkForAchievements = () => {
    const newAchievements: string[] = [];
    
    // Example achievement: Complete half of the activity
    if (completedCount + 1 >= Math.ceil(totalSteps / 2) && !achievements.includes('halfway_hero')) {
      newAchievements.push('halfway_hero');
    }
    
    // Example achievement: Complete the activity quickly
    if (completedCount + 1 === totalSteps && timeSpent < 120 && !achievements.includes('speed_learner')) {
      newAchievements.push('speed_learner');
    }
    
    // If new achievements earned, update state and show toast
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      
      newAchievements.forEach(achievement => {
        let achievementName = '';
        let description = '';
        
        switch (achievement) {
          case 'halfway_hero':
            achievementName = 'Halfway Hero';
            description = 'Completed half of the learning activity!';
            break;
          case 'speed_learner':
            achievementName = 'Speed Learner';
            description = 'Completed the activity in record time!';
            break;
        }
        
        toast({
          title: `Achievement Unlocked: ${achievementName}`,
          description,
          variant: 'default',
        });
      });
    }
  };
  
  // Navigate to next step
  const handleNextStep = () => {
    if (!completedSteps[currentStep.id]) {
      markCurrentStepComplete();
    }
    
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  // Navigate to previous step
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  // Handle activity completion
  const handleComplete = () => {
    setIsCompleting(true);
    
    // Mark any incomplete steps as complete
    const updatedCompletedSteps = { ...completedSteps };
    steps.forEach(step => {
      if (!updatedCompletedSteps[step.id]) {
        updatedCompletedSteps[step.id] = true;
      }
    });
    setCompletedSteps(updatedCompletedSteps);
    
    // Prepare result
    const result: ActivityResult = {
      studentId,
      activityId: metadata.id,
      completed: true,
      timeSpent,
      stepsCompleted: totalSteps,
      totalSteps,
      pointsEarned,
      startedAt: startTime.toISOString(),
      completedAt: new Date().toISOString(),
      achievements
    };
    
    // Show completion screen
    setShowCompletionScreen(true);
    
    // Call onComplete callback
    onComplete(result);
    
    setIsCompleting(false);
  };
  
  // Render completion screen
  const renderCompletionScreen = () => {
    const completionPercentage = (completedCount / totalSteps) * 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="mb-8">
          <div className="inline-block p-4 rounded-full bg-green-600/20 mb-4">
            <i className="ri-check-line text-4xl text-green-500"></i>
          </div>
          <div className="text-2xl font-semibold mb-2">Activity Complete!</div>
          <div className="text-gray-400">Well done on completing this activity.</div>
        </div>
        
        <div className="mb-8">
          <div className="text-4xl font-bold mb-1">
            <span className="text-green-500">{pointsEarned}</span>
            <span className="text-xl text-gray-400 ml-1">points</span>
          </div>
          
          <div className="my-6">
            <Progress 
              value={completionPercentage} 
              className="h-3 w-48 mx-auto bg-dark-700"
              // Need to fix this property in the Progress component
              // indicatorClassName="bg-green-600"
            />
          </div>
          
          <div className="flex justify-center space-x-6 text-gray-300">
            <div>
              <div className="text-lg font-semibold">{completedCount}</div>
              <div className="text-sm text-gray-400">Steps</div>
            </div>
            <Separator orientation="vertical" />
            <div>
              <div className="text-lg font-semibold">{formatTimeSpent(timeSpent)}</div>
              <div className="text-sm text-gray-400">Time Spent</div>
            </div>
            <Separator orientation="vertical" />
            <div>
              <div className="text-lg font-semibold">{achievements.length}</div>
              <div className="text-sm text-gray-400">Achievements</div>
            </div>
          </div>
        </div>
        
        {achievements.length > 0 && (
          <div className="mb-8">
            <div className="text-lg font-semibold mb-3">Achievements Earned</div>
            <div className="flex justify-center gap-3">
              {achievements.map(achievement => {
                let achievementName = '';
                let icon = '';
                
                switch (achievement) {
                  case 'halfway_hero':
                    achievementName = 'Halfway Hero';
                    icon = 'ri-award-line';
                    break;
                  case 'speed_learner':
                    achievementName = 'Speed Learner';
                    icon = 'ri-rocket-line';
                    break;
                  default:
                    achievementName = achievement;
                    icon = 'ri-medal-line';
                }
                
                return (
                  <Badge 
                    key={achievement} 
                    className="py-2 px-3 bg-gradient-to-r from-purple-600 to-indigo-600"
                  >
                    <i className={`${icon} mr-1`}></i>
                    {achievementName}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="flex justify-center space-x-3">
          <Button variant="outline" onClick={onExit}>
            Exit
          </Button>
          <Button className="bg-indigo-600" onClick={() => setShowCompletionScreen(false)}>
            Review Activity
          </Button>
        </div>
      </motion.div>
    );
  };
  
  // Get superhero theme styling
  const getThemeStyles = () => {
    if (!metadata.superheroTheme) return {};
    
    switch (metadata.superheroTheme.toLowerCase()) {
      case 'focus force':
        return {
          headerBg: 'bg-gradient-to-r from-purple-800 to-indigo-800',
          accentColor: 'text-purple-500',
          accentBg: 'bg-purple-600',
        };
      case 'pattern pioneers':
        return {
          headerBg: 'bg-gradient-to-r from-blue-800 to-cyan-800',
          accentColor: 'text-blue-500',
          accentBg: 'bg-blue-600',
        };
      case 'sensory squad':
        return {
          headerBg: 'bg-gradient-to-r from-teal-800 to-emerald-800',
          accentColor: 'text-teal-500',
          accentBg: 'bg-teal-600',
        };
      case 'vision voyagers':
        return {
          headerBg: 'bg-gradient-to-r from-amber-800 to-orange-800',
          accentColor: 'text-amber-500',
          accentBg: 'bg-amber-600',
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-indigo-800 to-violet-800',
          accentColor: 'text-indigo-500',
          accentBg: 'bg-indigo-600',
        };
    }
  };
  
  // Get interaction type icon
  const getInteractionTypeIcon = (type?: string) => {
    switch (type) {
      case 'read': return 'ri-book-open-line';
      case 'watch': return 'ri-movie-line';
      case 'listen': return 'ri-volume-up-line';
      case 'interact': return 'ri-cursor-line';
      case 'respond': return 'ri-chat-1-line';
      case 'move': return 'ri-run-line';
      default: return 'ri-book-open-line';
    }
  };
  
  // Get interaction type badge text
  const getInteractionTypeText = (type?: string) => {
    switch (type) {
      case 'read': return 'Read';
      case 'watch': return 'Watch';
      case 'listen': return 'Listen';
      case 'interact': return 'Interact';
      case 'respond': return 'Respond';
      case 'move': return 'Move';
      default: return 'Read';
    }
  };
  
  const themeStyles = getThemeStyles();
  
  // Render media content
  const renderMedia = (mediaUrl?: string, mediaType?: string) => {
    if (!mediaUrl) return null;
    
    switch (mediaType) {
      case 'image':
        return (
          <div className="mb-6">
            <img 
              src={mediaUrl} 
              alt="Activity media" 
              className="max-h-80 max-w-full mx-auto rounded-md"
            />
          </div>
        );
      case 'video':
        return (
          <div className="mb-6">
            <video 
              src={mediaUrl} 
              controls 
              className="max-w-full mx-auto rounded-md"
              style={{ maxHeight: '300px' }}
            />
          </div>
        );
      case 'audio':
        return (
          <div className="mb-6">
            <audio 
              src={mediaUrl} 
              controls 
              className="w-full mx-auto"
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  // Render current step adaptations
  const renderAdaptations = () => {
    if (!currentStep?.adaptations || currentStep.adaptations.length === 0) return null;
    
    return (
      <div className="mt-6 p-3 rounded-md bg-dark-900">
        <div className="flex items-center font-medium mb-2">
          <i className="ri-settings-5-line mr-1.5 text-indigo-400"></i>
          <span>Adaptations</span>
        </div>
        <div className="space-y-2">
          {currentStep.adaptations.map((adaptation, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium text-indigo-300">{adaptation.type}:</span>
              <span className="text-gray-300 ml-2">{adaptation.description}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto bg-dark-800 border-dark-700">
      {!showCompletionScreen ? (
        <>
          <CardHeader className={`${themeStyles.headerBg || 'bg-dark-800'}`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">{metadata.title}</CardTitle>
              <div className="flex items-center">
                <div className="px-3 py-1 rounded-md bg-dark-800/40 text-white">
                  <i className="ri-time-line mr-1"></i>
                  {formatTimeSpent(timeSpent)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-200">
                Step {currentStepIndex + 1} of {totalSteps}
              </div>
              <Badge className="bg-dark-800/40">
                <i className={`${getInteractionTypeIcon(currentStep?.interactionType)} mr-1`}></i>
                {getInteractionTypeText(currentStep?.interactionType)}
              </Badge>
            </div>
            
            <Progress 
              value={(currentStepIndex + 1) / totalSteps * 100} 
              className="h-1 mt-2 bg-dark-700"
              // Need to fix this property in the Progress component
              // indicatorClassName="bg-white/50"
            />
          </CardHeader>
          
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep?.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-xl font-medium mb-4">
                  {currentStep?.title}
                </div>
                
                {renderMedia(currentStep?.mediaUrl, currentStep?.mediaType)}
                
                <div className="prose prose-invert max-w-none">
                  {/* In a real implementation, we would use a markdown renderer here */}
                  <p>{currentStep?.content}</p>
                </div>
                
                {adaptations[metadata.adaptationType || ''] && renderAdaptations()}
                
                {currentStep?.superheroThemeElements && currentStep.superheroThemeElements.length > 0 && (
                  <div className="mt-6 p-3 rounded-md bg-dark-900">
                    <div className="flex items-center font-medium mb-2">
                      <i className="ri-superhero-line mr-1.5 text-purple-400"></i>
                      <span>Superhero Elements</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {currentStep.superheroThemeElements.map((element, index) => (
                        <Badge 
                          key={index} 
                          className={`${themeStyles.accentBg || 'bg-indigo-600'}`}
                        >
                          {element}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2 border-t border-dark-700">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
            >
              <i className="ri-arrow-left-line mr-1"></i>
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {currentStepIndex === totalSteps - 1 ? (
                <Button 
                  className={`${themeStyles.accentBg || 'bg-indigo-600'} hover:bg-opacity-90`}
                  onClick={handleComplete}
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
                  onClick={handleNextStep}
                >
                  Next
                  <i className="ri-arrow-right-line ml-1"></i>
                </Button>
              )}
            </div>
          </CardFooter>
        </>
      ) : (
        <CardContent className="py-0">
          {renderCompletionScreen()}
        </CardContent>
      )}
    </Card>
  );
};

export default ActivityPlayer;