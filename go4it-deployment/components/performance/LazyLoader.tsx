'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { LoadingFallback } from '@/components/LoadingFallback';

// Performance optimization: Dynamic imports with loading states
export function withLazyLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackComponent?: ComponentType,
) {
  const LazyComponent = lazy(importFunc);
  const Fallback = fallbackComponent || LoadingFallback;

  return function LazyWrappedComponent(props: any) {
    return (
      <Suspense fallback={<Fallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Preload components for better UX
export function preloadComponent(importFunc: () => Promise<any>) {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      importFunc();
    }, 100);
  }
}

// Image lazy loading with optimization
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function LazyImage({ src, alt, className, width, height }: LazyImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
}
