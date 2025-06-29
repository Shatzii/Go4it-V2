import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  loadingHeight?: number | string;
  priority?: boolean;
  blurStyle?: boolean;
  containerClassName?: string;
}

/**
 * OptimizedImage - A component for optimizing image loading and handling
 * 
 * @param src - Image source URL
 * @param alt - Alt text for the image
 * @param fallbackSrc - Fallback image to display if main image fails to load
 * @param loadingHeight - Height to use for the skeleton loader
 * @param priority - Whether to prioritize loading this image (disables lazy loading)
 * @param blurStyle - Whether to apply blur transition effect
 * @param containerClassName - Class name for the container div
 * @param className - Class name for the image
 * @param ...props - Any other props to pass to the img element
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '',
  loadingHeight = '100%',
  priority = false,
  blurStyle = true,
  containerClassName,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>(src);
  const imageRef = useRef<HTMLImageElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Update source if prop changes
    if (src !== imageSrc && !hasError) {
      setImageSrc(src);
      setIsLoading(true);
    }
  }, [src, imageSrc, hasError]);

  // Handle intersection observer for lazy loading
  useEffect(() => {
    // Skip if image should be loaded with priority
    if (priority) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && imageRef.current) {
          // Set the real src when image comes into view
          imageRef.current.setAttribute('src', imageSrc);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '200px', // Start loading when image is 200px from viewport
      threshold: 0.01,
    });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [imageSrc, priority]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {isLoading && (
        <Skeleton 
          className={cn('absolute inset-0 z-10', className)}
          style={{ height: loadingHeight }}
        />
      )}
      
      <img
        ref={imageRef}
        src={priority ? imageSrc : (hasError ? fallbackSrc : imageSrc)}
        alt={alt}
        className={cn(
          className,
          blurStyle && 'transition-all duration-500',
          blurStyle && isLoading ? 'scale-110 blur-2xl' : 'scale-100 blur-0'
        )}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;