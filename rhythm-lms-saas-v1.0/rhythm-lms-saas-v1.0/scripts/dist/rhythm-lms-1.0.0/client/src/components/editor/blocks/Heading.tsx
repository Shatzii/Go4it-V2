import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps {
  content: string;
  onChange: (content: string) => void;
  settings?: {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    align?: 'left' | 'center' | 'right';
    color?: string;
    size?: 'small' | 'medium' | 'large';
    weight?: 'normal' | 'medium' | 'bold';
    transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  };
}

export const Heading: React.FC<HeadingProps> = ({
  content,
  onChange,
  settings = {}
}) => {
  const {
    level = 2,
    align = 'left',
    color,
    size,
    weight = 'bold',
    transform = 'none'
  } = settings;

  // Map text alignment to Tailwind classes
  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  // Map font weight to Tailwind classes
  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold'
  };

  // Map text transform to Tailwind classes
  const transformMap = {
    none: 'normal-case',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize'
  };

  // Determine size classes based on heading level and size prop
  const getSizeClass = () => {
    // Default sizes based on heading level
    const defaultSizes: Record<number, string> = {
      1: 'text-4xl md:text-5xl',
      2: 'text-3xl md:text-4xl',
      3: 'text-2xl md:text-3xl',
      4: 'text-xl md:text-2xl',
      5: 'text-lg md:text-xl',
      6: 'text-base md:text-lg'
    };

    // Override with size prop if provided
    if (size) {
      const sizeOverrides: Record<string, string> = {
        small: 'text-sm md:text-base',
        medium: 'text-lg md:text-xl',
        large: 'text-2xl md:text-3xl'
      };
      return sizeOverrides[size];
    }

    return defaultSizes[level];
  };

  // Generate style object for custom color
  const customStyle = color ? { color } : {};

  // Dynamic component based on level
  const Component = `h${level}` as keyof JSX.IntrinsicElements;

  const handleChange = (e: React.ChangeEvent<HTMLHeadingElement>) => {
    onChange(e.currentTarget.textContent || '');
  };

  return (
    <Component
      className={cn(
        getSizeClass(),
        weightMap[weight],
        alignMap[align],
        transformMap[transform],
        'outline-none'
      )}
      style={customStyle}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={handleChange}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};