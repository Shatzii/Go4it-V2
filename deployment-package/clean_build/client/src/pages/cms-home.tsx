/**
 * CMS-Driven Home Page
 * 
 * This page is entirely driven by content from the CMS system,
 * demonstrating the modular architecture approach.
 */

import React from 'react';
import { usePage } from '@/modules/cms/hooks/usePage';
import { Page } from '@/modules/cms';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const CMSHomePage: React.FC = () => {
  // Fetch the page data from the CMS using slug
  const { data: pageData, isLoading, error } = usePage('home');
  
  if (isLoading) {
    return (
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
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load page content. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!pageData) {
    return (
      <div className="container mx-auto py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Page Not Found</AlertTitle>
          <AlertDescription>
            The requested page content was not found. Our team has been notified.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Render the page with the CMS data - pass slug instead of pageData
  return <Page slug="home" className="cms-home-page" />;
};

export default CMSHomePage;