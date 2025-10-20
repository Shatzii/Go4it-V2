'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedProgressBarProps {
  percentage: number;
  height?: string;
  className?: string;
  showLabel?: boolean;
  labelText?: string;
  delay?: number;
}

export default function AnimatedProgressBar({
  percentage,
  height = 'h-2',
  className = '',
  showLabel = false,
  labelText = '',
  delay = 0,
}: AnimatedProgressBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 },
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, delay]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 1500, 1);

      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const width = easeOutCubic * percentage;

      setCurrentWidth(width);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, percentage]);

  return (
    <div ref={progressRef} className={className}>
      {showLabel && labelText && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">{labelText}</span>
          <span className="neon-text font-bold">{percentage.toFixed(1)}/10</span>
        </div>
      )}
      <div className={`w-full bg-slate-700 rounded-full ${height}`}>
        <div
          className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${currentWidth}%`,
            height: '100%',
          }}
        />
      </div>
    </div>
  );
}
