import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Disable static optimization globally to prevent Clerk prerendering issues
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

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
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Providers>
          {children}
        </Providers>
        <elevenlabs-convai agent-id="agent_1001k4wwzpyredkb7hhfffvna14v"></elevenlabs-convai>
        <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
      </body>
    </html>
  );
}