import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart3, Users, FileText, Gift, Database, Shield } from 'lucide-react'

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
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-slate-800 border-r border-slate-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Go4It Admin</span>
              </div>
              
              <nav className="space-y-2">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Users className="w-5 h-5" />
                  User Management
                </Link>
                <Link
                  href="/admin/content"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Content Management
                </Link>
                <Link
                  href="/admin/coupons"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Gift className="w-5 h-5" />
                  Coupon System
                </Link>
                <Link
                  href="/admin/scraper-dashboard"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Database className="w-5 h-5" />
                  Data Scraper
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}