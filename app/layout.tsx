import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/components/providers/AppProviders';
import { WebSocketProvider } from '@/components/realtime/WebSocketProvider';
import { ErrorBoundary } from '@/components/testing/ErrorBoundary';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
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
          <ClientOnly>
            <AppProvider>
              <WebSocketProvider>
                {children}
                <MobileNavigation />
                <PerformanceMonitor />
              </WebSocketProvider>
            </AppProvider>
          </ClientOnly>
        </ErrorBoundary>
      </body>
    </html>
  );
}