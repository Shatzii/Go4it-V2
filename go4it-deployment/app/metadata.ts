import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Go4It Sports - Elite Athletic Development Platform',
  description: 'Comprehensive sports analytics platform for neurodivergent student athletes',
  keywords: 'sports analytics, athletic development, neurodivergent athletes, ADHD-friendly',
  authors: [{ name: 'Go4It Sports Team' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Go4It Sports - Elite Athletic Development Platform',
    description: 'Comprehensive sports analytics platform for neurodivergent student athletes',
    url: '/',
    siteName: 'Go4It Sports',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Go4It Sports' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Go4It Sports - Elite Athletic Development Platform',
    description: 'Comprehensive sports analytics platform for neurodivergent student athletes',
    images: ['/og-image.png'],
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#0f172a',
  };
}