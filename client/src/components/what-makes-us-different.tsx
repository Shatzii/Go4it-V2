import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Medal, UserSearch, LineChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WhatMakesUsDifferentProps {
  showTitle?: boolean;
}

const features = [
  {
    icon: BrainCircuit,
    title: "Score Smarter.",
    description: "Get a 0–100 GAR Score backed by real data — physical, mental, and emotional. See your star rating (1–5) light up as you grow."
  },
  {
    icon: Medal,
    title: "Your Full Breakdown.",
    description: "From combine results to coachability and learning style — your GAR Analysis gives you the blueprint to train smarter and level up faster."
  },
  {
    icon: UserSearch,
    title: "Play Where You Belong.",
    description: "Our AI maps your unique traits to your perfect sport and position. Whether you're a striker or a safety, we'll show you your best fit."
  },
  {
    icon: LineChart,
    title: "Track Your Growth.",
    description: "See your progress visually with performance analytics and custom dashboards. Set goals, track achievements, and celebrate every milestone."
  }
];

export function WhatMakesUsDifferent({ showTitle = true }: WhatMakesUsDifferentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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
    const nextIndex = (currentIndex + 1) % features.length;
    scrollToIndex(nextIndex);
  };
  
  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + features.length) % features.length;
    scrollToIndex(prevIndex);
  };
  
  // Automatically scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);
  
  // Handle scroll events to update currentIndex
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
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
  }, [currentIndex]);

  return (
    <section className="py-16 border-t border-b border-gray-800 bg-black">
      {showTitle && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              What Makes Us
            </span> Different
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
      </div>
    </section>
  );
}