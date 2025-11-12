import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Navigation from './components/Navigation';
import Providers from './providers';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { UTMProvider } from '@/components/analytics/UTMProvider';
import ConsentBanner from '@/components/consent/ConsentBanner';
import PWAInit from '@/components/pwa/PWAInit';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import OfflineIndicator from '@/components/pwa/OfflineIndicator';
import ComplianceFooter from './components/ComplianceFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Go4it Academy',
  description: 'Get Verified - AI-powered athletic development and recruitment platform for student athletes',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --blueglow-cyan: #00ffff;
            --blueglow-black: #000000;
            --blueglow-white: #ffffff;
          }
        `}</style>
      </head>
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        <Providers>
          <UTMProvider>
            <ToastProvider>
              <PWAInit />
              <OfflineIndicator />
              <Navigation />
              
              {/* Main Content */}
              <div className="pt-16">{children}</div>
              
              <ConsentBanner />
              <InstallPrompt />
              <ComplianceFooter />
              
              {/* Footer */}
              <footer className="w-full text-center py-6 text-slate-400 text-xs border-t border-slate-800">
                <a href="/privacy" className="hover:underline mx-2">Privacy Policy</a> | 
                <a href="/terms" className="hover:underline mx-2">Terms of Service</a>
              </footer>
            </ToastProvider>
          </UTMProvider>
        </Providers>
      </body>
    </html>
  );
}
// import './globals.css'; // Disabled due to PostCSS issues
