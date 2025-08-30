// Performance utilities for optimized loading and caching

'use client';

import { memo, lazy, ComponentType } from 'react';

// Lazy loading wrapper with error boundary
export const createLazyComponent = (
  importFn: () => Promise<{ default: ComponentType<any> }>,
  fallback?: ComponentType
) => {
  const LazyComponent = lazy(importFn);

  const WrappedComponent = memo((props: any) => (
    <LazyComponent {...props} />
  ));
  WrappedComponent.displayName = 'LazyComponent';
  return WrappedComponent;
};

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export const getCachedData = (key: string) => {
  const cached = apiCache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > cached.ttl) {
    apiCache.delete(key);
    return null;
  }

  return cached.data;
};

export const setCachedData = (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout as any);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  if (typeof window === 'undefined') return null;

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
};