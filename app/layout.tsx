import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import Navigation from './components/Navigation';
import Providers from './providers';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { headers } from 'next/headers';
import { brand } from '@/lib/brand';
import { UTMProvider } from '@/components/analytics/UTMProvider';
import ConsentBanner from '@/components/consent/ConsentBanner';
import PWAInit from '@/components/pwa/PWAInit';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import OfflineIndicator from '@/components/pwa/OfflineIndicator';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GO4IT Combine | Neon HUD Experience',
  description: 'International Combine 2025 - Film. Metrics. AI Coach. Ages 12–18 — Soccer • Basketball • Flag Football',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const requiresCompliance = h.get('x-go4it-requires-compliance') === 'true';
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
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

              {requiresCompliance && (
                <section className="w-full border-t border-slate-800 mt-12 py-6 text-xs text-slate-300">
                  <div className="container mx-auto px-4 space-y-2">
                    <p className="font-semibold">{brand.a11y.safetyLine}</p>
                    <p className="leading-relaxed">{brand.complianceFooter}</p>
                  </div>
                </section>
              )}
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
