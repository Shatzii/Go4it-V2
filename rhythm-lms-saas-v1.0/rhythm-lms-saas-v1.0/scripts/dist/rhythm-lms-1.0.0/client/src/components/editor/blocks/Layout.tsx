import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  content: any[];
  onChange: (content: any[]) => void;
  settings?: {
    columns?: 1 | 2 | 3 | 4;
    gap?: 'none' | 'small' | 'medium' | 'large';
    padding?: 'none' | 'small' | 'medium' | 'large';
    align?: 'left' | 'center' | 'right';
    background?: string;
    color?: string;
    border?: boolean;
    rounded?: boolean;
    shadow?: boolean;
    fullWidth?: boolean;
  };
}

export const Layout: React.FC<LayoutProps> = ({ 
  content,
  onChange,
  settings = {}
}) => {
  const {
    columns = 1,
    gap = 'medium',
    padding = 'medium',
    align = 'left',
    background,
    color,
    border = false,
    rounded = false,
    shadow = false,
    fullWidth = false
  } = settings;

  // Map gap values to Tailwind classes
  const gapMap = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-8'
  };

  // Map padding values to Tailwind classes
  const paddingMap = {
    none: 'p-0',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-8'
  };

  // Map align values to Tailwind classes
  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  // Determine column classes based on count
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  // Generate style for custom background and text colors
  const customStyle = {
    backgroundColor: background || undefined,
    color: color || undefined
  };

  return (
    <div 
      className={cn(
        'w-full',
        fullWidth ? 'max-w-none' : 'max-w-screen-xl mx-auto',
        border && 'border',
        rounded && 'rounded-lg',
        shadow && 'shadow-md',
        paddingMap[padding],
        alignMap[align]
      )}
      style={customStyle}
    >
      <div 
        className={cn(
          'grid',
          columnClasses[columns],
          gapMap[gap]
        )}
      >
        {content.map((item, index) => (
          <div key={index} className="min-w-0">
            {/* This would normally render the appropriate block component based on item.type */}
            <div className="p-2 border border-dashed rounded-md bg-gray-50 text-center text-sm text-gray-500">
              Block content would render here
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};