import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui/page-header';
import InteractiveSkillTree from '@/components/skill-tree/interactive-skill-tree';
import { useAuth } from '@/contexts/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Dumbbell, Sparkles, Zap } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

// Sports offered in the platform
const SPORTS = [
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'football', name: 'Football', icon: '🏈' },
  { id: 'soccer', name: 'Soccer', icon: '⚽' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'track', name: 'Track & Field', icon: '🏃' },
  { id: 'swimming', name: 'Swimming', icon: '🏊' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'golf', name: 'Golf', icon: '⛳' },
  { id: 'wrestling', name: 'Wrestling', icon: '🤼' }
];

function SkillTreePage() {
  const { user } = useAuth();
  const [selectedSport, setSelectedSport] = useState<string>(SPORTS[0].id);
  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(undefined);

  // Get user's preferred sport and position if available
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['/api/athlete-profile', user?.id],
    enabled: !!user?.id,
  });

  // Get user's skill tree stats
  const { data: skillStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/player/skill-stats', selectedSport],
    enabled: !!user?.id && !!selectedSport,
  });

  // Set default sport based on user profile
  React.useEffect(() => {
    if (userProfile?.primarySport) {
      setSelectedSport(userProfile.primarySport);
      if (userProfile.position) {
        setSelectedPosition(userProfile.position);
      }
    }
  }, [userProfile]);

  const handleSportChange = (sport: string) => {
    setSelectedSport(sport);
    // Reset position when changing sports
    setSelectedPosition(undefined);
  };

  const renderSportTabs = () => {
    return (
      <Tabs value={selectedSport} onValueChange={handleSportChange} className="w-full">
        <TabsList className="grid grid-flow-col auto-cols-fr w-full overflow-x-auto">
          {SPORTS.map(sport => (
            <TabsTrigger key={sport.id} value={sport.id} className="gap-2">
              <span>{sport.icon}</span>
              <span className="hidden md:inline">{sport.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  };

  const renderSkillsOverview = () => {
    if (isLoadingStats) {
      return (
        <div className="flex justify-center py-4">
          <Spinner size="md" />
        </div>
      );
    }

    // Default stats in case API doesn't return data
    const stats = skillStats || {
      totalSkills: 0,
      unlockedSkills: 0,
      masteredSkills: 0,
      totalXp: 0,
      skillsByCategory: []
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <Dumbbell className="w-4 h-4 mr-2 text-primary" />
              Total Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.unlockedSkills} / {stats.totalSkills}
            </div>
            <p className="text-sm text-muted-foreground">Skills unlocked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              Mastered Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.masteredSkills}
            </div>
            <p className="text-sm text-muted-foreground">Skills at max level</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <Zap className="w-4 h-4 mr-2 text-blue-500" />
              Total XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalXp.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Experience points earned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <Brain className="w-4 h-4 mr-2 text-purple-500" />
              Top Skill
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.skillsByCategory && stats.skillsByCategory.length > 0 ? (
              <>
                <div className="text-xl font-bold truncate">
                  {stats.skillsByCategory[0].category}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats.skillsByCategory[0].masteredCount} mastered skills
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No skills mastered yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Skill Tree"
        description="Visualize your athletic skill progression and unlock new abilities"
      >
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-primary border-primary">
            Interactive
          </Badge>
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Personalized
          </Badge>
          <Badge variant="outline" className="text-cyan-500 border-cyan-500">
            ADHD-Friendly
          </Badge>
        </div>
      </PageHeader>

      <div className="mt-6">
        {renderSportTabs()}
      </div>

      <div className="my-6">
        {renderSkillsOverview()}
      </div>

      <div className="my-6 bg-gray-900/30 rounded-xl border p-1">
        <InteractiveSkillTree 
          sportType={selectedSport} 
          position={selectedPosition}
        />
      </div>
    </div>
  );
}

export default SkillTreePage;