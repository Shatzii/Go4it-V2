/**
 * ContentSection Component
 * 
 * A container component that renders a group of related content blocks.
 * Used to create logical sections of content on a page.
 */

import React from 'react';
import { ContentSectionProps } from '../types';
import { ContentBlock } from './ContentBlock';
import { cn } from '@/lib/utils';

export const ContentSection: React.FC<ContentSectionProps> = ({ section, className }) => {
  if (!section || !section.blocks || section.blocks.length === 0) {
    return null;
  }
  
  // Determine if we should use a grid layout or not based on the number of blocks
  const useGrid = section.blocks.length > 1;
  
  return (
    <section 
      id={`section-${section.id}`}
      className={cn(
        'py-12',
        className
      )}
      aria-labelledby={`section-title-${section.id}`}
    >
      {section.name && (
        <h2 
          id={`section-title-${section.id}`} 
          className="text-3xl font-bold text-center mb-8"
        >
          {section.name}
        </h2>
      )}
      
      {section.description && (
        <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          {section.description}
        </p>
      )}
      
      <div className={cn(
        useGrid 
          ? 'grid gap-8 md:grid-cols-2 lg:grid-cols-3'
          : 'max-w-4xl mx-auto',
      )}>
        {section.blocks.map((block) => (
          <ContentBlock 
            key={block.id} 
            identifier={block.identifier} 
          />
        ))}
      </div>
    </section>
  );
};