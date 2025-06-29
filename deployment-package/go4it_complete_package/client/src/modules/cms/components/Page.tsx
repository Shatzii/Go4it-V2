import React from 'react';
import { usePage } from '../hooks/usePage';
import { PageData, PageComponent, PageProps } from '../types';
import { ContentBlock } from './ContentBlock';
import { formatContent } from '../utils/contentFormatter';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

/**
 * Page Component
 * 
 * Renders a full page from the CMS based on its slug.
 * Displays components of the page in a structured layout.
 */
export function Page({ slug, className = '' }: PageProps) {
  // Fetch page data by slug
  const { data: page, isLoading, error } = usePage(slug);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className={`cms-page-loading ${className}`}>
        <div className="container mx-auto py-12 space-y-8">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-48 rounded-lg" />
              <Skeleton className="h-48 rounded-lg" />
              <Skeleton className="h-48 rounded-lg" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className={`cms-page-error ${className}`}>
        <div className="container mx-auto py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Error loading page: {(error as Error).message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }
  
  // Show not found state
  if (!page) {
    return (
      <div className={`cms-page-not-found ${className}`}>
        <div className="container mx-auto py-12">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Page Not Found</AlertTitle>
            <AlertDescription>
              The requested page content was not found. Our team has been notified.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }
  
  // Show inactive page message
  if (!page.active) {
    return (
      <div className={`cms-page-inactive ${className}`}>
        <div className="container mx-auto py-12">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Page Unavailable</AlertTitle>
            <AlertDescription>
              This page is currently inactive.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`cms-page ${page.className || ''} ${className}`}
      data-id={page.id}
      data-slug={page.slug || ''}
    >
      {/* Page main content */}
      {page.title && <h1 className="cms-page-title">{page.title}</h1>}
      
      {page.content && (
        <div 
          className="cms-page-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}
      
      {/* Page components */}
      {page.components && page.components.length > 0 && (
        <div className="cms-page-components">
          {page.components.map((component, index) => renderComponent(component, page, index))}
        </div>
      )}
    </div>
  );
}

/**
 * Renders a component based on its type
 */
function renderComponent(component: PageComponent, page: PageData, index: number) {
  const key = `component-${index}`;
  
  switch (component.type) {
    case 'content-block':
      // Render a single content block by identifier
      return (
        <div key={key} className={`cms-component-block ${component.className || ''}`}>
          <ContentBlock identifier={component.identifier || ''} />
        </div>
      );
      
    case 'content-section':
      // Render all content blocks from a section
      return (
        <div key={key} className={`cms-component-section ${component.className || ''}`}>
          {component.title && <h2 className="cms-section-title">{component.title}</h2>}
          
          <div className="cms-section-blocks">
            {page.blocks && 
             page.blocks.filter(block => block.section === component.section).map((block, idx) => (
              <ContentBlock key={`block-${idx}`} identifier={block.identifier} />
            ))}
          </div>
        </div>
      );
      
    case 'hero':
      // Render a hero section with optional background image
      return (
        <div 
          key={key}
          className={`cms-component-hero ${component.className || ''}`}
          style={component.backgroundImage ? {
            backgroundImage: `url(${component.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : undefined}
        >
          {component.title && <h2 className="cms-hero-title">{component.title}</h2>}
          {component.subtitle && <p className="cms-hero-subtitle">{component.subtitle}</p>}
          {component.content && (
            <div 
              className="cms-hero-content"
              dangerouslySetInnerHTML={{ __html: formatContent(component.content || '', 'html') }}
            />
          )}
        </div>
      );
      
    case 'custom':
      // For custom components, just render the raw content
      return (
        <div 
          key={key}
          className={`cms-component-custom ${component.className || ''}`}
        >
          {component.title && <h2 className="cms-custom-title">{component.title}</h2>}
          {component.subtitle && <p className="cms-custom-subtitle">{component.subtitle}</p>}
          {component.content && (
            <div 
              className="cms-custom-content"
              dangerouslySetInnerHTML={{ __html: formatContent(component.content || '', 'html') }}
            />
          )}
        </div>
      );
      
    default:
      return (
        <div key={key} className="cms-component-unknown">
          <p>Unknown component type: {(component as any).type}</p>
        </div>
      );
  }
}