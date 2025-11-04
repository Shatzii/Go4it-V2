'use client';

import { useEffect, useState } from 'react';

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
  requiresRegistration: boolean;
  roomId: string;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch {
      // Failed to fetch events
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="text-slate-400 mt-4">Loading upcoming events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
        <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-white mb-2">
          No Upcoming Events
        </h3>
        <p className="text-slate-400">
          Check back soon for new parent night sessions!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">
        Upcoming Parent Night Sessions
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event) => {
          const startDate = new Date(event.startTime);
          const endDate = new Date(event.endTime);
          const isToday = startDate.toDateString() === new Date().toDateString();
          const isTomorrow = startDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

          return (
            <div
              key={event.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors"
            >
              {/* Event Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1 text-sm text-blue-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : 'Upcoming'}
                </span>
                <span className="text-slate-400 text-sm">
                  {event.maxAttendees} spots
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">
                {event.title}
              </h3>

              {/* Description */}
              {event.description && (
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
              )}

              {/* Date and Time */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">
                    {startDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">
                    {startDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                    {' - '}
                    {endDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZoneName: 'short',
                    })}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                  Live Demo
                </span>
                <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                  Q&A Session
                </span>
                <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                  Free Account
                </span>
              </div>

              {/* Register Button */}
              <button
                onClick={() => {
                  // Scroll to registration form
                  document.querySelector('form')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center' 
                  });
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Register Now</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
