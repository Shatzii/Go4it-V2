import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

export interface ErrorPageProps {
  // Error type: 404, 500, etc.
  errorCode?: number | string;
  // Custom title for the error page
  title?: string;
  // Description or message to display
  description?: string;
  // Whether to show a refresh button
  showRefresh?: boolean;
  // Whether to show a home button
  showHome?: boolean;
  // Additional action button
  actionButton?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  // Additional CSS class
  className?: string;
}

/**
 * Reusable Error Page component for various error scenarios
 */
export function ErrorPage({
  errorCode,
  title,
  description,
  showRefresh = true,
  showHome = true,
  actionButton,
  className = "",
}: ErrorPageProps) {
  // Default titles based on error code
  const getDefaultTitle = () => {
    switch (errorCode) {
      case 404:
        return "Page Not Found";
      case 500:
        return "Server Error";
      case 403:
        return "Access Denied";
      case 401:
        return "Authentication Required";
      default:
        return "An Error Occurred";
    }
  };

  // Default descriptions based on error code
  const getDefaultDescription = () => {
    switch (errorCode) {
      case 404:
        return "The page you're looking for doesn't exist or may have been moved.";
      case 500:
        return "Our servers encountered a problem. Please try again later.";
      case 403:
        return "You don't have permission to access this resource.";
      case 401:
        return "Please log in to access this page.";
      default:
        return "We're experiencing technical difficulties. Please try again.";
    }
  };

  const displayTitle = title || getDefaultTitle();
  const displayDescription = description || getDefaultDescription();

  // Handle refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={`min-h-[80vh] w-full flex flex-col items-center justify-center ${className}`}>
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardContent className="pt-8 pb-6 px-6">
          <div className="flex flex-col items-center text-center mb-6">
            {/* Error icon with code */}
            <div className="rounded-full bg-muted p-4 mb-4">
              <AlertCircle className="h-10 w-10 text-primary" />
            </div>
            
            {/* Error code badge - if provided */}
            {errorCode && (
              <div className="bg-muted inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Error {errorCode}
              </div>
            )}
            
            {/* Title and description */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{displayTitle}</h1>
            <p className="text-gray-600">{displayDescription}</p>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {showRefresh && (
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            
            {showHome && (
              <Link href="/">
                <Button>
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
            )}
            
            {actionButton && (
              <Link href={actionButton.href}>
                <Button>
                  {actionButton.icon && <span className="mr-2">{actionButton.icon}</span>}
                  {actionButton.label}
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}