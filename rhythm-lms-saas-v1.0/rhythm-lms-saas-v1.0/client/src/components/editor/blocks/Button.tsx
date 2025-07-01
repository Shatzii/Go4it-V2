import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  content: string;
  onChange: (content: string) => void;
  settings?: {
    style?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    align?: 'left' | 'center' | 'right';
    color?: string;
    background?: string;
    url?: string;
    fullWidth?: boolean;
    rounded?: boolean;
    icon?: string;
  };
}

export const Button: React.FC<ButtonProps> = ({
  content,
  onChange,
  settings = {}
}) => {
  const {
    style = 'primary',
    size = 'medium',
    align = 'center',
    color,
    background,
    url,
    fullWidth = false,
    rounded = true,
    icon
  } = settings;

  // Map style to Tailwind classes
  const getStyleClasses = () => {
    switch (style) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary/90';
      case 'secondary':
        return 'bg-secondary text-white hover:bg-secondary/90';
      case 'outline':
        return 'bg-transparent border border-primary text-primary hover:bg-primary/10';
      case 'ghost':
        return 'bg-transparent text-primary hover:bg-primary/10';
      default:
        return 'bg-primary text-white hover:bg-primary/90';
    }
  };

  // Map size to Tailwind classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-sm py-1 px-3';
      case 'medium':
        return 'text-base py-2 px-4';
      case 'large':
        return 'text-lg py-3 px-6';
      default:
        return 'text-base py-2 px-4';
    }
  };

  // Generate alignment classes
  const getAlignClasses = () => {
    switch (align) {
      case 'left':
        return 'mr-auto';
      case 'center':
        return 'mx-auto';
      case 'right':
        return 'ml-auto';
      default:
        return 'mx-auto';
    }
  };

  // Custom styles for color and background
  const customStyles: React.CSSProperties = {};
  if (color) customStyles.color = color;
  if (background) customStyles.backgroundColor = background;

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn(
      'my-2 flex',
      align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'
    )}>
      <div 
        className={cn(
          'relative group',
          fullWidth && 'w-full'
        )}
      >
        <button
          className={cn(
            'transition-colors font-medium',
            getStyleClasses(),
            getSizeClasses(),
            rounded && 'rounded-md',
            fullWidth && 'w-full',
            'cursor-pointer select-none'
          )}
          style={customStyles}
          onClick={(e) => {
            e.preventDefault();
            if (url) {
              window.open(url, '_blank');
            }
          }}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {content}
        </button>
        
        <div className="absolute -top-8 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <input
            type="text"
            value={content}
            onChange={handleContentChange}
            className="w-full text-sm border rounded py-1 px-2 bg-white text-center"
            placeholder="Button text"
          />
        </div>
      </div>
    </div>
  );
};