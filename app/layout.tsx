import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/components/providers/AppProviders';
import { WebSocketProvider } from '@/components/realtime/WebSocketProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { NotificationSystem } from '@/components/notifications/NotificationSystem';
import { AccessibilityEnhancements } from '@/components/accessibility/AccessibilityEnhancements';
import ClientOnly from '@/components/ClientOnly';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Go4It Sports - Elite Athletic Development Platform',
  description: 'Comprehensive sports analytics platform for neurodivergent student athletes',
  keywords: 'sports analytics, athletic development, neurodivergent athletes, ADHD-friendly',
  authors: [{ name: 'Go4It Sports Team' }],
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#0f172a',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        <ErrorBoundary>
          <AppProvider>
            <WebSocketProvider>
              <ServiceWorkerRegistration />
              
              {/* Global Navigation Bar */}
              <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-6">
                      <div className="text-xl font-bold text-white">
                        Go4It Sports
                      </div>
                      <div className="hidden md:flex items-center gap-4">
                        <a href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                          Dashboard
                        </a>
                        <a href="/academy" className="text-slate-300 hover:text-white transition-colors">
                          Academy
                        </a>
                        <a href="/recruiting-hub" className="text-slate-300 hover:text-white transition-colors">
                          Recruiting Hub
                        </a>
                        <a href="/combine-registration" className="text-slate-300 hover:text-white transition-colors">
                          Register for Combine
                        </a>
                        <a href="/upload" className="text-slate-300 hover:text-white transition-colors">
                          Upload
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ClientOnly>
                        <GlobalSearch />
                        <NotificationSystem />
                      </ClientOnly>
                    </div>
                  </div>
                </div>
              </nav>

              {/* Main Content */}
              <div className="pt-16">
                {children}
              </div>

              <ClientOnly>
                <MobileNavigation />
                <PerformanceMonitor />
                <AccessibilityEnhancements />
              </ClientOnly>
            </WebSocketProvider>
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}