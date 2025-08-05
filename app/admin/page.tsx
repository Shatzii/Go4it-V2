'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Users, 
  FileText, 
  BarChart3, 
  DollarSign, 
  Image,
  Globe,
  Shield,
  Bell,
  Edit3,
  Eye
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-10 neon-border rounded flex items-center justify-center text-white font-bold text-sm neon-glow">
              GO4IT
            </div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Site
            </Link>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 min-h-[calc(100vh-73px)]">
          <nav className="p-6">
            <div className="space-y-2">
              <Link
                href="/admin/cms"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
              >
                <Edit3 className="w-5 h-5" />
                <span>Seamless CMS</span>
                <div className="ml-auto bg-blue-600 text-xs px-2 py-1 rounded">NEW</div>
              </Link>
              
              <Link
                href="/admin/content"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
              >
                <FileText className="w-5 h-5" />
                <span>Content Management</span>
              </Link>
              
              <Link
                href="/admin/users"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
              >
                <Users className="w-5 h-5" />
                <span>User Management</span>
              </Link>
              
              <Link
                href="/admin/coupons"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
              >
                <DollarSign className="w-5 h-5" />
                <span>Coupons</span>
              </Link>
              
              <Link
                href="/admin/analytics"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </Link>
              
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h2>
              <p className="text-slate-400">Manage your Go4It Sports platform with full control</p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-400">Total Users</div>
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">1,247</div>
                <div className="text-sm text-green-400">+18% this month</div>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-400">Active Camps</div>
                  <Globe className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">2</div>
                <div className="text-sm text-blue-400">Mexico Launch</div>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-400">Revenue</div>
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">$47,329</div>
                <div className="text-sm text-green-400">+24% this month</div>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-400">Coupons Used</div>
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">89</div>
                <div className="text-sm text-yellow-400">FULLACCESS2025 popular</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-400" />
                  Content Management
                </h3>
                <p className="text-slate-400 mb-4">
                  Use the new Seamless CMS to update all website content, events, pricing, and global settings in real-time.
                </p>
                <div className="space-y-2">
                  <Link
                    href="/admin/cms"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
                  >
                    Open Seamless CMS
                  </Link>
                  <Link
                    href="/admin/content"
                    className="block w-full bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-center transition-colors"
                  >
                    Legacy Content Editor
                  </Link>
                </div>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  Mexico Launch Status
                </h3>
                <p className="text-slate-400 mb-4">
                  Monitor and manage the Mexico camp events with authentic content from your provided documents.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">English With Sports Camp</span>
                    <span className="text-green-400">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Team Camps & Clinics</span>
                    <span className="text-green-400">Active</span>
                  </div>
                </div>
                <Link
                  href="/admin/cms?section=events"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
                >
                  Edit Mexico Events
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white">Mexico events content updated with authentic camp information</span>
                  </div>
                  <span className="text-slate-400 text-sm">2 min ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white">New user registered: Alex Rodriguez</span>
                  </div>
                  <span className="text-slate-400 text-sm">15 min ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white">Coupon FULLACCESS2025 used by Maria Garcia</span>
                  </div>
                  <span className="text-slate-400 text-sm">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}