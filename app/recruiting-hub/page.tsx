'use client';

import { useState, Suspense } from 'react';
import { Trophy, Users, Calendar, MessageSquare, TrendingUp, Target, Award } from 'lucide-react';
import CollegeSearch from './components/CollegeSearch';
import OfferTracker from './components/OfferTracker';
import RecruitingTimeline from './components/RecruitingTimeline';
import CommunicationLog from './components/CommunicationLog';
import { useRecruitingData } from './hooks/useRecruitingData';
import { useUser } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function RecruitingHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useUser();
  
  // Convert string ID to number for recruiting API (or use 1 as fallback for demo)
  const userId = user?.id ? (isNaN(parseInt(user.id)) ? 1 : parseInt(user.id)) : 1;

  const { offers, communications, timeline, contacts, loading, refetch } = useRecruitingData(userId);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'search', label: 'College Search', icon: Trophy },
    { id: 'pipeline', label: 'Pipeline', icon: Target },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
  ];

  // Stats calculation
  const stats = [
    {
      label: 'Schools Interested',
      value: offers.filter((o: any) => o.status === 'interested').length,
      icon: Trophy,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
    },
    {
      label: 'Active Contacts',
      value: contacts.length,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20',
    },
    {
      label: 'Upcoming Events',
      value: timeline.filter((e: any) => !e.isCompleted && new Date(e.eventDate) >= new Date()).length,
      icon: Calendar,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20',
    },
    {
      label: 'Total Communications',
      value: communications.length,
      icon: MessageSquare,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20',
    },
    {
      label: 'Offers Received',
      value: offers.filter((o: any) => o.status === 'offered').length,
      icon: Award,
      color: 'text-red-400',
      bgColor: 'bg-red-600/20',
    },
  ];

  const handleUpdateOfferStatus = async (offerId: number, newStatus: string) => {
    try {
      await fetch('/api/recruiting/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: offerId, status: newStatus }),
      });
      refetch();
    } catch (error) {
      // Handle error
    }
  };

  const handleAddTimelineEvent = async (event: any) => {
    try {
      await fetch('/api/recruiting/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...event, userId }),
      });
      refetch();
    } catch (error) {
      // Handle error
    }
  };

  const handleToggleComplete = async (eventId: number) => {
    const event = timeline.find((e: any) => e.id === eventId);
    if (!event) return;

    try {
      await fetch('/api/recruiting/timeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, isCompleted: !(event as any).isCompleted }),
      });
      refetch();
    } catch (error) {
      // Handle error
    }
  };

  const handleAddCommunication = async (comm: any) => {
    try {
      await fetch('/api/recruiting/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...comm, userId }),
      });
      refetch();
    } catch (error) {
      // Handle error
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400">Loading recruiting data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Recruiting Hub
          </h1>
          <p className="text-slate-400">
            Manage your college recruiting journey in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                      <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {communications.slice(0, 5).map((comm: any) => (
                      <div key={comm.id} className="flex items-center gap-3 text-sm">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300">{comm.subject || comm.type}</span>
                        <span className="text-slate-500 ml-auto">
                          {new Date(comm.communicationDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {communications.length === 0 && (
                      <p className="text-slate-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Upcoming Events</h3>
                  <div className="space-y-3">
                    {timeline
                      .filter((e: any) => !e.isCompleted && new Date(e.eventDate) >= new Date())
                      .slice(0, 5)
                      .map((event: any) => (
                        <div key={event.id} className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-green-400" />
                          <span className="text-slate-300">{event.title}</span>
                          <span className="text-slate-500 ml-auto">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    {timeline.filter((e: any) => !e.isCompleted && new Date(e.eventDate) >= new Date()).length === 0 && (
                      <p className="text-slate-500 text-center py-4">No upcoming events</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'search' && (
            <Suspense fallback={<div>Loading...</div>}>
              <CollegeSearch />
            </Suspense>
          )}

          {activeTab === 'pipeline' && (
            <Suspense fallback={<div>Loading...</div>}>
              <OfferTracker offers={offers} onUpdateStatus={handleUpdateOfferStatus} />
            </Suspense>
          )}

          {activeTab === 'timeline' && (
            <Suspense fallback={<div>Loading...</div>}>
              <RecruitingTimeline
                events={timeline}
                onAddEvent={handleAddTimelineEvent}
                onToggleComplete={handleToggleComplete}
              />
            </Suspense>
          )}

          {activeTab === 'communications' && (
            <Suspense fallback={<div>Loading...</div>}>
              <CommunicationLog
                communications={communications}
                onAddCommunication={handleAddCommunication}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
