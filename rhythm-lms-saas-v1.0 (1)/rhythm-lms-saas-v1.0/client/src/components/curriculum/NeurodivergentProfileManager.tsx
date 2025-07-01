import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { NeurodivergentProfile } from '@shared/schema';
import { 
  Card, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Plus, 
  Edit, 
  MoreHorizontal, 
  Trash, 
  Zap,
  Brain, 
  Sparkles,
  BookOpen,
  Eye,
  Ear,
  Hand,
  Calendar,
  Clock,
  ListChecks
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

// Profile types
const NEURODIVERGENT_TYPES = [
  { value: 'ADHD', label: 'ADHD' },
  { value: 'Autism', label: 'Autism Spectrum' },
  { value: 'Dyslexia', label: 'Dyslexia' },
  { value: 'Dyscalculia', label: 'Dyscalculia' },
  { value: 'Combined', label: 'Combined Profile' },
  { value: 'Other', label: 'Other' }
];

// Learning styles
const LEARNING_STYLES = [
  { value: 'Visual', label: 'Visual' },
  { value: 'Auditory', label: 'Auditory' },
  { value: 'Kinesthetic', label: 'Kinesthetic' },
  { value: 'Reading/Writing', label: 'Reading/Writing' }
];

// Color schemes
const COLOR_SCHEMES = [
  { value: 'Standard', label: 'Standard' },
  { value: 'High Contrast', label: 'High Contrast' },
  { value: 'Reduced Blue Light', label: 'Reduced Blue Light' },
  { value: 'Pastel', label: 'Pastel Colors' },
  { value: 'Neutral', label: 'Neutral Colors' }
];

// Font preferences
const FONT_PREFERENCES = [
  { value: 'Standard', label: 'Standard' },
  { value: 'Dyslexia Friendly', label: 'Dyslexia Friendly' },
  { value: 'Large Print', label: 'Large Print' },
  { value: 'Spaced', label: 'Well Spaced' }
];

// Executive function areas
const EXECUTIVE_FUNCTION_AREAS = [
  { value: 'Planning', label: 'Planning' },
  { value: 'Organization', label: 'Organization' },
  { value: 'Time Management', label: 'Time Management' },
  { value: 'Working Memory', label: 'Working Memory' },
  { value: 'Emotional Regulation', label: 'Emotional Regulation' },
  { value: 'Task Initiation', label: 'Task Initiation' },
  { value: 'Flexibility', label: 'Cognitive Flexibility' }
];

// Sensory processing types
const SENSORY_TYPES = [
  { value: 'Visual', label: 'Visual' },
  { value: 'Auditory', label: 'Auditory' },
  { value: 'Tactile', label: 'Tactile' },
  { value: 'Olfactory', label: 'Olfactory' },
  { value: 'Proprioceptive', label: 'Proprioceptive' },
  { value: 'Vestibular', label: 'Vestibular' }
];

interface NeurodivergentProfileManagerProps {
  studentId?: number;
  onProfileSelect?: (profile: NeurodivergentProfile) => void;
}

export const NeurodivergentProfileManager: React.FC<NeurodivergentProfileManagerProps> = ({ 
  studentId,
  onProfileSelect
}) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Partial<NeurodivergentProfile>>({
    name: '',
    type: '',
    description: '',
    learningStrengths: [],
    learningChallenges: [],
    recommendedAccommodations: [],
    preferredLearningStyles: [],
    interestAreas: [],
    sensoryConsiderations: [],
    executiveFunctionSupports: [],
    colorSchemePreference: 'Standard',
    fontPreference: 'Standard'
  });

  const queryClient = useQueryClient();

  // Query to get all profiles
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['/api/profiles', selectedType],
    queryFn: async () => {
      let url = '/api/profiles';
      if (selectedType) url += `?type=${selectedType}`;
      return apiRequest<NeurodivergentProfile[]>({ url, method: 'GET' });
    }
  });

  // Query to get student-specific profiles if studentId is provided
  const { data: studentProfiles } = useQuery({
    queryKey: ['/api/students', studentId, 'profiles'],
    queryFn: async () => {
      return apiRequest<NeurodivergentProfile[]>({
        url: `/api/students/${studentId}/profiles`,
        method: 'GET'
      });
    },
    enabled: !!studentId
  });

  // Save profile mutation
  const saveProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<NeurodivergentProfile>) => {
      return apiRequest({
        url: '/api/profiles',
        method: profileData.id ? 'PUT' : 'POST',
        body: profileData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
      if (studentId) {
        queryClient.invalidateQueries({ queryKey: ['/api/students', studentId, 'profiles'] });
      }
      setIsEditing(false);
      resetForm();
    }
  });

  // Delete profile mutation
  const deleteProfileMutation = useMutation({
    mutationFn: async (profileId: number) => {
      return apiRequest({
        url: `/api/profiles/${profileId}`,
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
      if (studentId) {
        queryClient.invalidateQueries({ queryKey: ['/api/students', studentId, 'profiles'] });
      }
    }
  });

  // Reset form
  const resetForm = () => {
    setCurrentProfile({
      name: '',
      type: '',
      description: '',
      learningStrengths: [],
      learningChallenges: [],
      recommendedAccommodations: [],
      preferredLearningStyles: [],
      interestAreas: [],
      sensoryConsiderations: [],
      executiveFunctionSupports: [],
      colorSchemePreference: 'Standard',
      fontPreference: 'Standard'
    });
  };

  // Handle editing a profile
  const handleEditProfile = (profile: NeurodivergentProfile) => {
    setCurrentProfile(profile);
    setIsEditing(true);
    setActiveTab('edit');
  };

  // Handle deleting a profile
  const handleDeleteProfile = (id: number) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      deleteProfileMutation.mutate(id);
    }
  };

  // Handle saving a profile
  const handleSaveProfile = () => {
    // Validate required fields
    if (!currentProfile.name || !currentProfile.type || !currentProfile.description) {
      alert('Please fill in all required fields (name, type, and description)');
      return;
    }
    
    saveProfileMutation.mutate(currentProfile as NeurodivergentProfile);
  };

  // Handle adding accommodation fields
  const handleAddAccommodation = (category: string) => {
    const accommodations = currentProfile.recommendedAccommodations || [];
    const existingCategoryIndex = accommodations.findIndex(a => a.category === category);
    
    if (existingCategoryIndex >= 0) {
      // Category exists, append empty string
      const updated = [...accommodations];
      updated[existingCategoryIndex] = {
        ...updated[existingCategoryIndex],
        accommodations: [...updated[existingCategoryIndex].accommodations, '']
      };
      setCurrentProfile({
        ...currentProfile,
        recommendedAccommodations: updated
      });
    } else {
      // Category doesn't exist, create new
      setCurrentProfile({
        ...currentProfile,
        recommendedAccommodations: [
          ...accommodations,
          {
            category,
            accommodations: ['']
          }
        ]
      });
    }
  };

  // Handle updating accommodation
  const handleUpdateAccommodation = (categoryIndex: number, accommodationIndex: number, value: string) => {
    const accommodations = [...(currentProfile.recommendedAccommodations || [])];
    const updatedCategory = {...accommodations[categoryIndex]};
    updatedCategory.accommodations[accommodationIndex] = value;
    accommodations[categoryIndex] = updatedCategory;
    
    setCurrentProfile({
      ...currentProfile,
      recommendedAccommodations: accommodations
    });
  };

  // Handle adding sensory consideration
  const handleAddSensoryConsideration = (senseType: string) => {
    const sensoryConsiderations = currentProfile.sensoryConsiderations || [];
    const existingTypeIndex = sensoryConsiderations.findIndex(s => s.senseType === senseType);
    
    if (existingTypeIndex >= 0) {
      // Already exists, do nothing
      return;
    } else {
      // Create new entry
      setCurrentProfile({
        ...currentProfile,
        sensoryConsiderations: [
          ...sensoryConsiderations,
          {
            senseType,
            preferences: [],
            sensitivities: []
          }
        ]
      });
    }
  };

  // Handle adding executive function support
  const handleAddExecutiveFunction = (area: string) => {
    const executiveFunctions = currentProfile.executiveFunctionSupports || [];
    const existingAreaIndex = executiveFunctions.findIndex(ef => ef.area === area);
    
    if (existingAreaIndex >= 0) {
      // Already exists, append empty strategy
      const updated = [...executiveFunctions];
      updated[existingAreaIndex] = {
        ...updated[existingAreaIndex],
        strategies: [...updated[existingAreaIndex].strategies, '']
      };
      setCurrentProfile({
        ...currentProfile,
        executiveFunctionSupports: updated
      });
    } else {
      // Create new entry
      setCurrentProfile({
        ...currentProfile,
        executiveFunctionSupports: [
          ...executiveFunctions,
          {
            area,
            strategies: ['']
          }
        ]
      });
    }
  };

  // Get profile color class based on type
  const getProfileColorClass = (type: string) => {
    switch (type) {
      case 'ADHD':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'Autism':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'Dyslexia':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'Dyscalculia':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'Combined':
        return 'bg-pink-100 border-pink-300 text-pink-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Get profile icon based on type
  const getProfileIcon = (type: string) => {
    switch (type) {
      case 'ADHD':
        return <Zap className="h-5 w-5 text-orange-600" />;
      case 'Autism':
        return <Sparkles className="h-5 w-5 text-blue-600" />;
      case 'Dyslexia':
        return <BookOpen className="h-5 w-5 text-green-600" />;
      case 'Dyscalculia':
        return <Brain className="h-5 w-5 text-purple-600" />;
      case 'Combined':
        return <Sparkles className="h-5 w-5 text-pink-600" />;
      default:
        return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Neurodivergent Learning Profiles</CardTitle>
        <CardDescription>
          Create and manage learning profiles for neurodivergent students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="browse">Browse Profiles</TabsTrigger>
            <TabsTrigger value="create">Create Profile</TabsTrigger>
            {isEditing && (
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="browse">
            <div className="mb-6">
              <Label htmlFor="profile-type-filter">Filter by type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="profile-type-filter">
                  <SelectValue placeholder="All profile types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {NEURODIVERGENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div>
                {studentId && studentProfiles && studentProfiles.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3">Student Profiles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {studentProfiles.map(profile => (
                        <div 
                          key={profile.id} 
                          className={`rounded-lg border p-4 ${getProfileColorClass(profile.type)}`}
                          onClick={() => onProfileSelect && onProfileSelect(profile)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              {getProfileIcon(profile.type)}
                              <h3 className="ml-2 font-medium">{profile.name}</h3>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditProfile(profile)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600" 
                                  onClick={() => handleDeleteProfile(profile.id)}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-sm mt-2">{profile.description.substring(0, 100)}...</p>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {profile.preferredLearningStyles.map(style => (
                              <Badge key={style} variant="outline" className="text-xs">
                                {style}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <h3 className="text-lg font-semibold mb-3">All Profiles</h3>
                {profiles && profiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profiles.map(profile => (
                      <div 
                        key={profile.id} 
                        className={`rounded-lg border p-4 ${getProfileColorClass(profile.type)}`}
                        onClick={() => onProfileSelect && onProfileSelect(profile)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            {getProfileIcon(profile.type)}
                            <h3 className="ml-2 font-medium">{profile.name}</h3>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditProfile(profile)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => handleDeleteProfile(profile.id)}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm mt-2">{profile.description.substring(0, 100)}...</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {profile.preferredLearningStyles.map(style => (
                            <Badge key={style} variant="outline" className="text-xs">
                              {style}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    No profiles found
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profile-name">Profile Name<span className="text-red-500">*</span></Label>
                  <Input 
                    id="profile-name" 
                    value={currentProfile.name} 
                    onChange={(e) => setCurrentProfile({...currentProfile, name: e.target.value})} 
                    placeholder="e.g., Visual Learner with ADHD"
                  />
                </div>
                
                <div>
                  <Label htmlFor="profile-type">Profile Type<span className="text-red-500">*</span></Label>
                  <Select 
                    value={currentProfile.type as string} 
                    onValueChange={(value) => setCurrentProfile({...currentProfile, type: value})}
                  >
                    <SelectTrigger id="profile-type">
                      <SelectValue placeholder="Select profile type" />
                    </SelectTrigger>
                    <SelectContent>
                      {NEURODIVERGENT_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="profile-description">Description<span className="text-red-500">*</span></Label>
                <Textarea 
                  id="profile-description" 
                  value={currentProfile.description as string} 
                  onChange={(e) => setCurrentProfile({...currentProfile, description: e.target.value})} 
                  placeholder="Describe this learning profile..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-4">
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="learning-styles">
                    <AccordionTrigger className="text-base font-medium">
                      Learning Styles & Preferences
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 p-2">
                        <div>
                          <Label>Preferred Learning Styles</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {LEARNING_STYLES.map(style => (
                              <div key={style.value} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`style-${style.value}`} 
                                  checked={(currentProfile.preferredLearningStyles || []).includes(style.value)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setCurrentProfile({
                                        ...currentProfile,
                                        preferredLearningStyles: [
                                          ...(currentProfile.preferredLearningStyles || []),
                                          style.value
                                        ]
                                      });
                                    } else {
                                      setCurrentProfile({
                                        ...currentProfile,
                                        preferredLearningStyles: (currentProfile.preferredLearningStyles || [])
                                          .filter(s => s !== style.value)
                                      });
                                    }
                                  }}
                                />
                                <label htmlFor={`style-${style.value}`}>{style.label}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="color-scheme">Color Scheme Preference</Label>
                            <Select 
                              value={currentProfile.colorSchemePreference as string} 
                              onValueChange={(value) => setCurrentProfile({...currentProfile, colorSchemePreference: value})}
                            >
                              <SelectTrigger id="color-scheme">
                                <SelectValue placeholder="Select color scheme" />
                              </SelectTrigger>
                              <SelectContent>
                                {COLOR_SCHEMES.map(scheme => (
                                  <SelectItem key={scheme.value} value={scheme.value}>
                                    {scheme.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="font-preference">Font Preference</Label>
                            <Select 
                              value={currentProfile.fontPreference as string} 
                              onValueChange={(value) => setCurrentProfile({...currentProfile, fontPreference: value})}
                            >
                              <SelectTrigger id="font-preference">
                                <SelectValue placeholder="Select font preference" />
                              </SelectTrigger>
                              <SelectContent>
                                {FONT_PREFERENCES.map(font => (
                                  <SelectItem key={font.value} value={font.value}>
                                    {font.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="interest-areas">Interest Areas (comma separated)</Label>
                          <Input 
                            id="interest-areas" 
                            value={(currentProfile.interestAreas || []).join(', ')} 
                            onChange={(e) => setCurrentProfile({
                              ...currentProfile, 
                              interestAreas: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                            })} 
                            placeholder="e.g., space, dinosaurs, technology, art"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="strengths-challenges">
                    <AccordionTrigger className="text-base font-medium">
                      Strengths & Challenges
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 p-2">
                        <div>
                          <Label htmlFor="learning-strengths">Learning Strengths (comma separated)</Label>
                          <Input 
                            id="learning-strengths" 
                            value={(currentProfile.learningStrengths || []).join(', ')} 
                            onChange={(e) => setCurrentProfile({
                              ...currentProfile, 
                              learningStrengths: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            })} 
                            placeholder="e.g., visual pattern recognition, creative thinking"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="learning-challenges">Learning Challenges (comma separated)</Label>
                          <Input 
                            id="learning-challenges" 
                            value={(currentProfile.learningChallenges || []).join(', ')} 
                            onChange={(e) => setCurrentProfile({
                              ...currentProfile, 
                              learningChallenges: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                            })} 
                            placeholder="e.g., sustained attention, auditory processing"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="accommodations">
                    <AccordionTrigger className="text-base font-medium">
                      Recommended Accommodations
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 p-2">
                        {['Environmental', 'Instructional', 'Assessment', 'Social', 'Executive Function'].map(category => (
                          <div key={category} className="border rounded-md p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{category} Accommodations</h4>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleAddAccommodation(category)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {currentProfile.recommendedAccommodations?.find(a => a.category === category)?.accommodations.map((accommodation, index) => (
                              <div key={`${category}-${index}`} className="mb-2">
                                <Input 
                                  value={accommodation} 
                                  onChange={(e) => {
                                    const categoryIndex = currentProfile.recommendedAccommodations?.findIndex(a => a.category === category) || 0;
                                    handleUpdateAccommodation(categoryIndex, index, e.target.value);
                                  }}
                                  placeholder={`Add ${category.toLowerCase()} accommodation...`}
                                />
                              </div>
                            ))}
                            
                            {!currentProfile.recommendedAccommodations?.find(a => a.category === category) && (
                              <div className="text-sm text-muted-foreground">
                                No accommodations added. Click the + button to add one.
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="sensory">
                    <AccordionTrigger className="text-base font-medium">
                      Sensory Considerations
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 p-2">
                        <div className="mb-4">
                          <Label>Add Sensory Consideration For:</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {SENSORY_TYPES.map(sense => (
                              <Button 
                                key={sense.value}
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddSensoryConsideration(sense.value)}
                                className="flex items-center gap-1"
                              >
                                {sense.value === 'Visual' && <Eye className="h-3 w-3" />}
                                {sense.value === 'Auditory' && <Ear className="h-3 w-3" />}
                                {sense.value === 'Tactile' && <Hand className="h-3 w-3" />}
                                {sense.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {currentProfile.sensoryConsiderations?.map((sensory, sIndex) => (
                          <div key={`sensory-${sIndex}`} className="border rounded-md p-3">
                            <h4 className="font-medium mb-2">{sensory.senseType} Considerations</h4>
                            
                            <div className="mb-3">
                              <Label>Preferences (comma separated)</Label>
                              <Input 
                                value={sensory.preferences.join(', ')} 
                                onChange={(e) => {
                                  const updated = [...(currentProfile.sensoryConsiderations || [])];
                                  updated[sIndex] = {
                                    ...updated[sIndex],
                                    preferences: e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                                  };
                                  setCurrentProfile({
                                    ...currentProfile,
                                    sensoryConsiderations: updated
                                  });
                                }}
                                placeholder="e.g., soft lighting, calm spaces"
                              />
                            </div>
                            
                            <div>
                              <Label>Sensitivities (comma separated)</Label>
                              <Input 
                                value={sensory.sensitivities.join(', ')} 
                                onChange={(e) => {
                                  const updated = [...(currentProfile.sensoryConsiderations || [])];
                                  updated[sIndex] = {
                                    ...updated[sIndex],
                                    sensitivities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                  };
                                  setCurrentProfile({
                                    ...currentProfile,
                                    sensoryConsiderations: updated
                                  });
                                }}
                                placeholder="e.g., bright lights, loud noises"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="executive-function">
                    <AccordionTrigger className="text-base font-medium">
                      Executive Function Supports
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 p-2">
                        <div className="mb-4">
                          <Label>Add Support For:</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {EXECUTIVE_FUNCTION_AREAS.map(area => (
                              <Button 
                                key={area.value}
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddExecutiveFunction(area.value)}
                                className="flex items-center gap-1"
                              >
                                {area.value === 'Planning' && <ListChecks className="h-3 w-3" />}
                                {area.value === 'Time Management' && <Clock className="h-3 w-3" />}
                                {area.value === 'Organization' && <Calendar className="h-3 w-3" />}
                                {area.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {currentProfile.executiveFunctionSupports?.map((efSupport, efIndex) => (
                          <div key={`ef-${efIndex}`} className="border rounded-md p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{efSupport.area} Strategies</h4>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  const updated = [...(currentProfile.executiveFunctionSupports || [])];
                                  updated[efIndex] = {
                                    ...updated[efIndex],
                                    strategies: [...updated[efIndex].strategies, '']
                                  };
                                  setCurrentProfile({
                                    ...currentProfile,
                                    executiveFunctionSupports: updated
                                  });
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {efSupport.strategies.map((strategy, strategyIndex) => (
                              <div key={`${efSupport.area}-${strategyIndex}`} className="mb-2">
                                <Input 
                                  value={strategy} 
                                  onChange={(e) => {
                                    const updated = [...(currentProfile.executiveFunctionSupports || [])];
                                    updated[efIndex].strategies[strategyIndex] = e.target.value;
                                    setCurrentProfile({
                                      ...currentProfile,
                                      executiveFunctionSupports: updated
                                    });
                                  }}
                                  placeholder={`Add strategy for ${efSupport.area.toLowerCase()}...`}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={resetForm}
                >
                  Reset
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saveProfileMutation.isPending}
                >
                  {saveProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Profile
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {isEditing && (
            <TabsContent value="edit">
              <div className="space-y-6">
                {/* Duplicate of the create form, but for editing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-profile-name">Profile Name<span className="text-red-500">*</span></Label>
                    <Input 
                      id="edit-profile-name" 
                      value={currentProfile.name} 
                      onChange={(e) => setCurrentProfile({...currentProfile, name: e.target.value})} 
                      placeholder="e.g., Visual Learner with ADHD"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-profile-type">Profile Type<span className="text-red-500">*</span></Label>
                    <Select 
                      value={currentProfile.type as string} 
                      onValueChange={(value) => setCurrentProfile({...currentProfile, type: value})}
                    >
                      <SelectTrigger id="edit-profile-type">
                        <SelectValue placeholder="Select profile type" />
                      </SelectTrigger>
                      <SelectContent>
                        {NEURODIVERGENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="edit-profile-description">Description<span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="edit-profile-description" 
                    value={currentProfile.description as string} 
                    onChange={(e) => setCurrentProfile({...currentProfile, description: e.target.value})} 
                    placeholder="Describe this learning profile..."
                    rows={3}
                  />
                </div>
                
                {/* Continue with same accordion sections as in create */}
                <div className="space-y-4">
                  <Accordion type="multiple" className="w-full">
                    {/* Same accordion content as in create */}
                    {/* ... */}
                  </Accordion>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => {
                      setIsEditing(false);
                      resetForm();
                      setActiveTab('browse');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saveProfileMutation.isPending}
                  >
                    {saveProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Profile
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};