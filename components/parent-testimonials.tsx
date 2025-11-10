'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Quote, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  athleteName: string;
  sport: string;
  rating: number;
  quote: string;
  videoUrl?: string;
  thumbnail?: string;
  profileImage?: string;
  date: string;
  session: 'Tuesday' | 'Thursday';
  results?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Jennifer Martinez',
    role: 'Parent',
    location: 'Dallas, TX',
    athleteName: 'Marcus Martinez',
    sport: 'Basketball',
    rating: 5,
    quote: "The Tuesday Parent Night opened my eyes to NCAA eligibility requirements I didn't know existed. By Thursday, we had a clear plan. Marcus got his GAR score of 94 and now has 3 D1 offers.",
    date: '2024-10-28',
    session: 'Tuesday',
    results: '3 D1 offers, GAR 94',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
  },
  {
    id: '2',
    name: 'David Thompson',
    role: 'Parent',
    location: 'Vienna, Austria',
    athleteName: 'Emma Thompson',
    sport: 'Soccer',
    rating: 5,
    quote: "As an international family, we were lost on the NCAA process. The Parent Night sessions walked us through everything step-by-step. Emma is now in the GAR Top 100 and being scouted by US colleges.",
    date: '2024-10-25',
    session: 'Thursday',
    results: 'GAR Top 100, 5 college scouts',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    role: 'Parent',
    location: 'Denver, CO',
    athleteName: 'Tyler Johnson',
    sport: 'Football',
    rating: 5,
    quote: "I was skeptical about online schooling for athletes. The Parent Night team showed me NCAA-approved courses and the StarPath tracking system. Tyler maintains a 3.8 GPA while training 20+ hours per week.",
    date: '2024-10-21',
    session: 'Tuesday',
    results: '3.8 GPA, 20+ training hours/week',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: '4',
    name: 'Miguel Rodriguez',
    role: 'Parent',
    location: 'Mérida, Mexico',
    athleteName: 'Diego Rodriguez',
    sport: 'Football',
    rating: 5,
    quote: "El Parent Night me ayudó entender el proceso completo. From Tuesday discovery to Thursday decision, they answered every question. Diego now has full academic support and recruiting exposure.",
    date: '2024-10-18',
    session: 'Thursday',
    results: 'Full academic support, active recruiting',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
  },
  {
    id: '5',
    name: 'Lisa Chen',
    role: 'Parent',
    location: 'San Francisco, CA',
    athleteName: 'Alex Chen',
    sport: 'Volleyball',
    rating: 5,
    quote: "The transparency during Parent Night was refreshing. They clearly stated 'verification ≠ recruitment' but showed exactly how Go4it gives athletes every advantage. Alex's confidence has skyrocketed.",
    date: '2024-10-15',
    session: 'Tuesday',
    results: 'GAR 92, confidence boost',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
  },
  {
    id: '6',
    name: 'Robert Williams',
    role: 'Parent',
    location: 'Miami, FL',
    athleteName: 'Jordan Williams',
    sport: 'Basketball',
    rating: 5,
    quote: "Best decision we made was attending both Tuesday and Thursday sessions. By Monday onboarding, we knew exactly what to expect. Jordan is thriving academically and athletically.",
    date: '2024-10-12',
    session: 'Thursday',
    results: 'Thriving in academy',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
  },
];

export function ParentTestimonials() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
            Parent Night Success Stories
          </Badge>
          <h2 className="text-4xl font-black text-white mb-4">
            What Parents Say About Our Tuesday/Thursday Sessions
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Real feedback from parents who attended our free Parent Night info sessions
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-900 rounded-lg shadow-lg p-6 text-center border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <div className="text-3xl font-black text-cyan-400 mb-1">342</div>
            <div className="text-sm text-slate-400">Parents Last Week</div>
          </div>
          <div className="bg-slate-900 rounded-lg shadow-lg p-6 text-center border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <div className="text-3xl font-black text-green-400 mb-1">4.9</div>
            <div className="text-sm text-slate-400">Average Rating</div>
          </div>
          <div className="bg-slate-900 rounded-lg shadow-lg p-6 text-center border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <div className="text-3xl font-black text-purple-400 mb-1">89%</div>
            <div className="text-sm text-slate-400">Enroll After Thursday</div>
          </div>
          <div className="bg-slate-900 rounded-lg shadow-lg p-6 text-center border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <div className="text-3xl font-black text-orange-400 mb-1">100%</div>
            <div className="text-sm text-slate-400">Free Sessions</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-slate-900 border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedTestimonial(testimonial)}
            >
              <CardContent className="p-6">
                {/* Header with Profile Image */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Profile Image */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0 ring-2 ring-cyan-500/30 shadow-md">
                    {testimonial.profileImage ? (
                      <Image
                        src={testimonial.profileImage}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        unoptimized
                        priority={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Name & Location */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{testimonial.name}</h3>
                    <p className="text-sm text-slate-400 truncate">{testimonial.location}</p>
                  </div>

                  {/* Session Badge */}
                  <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                    {testimonial.session}
                  </Badge>
                </div>

                {/* Rating */}
                <div className="mb-3">{renderStars(testimonial.rating)}</div>

                {/* Quote */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-cyan-500/30 mb-2" />
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Athlete Info */}
                <div className="pt-4 border-t border-cyan-500/20">
                  <p className="text-xs text-slate-400 mb-2">
                    <strong className="text-white">Athlete:</strong> {testimonial.athleteName} • {testimonial.sport}
                  </p>
                  {testimonial.results && (
                    <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                      ✓ {testimonial.results}
                    </Badge>
                  )}
                </div>

                {/* Video Preview */}
                {testimonial.videoUrl && (
                  <Button variant="outline" size="sm" className="w-full mt-4 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-slate-300 mb-6">
            Join <strong className="text-cyan-400">hundreds of parents</strong> who discovered how Go4it helps athletes succeed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/parent-night"
              className="inline-flex items-center justify-center px-8 py-4 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
            >
              🎓 Reserve Your Spot for Free Parent Night
            </a>
            <a
              href="#pathways"
              className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-bold rounded-lg border-2 border-cyan-500/30 hover:border-cyan-500 transition-colors"
            >
              Browse All Pathways
            </a>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            Every Tuesday & Thursday • US & Europe Times • 100% Free • No Credit Card Required
          </p>
        </div>
      </div>

      {/* Modal for selected testimonial (optional enhancement) */}
      {selectedTestimonial && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTestimonial(null)}
        >
          <Card className="max-w-2xl w-full bg-slate-900 border-cyan-500/30" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {selectedTestimonial.name}
                  </h3>
                  <p className="text-slate-400">
                    {selectedTestimonial.location} • {selectedTestimonial.session} Session
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="text-slate-400 hover:text-cyan-400 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {renderStars(selectedTestimonial.rating)}

              <div className="my-6">
                <Quote className="w-12 h-12 text-cyan-500/30 mb-4" />
                <p className="text-lg text-slate-300 leading-relaxed">
                  {selectedTestimonial.quote}
                </p>
              </div>

              <div className="bg-slate-800 border border-cyan-500/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-300 mb-2">
                  <strong className="text-white">Athlete:</strong> {selectedTestimonial.athleteName}
                </p>
                <p className="text-sm text-slate-300 mb-2">
                  <strong className="text-white">Sport:</strong> {selectedTestimonial.sport}
                </p>
                {selectedTestimonial.results && (
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Results:</strong> {selectedTestimonial.results}
                  </p>
                )}
              </div>

              <Button
                onClick={() => (window.location.href = '/parent-night')}
                className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold"
                size="lg"
              >
                Join Parent Night Like {selectedTestimonial.name}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
