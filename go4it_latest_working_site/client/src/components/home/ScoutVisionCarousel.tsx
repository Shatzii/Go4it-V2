import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScoutVisionEntry {
  id: number;
  name: string;
  platform: string;
  url: string;
  followerCount: number;
  averageEngagement: number;
  sports: string[];
  contentQuality: number;
  relevanceScore: number;
  partnershipPotential: number;
  logoUrl: string;
  description: string;
}

export default function ScoutVisionCarousel() {
  const { data: scoutVisionData = [] } = useQuery<ScoutVisionEntry[]>({
    queryKey: ["/api/scout-vision"],
    queryFn: async () => {
      const response = await fetch('/api/scout-vision');
      if (!response.ok) {
        throw new Error('Failed to fetch Scout Vision data');
      }
      return response.json();
    }
  });

  // Format large numbers (e.g., 45,000)
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Format percentage (e.g., 12%)
  const formatPercentage = (decimal: number) => {
    return (decimal * 100).toFixed(0) + '%';
  };

  // Get platform icon class
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return 'text-red-500';
      case 'instagram':
        return 'text-pink-500';
      case 'tiktok':
        return 'text-cyan-500';
      case 'podcast':
        return 'text-purple-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Scout
          </span> Vision
        </h2>
        <Button asChild variant="ghost" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
          <Link href="/scout-vision">View All <ChevronRight className="h-4 w-4" /></Link>
        </Button>
      </div>

      {scoutVisionData.length > 0 ? (
        <div className="relative">
          {/* Left Shadow Overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none"></div>
          
          {/* Right Shadow Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none"></div>
          
          {/* Carousel - Mobile Friendly */}
          <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 md:gap-6 min-w-max">
              {scoutVisionData.map((entry) => (
                <Card 
                  key={entry.id} 
                  className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] overflow-hidden border border-gray-800 bg-black shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                >
                  <CardHeader className="pb-2 pt-3 px-3 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={entry.logoUrl}
                          alt={entry.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                        />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base text-white truncate">{entry.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-bold capitalize ${getPlatformIcon(entry.platform)}`}>
                            {entry.platform}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-2 px-3">
                    <p className="text-xs text-gray-300 mb-3 line-clamp-2 h-8">
                      {entry.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-800">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">FOLLOWERS</span>
                        <span className="text-xs text-white">{formatNumber(entry.followerCount)}</span>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="text-xs text-gray-400">ENGAGE</span>
                        <span className="text-xs text-white">{formatPercentage(entry.averageEngagement)}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-xs text-gray-400">QUALITY</span>
                        <span className="text-xs text-cyan-400 font-bold">
                          {entry.contentQuality}/100
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2 max-h-10 overflow-hidden">
                      {entry.sports.map((sport, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="text-[0.65rem] px-1.5 py-0 h-5 border-blue-800 text-blue-400"
                        >
                          {sport}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-0 px-3 pb-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                      onClick={() => window.open(entry.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" /> Visit
                    </Button>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300"></div>
                      <span className="text-xs text-blue-400">
                        {entry.partnershipPotential > 90 ? "Top Partner" : 
                         entry.partnershipPotential > 80 ? "Recommended" : "Potential"}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.min(Math.ceil(scoutVisionData.length / 4), 3) }).map((_, i) => (
              <div 
                key={i} 
                className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-gray-700'} transition-all duration-300`}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center p-12 border border-gray-800 rounded-lg bg-black/50">
          <p className="text-gray-400">No Scout Vision data available</p>
        </div>
      )}
    </section>
  );
}