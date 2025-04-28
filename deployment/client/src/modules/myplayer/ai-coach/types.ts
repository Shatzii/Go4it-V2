// Coach message type definition
export interface CoachMessage {
  id?: number;
  role: 'user' | 'coach';
  content: string;
  timestamp?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

// Training plan type definitions
export interface TrainingActivity {
  name: string;
  duration: string;
  description: string;
  intensity: 'Low' | 'Medium' | 'High';
  adhdConsiderations?: string;
}

export interface TrainingDay {
  day: number;
  title: string;
  focus: string;
  activities: TrainingActivity[];
  cooldown?: string;
  mentalTraining?: string;
  completed?: boolean;
  progress?: number;
}

export interface TrainingPlan {
  id?: number;
  title: string;
  sportType: string;
  focusArea: string;
  durationDays: number;
  recommendedLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  overview: string;
  days: TrainingDay[];
  createdAt?: string;
}

// Video feedback type definitions
export interface FeedbackStrength {
  area: string;
  observation: string;
  impact: string;
}

export interface FeedbackImprovement {
  area: string;
  observation: string;
  recommendation: string;
  drill: string;
}

export interface VideoFeedback {
  overallImpression: string;
  strengths: FeedbackStrength[];
  improvementAreas: FeedbackImprovement[];
  adhdConsiderations: string;
  nextStepsFocus: string;
}

// Coach state for UI
export interface CoachState {
  isTyping: boolean;
  currentView: 'chat' | 'training' | 'performance' | 'settings';
  showWelcomeMessage: boolean;
  userPreferences: {
    coachStyle: 'Supportive' | 'Challenging' | 'Technical' | 'Motivational';
    notificationEnabled: boolean;
    focusMode: boolean;
  };
}

// API response types
export interface ChatResponse {
  message: string;
  timestamp: string;
}

export interface TrainingPlanResponse {
  plan: TrainingPlan;
  planId: number;
}

export interface VideoFeedbackResponse extends VideoFeedback {
  id?: number;
}