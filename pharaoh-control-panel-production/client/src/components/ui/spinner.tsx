import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {}

export function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ size }), className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading</span>
    </div>
  );
}