'use client';

import { lazy } from 'react';
import { withLazyLoading, preloadComponent } from './LazyLoader';

// Lazy load heavy components for better initial page load
export const LazyVideoAnalysis = withLazyLoading(() => import('@/app/video-analysis/page'));
export const LazyGARUpload = withLazyLoading(() => import('@/app/gar-upload/page'));
export const LazyStarPath = withLazyLoading(() => import('@/app/starpath/page'));
export const LazyDashboard = withLazyLoading(() => import('@/app/dashboard/page'));
export const LazyChallenges = withLazyLoading(() => import('@/app/challenges/page'));
export const LazyAICoach = withLazyLoading(() => import('@/app/ai-coach/page'));
export const LazyTeams = withLazyLoading(() => import('@/app/teams/page'));
export const LazyRecruiting = withLazyLoading(() => import('@/app/recruiting-hub/page'));
export const LazyAcademy = withLazyLoading(() => import('@/app/academy/page'));

// Preload critical components on page load
export function preloadCriticalComponents() {
  if (typeof window !== 'undefined') {
    // Preload based on user's likely next action
    const path = window.location.pathname;

    if (path === '/') {
      // On homepage, preload registration and GAR upload
      preloadComponent(() => import('@/app/register/page'));
      preloadComponent(() => import('@/app/gar-upload/page'));
    } else if (path === '/register') {
      // On registration, preload dashboard and onboarding
      preloadComponent(() => import('@/app/dashboard/page'));
      preloadComponent(() => import('@/app/onboarding/page'));
    } else if (path === '/dashboard') {
      // On dashboard, preload key features
      preloadComponent(() => import('@/app/gar-upload/page'));
      preloadComponent(() => import('@/app/starpath/page'));
      preloadComponent(() => import('@/app/challenges/page'));
    }
  }
}
