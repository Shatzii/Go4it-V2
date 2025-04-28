import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  ArrowLeft, 
  Star, 
  Trophy, 
  Zap, 
  Badge, 
  Award, 
  Calendar, 
  Clock, 
  Target, 
  User, 
  Mail, 
  Dumbbell, 
  Save,
  Trash,
  Eye,
  EyeOff,
  Plus
} from 'lucide-react';

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const StarProfileDetail = () => {
  const { userId } = useParams();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [addAchievementDialogOpen, setAddAchievementDialogOpen] = useState(false);
  const [addBadgeDialogOpen, setAddBadgeDialogOpen] = useState(false);
  
  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: [`/api/admin/star-profiles/${userId}`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/admin/star-profiles/${userId}`);
      const data = await res.json();
      // Initialize form data when profile is loaded
      setFormData(data.profile);
      return data;
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PUT', `/api/admin/star-profiles/${userId}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Profile Updated',
        description: 'The Star profile has been updated successfully.'
      });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/star-profiles/${userId}`] });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Update',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Standardize profile mutation
  const standardizeProfileMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/admin/star-profiles/${userId}/standardize`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Profile Standardized',
        description: 'The profile has been standardized to Five-Star Athlete standards.'
      });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/star-profiles/${userId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Standardize',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (name: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setFormData({
        ...formData,
        [name]: numValue
      });
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    setFormData(profile?.profile);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
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

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setLocation('/admin/star-profiles')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profiles
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>
              The requested Star profile could not be found.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setLocation('/admin/star-profiles')}>
              Return to Profiles
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => setLocation('/admin/star-profiles')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profiles
          </Button>
          <h1 className="text-3xl font-bold ml-4">Star Profile: {profile.user.firstName} {profile.user.lastName}</h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={updateProfileMutation.isPending}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => standardizeProfileMutation.mutate()}
                disabled={standardizeProfileMutation.isPending}
              >
                {standardizeProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Standardize
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle>Athlete Profile</CardTitle>
                <UIBadge className={getStarLevelColor(profile.profile.currentStarLevel)}>
                  {profile.profile.currentStarLevel}-Star
                </UIBadge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-24 w-24 mb-3 border-2 border-primary">
                  <AvatarImage src={profile.user.profileImage || ''} alt={`${profile.user.firstName} ${profile.user.lastName}`} />
                  <AvatarFallback>{profile.user.firstName?.substring(0, 1)}{profile.user.lastName?.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{profile.user.firstName} {profile.user.lastName}</h3>
                <p className="text-muted-foreground">@{profile.user.username}</p>
                <UIBadge variant="outline" className={`${getRankColor(profile.profile.currentRank)} text-white mt-2`}>
                  {profile.profile.currentRank}
                </UIBadge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Username:</span>
                  <span className="font-medium">{profile.user.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{profile.user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Sport:</span>
                  <span className="font-medium">{profile.profile.sportSpecialty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Focus:</span>
                  <span className="font-medium">{profile.profile.currentFocus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">XP Total:</span>
                  <span className="font-medium">{profile.profile.xpTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Streak:</span>
                  <span className="font-medium">{profile.profile.activeStreak} days (Max: {profile.profile.longestStreak})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Badges:</span>
                  <span className="font-medium">{profile.profile.badgesEarned}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Achievements:</span>
                  <span className="font-medium">{profile.profile.achievementsUnlocked}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Drills Completed:</span>
                  <span className="font-medium">{profile.profile.completedDrills}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Training Time:</span>
                  <span className="font-medium">{formatTime(profile.profile.preferredTrainingTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Weekly Minutes:</span>
                  <span className="font-medium">{profile.profile.weeklyTrainingMinutes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Activity:</span>
                  <span className="font-medium">{formatDate(profile.profile.lastActivity)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {profile.profile.profilePublic ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-muted-foreground">Profile:</span>
                  <span className="font-medium">{profile.profile.profilePublic ? 'Public' : 'Private'}</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Next Milestone Progress</h4>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span>Current: {profile.profile.currentStarLevel}-Star</span>
                  <span>Next: {profile.profile.nextMilestone}</span>
                </div>
                <Progress value={30} className="h-1 mb-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Profile Details</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="workouts">Workouts</TabsTrigger>
              <TabsTrigger value="path">Star Path</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    {isEditing ? 'Edit profile details below' : 'View and manage athlete profile details'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentStarLevel">Star Level</Label>
                          <Select 
                            value={formData.currentStarLevel.toString()} 
                            onValueChange={(value) => handleNumberChange('currentStarLevel', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select star level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1-Star</SelectItem>
                              <SelectItem value="2">2-Star</SelectItem>
                              <SelectItem value="3">3-Star</SelectItem>
                              <SelectItem value="4">4-Star</SelectItem>
                              <SelectItem value="5">5-Star</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="currentRank">Rank</Label>
                          <Select 
                            value={formData.currentRank} 
                            onValueChange={(value) => handleSelectChange('currentRank', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select rank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Rookie">Rookie</SelectItem>
                              <SelectItem value="Prospect">Prospect</SelectItem>
                              <SelectItem value="Rising Star">Rising Star</SelectItem>
                              <SelectItem value="All-Star">All-Star</SelectItem>
                              <SelectItem value="MVP">MVP</SelectItem>
                              <SelectItem value="Legend">Legend</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="xpTotal">XP Total</Label>
                          <Input 
                            id="xpTotal"
                            name="xpTotal"
                            type="number"
                            value={formData.xpTotal}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="activeStreak">Active Streak (Days)</Label>
                          <Input 
                            id="activeStreak"
                            name="activeStreak"
                            type="number"
                            value={formData.activeStreak}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="longestStreak">Longest Streak (Days)</Label>
                          <Input 
                            id="longestStreak"
                            name="longestStreak"
                            type="number"
                            value={formData.longestStreak}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="nextMilestone">Next Milestone</Label>
                          <Select 
                            value={formData.nextMilestone} 
                            onValueChange={(value) => handleSelectChange('nextMilestone', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select next milestone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Rising Prospect">Rising Prospect</SelectItem>
                              <SelectItem value="Skilled Athlete">Skilled Athlete</SelectItem>
                              <SelectItem value="Elite Performer">Elite Performer</SelectItem>
                              <SelectItem value="Star Athlete">Star Athlete</SelectItem>
                              <SelectItem value="Five-Star Athlete">Five-Star Athlete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="currentFocus">Current Focus</Label>
                          <Input 
                            id="currentFocus"
                            name="currentFocus"
                            value={formData.currentFocus}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sportSpecialty">Sport Specialty</Label>
                          <Select 
                            value={formData.sportSpecialty} 
                            onValueChange={(value) => handleSelectChange('sportSpecialty', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sport" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basketball">Basketball</SelectItem>
                              <SelectItem value="football">Football</SelectItem>
                              <SelectItem value="soccer">Soccer</SelectItem>
                              <SelectItem value="baseball">Baseball</SelectItem>
                              <SelectItem value="volleyball">Volleyball</SelectItem>
                              <SelectItem value="track">Track & Field</SelectItem>
                              <SelectItem value="swimming">Swimming</SelectItem>
                              <SelectItem value="tennis">Tennis</SelectItem>
                              <SelectItem value="golf">Golf</SelectItem>
                              <SelectItem value="wrestling">Wrestling</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="preferredTrainingTime">Preferred Training Time</Label>
                          <Input 
                            id="preferredTrainingTime"
                            name="preferredTrainingTime"
                            type="time"
                            value={formData.preferredTrainingTime}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="weeklyTrainingMinutes">Weekly Training Minutes</Label>
                          <Input 
                            id="weeklyTrainingMinutes"
                            name="weeklyTrainingMinutes"
                            type="number"
                            value={formData.weeklyTrainingMinutes}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="badgesEarned">Badges Earned</Label>
                          <Input 
                            id="badgesEarned"
                            name="badgesEarned"
                            type="number"
                            value={formData.badgesEarned}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="achievementsUnlocked">Achievements Unlocked</Label>
                          <Input 
                            id="achievementsUnlocked"
                            name="achievementsUnlocked"
                            type="number"
                            value={formData.achievementsUnlocked}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="profilePublic" 
                          checked={formData.profilePublic} 
                          onCheckedChange={(checked) => handleSwitchChange('profilePublic', checked)}
                        />
                        <Label htmlFor="profilePublic">Public Profile</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="isFeatured" 
                          checked={formData.isFeatured} 
                          onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
                        />
                        <Label htmlFor="isFeatured">Featured Athlete</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value) => handleSelectChange('status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-muted">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Key Stats</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">XP Total:</span>
                                <span className="font-semibold">{profile.profile.xpTotal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Active Streak:</span>
                                <span className="font-semibold">{profile.profile.activeStreak} days</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Longest Streak:</span>
                                <span className="font-semibold">{profile.profile.longestStreak} days</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Badges:</span>
                                <span className="font-semibold">{profile.profile.badgesEarned}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Achievements:</span>
                                <span className="font-semibold">{profile.profile.achievementsUnlocked}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-muted">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Training Preferences</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Preferred Time:</span>
                                <span className="font-semibold">{formatTime(profile.profile.preferredTrainingTime)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Weekly Minutes:</span>
                                <span className="font-semibold">{profile.profile.weeklyTrainingMinutes}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Current Focus:</span>
                                <span className="font-semibold">{profile.profile.currentFocus}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Personalized Path:</span>
                                <span className="font-semibold">{profile.profile.personalizedPathCreated ? 'Created' : 'Not Created'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Star Path Active:</span>
                                <span className="font-semibold">{profile.profile.starPathActive ? 'Yes' : 'No'}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card className="border-muted">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Account Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <UIBadge variant={profile.profile.status === 'active' ? 'default' : 'destructive'}>
                                {profile.profile.status.charAt(0).toUpperCase() + profile.profile.status.slice(1)}
                              </UIBadge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Profile Visibility:</span>
                              <UIBadge variant={profile.profile.profilePublic ? 'default' : 'outline'}>
                                {profile.profile.profilePublic ? 'Public' : 'Private'}
                              </UIBadge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Featured Athlete:</span>
                              <UIBadge variant={profile.profile.isFeatured ? 'default' : 'outline'}>
                                {profile.profile.isFeatured ? 'Featured' : 'Not Featured'}
                              </UIBadge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Updated:</span>
                              <span className="font-semibold">{formatDate(profile.profile.lastUpdated)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
                {isEditing && (
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel} disabled={updateProfileMutation.isPending}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>
                      Athlete's unlocked achievements and progress
                    </CardDescription>
                  </div>
                  <Dialog open={addAchievementDialogOpen} onOpenChange={setAddAchievementDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Achievement
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Achievement</DialogTitle>
                        <DialogDescription>
                          Grant a new achievement to this athlete
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="achievement">Achievement</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select achievement" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Free Throw Master</SelectItem>
                              <SelectItem value="2">Dribble Expert</SelectItem>
                              <SelectItem value="3">Conditioning Pro</SelectItem>
                              <SelectItem value="4">Team Player</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="achievementNote">Note (Optional)</Label>
                          <Textarea id="achievementNote" placeholder="Add a note about this achievement" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddAchievementDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button>Add Achievement</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {profile.achievements && profile.achievements.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Achievement</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Completed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profile.achievements.map((achievement: any) => (
                          <TableRow key={achievement.id}>
                            <TableCell>
                              <div className="font-medium">{achievement.achievementId}</div>
                            </TableCell>
                            <TableCell>
                              <div className="w-40">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{achievement.progress}%</span>
                                </div>
                                <Progress value={achievement.progress} className="h-2" />
                              </div>
                            </TableCell>
                            <TableCell>
                              {achievement.completed ? (
                                <UIBadge>Completed</UIBadge>
                              ) : (
                                <UIBadge variant="outline">In Progress</UIBadge>
                              )}
                            </TableCell>
                            <TableCell>
                              {achievement.completedAt ? formatDate(achievement.completedAt) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No achievements recorded yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="badges">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Badges</CardTitle>
                    <CardDescription>
                      Badges earned by the athlete
                    </CardDescription>
                  </div>
                  <Dialog open={addBadgeDialogOpen} onOpenChange={setAddBadgeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Award Badge
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Award New Badge</DialogTitle>
                        <DialogDescription>
                          Grant a new badge to this athlete
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="badge">Badge</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select badge" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Consistency Champion</SelectItem>
                              <SelectItem value="2">Rapid Improver</SelectItem>
                              <SelectItem value="3">Milestone Achiever</SelectItem>
                              <SelectItem value="4">Perfect Attendance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="badgeNote">Note (Optional)</Label>
                          <Textarea id="badgeNote" placeholder="Add a note about this badge" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddBadgeDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button>Award Badge</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {profile.badges && profile.badges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {profile.badges.map((badge: any) => (
                        <Card key={badge.id} className="overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex justify-center">
                            <Badge className="w-12 h-12 text-white" />
                          </div>
                          <CardContent className="p-4">
                            <div className="font-semibold text-center">Badge #{badge.badgeId}</div>
                            <div className="text-xs text-center text-muted-foreground">
                              Awarded: {formatDate(badge.awardedAt)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No badges awarded yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="workouts">
              <Card>
                <CardHeader>
                  <CardTitle>Workout Verifications</CardTitle>
                  <CardDescription>
                    Recent verified workouts and training sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile.workouts && profile.workouts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Workout</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Verified</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profile.workouts.map((workout: any) => (
                          <TableRow key={workout.id}>
                            <TableCell>
                              <div className="font-medium">{workout.title}</div>
                              <div className="text-xs text-muted-foreground">{workout.description}</div>
                            </TableCell>
                            <TableCell>{formatDate(workout.createdAt)}</TableCell>
                            <TableCell>
                              {workout.verified ? (
                                <UIBadge>Verified</UIBadge>
                              ) : (
                                <UIBadge variant="outline">Pending</UIBadge>
                              )}
                            </TableCell>
                            <TableCell>
                              {workout.verifiedAt ? formatDate(workout.verifiedAt) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No workout verifications yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="path">
              <Card>
                <CardHeader>
                  <CardTitle>Star Path</CardTitle>
                  <CardDescription>
                    Athlete's Star Path progress and goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile.starPath ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="border-muted">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Path Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Current Level:</span>
                                <span className="font-semibold">{profile.starPath.currentLevel}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Target Level:</span>
                                <span className="font-semibold">{profile.starPath.targetLevel}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">XP to Next Level:</span>
                                <span className="font-semibold">{profile.starPath.xpToNextLevel}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Milestones Completed:</span>
                                <span className="font-semibold">{profile.starPath.milestonesCompleted}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-muted">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Path Status</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Created:</span>
                                <span className="font-semibold">{formatDate(profile.starPath.createdAt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Updated:</span>
                                <span className="font-semibold">{formatDate(profile.starPath.updatedAt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <UIBadge>Active</UIBadge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Level Progress</h3>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Level {profile.starPath.currentLevel}</span>
                          <span>Level {profile.starPath.currentLevel + 1}</span>
                        </div>
                        <Progress value={70} className="h-2 mb-4" />
                        
                        <div className="grid grid-cols-5 gap-2 mt-4">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <Card 
                              key={level} 
                              className={`text-center p-2 ${level <= profile.starPath.currentLevel ? 'bg-primary/10' : ''}`}
                            >
                              <Star 
                                className={`mx-auto h-6 w-6 ${level <= profile.starPath.currentLevel ? 'text-primary' : 'text-muted-foreground'}`} 
                                fill={level <= profile.starPath.currentLevel ? 'currentColor' : 'none'}
                              />
                              <div className={`text-xs mt-1 ${level <= profile.starPath.currentLevel ? 'font-medium' : 'text-muted-foreground'}`}>
                                Level {level}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-muted-foreground mb-4">
                        No Star Path found for this athlete
                      </div>
                      <Button>Create Star Path</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StarProfileDetail;