'use client';

import React from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { UserProfile } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function ProfilePage() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/dashboard" className="text-2xl font-bold text-white">Go4It Sports</a>
            <a href="/dashboard" className="text-blue-400 hover:text-blue-300">← Back to Dashboard</a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Student Athlete Profile</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Clerk Profile Component */}
          <div className="lg:col-span-2">
            <UserProfile 
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorPrimary: '#2563eb',
                  colorBackground: '#1e293b',
                  colorInputBackground: '#334155',
                  colorText: '#ffffff'
                }
              }}
            />
          </div>

          {/* Sports-Specific Information */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Athletic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Primary Sport</label>
                  <select className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white">
                    <option>Select Sport</option>
                    <option>Football</option>
                    <option>Basketball</option>
                    <option>Soccer</option>
                    <option>Baseball</option>
                    <option>Track & Field</option>
                    <option>Swimming</option>
                    <option>Tennis</option>
                    <option>Volleyball</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Position</label>
                  <input type="text" className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white" placeholder="e.g. Quarterback, Point Guard" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Height</label>
                  <input type="text" className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white" placeholder="e.g. 6'2&quot;" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Weight</label>
                  <input type="text" className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white" placeholder="e.g. 185 lbs" />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Academic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">School</label>
                  <input type="text" className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white" placeholder="High School Name" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Grade Level</label>
                  <select className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white">
                    <option>Select Grade</option>
                    <option>9th Grade (Freshman)</option>
                    <option>10th Grade (Sophomore)</option>
                    <option>11th Grade (Junior)</option>
                    <option>12th Grade (Senior)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Graduation Year</label>
                  <input type="number" className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white" placeholder="2025" />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Goals & Aspirations</h3>
              <textarea 
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white h-24 resize-none" 
                placeholder="Describe your athletic and academic goals..."
              ></textarea>
            </div>

            <button className="btn-primary w-full">
              Save Athletic Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}