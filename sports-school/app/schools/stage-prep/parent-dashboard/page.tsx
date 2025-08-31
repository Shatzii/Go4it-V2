'use client';

import { redirect } from 'next/navigation';

// Force dynamic rendering for this page to prevent static generation issues
// Prevent static generation during build
// Redirect to the correct secondary school parent dashboard
export default function StagePrepParentDashboard() {
  redirect('/schools/secondary/parent-dashboard');
}
