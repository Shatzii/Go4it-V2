'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onError?: () => void;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Generate blur placeholder
  const generateBlurDataURL = (width: number = 10, height: number = 10) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.fillRect(0, 0, width, height);
    }
    return canvas.toDataURL();
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    if (onError) onError();
  };

  if (hasError) {
    return (
      <div className={`bg-slate-800 flex items-center justify-center ${className}`}>
        <span className="text-slate-400 text-sm">Image not found</span>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {isInView && (
        <>
          {/* Loading placeholder */}
          {!isLoaded && (
            <div className={`absolute inset-0 bg-slate-800 animate-pulse`} />
          )}
          
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL || (typeof window !== 'undefined' ? generateBlurDataURL() : undefined)}
          />
        </>
      )}
    </div>
  );
}

// Optimized avatar component
export function OptimizedAvatar({ 
  src, 
  alt, 
  size = 40, 
  className = '' 
}: { 
  src?: string; 
  alt: string; 
  size?: number; 
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  
  if (!src || hasError) {
    // Generate initials from alt text
    const initials = alt
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return (
      <div 
        className={`
          flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 
          text-white font-semibold ${className}
        `}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initials}
      </div>
    );
  }
  
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      onError={() => setHasError(true)}
    />
  );
}

// Responsive image component
export function ResponsiveImage({ 
  src, 
  alt, 
  className,
  aspectRatio = '16/9'
}: { 
  src: string; 
  alt: string; 
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio }}>
      <OptimizedImage
        src={src}
        alt={alt}
        className="absolute inset-0 object-cover"
        width={1920}
        height={1080}
      />
    </div>
  );
}