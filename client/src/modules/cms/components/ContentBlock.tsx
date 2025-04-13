import React from 'react';
import { useContent } from '../hooks/useContent';
import { ContentBlock as ContentBlockType } from '../types';
import { formatContent } from '../utils/contentFormatter';

interface ContentBlockProps {
  identifier?: string;
  block?: ContentBlockType;
  className?: string;
}

/**
 * ContentBlock Component
 * 
 * Renders a single content block from the CMS.
 * Can fetch content by identifier or use a provided content block directly.
 */
export function ContentBlock({ identifier, block, className = '' }: ContentBlockProps) {
  // Check if we need to fetch content by identifier or use provided block
  const shouldFetch = !block && !!identifier;
  
  // Fetch content when needed
  const { data, isLoading, error } = useContent(identifier || '', {
    enabled: shouldFetch,
  });
  
  // Use provided block or fetched content
  const contentBlock = block || data;
  
  // Show loading state
  if (shouldFetch && isLoading) {
    return <div className={`cms-content-loading ${className}`}>Loading content...</div>;
  }
  
  // Show error state
  if (shouldFetch && error) {
    return (
      <div className={`cms-content-error ${className}`}>
        <p>Error loading content: {(error as Error).message || 'Unknown error'}</p>
      </div>
    );
  }
  
  // Show not found state
  if (shouldFetch && !contentBlock) {
    return (
      <div className={`cms-content-not-found ${className}`}>
        <p>Content block not found: {identifier}</p>
      </div>
    );
  }
  
  // Show inactive content block message
  if (contentBlock && !contentBlock.active) {
    return (
      <div className={`cms-content-inactive ${className}`}>
        <p>This content is currently inactive.</p>
      </div>
    );
  }
  
  // Render content
  if (contentBlock) {
    return (
      <div 
        className={`cms-content ${className}`}
        data-id={contentBlock.id}
        data-identifier={contentBlock.identifier}
      >
        {contentBlock.title && (
          <h3 className="cms-content-title">{contentBlock.title}</h3>
        )}
        
        <div 
          className="cms-content-body"
          dangerouslySetInnerHTML={{ 
            __html: formatContent(contentBlock.content, contentBlock.format) 
          }}
        />
      </div>
    );
  }
  
  // Fallback for unexpected state
  return <div className={`cms-content-empty ${className}`}></div>;
}