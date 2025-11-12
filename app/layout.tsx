import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Providers from './providers';

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
          {children}
        </Providers>
      </body>
    </html>
  );
}