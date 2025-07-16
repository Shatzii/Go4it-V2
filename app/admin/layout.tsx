import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Go4It Sports - Admin Dashboard',
  description: 'Administrative dashboard for Go4It Sports platform management',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900">
        {children}
      </body>
    </html>
  )
}