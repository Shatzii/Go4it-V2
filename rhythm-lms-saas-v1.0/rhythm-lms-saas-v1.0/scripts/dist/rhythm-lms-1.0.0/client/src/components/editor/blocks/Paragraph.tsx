import React from 'react';
import { cn } from '@/lib/utils';

interface ParagraphProps {
  content: string;
  onChange: (content: string) => void;
  settings?: {
    align?: 'left' | 'center' | 'right' | 'justify';
    size?: 'small' | 'medium' | 'large';
    color?: string;
    style?: 'normal' | 'italic' | 'code';
    weight?: 'normal' | 'medium' | 'bold';
    letterSpacing?: 'normal' | 'wide' | 'wider' | 'tight';
  };
}

export const Paragraph: React.FC<ParagraphProps> = ({
  content,
  onChange,
  settings = {}
}) => {
  const {
    align = 'left',
    size = 'medium',
    color,
    style = 'normal',
    weight = 'normal',
    letterSpacing = 'normal'
  } = settings;

  // Map text alignment to Tailwind classes
  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  // Map text size to Tailwind classes
  const sizeMap = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  // Map font weight to Tailwind classes
  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold'
  };

  // Map letter spacing to Tailwind classes
  const letterSpacingMap = {
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
    tight: 'tracking-tight'
  };

  // Map text style to classes
  const styleClass = style === 'italic' ? 'italic' : style === 'code' ? 'font-mono bg-gray-100 p-1 rounded' : '';

  // Generate custom style for color
  const customStyle = color ? { color } : {};

  const handleChange = (e: React.ChangeEvent<HTMLParagraphElement>) => {
    onChange(e.currentTarget.textContent || '');
  };

  return (
    <p
      className={cn(
        'my-2',
        alignMap[align],
        sizeMap[size],
        weightMap[weight],
        letterSpacingMap[letterSpacing],
        styleClass,
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