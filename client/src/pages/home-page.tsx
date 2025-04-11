import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ChevronRight, Clock, Trophy, Calendar, Video, Award, CheckCircle, MapPin } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { motion } from "framer-motion";
import { WhatMakesUsDifferent } from "@/components/what-makes-us-different";
import FeaturedCombines from "@/components/home/FeaturedCombines";
import FeaturedBlogPosts from "@/components/home/FeaturedBlogPosts";
import ScoutVisionCarousel from "@/components/home/ScoutVisionCarousel";
import SimpleFeatureCommercial from "@/components/home/SimpleFeatureCommercial";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  coverImage: string | null;
  authorId: number;
  category: string;
  publishDate: string;
  featured: boolean;
  slug: string;
  tags: string[];
}

interface ContentBlock {
  id: number;
  title: string;
  content: string;
  section: string;
  identifier: string;
  order: number | null;
  active: boolean | null;
  metadata: Record<string, any> | null;
  lastUpdated: string | null;
  lastUpdatedBy: number | null;
}

interface FeaturedAthlete {
  id: number;
  userId: number;
  coverImage: string;
  featuredVideo: string | null;
  highlightText: string;
  sportPosition: string;
  starRating: number;
  featuredStats: Record<string, any> | null;
  featuredDate: string;
  order: number;
  active: boolean;
  name: string;
  username: string;
  profileImage: string;
}

export default function HomePage() {
  const { user } = useAuth();
  // We don't need activeTab state anymore since the Community section has been simplified
  // and blogPosts are being handled in FeaturedBlogPosts component
  
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: contentBlocks = [] } = useQuery<ContentBlock[]>({
    queryKey: ["/api/content-blocks/section/what-makes-us-different"],
  });

  // Blog posts are now being fetched from FeaturedBlogPosts component

  const { data: featuredAthletes = [] } = useQuery<FeaturedAthlete[]>({
    queryKey: ["/api/featured-athletes"],
    queryFn: async () => {
      const response = await fetch('/api/featured-athletes?limit=8');
      if (!response.ok) {
        throw new Error('Failed to fetch featured athletes');
      }
      return response.json();
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Convert 1-100 GAR score to a visual representation
  const renderStarRating = (rating: number) => {
    // Calculate how many full stars to show based on GAR score (1-100 scale)
    const normalizedRating = Math.min(5, Math.max(0, Math.round(rating / 20)));
    
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < normalizedRating 
              ? "text-cyan-400 fill-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" 
              : "text-gray-700"
          }`}
        />
      ));
  };

  return (
    <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
      {/* Mobile-optimized Hero and What Makes Us Different Section */}
      <WhatMakesUsDifferent showHeroSection={true} showTitle={false} />
      
      {/* Animated Commercial Explaining Site Features - Only for non-authenticated users */}
      {!user && (
        <section className="py-8 my-12 border-t border-b border-gray-800 bg-black/60 rounded-lg">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Explore Go4It
              </span> Features
            </h2>
            <p className="text-lg text-blue-300 mt-1">Discover what makes our platform unique</p>
          </div>
          <SimpleFeatureCommercial />
        </section>
      )}
      
      {/* Featured Athletes Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Top Verified
            </span> Athletes
          </h2>
          <Button variant="ghost" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {featuredAthletes.length > 0 ? (
          <div className="relative">
            {/* Left Shadow Overlay */}
            <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none"></div>
            
            {/* Right Shadow Overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none"></div>
            
            {/* Carousel - Mobile Friendly */}
            <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              <div className="flex gap-3 md:gap-6 min-w-max">
                {featuredAthletes.map((athlete) => (
                  <Card 
                    key={athlete.id} 
                    className="flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px] overflow-hidden border border-gray-800 bg-black shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={athlete.coverImage}
                        alt={athlete.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-md py-1 px-2 text-xs text-white font-bold shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>VERIFIED</span>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2 pt-3 px-3 border-b border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={athlete.profileImage}
                            alt={athlete.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.5)] border border-white">
                            {athlete.starRating}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base text-white truncate">{athlete.name}</CardTitle>
                          <p className="text-xs text-blue-400 font-medium truncate">{athlete.sportPosition}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStarRating(athlete.starRating)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="py-2 px-3">
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-800">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400">SPORT</span>
                          <span className="text-xs text-white">{athlete.sportPosition.split(' ')[0]}</span>
                        </div>
                        <div className="flex flex-col text-center">
                          <span className="text-xs text-gray-400">POSITION</span>
                          <span className="text-xs text-white">{athlete.sportPosition.split(' ').slice(1).join(' ')}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-xs text-gray-400">GAR</span>
                          <span className="text-xs text-cyan-400 font-bold">
                            {athlete.starRating}/100
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-0 px-3 pb-3">
                      <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                        <Link href={`/profile/${athlete.userId}`}>View Profile</Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                        disabled={!athlete.featuredVideo}
                      >
                        <Video className="h-3 w-3" /> Highlights
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.min(Math.ceil(featuredAthletes.length / 4), 3) }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-gray-700'} transition-all duration-300`}
                ></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center p-12 border border-gray-800 rounded-lg bg-black/50">
            <p className="text-gray-400">No featured athletes available</p>
          </div>
        )}
      </section>

      {/* Scout Vision Section */}
      <ScoutVisionCarousel />

      {/* Upcoming Combines Section */}
      <FeaturedCombines />

      {/* Blog Posts Section */}
      <FeaturedBlogPosts />

      {/* Community Section - Horizontal Carousel */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Community
            </span> Forum
          </h2>
          <Button asChild variant="ghost" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
            <Link href="/community">View Community <ChevronRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="relative">
          {/* Left Shadow Overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none"></div>
          
          {/* Right Shadow Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none"></div>
          
          {/* Introduction Card */}
          <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            <div className="flex gap-4 min-w-max">
              {/* Introduction Card - Fixed at the beginning */}
              <Card className="flex-shrink-0 w-[280px] md:w-[300px] border border-gray-800 bg-black shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Join the Conversation</CardTitle>
                  <CardDescription>
                    Connect with athletes, coaches, and parents in our community forum.
                    Share experiences and build your network.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Forum Cards - Scrollable */}
              <div className="flex-shrink-0 w-[280px] md:w-[300px] border border-gray-800 rounded-lg p-4 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 bg-black">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Athletes</Badge>
                </div>
                <h3 className="text-lg text-white mb-2">Training & Development</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Share your training routines, progress, and goals with other athletes.
                </p>
                <Button asChild variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                  <Link href="/community/athletes">Join Discussion</Link>
                </Button>
              </div>
              
              <div className="flex-shrink-0 w-[280px] md:w-[300px] border border-gray-800 rounded-lg p-4 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 bg-black">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Coaches</Badge>
                </div>
                <h3 className="text-lg text-white mb-2">Coaching Strategies</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Exchange coaching tips, drills, and management strategies.
                </p>
                <Button asChild variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                  <Link href="/community/coaches">Join Discussion</Link>
                </Button>
              </div>
              
              <div className="flex-shrink-0 w-[280px] md:w-[300px] border border-gray-800 rounded-lg p-4 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 bg-black">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Parents</Badge>
                </div>
                <h3 className="text-lg text-white mb-2">Parent Support Network</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Connect with other parents about supporting your young athletes.
                </p>
                <Button asChild variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                  <Link href="/community/parents">Join Discussion</Link>
                </Button>
              </div>

              <div className="flex-shrink-0 w-[280px] md:w-[300px] border border-gray-800 rounded-lg p-4 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 bg-black">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Events</Badge>
                </div>
                <h3 className="text-lg text-white mb-2">Local Sports Events</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Find and discuss local games, tournaments, and community sports events.
                </p>
                <Button asChild variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                  <Link href="/community/events">Join Discussion</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-gray-700'} transition-all duration-300`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to Elevate Your Athletic Journey?</h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of athletes who have discovered their potential and connected with coaches through our platform.
        </p>
        {!user ? (
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/auth">Get Started Today</Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        )}
      </section>
    </div>
  );
}