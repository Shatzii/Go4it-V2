import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Go4It Sports - Elite Athletic Development Platform',
  description: 'Comprehensive sports analytics platform for neurodivergent student athletes',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head></head>
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        {/* Simplified nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                Go4It Sports
              </a>
              <div className="hidden md:flex items-center gap-6">
                <a href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</a>
                <a href="/recruiting-hub" className="text-slate-300 hover:text-white transition-colors">Recruiting</a>
                <a href="/academy" className="text-slate-300 hover:text-white transition-colors">Academy</a>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Main Content */}
        <div className="pt-16">{children}</div>
        
        {/* Footer */}
        <footer className="w-full text-center py-6 text-slate-400 text-xs border-t border-slate-800 mt-12">
          <a href="/privacy" className="hover:underline mx-2">Privacy Policy</a> | 
          <a href="/terms" className="hover:underline mx-2">Terms of Service</a>
        </footer>
      </body>
    </html>
  );
}
