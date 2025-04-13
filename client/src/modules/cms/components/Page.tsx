import React from 'react';
import { usePage } from '../hooks/usePage';
import { PageData } from '../types';
import { ContentBlock } from './ContentBlock';

interface PageProps {
  slug: string;
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * Page Component
 * 
 * Renders a full page from the CMS based on its slug.
 * Displays components of the page in a structured layout.
 */
export function Page({ slug, fallback, className = '' }: PageProps) {
  const { data: page, isLoading, error } = usePage(slug);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-muted h-10 w-3/4 rounded-md mb-8"></div>
        <div className="animate-pulse bg-muted h-64 rounded-md"></div>
        <div className="animate-pulse bg-muted h-32 rounded-md"></div>
      </div>
    );
  }
  
  if (error || !page) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="p-4 border border-destructive text-destructive rounded-md">
        {error ? (
          <p>Error loading page: {error instanceof Error ? error.message : 'Unknown error'}</p>
        ) : (
          <p>Page not found: {slug}</p>
        )}
      </div>
    );
  }
  
  return (
    <div className={`cms-page ${className}`}>
      {page.title && (
        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
      )}
      
      {page.description && (
        <p className="text-xl mb-8 text-muted-foreground">{page.description}</p>
      )}
      
      {page.components && page.components.length > 0 ? (
        <div className="cms-page-components space-y-10">
          {page.components.map((component) => (
            <div key={component.id} className="component">
              {renderComponent(component, page)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No content available for this page.</p>
      )}
    </div>
  );
}

/**
 * Renders a component based on its type
 */
function renderComponent(component: PageData['components'][0], page: PageData) {
  switch (component.type) {
    case 'content_block':
      return (
        <ContentBlock 
          identifier={component.data?.identifier} 
          className={component.data?.className || ''}
        />
      );
    
    case 'hero':
      return (
        <div className="bg-primary/5 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-3">{component.data?.title}</h2>
          {component.data?.subtitle && (
            <p className="text-xl mb-4">{component.data.subtitle}</p>
          )}
          {component.data?.content && (
            <div className="prose" dangerouslySetInnerHTML={{ __html: component.data.content }} />
          )}
          {component.data?.ctaUrl && (
            <div className="mt-6">
              <a 
                href={component.data.ctaUrl} 
                className="inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
              >
                {component.data.ctaText || 'Learn More'}
              </a>
            </div>
          )}
        </div>
      );
      
    case 'grid':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(component.data?.items) && component.data.items.map((item: any, index: number) => (
            <div key={index} className="p-4 border rounded-lg">
              {item.title && <h3 className="text-lg font-semibold mb-2">{item.title}</h3>}
              {item.content && <div dangerouslySetInnerHTML={{ __html: item.content }} />}
            </div>
          ))}
        </div>
      );
    
    default:
      return (
        <div className="p-4 border border-amber-200 bg-amber-50 text-amber-800 rounded-md">
          <p>Unknown component type: {component.type}</p>
        </div>
      );
  }
}