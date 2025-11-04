'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface NetworkingEvent {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  locationType: string;
  venue: string | null;
  startTime: Date;
  endTime: Date;
  maxAttendees: number | null;
  currentAttendees: number;
  registrationFee: number;
  targetAudience: string[];
  speakers: Array<{ name: string; title: string }>;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<NetworkingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/alumni/events?upcoming=true&limit=3');
      const data = await response.json();
      setEvents(data.events || []);
    } catch {
      // Error fetching events
    } finally {
      setLoading(false);
    }
  };

  const getLocationIcon = (locationType: string) => {
    if (locationType === 'virtual') {
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  };

  const getAvailabilityStatus = (current: number, max: number | null) => {
    if (!max) return { label: 'Open', color: 'green' };
    const percentage = (current / max) * 100;
    if (percentage >= 90) return { label: 'Almost Full', color: 'red' };
    if (percentage >= 70) return { label: 'Filling Fast', color: 'yellow' };
    return { label: 'Available', color: 'green' };
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-slate-700 rounded mb-4"></div>
            <div className="h-4 bg-slate-700 rounded mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800/30 border border-slate-700 rounded-xl">
        <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-slate-400">No upcoming events. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {events.map((event) => {
        const availability = getAvailabilityStatus(event.currentAttendees, event.maxAttendees);
        
        return (
          <div
            key={event.id}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-all group"
          >
            {/* Event Type Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full capitalize">
                {event.eventType}
              </span>
              {event.registrationFee === 0 ? (
                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full font-medium">
                  FREE
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium">
                  ${event.registrationFee}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-xl text-white mb-3 group-hover:text-blue-400 transition-colors">
              {event.title}
            </h3>

            {/* Description */}
            {event.description && (
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>
            )}

            {/* Date & Time */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{format(new Date(event.startTime), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-slate-300 text-sm mb-4">
              <div className="text-blue-400">
                {getLocationIcon(event.locationType)}
              </div>
              <span className="capitalize">
                {event.locationType === 'virtual' ? 'Virtual Event' : event.venue || 'In-Person'}
              </span>
            </div>

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="mb-4 pb-4 border-b border-slate-700">
                <p className="text-xs text-slate-500 mb-2">Featured Speakers</p>
                <div className="space-y-1">
                  {event.speakers.slice(0, 2).map((speaker, idx) => (
                    <p key={idx} className="text-sm text-slate-300">
                      {speaker.name} <span className="text-slate-500">• {speaker.title}</span>
                    </p>
                  ))}
                  {event.speakers.length > 2 && (
                    <p className="text-xs text-slate-500">+{event.speakers.length - 2} more</p>
                  )}
                </div>
              </div>
            )}

            {/* Target Audience */}
            {event.targetAudience && event.targetAudience.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">For</p>
                <div className="flex flex-wrap gap-2">
                  {event.targetAudience.slice(0, 3).map((audience, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded capitalize">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">
                  {event.currentAttendees} {event.maxAttendees && `/ ${event.maxAttendees}`} attending
                </span>
                <span className={`text-xs font-medium ${
                  availability.color === 'green' ? 'text-green-400' :
                  availability.color === 'yellow' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {availability.label}
                </span>
              </div>
              {event.maxAttendees && (
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      availability.color === 'green' ? 'bg-green-500' :
                      availability.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Register Button */}
            <Link
              href={`/alumni/events/${event.id}`}
              className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg text-center hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Register Now
            </Link>
          </div>
        );
      })}
    </div>
  );
}
