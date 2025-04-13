/**
 * ContentBlock Component
 * 
 * A flexible content block component that can render different styles
 * of content based on metadata and props.
 */

import React from 'react';
import { CmsComponentProps } from '../types';
import { formatContent } from '../hooks/useContent';
import { cn } from '@/lib/utils';

const ContentBlock: React.FC<CmsComponentProps> = ({ content, className }) => {
  if (!content) return null;
  
  const { title, content: contentText, metadata } = content;
  
  // Extract metadata for styling
  const layout = metadata?.layout || 'default';
  const backgroundColor = metadata?.backgroundColor || 'bg-white';
  const position = metadata?.position || 'left';
  const additionalClasses = metadata?.additionalClasses || '';
  const animation = metadata?.animation || '';
  
  // Apply animation classes if specified
  const animationClass = animation ? `animate-${animation}` : '';
  
  // Base styles based on layout type
  const getBaseStyles = (): string => {
    switch (layout) {
      case 'hero':
        return 'p-8 rounded-lg shadow-lg text-center';
      case 'card':
        return 'p-6 rounded-lg shadow-md flex flex-col';
      case 'grid':
        return 'p-4 rounded-md';
      case 'list':
        return 'p-4 border-b';
      default:
        return 'p-4 rounded-md';
    }
  };
  
  // Position styles
  const getPositionStyles = (): string => {
    switch (position) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      case 'center':
        return 'text-center';
      case 'full':
        return 'w-full';
      default:
        return 'text-left';
    }
  };
  
  return (
    <div 
      className={cn(
        getBaseStyles(),
        getPositionStyles(),
        backgroundColor,
        animationClass,
        additionalClasses,
        className
      )}
    >
      {title && (
        <h3 className="text-xl font-bold mb-2">{title}</h3>
      )}
      
      {contentText && (
        <div 
          className="content-text"
          dangerouslySetInnerHTML={{ __html: formatContent(contentText) }}
        />
      )}
      
      {/* If there are any custom HTML or component features in metadata, they could be rendered here */}
    </div>
  );
};

export default ContentBlock;