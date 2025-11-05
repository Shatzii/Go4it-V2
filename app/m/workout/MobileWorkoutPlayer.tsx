/**
 * Mobile Workout Player Client Component
 * 
 * Mobile-optimized workout execution interface
 */

'use client';

import { WorkoutPlayer } from '@/components/drills/WorkoutPlayer';
import { useRouter } from 'next/navigation';

interface WorkoutStep {
  id: string;
  drillId: string;
  drillTitle: string;
  drillDescription: string;
  type: 'warmup' | 'main' | 'cooldown';
  order: number;
  duration?: number;
  sets?: number;
  reps?: string;
  restPeriod?: number;
  notes?: string;
  xpReward: number;
}

interface MobileWorkoutPlayerProps {
  assignmentId: string;
  athleteId: string;
  workoutTitle: string;
  workoutSteps: WorkoutStep[];
  totalDuration: number;
}

export default function MobileWorkoutPlayer({
  assignmentId,
  athleteId,
  workoutTitle,
  workoutSteps,
  totalDuration,
}: MobileWorkoutPlayerProps) {
  const router = useRouter();

  function handleComplete() {
    // Navigate back to dashboard
    router.push('/m/dashboard?completed=true');
  }

  function handleCancel() {
    router.back();
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkoutPlayer
        assignmentId={assignmentId}
        athleteId={athleteId}
        workoutTitle={workoutTitle}
        workoutSteps={workoutSteps}
        totalDuration={totalDuration}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}
