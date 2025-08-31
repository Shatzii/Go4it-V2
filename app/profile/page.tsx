'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Star,
  Trophy,
  Calendar,
  Settings,
  Mail,
  Phone,
  MapPin,
  School,
  Edit2,
  Camera,
  CheckCircle,
  Plus,
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const user = {
    id: '1',
    firstName: 'Jordan',
    lastName: 'Martinez',
    email: 'jordan.martinez@email.com',
    phone: '(555) 123-4567',
    location: 'Austin, TX',
    school: 'Austin High School',
    grade: '11th',
    sport: 'Soccer',
    position: 'Midfielder',
    jersey: '#10',
    garScore: 78,
    starLevel: 8,
    totalXp: 2450,
    avatar: null,
    bio: 'Dedicated soccer player with passion for the game. Looking to play at the collegiate level.',
    achievements: [
      { id: 1, title: 'First GAR Analysis', date: '2024-01-15', icon: '🎯' },
      { id: 2, title: 'Star Level 5', date: '2024-02-10', icon: '⭐' },
      { id: 3, title: 'Perfect Training Week', date: '2024-03-05', icon: '🏆' },
    ],
    stats: {
      videosUploaded: 14,
      totalAnalyses: 12,
      trainingHours: 145,
      scoutViews: 47,
    },
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'stats', label: 'Statistics', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Athlete Profile</h1>
              <p className="text-slate-400">Manage your athletic profile and achievements</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 bg-slate-700 rounded-full p-2 hover:bg-slate-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h2 className="text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
                  {user.sport} • {user.position}
                </span>
                <span className="bg-green-900 text-green-200 px-3 py-1 rounded-full text-sm">
                  Jersey {user.jersey}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-slate-400">
                  <School className="w-4 h-4" />
                  <span>{user.school}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>Grade {user.grade}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="mb-2">
                <span className="text-2xl font-bold text-green-400">{user.garScore}</span>
                <span className="text-slate-400 text-sm ml-1">GAR Score</span>
              </div>
              <div className="mb-2">
                <span className="text-xl font-bold text-blue-400">Level {user.starLevel}</span>
                <span className="text-slate-400 text-sm ml-1">StarPath</span>
              </div>
              <div className="text-sm text-slate-400">{user.totalXp.toLocaleString()} XP</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="border-b border-slate-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-400">
                          {user.stats.videosUploaded}
                        </div>
                        <div className="text-sm text-slate-400">Videos Uploaded</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400">
                          {user.stats.totalAnalyses}
                        </div>
                        <div className="text-sm text-slate-400">Total Analyses</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-400">
                          {user.stats.trainingHours}
                        </div>
                        <div className="text-sm text-slate-400">Training Hours</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-400">
                          {user.stats.scoutViews}
                        </div>
                        <div className="text-sm text-slate-400">Scout Views</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Bio</h3>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-slate-300">{user.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Achievements</h3>
                {user.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-slate-700 rounded-lg p-4 flex items-center space-x-4"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{achievement.title}</div>
                      <div className="text-sm text-slate-400">{achievement.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">GAR Score Progression</h4>
                    <div className="text-slate-400 text-sm">
                      View your GAR score history and improvements over time
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Training Analytics</h4>
                    <div className="text-slate-400 text-sm">
                      Detailed breakdown of your training sessions and progress
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Privacy Settings</h4>
                    <div className="text-slate-400 text-sm">
                      Control who can view your profile and stats
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Notification Preferences</h4>
                    <div className="text-slate-400 text-sm">
                      Manage email and push notification settings
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Account Security</h4>
                    <div className="text-slate-400 text-sm">
                      Update password and security settings
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
