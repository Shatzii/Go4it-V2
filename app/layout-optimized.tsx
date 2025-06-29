import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ErrorBoundary from '@/src/components/ui/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Go4It Sports - Advanced Athletics Platform',
  description: 'AI-powered sports analytics platform designed for neurodivergent student athletes',
  keywords: ['sports analytics', 'ADHD', 'student athletes', 'AI coaching', 'video analysis'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-900 text-white antialiased`}>
        <ErrorBoundary>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}