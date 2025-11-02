'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, MapPin, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineEvent {
  id: number;
  title: string;
  description?: string;
  eventType: string;
  eventDate: string;
  location?: string;
  isCompleted: boolean;
}

interface RecruitingTimelineProps {
  events: TimelineEvent[];
  onAddEvent: (event: Partial<TimelineEvent>) => void;
  onToggleComplete: (eventId: number) => void;
}

export default function RecruitingTimeline({ events = [], onAddEvent, onToggleComplete }: RecruitingTimelineProps) {
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    eventType: 'visit',
    eventDate: '',
    location: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent(newEvent);
    setNewEvent({ title: '', eventType: 'visit', eventDate: '', location: '', description: '' });
    setShowForm(false);
  };

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

  const upcomingEvents = sortedEvents.filter(e => !e.isCompleted && new Date(e.eventDate) >= new Date());
  const pastEvents = sortedEvents.filter(e => e.isCompleted || new Date(e.eventDate) < new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Recruiting Timeline</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Event Title</label>
              <input
                type="text"
                required
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Official Visit to..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Event Type</label>
              <select
                value={newEvent.eventType}
                onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="visit">Campus Visit</option>
                <option value="camp">Camp/Showcase</option>
                <option value="deadline">Application Deadline</option>
                <option value="commitment">Commitment Decision</option>
                <option value="contact">Coach Contact</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
              <input
                type="date"
                required
                value={newEvent.eventDate}
                onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="City, State"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Add Event
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} onToggleComplete={onToggleComplete} />
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-400 mb-3">Past Events</h3>
          <div className="space-y-3 opacity-60">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} onToggleComplete={onToggleComplete} />
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && !showForm && (
        <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700">
          <CalendarIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No events scheduled yet</p>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onToggleComplete }: { event: TimelineEvent; onToggleComplete: (id: number) => void }) {
  const eventDate = new Date(event.eventDate);
  const isUpcoming = eventDate >= new Date() && !event.isCompleted;
  
  return (
    <div className={`bg-slate-800/50 border rounded-lg p-4 ${isUpcoming ? 'border-blue-500' : 'border-slate-700'}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggleComplete(event.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            event.isCompleted
              ? 'bg-green-600 border-green-600'
              : 'border-slate-500 hover:border-blue-500'
          }`}
        >
          {event.isCompleted && <Check className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1">
          <h4 className={`font-semibold mb-1 ${event.isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
            {event.title}
          </h4>

          <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {format(eventDate, 'MMM d, yyyy')}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location}
              </span>
            )}
            <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs">
              {event.eventType}
            </span>
          </div>

          {event.description && (
            <p className="text-sm text-slate-400">{event.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
