'use client';

import Link from 'next/link';
import { BarChart3, Users, FileText, Gift, Database, Shield, LogOut } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = () => {
    // Clear admin authentication
    localStorage.removeItem('adminAccess');
    localStorage.removeItem('adminToken');
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'adminAccess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin/login';
  };

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
                  href="/admin/dashboard"
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

              {/* Logout Button */}
              <div className="mt-8 pt-4 border-t border-slate-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
