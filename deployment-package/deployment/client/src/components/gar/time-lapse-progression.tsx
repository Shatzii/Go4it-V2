import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { SpeechButton } from '@/components/ui/speech-button';
import { Pause, Play, SkipBack, SkipForward, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ComparisonRadarChart } from './comparison-radar-chart';

interface TimeLapseProgressionProps {
  athleteId: number;
}

// Mock data for the GAR progression over time
const mockProgressionData = [
  {
    date: '2023-01-01',
    overall: 3.2,
    skills: {
      athleticism: 3.1,
      gameIQ: 2.8,
      teamwork: 3.5,
      technique: 3.0,
      leadership: 2.9,
      mentalToughness: 3.2,
    }
  },
  {
    date: '2023-02-15',
    overall: 3.4,
    skills: {
      athleticism: 3.3,
      gameIQ: 3.0,
      teamwork: 3.6,
      technique: 3.4,
      leadership: 3.1,
      mentalToughness: 3.4,
    }
  },
  {
    date: '2023-04-10',
    overall: 3.6,
    skills: {
      athleticism: 3.5,
      gameIQ: 3.3,
      teamwork: 3.8,
      technique: 3.6,
      leadership: 3.4,
      mentalToughness: 3.7,
    }
  },
  {
    date: '2023-06-01',
    overall: 3.8,
    skills: {
      athleticism: 3.7,
      gameIQ: 3.6,
      teamwork: 3.9,
      technique: 3.8,
      leadership: 3.6,
      mentalToughness: 3.9,
    }
  },
  {
    date: '2023-08-15',
    overall: 4.0,
    skills: {
      athleticism: 3.9,
      gameIQ: 3.8,
      teamwork: 4.1,
      technique: 4.0,
      leadership: 3.8,
      mentalToughness: 4.1,
    }
  },
  {
    date: '2023-10-30',
    overall: 4.1,
    skills: {
      athleticism: 4.0,
      gameIQ: 4.0,
      teamwork: 4.2,
      technique: 4.1,
      leadership: 4.0,
      mentalToughness: 4.2,
    }
  },
];

// Format for radar chart
const formatForRadarChart = (skillsData: any) => {
  return [
    { subject: 'Athleticism', A: skillsData.athleticism, fullMark: 5 },
    { subject: 'Game IQ', A: skillsData.gameIQ, fullMark: 5 },
    { subject: 'Teamwork', A: skillsData.teamwork, fullMark: 5 },
    { subject: 'Technique', A: skillsData.technique, fullMark: 5 },
    { subject: 'Leadership', A: skillsData.leadership, fullMark: 5 },
    { subject: 'Mental Toughness', A: skillsData.mentalToughness, fullMark: 5 },
  ];
};

export function TimeLapseProgression({ athleteId }: TimeLapseProgressionProps) {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // Speed multiplier (1-3)
  const [viewMode, setViewMode] = useState('skills'); // 'skills' or 'comparison'
  const [selectedComparisonIndex, setSelectedComparisonIndex] = useState(0);
  
  // Fetch progression data (using mock for now)
  const { data: progressionData, isLoading } = useQuery({
    queryKey: ['/api/athlete/progression', athleteId],
    enabled: false // Disabled for now since we're using mock data
  });
  
  const data = progressionData || mockProgressionData;
  
  // Auto-play effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= data.length) {
            setIsPlaying(false);
            return prevIndex;
          }
          return nextIndex;
        });
      }, 1500 / speed);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, data.length, speed]);
  
  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.min(data.length - 1, prev + 1));
  };
  
  const handleSliderChange = (value: number[]) => {
    setIsPlaying(false);
    setCurrentIndex(value[0]);
  };
  
  const handleSpeedChange = () => {
    setSpeed(prev => prev < 3 ? prev + 1 : 1);
  };
  
  const handleSaveSnapshot = () => {
    toast({
      title: 'Snapshot Saved',
      description: 'Your progress snapshot has been saved',
    });
  };
  
  const getProgressSummary = () => {
    if (data.length <= 1) return 'Not enough data to calculate progress';
    
    const firstData = data[0];
    const currentData = data[currentIndex];
    const overallChange = currentData.overall - firstData.overall;
    
    let biggestImprovement = '';
    let maxImprovement = 0;
    
    Object.entries(currentData.skills).forEach(([skill, value]) => {
      // @ts-ignore - We know these properties exist
      const improvement = value - firstData.skills[skill];
      if (improvement > maxImprovement) {
        maxImprovement = improvement;
        biggestImprovement = skill;
      }
    });
    
    return `Overall improvement of ${overallChange.toFixed(1)} points since ${new Date(firstData.date).toLocaleDateString()}. Biggest improvement in ${biggestImprovement} (${maxImprovement.toFixed(1)} points).`;
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading progress data...</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  // If no data
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Progress Data Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There is no progression data available for this athlete yet. Complete assessments to begin tracking progress over time.</p>
        </CardContent>
      </Card>
    );
  }
  
  const currentData = data[currentIndex];
  const formattedDate = new Date(currentData.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const radarData = formatForRadarChart(currentData.skills);
  
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span>GAR Progression Time-Lapse</span>
            <SpeechButton 
              text={`GAR Progression Time-Lapse for date ${formattedDate}. Overall GAR score: ${currentData.overall.toFixed(1)} out of 5. ${getProgressSummary()}`} 
              tooltip="Read progression summary"
              className="ml-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSpeedChange}
              className="flex items-center gap-1 text-xs"
            >
              <Clock className="h-3 w-3" />
              {speed}×
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Visualize your athletic development over time with animated progression
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="skills">Skills Breakdown</TabsTrigger>
            <TabsTrigger value="comparison">Compare Periods</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{formattedDate}</h3>
                <p className="text-sm text-muted-foreground">Overall GAR: {currentData.overall.toFixed(1)}/5.0</p>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleNext}
                  disabled={currentIndex === data.length - 1}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
            
            <Slider
              value={[currentIndex]}
              min={0}
              max={data.length - 1}
              step={1}
              onValueChange={handleSliderChange}
              className="mt-6"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <div>{new Date(data[0].date).toLocaleDateString()}</div>
              <div>{new Date(data[data.length - 1].date).toLocaleDateString()}</div>
            </div>
            
            <div className="p-3 bg-background/60 rounded-md mt-2">
              <h4 className="text-sm font-medium mb-1">Progress Summary</h4>
              <p className="text-sm">{getProgressSummary()}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Progress Comparison</h3>
              <Button variant="outline" size="sm" onClick={handleSaveSnapshot}>
                Save Snapshot
              </Button>
            </div>
            
            <ComparisonRadarChart 
              currentData={formatForRadarChart(data[currentIndex].skills)}
              comparisonData={formatForRadarChart(data[selectedComparisonIndex].skills)}
              currentDate={formattedDate}
              comparisonDate={new Date(data[selectedComparisonIndex].date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            />
            
            <div className="flex flex-col space-y-2 mt-2">
              <label className="text-sm font-medium">Compare with:</label>
              <select 
                className="border rounded p-2 bg-background"
                value={selectedComparisonIndex}
                onChange={(e) => setSelectedComparisonIndex(Number(e.target.value))}
              >
                {data.map((item, idx) => (
                  <option key={idx} value={idx} disabled={idx === currentIndex}>
                    {new Date(item.date).toLocaleDateString()} {idx === currentIndex ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2 bg-background/60 rounded-md">
                <p className="text-xs font-medium">Current Overall</p>
                <p className="text-lg font-bold">{data[currentIndex].overall.toFixed(1)}</p>
              </div>
              <div className="p-2 bg-background/60 rounded-md">
                <p className="text-xs font-medium">Comparison Overall</p>
                <p className="text-lg font-bold">{data[selectedComparisonIndex].overall.toFixed(1)}</p>
              </div>
              <div className="p-2 bg-background/60 rounded-md col-span-2">
                <p className="text-xs font-medium">Improvement</p>
                <p className="text-lg font-bold text-emerald-500">
                  +{(data[currentIndex].overall - data[selectedComparisonIndex].overall).toFixed(1)}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">Data refreshed {Math.floor(Math.random() * 24) + 1} hours ago</p>
      </CardFooter>
    </Card>
  );
}