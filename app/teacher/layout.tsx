import React from 'react';
import { redirect } from 'next/navigation';
import { requireRole } from '../../lib/auth';

// Server-side layout that enforces Clerk RBAC for teacher routes
export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  try {
    // Will throw if not authenticated or not a teacher/admin
    await requireRole('teacher');
  } catch (err) {
    // Redirect unauthenticated/unauthorized users to sign-in (Clerk)
    redirect(`/sign-in?redirect=/teacher`);
  }

  return <>{children}</>;
}
