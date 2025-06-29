'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, Calendar, Trophy, MessageSquare, Target, Plus, Settings } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  sport: string;
  division: string;
  season: string;
  year: number;
  homeVenue: string;
  teamColors: { primary: string; secondary: string };
  rosterCount: number;
  maxRosterSize: number;
  availableSpots: number;
  isActive: boolean;
}

const sports = [
  { value: 'flag_football', label: 'Flag Football', icon: '🏈' },
  { value: 'soccer', label: 'Soccer', icon: '⚽' },
  { value: 'basketball', label: 'Basketball', icon: '🏀' },
  { value: 'track_field', label: 'Track & Field', icon: '🏃‍♂️' }
];

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [newTeam, setNewTeam] = useState({
    name: '',
    sport: '',
    division: '',
    season: 'Fall',
    year: new Date().getFullYear(),
    homeVenue: '',
    maxRosterSize: 20
  });

  useEffect(() => {
    fetchTeams();
  }, [selectedSport]);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`/api/teams?role=coach${selectedSport !== 'all' ? `&sport=${selectedSport}` : ''}`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async () => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam)
      });

      if (response.ok) {
        fetchTeams();
        setIsCreateDialogOpen(false);
        setNewTeam({
          name: '',
          sport: '',
          division: '',
          season: 'Fall',
          year: new Date().getFullYear(),
          homeVenue: '',
          maxRosterSize: 20
        });
      }
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const getSportEmoji = (sport: string) => {
    const sportData = sports.find(s => s.value === sport);
    return sportData?.icon || '🏃‍♂️';
  };

  const getSportLabel = (sport: string) => {
    const sportData = sports.find(s => s.value === sport);
    return sportData?.label || sport;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Go4It Teams</h1>
          <p className="text-muted-foreground">Manage your teams across all sports</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Set up a new team for the current season
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                    placeholder="Thunder Bolts"
                  />
                </div>
                <div>
                  <Label htmlFor="sport">Sport</Label>
                  <Select value={newTeam.sport} onValueChange={(value) => setNewTeam({...newTeam, sport: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sports.map(sport => (
                        <SelectItem key={sport.value} value={sport.value}>
                          {sport.icon} {sport.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="division">Division</Label>
                  <Input
                    id="division"
                    value={newTeam.division}
                    onChange={(e) => setNewTeam({...newTeam, division: e.target.value})}
                    placeholder="U-16"
                  />
                </div>
                <div>
                  <Label htmlFor="season">Season</Label>
                  <Select value={newTeam.season} onValueChange={(value) => setNewTeam({...newTeam, season: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newTeam.year}
                    onChange={(e) => setNewTeam({...newTeam, year: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="venue">Home Venue</Label>
                <Input
                  id="venue"
                  value={newTeam.homeVenue}
                  onChange={(e) => setNewTeam({...newTeam, homeVenue: e.target.value})}
                  placeholder="Central Sports Complex"
                />
              </div>
              <div>
                <Label htmlFor="roster-size">Max Roster Size</Label>
                <Input
                  id="roster-size"
                  type="number"
                  value={newTeam.maxRosterSize}
                  onChange={(e) => setNewTeam({...newTeam, maxRosterSize: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createTeam} disabled={!newTeam.name || !newTeam.sport}>
                Create Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sport Filter */}
      <Tabs value={selectedSport} onValueChange={setSelectedSport}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Sports</TabsTrigger>
          <TabsTrigger value="flag_football">🏈 Flag Football</TabsTrigger>
          <TabsTrigger value="soccer">⚽ Soccer</TabsTrigger>
          <TabsTrigger value="basketball">🏀 Basketball</TabsTrigger>
          <TabsTrigger value="track_field">🏃‍♂️ Track & Field</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedSport} className="space-y-4">
          {teams.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">No Teams Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first team to start managing players, schedules, and performance
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Team
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teams.map(team => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push(`/teams/${team.id}`)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getSportEmoji(team.sport)}</span>
                        <div>
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <CardDescription>
                            {getSportLabel(team.sport)} • {team.division}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={team.isActive ? "default" : "secondary"}>
                        {team.season} {team.year}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Roster
                        </span>
                        <span className="font-medium">
                          {team.rosterCount}/{team.maxRosterSize}
                          {team.availableSpots > 0 && (
                            <span className="text-green-600 ml-1">
                              ({team.availableSpots} spots)
                            </span>
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Home Venue</span>
                        <span className="font-medium truncate ml-2">{team.homeVenue || 'TBD'}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Trophy className="h-4 w-4 mr-1" />
                          Stats
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      {teams.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Teams</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Active Players</p>
                  <p className="text-2xl font-bold">
                    {teams.reduce((sum, team) => sum + team.rosterCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sports</p>
                  <p className="text-2xl font-bold">
                    {new Set(teams.map(t => t.sport)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Available Spots</p>
                  <p className="text-2xl font-bold">
                    {teams.reduce((sum, team) => sum + team.availableSpots, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}