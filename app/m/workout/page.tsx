/**
 * Mobile Workout Execution
 * Path: /m/workout
 * 
 * ZONE: RED (athlete performance tracking)
 * 
 * Mobile-optimized workout player with:
 * - Full-screen video playback
 * - Touch-friendly controls
 * - Progress tracking
 * - Performance logging
 */

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { athleteDrillAssignments, drills, workoutTemplates } from '@/lib/db/drill-library-schema';
import { eq } from 'drizzle-orm';
import MobileWorkoutPlayer from './MobileWorkoutPlayer';

// Force dynamic rendering - do not statically generate this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Workout | Go4it Sports Academy',
  description: 'Execute your training workout',
};

interface MobileWorkoutPageProps {
  searchParams: {
    assignmentId?: string;
    workoutId?: string;
  };
}

export default async function MobileWorkoutPage({ searchParams }: MobileWorkoutPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in?redirect=/m/workout');
  }

  const { assignmentId, workoutId } = searchParams;

  // Handle single drill assignment
  if (assignmentId) {
    const assignment = await db.query.athleteDrillAssignments.findFirst({
      where: eq(athleteDrillAssignments.id, assignmentId),
      with: {
        drill: true,
      },
    });

    if (!assignment) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Assignment Not Found</h1>
            <p className="text-muted-foreground mb-4">This drill assignment doesn&apos;t exist or has been removed.</p>
            <a href="/m/dashboard" className="text-primary underline">
              Back to Dashboard
            </a>
          </div>
        </div>
      );
    }

    // Check permissions (RED zone - only owner can access)
    if (assignment.athleteId !== userId) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">You don&apos;t have permission to view this assignment.</p>
            <a href="/m/dashboard" className="text-primary underline">
              Back to Dashboard
            </a>
          </div>
        </div>
      );
    }

    // Convert single drill to workout format
    const workoutSteps = [
      {
        id: assignment.drill.id,
        drillId: assignment.drill.id,
        drillTitle: assignment.drill.title,
        drillDescription: assignment.drill.description || '',
        type: 'main' as const,
        order: 1,
        duration: assignment.customDuration || assignment.drill.duration,
        sets: assignment.customSets || assignment.drill.sets,
        reps: assignment.customReps || assignment.drill.reps,
        restPeriod: assignment.drill.restPeriod,
        notes: assignment.notes,
        xpReward: assignment.drill.xpReward || 10,
      },
    ];

    return (
      <MobileWorkoutPlayer
        assignmentId={assignment.id}
        athleteId={userId}
        workoutTitle={assignment.drill.title}
        workoutSteps={workoutSteps}
        totalDuration={workoutSteps[0].duration || 15}
      />
    );
  }

  // Handle workout template
  if (workoutId) {
    const workout = await db.query.workoutTemplates.findFirst({
      where: eq(workoutTemplates.id, workoutId),
    });

    if (!workout) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Workout Not Found</h1>
            <p className="text-muted-foreground mb-4">This workout doesn&apos;t exist or has been removed.</p>
            <a href="/m/dashboard" className="text-primary underline">
              Back to Dashboard
            </a>
          </div>
        </div>
      );
    }

    // Fetch drills in workout
    const drillSequence = workout.drillSequence as any[] || [];
    const drillIds = drillSequence.map(step => step.drillId);

    const workoutDrills = await db.query.drills.findMany({
      where: (drills, { inArray }) => inArray(drills.id, drillIds),
    });

    // Build workout steps
    const workoutSteps = drillSequence.map(step => {
      const drill = workoutDrills.find(d => d.id === step.drillId);
      if (!drill) return null;

      return {
        id: drill.id,
        drillId: drill.id,
        drillTitle: drill.title,
        drillDescription: drill.description || '',
        type: step.type || 'main' as const,
        order: step.order,
        duration: step.duration || drill.duration,
        sets: step.sets || drill.sets,
        reps: step.reps || drill.reps,
        restPeriod: step.restPeriod || drill.restPeriod,
        notes: step.notes,
        xpReward: drill.xpReward || 10,
      };
    }).filter(Boolean) as any[];

    return (
      <MobileWorkoutPlayer
        assignmentId={workoutId} // Using workoutId as assignmentId for now
        athleteId={userId}
        workoutTitle={workout.title}
        workoutSteps={workoutSteps}
        totalDuration={workout.totalDuration || 30}
      />
    );
  }

  // No assignment or workout specified
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">No Workout Selected</h1>
        <p className="text-muted-foreground mb-4">Please select a drill or workout from your dashboard.</p>
        <a href="/m/dashboard" className="text-primary underline">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
