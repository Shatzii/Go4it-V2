'use client';

import { redirect } from 'next/navigation'

// Force dynamic rendering for this page to prevent static generation issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Prevent static generation during build
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// Redirect to the correct secondary school parent dashboard
export default function StagePrepParentDashboard() {
  redirect('/schools/secondary/parent-dashboard')
}