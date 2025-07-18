'use client';

import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, TrendingUp, Award, Users, Target, BarChart3, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AthleteSkills {
  id: string;
  name: string;
  sport: string;
  position: string;
  country: string;
  age: number;
  skills: {
    technical: number;
    physical: number;
    tactical: number;
    mental: number;
    leadership: number;
    consistency: number;
    potential: number;
    gameIQ: number;
  };
  rankings: {
    national: number;
    regional: number;
    position: number;
  };
  color: string;
}

export default function AthleteComparisonPage() {
  const [selectedAthletes, setSelectedAthletes] = useState<AthleteSkills[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [availableAthletes, setAvailableAthletes] = useState<AthleteSkills[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Color palette for different athletes
  const colors = [
    '#8B5CF6', // Purple
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#F97316', // Orange
    '#EC4899', // Pink
    '#14B8A6', // Teal
  ];

  useEffect(() => {
    loadAvailableAthletes();
  }, []);

  const loadAvailableAthletes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/rankings?type=global&maxResults=50');
      const data = await response.json();
      
      if (data.success && data.athletes) {
        const athletesWithSkills = data.athletes.map((athlete: any, index: number) => ({
          id: athlete.id || `athlete-${index}`,
          name: athlete.name,
          sport: athlete.sport,
          position: athlete.position,
          country: athlete.country || 'Unknown',
          age: athlete.age || 18,
          skills: {
            technical: athlete.skills?.technical || Math.floor(Math.random() * 30) + 70,
            physical: athlete.skills?.physical || Math.floor(Math.random() * 30) + 70,
            tactical: athlete.skills?.tactical || Math.floor(Math.random() * 30) + 70,
            mental: athlete.skills?.mental || Math.floor(Math.random() * 30) + 70,
            leadership: athlete.skills?.leadership || Math.floor(Math.random() * 30) + 60,
            consistency: athlete.skills?.consistency || Math.floor(Math.random() * 30) + 65,
            potential: athlete.skills?.potential || Math.floor(Math.random() * 30) + 75,
            gameIQ: athlete.skills?.gameIQ || Math.floor(Math.random() * 30) + 70,
          },
          rankings: {
            national: athlete.rankings?.national || Math.floor(Math.random() * 500) + 1,
            regional: athlete.rankings?.regional || Math.floor(Math.random() * 100) + 1,
            position: athlete.rankings?.position || Math.floor(Math.random() * 50) + 1,
          },
          color: colors[index % colors.length]
        }));
        setAvailableAthletes(athletesWithSkills);
      }
    } catch (error) {
      console.error('Error loading athletes:', error);
      toast({
        title: "Error",
        description: "Failed to load athlete data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAthletes = availableAthletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = sportFilter === 'all' || athlete.sport.toLowerCase() === sportFilter.toLowerCase();
    return matchesSearch && matchesSport;
  });

  const addAthleteToComparison = (athlete: AthleteSkills) => {
    if (selectedAthletes.length >= 6) {
      toast({
        title: "Maximum Reached",
        description: "You can compare up to 6 athletes at once",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedAthletes.find(a => a.id === athlete.id)) {
      toast({
        title: "Already Selected",
        description: "This athlete is already in the comparison",
        variant: "destructive",
      });
      return;
    }

    setSelectedAthletes([...selectedAthletes, athlete]);
    toast({
      title: "Athlete Added",
      description: `${athlete.name} added to comparison`,
    });
  };

  const removeAthleteFromComparison = (athleteId: string) => {
    setSelectedAthletes(selectedAthletes.filter(a => a.id !== athleteId));
  };

  const prepareRadarData = () => {
    const skills = ['technical', 'physical', 'tactical', 'mental', 'leadership', 'consistency', 'potential', 'gameIQ'];
    
    return skills.map(skill => {
      const dataPoint: any = {
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        fullMark: 100,
      };
      
      selectedAthletes.forEach(athlete => {
        dataPoint[athlete.name] = athlete.skills[skill as keyof typeof athlete.skills];
      });
      
      return dataPoint;
    });
  };

  const getSkillAverage = (skill: keyof AthleteSkills['skills']) => {
    if (selectedAthletes.length === 0) return 0;
    const total = selectedAthletes.reduce((sum, athlete) => sum + athlete.skills[skill], 0);
    return Math.round(total / selectedAthletes.length);
  };

  const getTopPerformer = (skill: keyof AthleteSkills['skills']) => {
    if (selectedAthletes.length === 0) return null;
    return selectedAthletes.reduce((top, athlete) => 
      athlete.skills[skill] > top.skills[skill] ? athlete : top
    );
  };

  const sports = Array.from(new Set(availableAthletes.map(athlete => athlete.sport)));

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Athlete Skill Comparison</h1>
            <p className="text-slate-400">Compare multiple athletes' skills using interactive radar charts</p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <span className="text-sm text-slate-400">{selectedAthletes.length}/6 selected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Athlete Selection Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Select Athletes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filter */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="search" className="text-sm font-medium text-slate-300">Search Athletes</Label>
                    <Input
                      id="search"
                      placeholder="Search by name, sport, or position..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sport-filter" className="text-sm font-medium text-slate-300">Filter by Sport</Label>
                    <Select value={sportFilter} onValueChange={setSportFilter}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="All Sports" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sports</SelectItem>
                        {sports.map(sport => (
                          <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Available Athletes */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center p-4">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-sm text-slate-400 mt-2">Loading athletes...</p>
                    </div>
                  ) : filteredAthletes.length === 0 ? (
                    <div className="text-center p-4 text-slate-400">
                      <Search className="w-8 h-8 mx-auto mb-2" />
                      <p>No athletes found</p>
                    </div>
                  ) : (
                    filteredAthletes.map(athlete => (
                      <div
                        key={athlete.id}
                        className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                        onClick={() => addAthleteToComparison(athlete)}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-white">{athlete.name}</div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>{athlete.sport}</span>
                            <span>•</span>
                            <span>{athlete.position}</span>
                            <span>•</span>
                            <span>{athlete.country}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-600"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Radar Chart and Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Athletes */}
            {selectedAthletes.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Selected Athletes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedAthletes.map(athlete => (
                      <Badge
                        key={athlete.id}
                        variant="outline"
                        className="flex items-center gap-2 px-3 py-1 text-white border-slate-600"
                        style={{ borderColor: athlete.color }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: athlete.color }}
                        />
                        <span>{athlete.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-slate-700"
                          onClick={() => removeAthleteFromComparison(athlete.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Radar Chart */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Skill Comparison Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAthletes.length === 0 ? (
                  <div className="text-center p-12 text-slate-400">
                    <Target className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Athletes Selected</h3>
                    <p>Select athletes from the left panel to compare their skills</p>
                  </div>
                ) : (
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={prepareRadarData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" className="text-slate-300" />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 100]} 
                          className="text-slate-400"
                        />
                        {selectedAthletes.map(athlete => (
                          <Radar
                            key={athlete.id}
                            name={athlete.name}
                            dataKey={athlete.name}
                            stroke={athlete.color}
                            fill={athlete.color}
                            fillOpacity={0.1}
                            strokeWidth={2}
                          />
                        ))}
                        <Legend />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#ffffff'
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Analysis */}
            {selectedAthletes.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Skills Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(selectedAthletes[0].skills).map(skill => {
                      const topPerformer = getTopPerformer(skill as keyof AthleteSkills['skills']);
                      const average = getSkillAverage(skill as keyof AthleteSkills['skills']);
                      
                      return (
                        <div key={skill} className="bg-slate-700 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white capitalize">{skill}</h4>
                            <span className="text-sm text-slate-400">Avg: {average}</span>
                          </div>
                          {topPerformer && (
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-slate-300">
                                <span className="font-medium">{topPerformer.name}</span>
                                {' '}({topPerformer.skills[skill as keyof typeof topPerformer.skills]})
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}