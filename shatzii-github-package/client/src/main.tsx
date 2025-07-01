import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import "./index.css";

// Lazy load the main App component for code splitting
const App = lazy(() => import("./App"));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
      <p className="text-blue-100 text-lg font-medium">Loading Shatzii AI Platform...</p>
    </div>
  </div>
);

// Performance monitoring for production
if (import.meta.env.PROD) {
  // Initialize performance observer
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as any;
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch (e) {
      // Silently fail if performance observer not supported
    }
  }
}

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (import.meta.env.DEV) {
    console.error('Unhandled promise rejection:', event.reason);
  }
  
  // Send error to backend if available (only in production)
  if (import.meta.env.PROD && event.reason && typeof event.reason === 'object') {
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'unhandledrejection',
        error: event.reason.message || 'Unknown error',
        stack: event.reason.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      })
    }).catch(() => {
      // Silently fail if error logging fails
    });
  }
  
  // Prevent the default browser behavior
  event.preventDefault();
});

// Handle uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'error',
      error: event.error?.message || event.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: new Date().toISOString(),
      url: window.location.href
    })
  }).catch(() => {
    // Silently fail if error logging fails
  });
});

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<LoadingFallback />}>
    <App />
  </Suspense>
);
