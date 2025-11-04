'use client';

import { useState } from 'react';
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
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            Parent Night Success Stories
          </Badge>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            What Parents Say About Our Tuesday/Thursday Sessions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real feedback from parents who attended our free Parent Night info sessions
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
            <div className="text-3xl font-black text-blue-600 mb-1">342</div>
            <div className="text-sm text-gray-600">Parents Last Week</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
            <div className="text-3xl font-black text-green-600 mb-1">4.9</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
            <div className="text-3xl font-black text-purple-600 mb-1">89%</div>
            <div className="text-sm text-gray-600">Enroll After Thursday</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
            <div className="text-3xl font-black text-orange-600 mb-1">100%</div>
            <div className="text-sm text-gray-600">Free Sessions</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedTestimonial(testimonial)}
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {testimonial.session}
                  </Badge>
                </div>

                {/* Rating */}
                <div className="mb-3">{renderStars(testimonial.rating)}</div>

                {/* Quote */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-blue-200 mb-2" />
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Athlete Info */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    <strong>Athlete:</strong> {testimonial.athleteName} • {testimonial.sport}
                  </p>
                  {testimonial.results && (
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                      ✓ {testimonial.results}
                    </Badge>
                  )}
                </div>

                {/* Video Preview */}
                {testimonial.videoUrl && (
                  <Button variant="outline" size="sm" className="w-full mt-4">
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
          <p className="text-lg text-gray-600 mb-6">
            Join <strong>hundreds of parents</strong> who discovered how Go4it helps athletes succeed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/parent-night"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              🎓 Reserve Your Spot for Free Parent Night
            </a>
            <a
              href="#pathways"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-lg border-2 border-gray-200 hover:border-blue-600 transition-colors"
            >
              Browse All Pathways
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Every Tuesday & Thursday • US & Europe Times • 100% Free • No Credit Card Required
          </p>
        </div>
      </div>

      {/* Modal for selected testimonial (optional enhancement) */}
      {selectedTestimonial && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTestimonial(null)}
        >
          <Card className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedTestimonial.name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedTestimonial.location} • {selectedTestimonial.session} Session
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {renderStars(selectedTestimonial.rating)}

              <div className="my-6">
                <Quote className="w-12 h-12 text-blue-200 mb-4" />
                <p className="text-lg text-gray-700 leading-relaxed">
                  {selectedTestimonial.quote}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Athlete:</strong> {selectedTestimonial.athleteName}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Sport:</strong> {selectedTestimonial.sport}
                </p>
                {selectedTestimonial.results && (
                  <p className="text-sm text-gray-600">
                    <strong>Results:</strong> {selectedTestimonial.results}
                  </p>
                )}
              </div>

              <Button
                onClick={() => (window.location.href = '/parent-night')}
                className="w-full"
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
