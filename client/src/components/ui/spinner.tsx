import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClass = {
    'sm': 'h-4 w-4',
    'md': 'h-8 w-8',
    'lg': 'h-12 w-12',
  }[size];

  return (
    <div className={cn("animate-spin rounded-full border-t-2 border-b-2 border-blue-500", sizeClass, className)} />
  );
};