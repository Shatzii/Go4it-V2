'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Trophy, Camera, Play, Star, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: 'combine' | 'showcase' | 'training' | 'competition';
  participants: number;
  highlights: string[];
  images: string[];
  videos?: string[];
  garScores?: {
    average: number;
    highest: number;
    participants: number;
  };
}

// Placeholder for past events - ready to be populated with real images
const pastEvents: Event[] = [
  {
    id: '1',
    title: 'Vienna Combine 2024',
    date: '2024-07-22',
    location: 'Vienna, Austria',
    description:
      'Our inaugural GAR Score testing event featuring Friday Night Lights and comprehensive athletic evaluation.',
    type: 'combine',
    participants: 89,
    highlights: [
      'First official GAR Score testing',
      'Friday Night Lights showcase',
      'International athlete participation',
      'Live streaming to 500+ viewers',
    ],
    images: [
      '/events/vienna-combine-1.jpg', // Ready for actual images
      '/events/vienna-combine-2.jpg',
      '/events/vienna-combine-3.jpg',
    ],
    videos: ['/events/vienna-highlights.mp4'],
    garScores: {
      average: 86,
      highest: 94,
      participants: 89,
    },
  },
  {
    id: '2',
    title: 'Elite Training Camp',
    date: '2024-06-15',
    location: 'Los Angeles, CA',
    description:
      'Intensive 3-day training camp for verified athletes with personalized coaching and performance analysis.',
    type: 'training',
    participants: 32,
    highlights: [
      'Personalized AI coaching sessions',
      'Biomechanical analysis',
      'Nutrition planning workshops',
      'College recruitment seminars',
    ],
    images: ['/events/training-camp-1.jpg', '/events/training-camp-2.jpg'],
    garScores: {
      average: 88,
      highest: 92,
      participants: 32,
    },
  },
  {
    id: '3',
    title: 'Spring Showcase',
    date: '2024-05-10',
    location: 'Atlanta, GA',
    description:
      'Multi-sport showcase event featuring high school athletes from across the Southeast.',
    type: 'showcase',
    participants: 156,
    highlights: [
      'Multi-sport competition',
      'College coach attendance',
      'Live GAR score displays',
      'Regional rankings debut',
    ],
    images: [
      '/events/spring-showcase-1.jpg',
      '/events/spring-showcase-2.jpg',
      '/events/spring-showcase-3.jpg',
    ],
    garScores: {
      average: 84,
      highest: 96,
      participants: 156,
    },
  },
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'combine':
        return 'bg-blue-500';
      case 'showcase':
        return 'bg-purple-500';
      case 'training':
        return 'bg-green-500';
      case 'competition':
        return 'bg-orange-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'combine':
        return <Trophy className="w-4 h-4" />;
      case 'showcase':
        return <Star className="w-4 h-4" />;
      case 'training':
        return <Users className="w-4 h-4" />;
      case 'competition':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-orange-500 text-white font-bold text-lg px-6 py-2">
            <Camera className="w-5 h-5 mr-2" />
            PAST EVENTS
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            EVENT GALLERY
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Relive the moments from our incredible events, showcases, and training camps
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event) => (
            <Card
              key={event.id}
              className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800">
                {/* Placeholder for event image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Event Photo Coming Soon</p>
                  </div>
                </div>

                {/* Event Type Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className={`${getEventTypeColor(event.type)} text-white font-semibold`}>
                    {getEventTypeIcon(event.type)}
                    {event.type.toUpperCase()}
                  </Badge>
                </div>

                {/* GAR Score Badge */}
                {event.garScores && (
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 text-sm font-semibold">
                        GAR {event.garScores.average}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-slate-300 mb-4">{event.description}</p>

                {/* Participants */}
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">{event.participants} participants</span>
                </div>

                {/* GAR Scores Summary */}
                {event.garScores && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {event.garScores.average}
                      </div>
                      <div className="text-xs text-slate-400">Avg GAR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {event.garScores.highest}
                      </div>
                      <div className="text-xs text-slate-400">Highest</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">
                        {event.garScores.participants}
                      </div>
                      <div className="text-xs text-slate-400">Tested</div>
                    </div>
                  </div>
                )}

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="font-semibold text-white mb-2 text-sm">Event Highlights</h4>
                  <div className="space-y-1">
                    {event.highlights.slice(0, 3).map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <Camera className="w-3 h-3 mr-1" />
                    View Gallery
                  </Button>
                  {event.videos && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play className="w-3 h-3 mr-1" />
                      Watch Video
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Trophy className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-white">Join Our Next Event</h3>
              <p className="text-slate-300 mb-6">
                Be part of the next generation of verified athletes. Follow us for upcoming events
                and showcases.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => (window.location.href = '/friday-night-lights')}
                >
                  Register for Friday Night Lights
                </Button>
                <Button variant="outline">View Calendar</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section for User */}
        <div className="mt-16">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-center">Add Your Event Photos</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 mb-4">
                <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">Upload photos from past events</p>
                <p className="text-sm text-slate-500">
                  Drag and drop images here or click to browse
                </p>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Help us build the complete story of Go4It Sports events
              </p>
              <Button variant="outline" className="w-full">
                Choose Photos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
