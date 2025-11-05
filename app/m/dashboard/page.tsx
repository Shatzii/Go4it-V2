/**
 * Mobile Athlete Dashboard
 * Path: /m/dashboard
 * 
 * ZONE: RED (athlete-specific data)
 * 
 * Mobile-optimized athlete dashboard with:
 * - Assigned drills and workouts
 * - Today's schedule
 * - Progress overview
 * - Quick actions
 * - StarPath metrics
 */

import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { athleteDrillAssignments, workoutTemplates, drills } from '@/lib/db/drill-library-schema';
import { eq, and } from 'drizzle-orm';
import MobileAthleteView from './MobileAthleteView';

// Force dynamic rendering - do not statically generate this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'My Training | Go4it Sports Academy',
  description: 'Your personalized training dashboard',
};

export default async function MobileDashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in?redirect=/m/dashboard');
  }

  // Fetch athlete's assigned drills (due today or overdue)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const assignments = await db.query.athleteDrillAssignments.findMany({
    where: and(
      eq(athleteDrillAssignments.athleteId, userId),
      eq(athleteDrillAssignments.status, 'assigned')
    ),
    with: {
      drill: true,
    },
    limit: 20,
    orderBy: (athleteDrillAssignments, { asc }) => [asc(athleteDrillAssignments.dueDate)],
  });

  // Fetch completed assignments (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const completedAssignments = await db.query.athleteDrillAssignments.findMany({
    where: and(
      eq(athleteDrillAssignments.athleteId, userId),
      eq(athleteDrillAssignments.status, 'completed')
    ),
    limit: 10,
    orderBy: (athleteDrillAssignments, { desc }) => [desc(athleteDrillAssignments.completedAt)],
  });

  // Calculate stats
  const totalAssigned = assignments.length;
  const dueTodayCount = assignments.filter(a => {
    const dueDate = a.dueDate ? new Date(a.dueDate) : null;
    return dueDate && dueDate >= today && dueDate < tomorrow;
  }).length;

  const weeklyXP = completedAssignments.reduce((sum, assignment) => {
    // Would fetch actual drill XP from drill record
    return sum + 10; // Placeholder
  }, 0);

  return (
    <MobileAthleteView
      userId={userId}
      assignments={assignments}
      completedCount={completedAssignments.length}
      totalAssigned={totalAssigned}
      dueTodayCount={dueTodayCount}
      weeklyXP={weeklyXP}
    />
  );
}
