import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

// Superhero themes with their colors and descriptions
const superheroThemes = [
  {
    id: 'focus-force',
    name: 'Focus Force',
    primaryColor: 'purple',
    description: 'Harness your energy into focused learning and powerful attention.',
    icon: 'ri-focus-3-line',
    strengths: ['Hyperfocus', 'Creative thinking', 'High energy'],
    idealFor: 'ADHD'
  },
  {
    id: 'pattern-pioneers',
    name: 'Pattern Pioneers',
    primaryColor: 'blue',
    description: 'Discover hidden patterns and solve complex problems with systematic thinking.',
    icon: 'ri-brain-line',
    strengths: ['Pattern recognition', 'Detail-oriented', 'Logical thinking'],
    idealFor: 'Autism'
  },
  {
    id: 'sensory-squad',
    name: 'Sensory Squad',
    primaryColor: 'teal',
    description: 'Transform heightened sensory awareness into extraordinary perception abilities.',
    icon: 'ri-empathize-line',
    strengths: ['Sensory awareness', 'Attention to detail', 'Innovative solutions'],
    idealFor: 'Sensory Processing'
  },
  {
    id: 'vision-voyagers',
    name: 'Vision Voyagers',
    primaryColor: 'orange',
    description: 'See the world differently and navigate learning with unique visual approaches.',
    icon: 'ri-eye-line',
    strengths: ['Visual thinking', 'Creative problem-solving', 'Big picture perspective'],
    idealFor: 'Dyslexia'
  }
];

// US States for dropdown
const usStates = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  // More states would be listed here...
];

// Grade levels
const gradeLevels = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

// Available avatars
const avatarOptions = [
  { id: 'purple-hero', url: '/avatars/purple-hero.png', theme: 'focus-force' },
  { id: 'blue-hero', url: '/avatars/blue-hero.png', theme: 'pattern-pioneers' },
  { id: 'teal-hero', url: '/avatars/teal-hero.png', theme: 'sensory-squad' },
  { id: 'orange-hero', url: '/avatars/orange-hero.png', theme: 'vision-voyagers' },
  // In a real app, these would be actual image paths
];

const StudentProfilePage: React.FC = () => {
  const [_, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  
  // Mock studentId (in production this would come from auth context)
  const studentId = params.id || '1';
  
  // State for form values
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    gradeLevel: '',
    stateCode: '',
    superheroIdentity: '',
    superheroTheme: '',
    avatarUrl: '',
    learningPreferences: {
      visualLearning: true,
      audioLearning: false,
      kinestheticLearning: true,
      readingWriting: false
    },
    adaptations: {
      extendedTime: false,
      visualSupports: true,
      textToSpeech: false,
      simplifiedInstructions: true,
      breakFrequency: 'medium'
    }
  });
  
  // Fetch student data
  const { data: student, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['/api/students', studentId],
    staleTime: 60000, // 1 minute
    onSuccess: (data) => {
      if (data) {
        // Initialize form with student data
        setFormValues({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          gradeLevel: data.gradeLevel || '',
          stateCode: data.stateCode || '',
          superheroIdentity: data.superheroIdentity || '',
          superheroTheme: data.superheroTheme || '',
          avatarUrl: data.avatarUrl || '',
          learningPreferences: data.learningPreferences ? 
            JSON.parse(data.learningPreferences) : 
            formValues.learningPreferences,
          adaptations: data.adaptations ? 
            JSON.parse(data.adaptations) : 
            formValues.adaptations
        });
      }
    }
  });
  
  // Save profile mutation
  const saveProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/students/${studentId}`, 'PUT', data),
    onSuccess: () => {
      toast({
        title: 'Profile Saved',
        description: 'Your superhero profile has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error Saving Profile',
        description: error.message || 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If changing superhero theme, update avatar to match theme
    if (name === 'superheroTheme') {
      const themeAvatars = avatarOptions.filter(avatar => avatar.theme === value);
      if (themeAvatars.length > 0) {
        setFormValues(prev => ({
          ...prev,
          avatarUrl: themeAvatars[0].url
        }));
      }
    }
  };
  
  // Handle learning preference toggle
  const handleLearningPreferenceChange = (name: string, value: boolean) => {
    setFormValues(prev => ({
      ...prev,
      learningPreferences: {
        ...prev.learningPreferences,
        [name]: value
      }
    }));
  };
  
  // Handle adaptation toggle
  const handleAdaptationChange = (name: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      adaptations: {
        ...prev.adaptations,
        [name]: value
      }
    }));
  };
  
  // Handle avatar selection
  const handleAvatarSelect = (avatarUrl: string) => {
    setFormValues(prev => ({
      ...prev,
      avatarUrl
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    saveProfileMutation.mutate({
      ...formValues,
      learningPreferences: JSON.stringify(formValues.learningPreferences),
      adaptations: JSON.stringify(formValues.adaptations)
    });
  };
  
  // Get theme colors based on selected superhero theme
  const getThemeColors = () => {
    const theme = superheroThemes.find(theme => theme.id === formValues.superheroTheme);
    
    switch (theme?.primaryColor) {
      case 'purple':
        return {
          primary: 'from-purple-600 to-indigo-700',
          accent: 'bg-purple-600',
          text: 'text-purple-500',
          border: 'border-purple-700',
          icon: 'text-purple-400',
        };
      case 'blue':
        return {
          primary: 'from-blue-600 to-cyan-700',
          accent: 'bg-blue-600',
          text: 'text-blue-500',
          border: 'border-blue-700',
          icon: 'text-blue-400',
        };
      case 'teal':
        return {
          primary: 'from-teal-600 to-emerald-700',
          accent: 'bg-teal-600',
          text: 'text-teal-500',
          border: 'border-teal-700',
          icon: 'text-teal-400',
        };
      case 'orange':
        return {
          primary: 'from-orange-600 to-amber-700',
          accent: 'bg-orange-600',
          text: 'text-orange-500',
          border: 'border-orange-700',
          icon: 'text-orange-400',
        };
      default:
        return {
          primary: 'from-indigo-600 to-purple-700',
          accent: 'bg-indigo-600',
          text: 'text-indigo-500',
          border: 'border-indigo-700',
          icon: 'text-indigo-400',
        };
    }
  };
  
  const themeColors = getThemeColors();
  
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Header */}
      <header className={`bg-gradient-to-r ${themeColors.primary} py-10 px-4`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="mr-4 bg-white/10 hover:bg-white/20"
                onClick={() => setLocation(`/dashboard/${studentId}`)}
              >
                <i className="ri-arrow-left-line mr-1"></i> Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Superhero Profile</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {isLoadingStudent ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <i className="ri-loader-4-line animate-spin text-3xl mb-2 text-indigo-500"></i>
              <p>Loading profile...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary Column */}
            <div>
              <Card className="bg-dark-800 border-dark-700 sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className={`ri-user-6-line mr-2 ${themeColors.icon}`}></i>
                    Profile Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      {formValues.avatarUrl ? (
                        <Avatar className="w-32 h-32 border-4 border-dark-700">
                          <AvatarImage src={formValues.avatarUrl} alt="Avatar" />
                          <AvatarFallback className="bg-dark-700 text-4xl">
                            {formValues.firstName?.charAt(0)}{formValues.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-dark-700 flex items-center justify-center border-4 border-dark-600">
                          <i className="ri-user-6-line text-4xl text-gray-400"></i>
                        </div>
                      )}
                      
                      {formValues.superheroTheme && (
                        <div className={`absolute -bottom-2 right-0 ${themeColors.accent} rounded-full w-10 h-10 flex items-center justify-center`}>
                          <i className={`${superheroThemes.find(t => t.id === formValues.superheroTheme)?.icon || 'ri-superhero-line'} text-white`}></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <h2 className="text-xl font-bold mb-1">
                        {formValues.firstName && formValues.lastName 
                          ? `${formValues.firstName} ${formValues.lastName}` 
                          : 'New Student'}
                      </h2>
                      <div className="text-gray-400 mb-2">
                        {formValues.superheroIdentity 
                          ? formValues.superheroIdentity 
                          : 'Choose your superhero identity'}
                      </div>
                      
                      {formValues.superheroTheme && (
                        <Badge className={themeColors.accent}>
                          {superheroThemes.find(t => t.id === formValues.superheroTheme)?.name || 'Superhero'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-dark-700" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">State:</span>
                      <span>{usStates.find(s => s.code === formValues.stateCode)?.name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Grade:</span>
                      <span>{formValues.gradeLevel ? (formValues.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${formValues.gradeLevel}`) : 'Not set'}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-dark-700" />
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Learning Preferences</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(formValues.learningPreferences).map(([key, value]) => (
                          value && (
                            <Badge key={key} variant="outline" className="border-dark-600">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Adaptations</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(formValues.adaptations)
                          .filter(([key, value]) => typeof value === 'boolean' && value)
                          .map(([key]) => (
                            <Badge key={key} variant="outline" className="border-dark-600">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Profile Settings Column */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="mb-8">
                    <TabsTrigger value="personal" className="data-[state=active]:bg-dark-800">
                      <i className="ri-user-6-line mr-1"></i> Personal Info
                    </TabsTrigger>
                    <TabsTrigger value="superhero" className="data-[state=active]:bg-dark-800">
                      <i className="ri-superhero-line mr-1"></i> Superhero Identity
                    </TabsTrigger>
                    <TabsTrigger value="learning" className="data-[state=active]:bg-dark-800">
                      <i className="ri-settings-5-line mr-1"></i> Learning Preferences
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Personal Info Tab */}
                  <TabsContent value="personal" className="m-0">
                    <Card className="bg-dark-800 border-dark-700">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <i className={`ri-user-6-line mr-2 ${themeColors.icon}`}></i>
                          Personal Information
                        </CardTitle>
                        <CardDescription>
                          Basic information about the student
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              placeholder="Enter first name"
                              value={formValues.firstName}
                              onChange={handleInputChange}
                              className="bg-dark-900 border-dark-600"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              placeholder="Enter last name"
                              value={formValues.lastName}
                              onChange={handleInputChange}
                              className="bg-dark-900 border-dark-600"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="stateCode">State</Label>
                            <Select 
                              value={formValues.stateCode} 
                              onValueChange={(value) => handleSelectChange('stateCode', value)}
                            >
                              <SelectTrigger className="bg-dark-900 border-dark-600">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {usStates.map(state => (
                                  <SelectItem key={state.code} value={state.code}>
                                    {state.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="gradeLevel">Grade Level</Label>
                            <Select 
                              value={formValues.gradeLevel} 
                              onValueChange={(value) => handleSelectChange('gradeLevel', value)}
                            >
                              <SelectTrigger className="bg-dark-900 border-dark-600">
                                <SelectValue placeholder="Select grade level" />
                              </SelectTrigger>
                              <SelectContent>
                                {gradeLevels.map(grade => (
                                  <SelectItem key={grade} value={grade}>
                                    {grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Superhero Identity Tab */}
                  <TabsContent value="superhero" className="m-0">
                    <Card className="bg-dark-800 border-dark-700">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <i className={`ri-superhero-line mr-2 ${themeColors.icon}`}></i>
                          Superhero Identity
                        </CardTitle>
                        <CardDescription>
                          Create your learning superhero identity
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="superheroIdentity">Superhero Name</Label>
                          <Input
                            id="superheroIdentity"
                            name="superheroIdentity"
                            placeholder="Choose your superhero name"
                            value={formValues.superheroIdentity}
                            onChange={handleInputChange}
                            className="bg-dark-900 border-dark-600"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Superhero Theme</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {superheroThemes.map(theme => (
                              <Card 
                                key={theme.id} 
                                className={`bg-dark-900 border-2 cursor-pointer ${
                                  formValues.superheroTheme === theme.id 
                                    ? `border-${theme.primaryColor}-600` 
                                    : 'border-dark-700'
                                } hover:border-${theme.primaryColor}-600 transition-colors`}
                                onClick={() => handleSelectChange('superheroTheme', theme.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full bg-${theme.primaryColor}-600 flex items-center justify-center`}>
                                      <i className={`${theme.icon} text-white`}></i>
                                    </div>
                                    <div>
                                      <h3 className="font-medium">{theme.name}</h3>
                                      <p className={`text-xs text-${theme.primaryColor}-400`}>
                                        Ideal for {theme.idealFor}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-400 mt-2">
                                    {theme.description}
                                  </p>
                                  <div className="mt-3">
                                    <div className="text-xs text-gray-500 mb-1">Strengths:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {theme.strengths.map((strength, idx) => (
                                        <Badge 
                                          key={idx} 
                                          variant="outline" 
                                          className={`border-${theme.primaryColor}-800 text-${theme.primaryColor}-400 text-xs`}
                                        >
                                          {strength}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Choose Avatar</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {/* This would display actual avatars in a real app */}
                            {avatarOptions
                              .filter(avatar => !formValues.superheroTheme || avatar.theme === formValues.superheroTheme)
                              .map(avatar => (
                                <div 
                                  key={avatar.id} 
                                  className={`relative cursor-pointer rounded-lg p-2 ${
                                    formValues.avatarUrl === avatar.url 
                                      ? `bg-${avatar.theme.split('-')[0]}-900/30 border-2 border-${avatar.theme.split('-')[0]}-700` 
                                      : 'bg-dark-900 border-2 border-dark-700'
                                  }`}
                                  onClick={() => handleAvatarSelect(avatar.url)}
                                >
                                  <div className="aspect-square rounded-lg bg-dark-850 flex items-center justify-center">
                                    {/* This would be an actual image in a real app */}
                                    <i className={`ri-user-6-fill text-4xl text-${avatar.theme.split('-')[0]}-500`}></i>
                                  </div>
                                  {formValues.avatarUrl === avatar.url && (
                                    <div className="absolute -top-2 -right-2 bg-green-600 rounded-full p-1">
                                      <i className="ri-check-line text-white text-xs"></i>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Learning Preferences Tab */}
                  <TabsContent value="learning" className="m-0">
                    <Card className="bg-dark-800 border-dark-700">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <i className={`ri-settings-5-line mr-2 ${themeColors.icon}`}></i>
                          Learning Preferences
                        </CardTitle>
                        <CardDescription>
                          Customize your learning experience
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium">Preferred Learning Styles</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="visualLearning" 
                                checked={formValues.learningPreferences.visualLearning}
                                onCheckedChange={(checked) => handleLearningPreferenceChange('visualLearning', checked)}
                              />
                              <Label htmlFor="visualLearning" className="flex items-center">
                                <i className="ri-eye-line mr-1.5"></i> Visual Learning
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="audioLearning" 
                                checked={formValues.learningPreferences.audioLearning}
                                onCheckedChange={(checked) => handleLearningPreferenceChange('audioLearning', checked)}
                              />
                              <Label htmlFor="audioLearning" className="flex items-center">
                                <i className="ri-volume-up-line mr-1.5"></i> Audio Learning
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="kinestheticLearning" 
                                checked={formValues.learningPreferences.kinestheticLearning}
                                onCheckedChange={(checked) => handleLearningPreferenceChange('kinestheticLearning', checked)}
                              />
                              <Label htmlFor="kinestheticLearning" className="flex items-center">
                                <i className="ri-hand-coin-line mr-1.5"></i> Hands-on Learning
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="readingWriting" 
                                checked={formValues.learningPreferences.readingWriting}
                                onCheckedChange={(checked) => handleLearningPreferenceChange('readingWriting', checked)}
                              />
                              <Label htmlFor="readingWriting" className="flex items-center">
                                <i className="ri-book-read-line mr-1.5"></i> Reading/Writing
                              </Label>
                            </div>
                          </div>
                        </div>
                        
                        <Separator className="bg-dark-700" />
                        
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium">Learning Adaptations</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="extendedTime" 
                                checked={formValues.adaptations.extendedTime}
                                onCheckedChange={(checked) => handleAdaptationChange('extendedTime', checked)}
                              />
                              <Label htmlFor="extendedTime" className="flex items-center">
                                <i className="ri-time-line mr-1.5"></i> Extended Time
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="visualSupports" 
                                checked={formValues.adaptations.visualSupports}
                                onCheckedChange={(checked) => handleAdaptationChange('visualSupports', checked)}
                              />
                              <Label htmlFor="visualSupports" className="flex items-center">
                                <i className="ri-image-line mr-1.5"></i> Visual Supports
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="textToSpeech" 
                                checked={formValues.adaptations.textToSpeech}
                                onCheckedChange={(checked) => handleAdaptationChange('textToSpeech', checked)}
                              />
                              <Label htmlFor="textToSpeech" className="flex items-center">
                                <i className="ri-volume-up-line mr-1.5"></i> Text to Speech
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="simplifiedInstructions" 
                                checked={formValues.adaptations.simplifiedInstructions}
                                onCheckedChange={(checked) => handleAdaptationChange('simplifiedInstructions', checked)}
                              />
                              <Label htmlFor="simplifiedInstructions" className="flex items-center">
                                <i className="ri-file-list-3-line mr-1.5"></i> Simplified Instructions
                              </Label>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Label htmlFor="breakFrequency" className="mb-2 block">Break Frequency</Label>
                            <RadioGroup 
                              id="breakFrequency"
                              value={formValues.adaptations.breakFrequency}
                              onValueChange={(value) => handleAdaptationChange('breakFrequency', value)}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="low" id="break-low" />
                                <Label htmlFor="break-low">Low - Less frequent breaks</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="medium" id="break-medium" />
                                <Label htmlFor="break-medium">Medium - Standard break schedule</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="high" id="break-high" />
                                <Label htmlFor="break-high">High - More frequent breaks</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-8 flex justify-end">
                      <Button 
                        type="submit" 
                        className={themeColors.accent}
                        disabled={saveProfileMutation.isPending}
                      >
                        {saveProfileMutation.isPending ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="ri-save-line mr-1"></i>
                            Save Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentProfilePage;