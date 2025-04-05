import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Medal, UserSearch, LineChart, ChevronLeft, ChevronRight, Cpu, BadgeCheck, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "../contexts/auth-context";
import { useQuery } from "@tanstack/react-query";

interface WhatMakesUsDifferentProps {
  showTitle?: boolean;
  showHeroSection?: boolean;
}

interface ContentBlock {
  id: number;
  title: string;
  content: string;
  section: string;
  identifier: string;
  order: number | null;
  active: boolean | null;
  metadata: {
    iconName?: string;
    backgroundColor?: string;
  } | null;
  lastUpdated: string | null;
  lastUpdatedBy: number | null;
}

// Icon mapping object
const iconMap: Record<string, any> = {
  'cpu': Cpu,
  'badge-check': BadgeCheck,
  'users': Users,
  'trending-up': TrendingUp,
  'brain-circuit': BrainCircuit,
  'medal': Medal,
  'user-search': UserSearch,
  'line-chart': LineChart
};

// Define a feature type for type safety
interface Feature {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  backgroundColor: string;
}

export function WhatMakesUsDifferent({ showTitle = true, showHeroSection = true }: WhatMakesUsDifferentProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch content blocks from the API
  const { data: contentBlocks, isLoading, isError } = useQuery({
    queryKey: ['/api/content-blocks/section'],
    queryFn: async () => {
      const response = await fetch('/api/content-blocks/section/what-makes-us-different');
      if (!response.ok) {
        throw new Error('Failed to fetch content blocks');
      }
      return response.json() as Promise<ContentBlock[]>;
    }
  });
  
  // Create features array from content blocks or use fallback if not loaded yet
  const features: Feature[] = React.useMemo(() => {
    if (!contentBlocks || contentBlocks.length === 0) {
      return [
        {
          icon: Cpu,
          title: "AI Motion Analysis",
          description: "Our cutting-edge AI technology analyzes your motion mechanics with professional-grade accuracy.",
          backgroundColor: 'bg-blue-100'
        },
        {
          icon: BadgeCheck,
          title: "Verified Combines",
          description: "Participate in certified athletic combines where your performance metrics are verified by professionals.",
          backgroundColor: 'bg-green-100'
        }
      ];
    }

    return contentBlocks.map(block => {
      // Get the icon from the metadata or use a default
      const IconComponent = block.metadata?.iconName 
        ? iconMap[block.metadata.iconName] 
        : BrainCircuit;
        
      return {
        icon: IconComponent,
        title: block.title,
        description: block.content,
        backgroundColor: block.metadata?.backgroundColor || 'bg-blue-100'
      };
    });
  }, [contentBlocks]);
  
  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cards = container.querySelectorAll('.feature-card');
    if (cards.length <= index) return;
    
    cards[index].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
    
    setCurrentIndex(index);
  };
  
  const handleNext = () => {
    if (features.length === 0) return;
    const nextIndex = (currentIndex + 1) % features.length;
    scrollToIndex(nextIndex);
  };
  
  const handlePrev = () => {
    if (features.length === 0) return;
    const prevIndex = (currentIndex - 1 + features.length) % features.length;
    scrollToIndex(prevIndex);
  };
  
  // Removed auto-scrolling to prevent disruption of user experience
  // Manual scrolling is still available through navigation buttons and dots
  
  // Handle scroll events to update currentIndex
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || features.length === 0) return;
    
    const handleScroll = () => {
      const containerWidth = container.clientWidth;
      const scrollPosition = container.scrollLeft;
      const newIndex = Math.round(scrollPosition / containerWidth);
      if (newIndex !== currentIndex && newIndex < features.length) {
        setCurrentIndex(newIndex);
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, features.length]);

  return (
    <section className="py-16 border-t border-b border-gray-800 bg-black">
      {/* Hero Section */}
      {showHeroSection && (
        <div className="text-center mb-14">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            GET VERIFIED
          </h1>
          <h2 className="text-3xl font-semibold text-white mb-3">
            GAR Rating System
          </h2>
          <p className="text-xl text-blue-400 max-w-3xl mx-auto">
            The Ultimate AI-Powered Athlete Evaluation Framework
          </p>
          
          <p className="text-xl mt-4 mb-0 max-w-3xl mx-auto text-gray-300">
            Our revolutionary GAR Rating System uses artificial intelligence to analyze
            physical metrics, cognitive abilities, and psychological factors for the most 
            comprehensive athlete evaluation available.
          </p>
        </div>
      )}

      {/* Feature Title */}
      {showTitle && !showHeroSection && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              The GAR
            </span> Rating System
          </h2>
        </div>
      )}

      <div className="container mx-auto px-4 relative">
        {/* Left Shadow Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
            
        {/* Right Shadow Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        
        {/* Previous Button */}
        <Button 
          onClick={handlePrev} 
          variant="ghost" 
          size="icon" 
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-gray-900/50 hover:bg-gray-800/80 text-gray-200 h-10 w-10 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        {/* Next Button */}
        <Button 
          onClick={handleNext} 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-gray-900/50 hover:bg-gray-800/80 text-gray-200 h-10 w-10 rounded-full"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        
        {/* Horizontal Carousel */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="feature-card flex-shrink-0 w-[280px] md:w-[350px] border border-gray-800 bg-gray-950 shadow-lg transform transition-all duration-300 snap-center hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="section-icon flex-shrink-0 w-24 h-24 relative my-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full backdrop-blur-sm"></div>
                        <Icon className="w-full h-full p-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                      </div>
                      <div className="section-content">
                        <h3 className="section-title text-2xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="section-text text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        {/* Navigation Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {features.map((_, index) => (
            <button 
              key={index} 
              onClick={() => scrollToIndex(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-blue-400 w-4' : 'bg-gray-700'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10">
          {!user ? (
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] text-lg font-semibold">
              <Link href="/auth">Get Verified Today</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] text-lg font-semibold">
              <Link href="/dashboard">View My GAR Rating</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}