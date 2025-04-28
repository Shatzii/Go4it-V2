import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useParams, useLocation } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star, Users, Award, BadgeCheck, PlusCircle, Zap, RefreshCw } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const StarProfiles = () => {
  const [sortBy, setSortBy] = useState('currentStarLevel');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [standardizeDialogOpen, setStandardizeDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Fetch star profiles
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['/api/admin/star-profiles', { limit, offset, sortBy, sortDir }],
    queryFn: async () => {
      const res = await apiRequest(
        'GET', 
        `/api/admin/star-profiles?limit=${limit}&offset=${offset}&sortBy=${sortBy}&sortDir=${sortDir}`
      );
      return await res.json();
    }
  });

  // Standardize single profile mutation
  const standardizeProfileMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest('POST', `/api/admin/star-profiles/${userId}/standardize`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Profile Standardized',
        description: 'The profile has been standardized to Five-Star Athlete standards.'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/star-profiles'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Standardize',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Bulk standardize profiles mutation
  const bulkStandardizeProfilesMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/admin/star-profiles/bulk-standardize');
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Profiles Standardized',
        description: `Successfully standardized ${data.success} profiles. Failed: ${data.failed}`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/star-profiles'] });
      setStandardizeDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Standardize Profiles',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Format star level
  const formatStarLevel = (level: number) => {
    return Array(level).fill('⭐').join('');
  };

  // Get star level badge color
  const getStarLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-zinc-500 hover:bg-zinc-600';
      case 2: return 'bg-blue-500 hover:bg-blue-600';
      case 3: return 'bg-indigo-500 hover:bg-indigo-600';
      case 4: return 'bg-purple-500 hover:bg-purple-600';
      case 5: return 'bg-amber-500 hover:bg-amber-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  // Get rank badge color
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Rookie': return 'bg-slate-500';
      case 'Prospect': return 'bg-green-500';
      case 'Rising Star': return 'bg-blue-500';
      case 'All-Star': return 'bg-indigo-500';
      case 'MVP': return 'bg-purple-500';
      case 'Legend': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate time since last activity
  const timeSinceLastActivity = (date: string) => {
    const lastActivity = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastActivity.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffDays / 30)} months ago`;
    }
  };

  // Handle standardize button click
  const handleStandardize = (userId: number) => {
    standardizeProfileMutation.mutate(userId);
  };

  // Handle bulk standardize button click
  const handleBulkStandardize = () => {
    bulkStandardizeProfilesMutation.mutate();
  };

  // Handle profile click
  const handleProfileClick = (userId: number) => {
    setLocation(`/admin/star-profiles/${userId}`);
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Star Profile Manager</h1>
          <p className="text-muted-foreground">
            Manage athlete Star profiles with the Five-Star standard
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={standardizeDialogOpen} onOpenChange={setStandardizeDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" />
                Bulk Standardize
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Standardize All Profiles</DialogTitle>
                <DialogDescription>
                  This will standardize all profiles according to the Five-Star Athlete standard.
                  It will process all athlete profiles that don't currently meet the standard.
                </DialogDescription>
              </DialogHeader>
              <p>
                Standardizing profiles ensures:
              </p>
              <ul className="list-disc list-inside my-4 space-y-1">
                <li>Consistent Star level progression</li>
                <li>Proper XP tracking and rewards</li>
                <li>Achievement and badge integration</li>
                <li>Complete milestone tracking</li>
                <li>Sport-specific path customization</li>
              </ul>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStandardizeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleBulkStandardize}
                  disabled={bulkStandardizeProfilesMutation.isPending}
                >
                  {bulkStandardizeProfilesMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Standardize All Profiles
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="rounded-l-none"
            >
              Table
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Label htmlFor="sortBy">Sort By:</Label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="currentStarLevel">Star Level</SelectItem>
              <SelectItem value="xpTotal">XP Total</SelectItem>
              <SelectItem value="lastActivity">Last Activity</SelectItem>
              <SelectItem value="activeStreak">Active Streak</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
          >
            {sortDir === 'asc' ? '▲ Ascending' : '▼ Descending'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => offset > 0 && setOffset(offset - limit)}
            disabled={offset === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {offset + 1}-{offset + (profiles?.length || 0)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => profiles?.length === limit && setOffset(offset + limit)}
            disabled={profiles?.length < limit}
          >
            Next
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles?.map((profile: any) => (
            <Card 
              key={profile.userId} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleProfileClick(profile.userId)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarImage src={profile.profileImage || ''} alt={profile.fullName} />
                      <AvatarFallback>{profile.fullName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{profile.fullName}</CardTitle>
                      <CardDescription>@{profile.username}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStarLevelColor(profile.currentStarLevel)}>
                    {profile.currentStarLevel}-Star
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Rank:</span>{' '}
                    <Badge variant="outline" className={`${getRankColor(profile.currentRank)} text-white`}>
                      {profile.currentRank}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sport:</span>{' '}
                    <span className="font-medium">{profile.sportSpecialty}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">XP:</span>{' '}
                    <span className="font-medium">{profile.xpTotal.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Streak:</span>{' '}
                    <span className="font-medium">{profile.activeStreak} days</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Badges:</span>{' '}
                    <span className="font-medium">{profile.badgesEarned}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Focus:</span>{' '}
                    <span className="font-medium">{profile.currentFocus}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Next Milestone: {profile.nextMilestone}</span>
                    <span className="text-xs font-medium">{profile.completedDrills} drills</span>
                  </div>
                  <Progress value={30} className="h-1" /> 
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Last active: {timeSinceLastActivity(profile.lastActivity)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStandardize(profile.userId);
                  }}
                  disabled={standardizeProfileMutation.isPending}
                >
                  {standardizeProfileMutation.isPending && standardizeProfileMutation.variables === profile.userId && (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  )}
                  Standardize
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Athlete</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('currentStarLevel')}>
                  Star Level {sortBy === 'currentStarLevel' && (sortDir === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('xpTotal')}>
                  XP {sortBy === 'xpTotal' && (sortDir === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('activeStreak')}>
                  Streak {sortBy === 'activeStreak' && (sortDir === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('lastActivity')}>
                  Last Active {sortBy === 'lastActivity' && (sortDir === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((profile: any) => (
                <TableRow 
                  key={profile.userId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleProfileClick(profile.userId)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile.profileImage || ''} alt={profile.fullName} />
                        <AvatarFallback>{profile.fullName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{profile.fullName}</div>
                        <div className="text-xs text-muted-foreground">@{profile.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStarLevelColor(profile.currentStarLevel)}>
                      {profile.currentStarLevel}-Star
                    </Badge>
                  </TableCell>
                  <TableCell>{profile.xpTotal.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getRankColor(profile.currentRank)} text-white`}>
                      {profile.currentRank}
                    </Badge>
                  </TableCell>
                  <TableCell>{profile.sportSpecialty}</TableCell>
                  <TableCell>{profile.activeStreak} days</TableCell>
                  <TableCell>{timeSinceLastActivity(profile.lastActivity)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStandardize(profile.userId);
                      }}
                      disabled={standardizeProfileMutation.isPending}
                    >
                      {standardizeProfileMutation.isPending && standardizeProfileMutation.variables === profile.userId && (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      )}
                      Standardize
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default StarProfiles;