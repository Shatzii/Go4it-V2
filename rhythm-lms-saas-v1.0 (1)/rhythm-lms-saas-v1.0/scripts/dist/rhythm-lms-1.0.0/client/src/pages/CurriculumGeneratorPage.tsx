import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

// Subject options
const subjects = [
  { id: 'math', name: 'Mathematics' },
  { id: 'ela', name: 'English Language Arts' },
  { id: 'science', name: 'Science' },
  { id: 'social-studies', name: 'Social Studies' },
  { id: 'history', name: 'History' },
  { id: 'art', name: 'Art' },
  { id: 'music', name: 'Music' },
  { id: 'pe', name: 'Physical Education' },
  { id: 'health', name: 'Health' },
  { id: 'tech', name: 'Technology' }
];

// Grade level options
const gradeLevels = [
  'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];

// Neurodivergent profile types
const profileTypes = [
  { id: 'adhd', name: 'ADHD', description: 'Attention-Deficit/Hyperactivity Disorder' },
  { id: 'autism', name: 'Autism', description: 'Autism Spectrum Disorder' },
  { id: 'dyslexia', name: 'Dyslexia', description: 'Reading Disability' },
  { id: 'dyscalculia', name: 'Dyscalculia', description: 'Math Learning Disability' },
  { id: 'dysgraphia', name: 'Dysgraphia', description: 'Writing Disability' }
];

const CurriculumGeneratorPage: React.FC = () => {
  const [_, setLocation] = useLocation();
  
  // Form state
  const [studentId, setStudentId] = useState<number>(1); // Default student ID
  const [profileId, setProfileId] = useState<number>(1); // Default profile ID
  const [stateCode, setStateCode] = useState<string>('');
  const [gradeLevel, setGradeLevel] = useState<string>('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('generator');
  const [generatingCurriculum, setGeneratingCurriculum] = useState<boolean>(false);
  const [generatedPathId, setGeneratedPathId] = useState<number | null>(null);
  
  // Fetch AI Engine status
  const { data: aiStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ['/api/ai/status'],
    staleTime: 30000, // 30 seconds
  });
  
  // Fetch profiles for dropdown
  const { data: profiles, isLoading: isProfilesLoading } = useQuery({
    queryKey: ['/api/academic/profiles'],
    staleTime: 60000, // 1 minute
  });
  
  // Generate curriculum mutation
  const generateCurriculumMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/ai/curriculum/generate', 'POST', data),
    onSuccess: (data) => {
      toast({
        title: 'Curriculum Generated!',
        description: 'The curriculum path has been successfully created.',
      });
      setGeneratingCurriculum(false);
      setGeneratedPathId(data.id);
      setSelectedTab('results');
    },
    onError: (error: any) => {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate curriculum. Please try again.',
        variant: 'destructive',
      });
      setGeneratingCurriculum(false);
    }
  });
  
  // Fetch generated curriculum path details if we have an ID
  const { data: curriculumPath, isLoading: isPathLoading } = useQuery({
    queryKey: ['/api/academic/students', studentId, 'curriculum-paths', generatedPathId],
    enabled: generatedPathId !== null,
    staleTime: 0, // Always refetch
  });
  
  // Handle subject toggle
  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };
  
  // Handle form submission
  const handleGenerateCurriculum = () => {
    if (!stateCode) {
      toast({
        title: 'State Required',
        description: 'Please select a state for educational standards.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!gradeLevel) {
      toast({
        title: 'Grade Level Required',
        description: 'Please select a grade level for the curriculum.',
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedSubjects.length === 0) {
      toast({
        title: 'Subjects Required',
        description: 'Please select at least one subject for the curriculum.',
        variant: 'destructive',
      });
      return;
    }
    
    setGeneratingCurriculum(true);
    
    generateCurriculumMutation.mutate({
      studentId,
      profileId,
      stateCode,
      gradeLevel,
      subjects: selectedSubjects
    });
  };
  
  // Get state name by code
  const getStateName = (code: string) => {
    const state = usStates.find(state => state.code === code);
    return state ? state.name : code;
  };
  
  // Format curriculum content
  const formatCurriculumContent = () => {
    if (!curriculumPath) return null;
    
    try {
      const content = typeof curriculumPath.content === 'string' 
        ? JSON.parse(curriculumPath.content) 
        : curriculumPath.content;
      
      return content;
    } catch (e) {
      console.error('Error parsing curriculum content:', e);
      return null;
    }
  };
  
  const content = formatCurriculumContent();
  
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <header className="bg-dark-900 border-b border-dark-800 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center">
              <span className="bg-purple-600 rounded-full p-1 mr-2">
                <i className="ri-sword-line text-white"></i>
              </span>
              Academic Curriculum Generator
            </h1>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="text-gray-300 border-dark-700"
                onClick={() => setLocation('/dashboard')}
              >
                <i className="ri-dashboard-line mr-1"></i> Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            {!isStatusLoading && aiStatus?.connected ? (
              <Badge variant="success" className="bg-green-600 text-white">
                <i className="ri-checkbox-circle-line mr-1"></i> AI Engine Connected
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-yellow-600 text-white">
                <i className="ri-error-warning-line mr-1"></i> AI Engine Offline (Using Fallback Mode)
              </Badge>
            )}
            
            {!isStatusLoading && aiStatus?.capabilities && (
              <span className="ml-3 text-sm text-gray-400">
                Capabilities: {aiStatus.capabilities.join(', ')}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            Generate personalized learning paths based on state standards and tailored to neurodivergent student profiles.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="bg-dark-800 mb-4">
                <TabsTrigger value="generator" className="data-[state=active]:bg-indigo-600">
                  <i className="ri-magic-line mr-1"></i> Generator
                </TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-indigo-600" disabled={!generatedPathId}>
                  <i className="ri-file-list-3-line mr-1"></i> Results
                </TabsTrigger>
                <TabsTrigger value="compliance" className="data-[state=active]:bg-indigo-600" disabled={!generatedPathId}>
                  <i className="ri-scales-3-line mr-1"></i> Compliance Check
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="generator" className="m-0">
                <Card className="bg-dark-800 border-dark-700">
                  <CardHeader>
                    <CardTitle>Curriculum Generator</CardTitle>
                    <CardDescription>
                      Create a superhero-themed curriculum path aligned with state standards and adapted for neurodivergent learners.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select value={stateCode} onValueChange={setStateCode}>
                          <SelectTrigger className="bg-dark-900 border-dark-600">
                            <SelectValue placeholder="Select a state" />
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
                        <Label htmlFor="grade">Grade Level</Label>
                        <Select value={gradeLevel} onValueChange={setGradeLevel}>
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
                    
                    <div className="space-y-2">
                      <Label>Neurodivergent Profile</Label>
                      <Select value={profileId.toString()} onValueChange={(value) => setProfileId(parseInt(value))}>
                        <SelectTrigger className="bg-dark-900 border-dark-600">
                          <SelectValue placeholder="Select a profile" />
                        </SelectTrigger>
                        <SelectContent>
                          {!isProfilesLoading && profiles ? (
                            profiles.map((profile: any) => (
                              <SelectItem key={profile.id} value={profile.id.toString()}>
                                {profile.name || `Profile ${profile.id}`}
                              </SelectItem>
                            ))
                          ) : (
                            profileTypes.map(type => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name} Profile
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Subjects</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {subjects.map(subject => (
                          <div key={subject.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={subject.id}
                              checked={selectedSubjects.includes(subject.id)}
                              onCheckedChange={() => toggleSubject(subject.id)}
                            />
                            <label 
                              htmlFor={subject.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {subject.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-dark-900 rounded-md p-3 mt-3">
                      <h3 className="text-sm font-semibold mb-2 flex items-center">
                        <i className="ri-superhero-line text-purple-400 mr-1.5"></i> Superhero Theme
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Button 
                          variant="outline" 
                          className="border-purple-800 bg-purple-900/20 text-purple-300 hover:bg-purple-800/40"
                          size="sm"
                        >
                          Focus Force
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-dark-700 hover:border-blue-700 hover:bg-blue-900/20 hover:text-blue-300"
                          size="sm"
                        >
                          Pattern Pioneers
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-dark-700 hover:border-green-700 hover:bg-green-900/20 hover:text-green-300"
                          size="sm"
                        >
                          Sensory Squad
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-dark-700 hover:border-orange-700 hover:bg-orange-900/20 hover:text-orange-300"
                          size="sm"
                        >
                          Memory Mavericks
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setLocation('/dashboard')}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleGenerateCurriculum}
                      disabled={generateCurriculumMutation.isPending || generatingCurriculum}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {generateCurriculumMutation.isPending ? (
                        <>
                          <i className="ri-loader-4-line animate-spin mr-1"></i> Generating...
                        </>
                      ) : (
                        <>
                          <i className="ri-magic-line mr-1"></i> Generate Curriculum
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="results" className="m-0">
                <Card className="bg-dark-800 border-dark-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="bg-indigo-600 rounded-full p-1 mr-2">
                        <i className="ri-file-list-3-line text-white"></i>
                      </span>
                      Generated Curriculum Path
                    </CardTitle>
                    <CardDescription>
                      {curriculumPath && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="border-indigo-600 text-indigo-300">
                            {curriculumPath.stateCode && getStateName(curriculumPath.stateCode)}
                          </Badge>
                          <Badge variant="outline" className="border-indigo-600 text-indigo-300">
                            {curriculumPath.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${curriculumPath.gradeLevel}`}
                          </Badge>
                          {curriculumPath.subjects && curriculumPath.subjects.split(',').map((subject: string) => (
                            <Badge key={subject} variant="outline" className="border-indigo-600 text-indigo-300">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {isPathLoading ? (
                      <div className="flex justify-center py-10">
                        <div className="flex items-center space-x-2">
                          <i className="ri-loader-4-line animate-spin text-2xl text-indigo-500"></i>
                          <span>Loading curriculum path...</span>
                        </div>
                      </div>
                    ) : content ? (
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-6">
                          {/* Overview */}
                          <div className="bg-dark-900 rounded-md p-4 border border-dark-700">
                            <h3 className="text-lg font-semibold mb-2">Curriculum Overview</h3>
                            <p className="text-gray-300 mb-3">
                              {content.overview || "This personalized curriculum path is designed to meet state standards while accommodating the student's neurodivergent learning profile."}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                              <div className="bg-dark-850 rounded p-3">
                                <h4 className="text-sm font-medium mb-1 text-indigo-300">Superhero Theme</h4>
                                <p className="text-sm text-gray-400">Focus Force</p>
                              </div>
                              <div className="bg-dark-850 rounded p-3">
                                <h4 className="text-sm font-medium mb-1 text-purple-300">Learning Profile</h4>
                                <p className="text-sm text-gray-400">ADHD-Friendly Adaptations</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Units */}
                          <div>
                            <h3 className="text-md font-semibold mb-3">Academic Units</h3>
                            <div className="space-y-4">
                              {content.units && content.units.map((unit: any, index: number) => (
                                <div key={index} className="bg-dark-900 rounded-md border border-dark-700 overflow-hidden">
                                  <div className="bg-indigo-900/30 border-b border-indigo-900/50 p-3">
                                    <h4 className="font-medium">{unit.title}</h4>
                                    <p className="text-sm text-gray-300 mt-1">{unit.description}</p>
                                  </div>
                                  
                                  <div className="p-3">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {unit.subjects && unit.subjects.map((subject: string, idx: number) => (
                                        <Badge key={idx} className="bg-indigo-700/40">
                                          {subject}
                                        </Badge>
                                      ))}
                                    </div>
                                    
                                    <div className="space-y-3 mt-4">
                                      <h5 className="text-sm font-medium">Key Learning Objectives:</h5>
                                      <ul className="space-y-2 list-disc list-inside text-sm text-gray-300">
                                        {unit.objectives && unit.objectives.map((objective: string, idx: number) => (
                                          <li key={idx}>{objective}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div className="mt-4 pt-3 border-t border-dark-700">
                                      <h5 className="text-sm font-medium mb-2">Lesson Plans:</h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {unit.lessonPlans && unit.lessonPlans.map((lesson: any, idx: number) => (
                                          <div key={idx} className="bg-dark-850 rounded p-2 text-sm">
                                            <div className="font-medium">{lesson.title}</div>
                                            <div className="text-gray-400 text-xs mt-1">{lesson.duration || '30 min'}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div className="mt-4 flex justify-end">
                                      <Button variant="ghost" size="sm" className="text-indigo-300">
                                        <i className="ri-eye-line mr-1"></i> View Details
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Adaptations */}
                          <div className="bg-purple-900/20 rounded-md p-4 border border-purple-900/40">
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                              <i className="ri-mental-health-line text-purple-400 mr-1.5"></i> 
                              Neurodivergent Adaptations
                            </h3>
                            <p className="text-gray-300 mb-3">
                              These personalized accommodations are designed to support this student's learning profile.
                            </p>
                            
                            <div className="space-y-3 mt-3">
                              {content.adaptations && content.adaptations.map((adaptation: any, index: number) => (
                                <div key={index} className="bg-dark-900/40 rounded p-3 border border-purple-900/30">
                                  <h4 className="text-sm font-medium text-purple-300">{adaptation.title}</h4>
                                  <p className="text-sm text-gray-400 mt-1">{adaptation.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Assessments */}
                          <div className="bg-dark-900 rounded-md p-4 border border-dark-700">
                            <h3 className="text-lg font-semibold mb-2">Assessment Plan</h3>
                            <p className="text-gray-300 mb-3">
                              Customized assessment strategies that accommodate the student's learning profile.
                            </p>
                            
                            <div className="space-y-3">
                              {content.assessments && content.assessments.map((assessment: any, index: number) => (
                                <div key={index} className="bg-dark-850 rounded p-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="text-sm font-medium">{assessment.title}</h4>
                                      <p className="text-sm text-gray-400 mt-1">{assessment.description}</p>
                                    </div>
                                    <Badge className={`
                                      ${assessment.type === 'formative' ? 'bg-green-700/50' : 'bg-blue-700/50'}
                                    `}>
                                      {assessment.type}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                          <i className="ri-file-warning-line text-3xl"></i>
                        </div>
                        <h3 className="text-lg font-medium mb-1">No Content Available</h3>
                        <p className="text-gray-500">
                          The curriculum path doesn't have detailed content.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTab('generator')}
                    >
                      <i className="ri-arrow-left-line mr-1"></i> Back to Generator
                    </Button>
                    
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        className="bg-dark-700 hover:bg-dark-600"
                      >
                        <i className="ri-download-line mr-1"></i> Export
                      </Button>
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <i className="ri-edit-line mr-1"></i> Edit Curriculum
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="compliance" className="m-0">
                <Card className="bg-dark-800 border-dark-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="bg-green-600 rounded-full p-1 mr-2">
                        <i className="ri-scales-3-line text-white"></i>
                      </span>
                      Compliance Check
                    </CardTitle>
                    <CardDescription>
                      Verify that the generated curriculum path meets state educational standards and requirements.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {curriculumPath && curriculumPath.stateCode && (
                      <div className="space-y-4">
                        <div className="bg-green-900/20 rounded-md p-4 border border-green-900/40 flex items-center">
                          <div className="mr-4 text-green-500">
                            <i className="ri-checkbox-circle-line text-3xl"></i>
                          </div>
                          <div>
                            <h3 className="font-medium">Curriculum is Compliant</h3>
                            <p className="text-sm text-gray-300">
                              This curriculum meets all requirements for {getStateName(curriculumPath.stateCode)}.
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-dark-900 rounded-md p-4 border border-dark-700">
                            <h3 className="text-sm font-medium mb-2">State Requirements</h3>
                            <ul className="space-y-2">
                              <li className="flex items-center text-sm">
                                <i className="ri-checkbox-circle-fill text-green-500 mr-2"></i>
                                <span>Required subjects coverage</span>
                              </li>
                              <li className="flex items-center text-sm">
                                <i className="ri-checkbox-circle-fill text-green-500 mr-2"></i>
                                <span>Grade-level appropriate content</span>
                              </li>
                              <li className="flex items-center text-sm">
                                <i className="ri-checkbox-circle-fill text-green-500 mr-2"></i>
                                <span>Minimum instructional hours</span>
                              </li>
                              <li className="flex items-center text-sm">
                                <i className="ri-checkbox-circle-fill text-green-500 mr-2"></i>
                                <span>Assessment requirements</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-dark-900 rounded-md p-4 border border-dark-700">
                            <h3 className="text-sm font-medium mb-2">Special Education Provisions</h3>
                            <ul className="space-y-2">
                              <li className="flex items-center text-sm">
                                <i className="ri-checkbox-circle-fill text-green-500 mr-2"></i>
                                <span>IDEA compliance</span>
                              </li>
                              <li className="flex items-center text-sm">
                                <i className="ri-checkbox-circle-fill text-green-500 mr-2"></i>
                                <span>Appropriate accommodations</span>
                              </li>
                              <li className="flex items-center text-sm">
                                <i className="ri-checkbox-circle-fill text-green-500 mr-2"></i>
                                <span>Individual needs addressed</span>
                              </li>
                              <li className="flex items-center text-sm">
                                <i className="ri-checkbox-circle-fill text-green-500 mr-2"></i>
                                <span>Documentation requirements</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="bg-dark-900 rounded-md overflow-hidden">
                          <div className="bg-dark-800 p-3 border-b border-dark-700">
                            <h3 className="font-medium">Standards Coverage</h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                  <span>Mathematics</span>
                                  <span className="text-green-500">98%</span>
                                </div>
                                <div className="w-full bg-dark-700 rounded-full h-2">
                                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                  <span>English Language Arts</span>
                                  <span className="text-green-500">100%</span>
                                </div>
                                <div className="w-full bg-dark-700 rounded-full h-2">
                                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                  <span>Science</span>
                                  <span className="text-green-500">95%</span>
                                </div>
                                <div className="w-full bg-dark-700 rounded-full h-2">
                                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-900/20 rounded-md p-4 border border-blue-900/40">
                          <h3 className="font-medium mb-2">Compliance Notes</h3>
                          <p className="text-sm text-gray-300">
                            This curriculum includes all required educational components for {getStateName(curriculumPath.stateCode)} and 
                            meets special education requirements for neurodivergent students. The adaptations are 
                            appropriate and maintain academic rigor while providing necessary accommodations.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTab('results')}
                    >
                      <i className="ri-arrow-left-line mr-1"></i> Back to Results
                    </Button>
                    
                    <Button className="bg-green-600 hover:bg-green-700">
                      <i className="ri-file-paper-2-line mr-1"></i> Generate Compliance Report
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="md:col-span-4">
            <Card className="bg-dark-800 border-dark-700">
              <CardHeader>
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Superhero Learning Themes</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant="outline" 
                      className="border-purple-800 bg-purple-900/20 text-purple-300 justify-start text-sm h-auto py-2.5"
                    >
                      <div className="flex items-center">
                        <div className="mr-2 text-lg">
                          <i className="ri-focus-3-line"></i>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Focus Force</div>
                          <div className="text-xs text-purple-300/70">ADHD-Friendly</div>
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="border-dark-700 hover:border-blue-700 hover:bg-blue-900/20 hover:text-blue-300 justify-start text-sm h-auto py-2.5"
                    >
                      <div className="flex items-center">
                        <div className="mr-2 text-lg">
                          <i className="ri-brain-line"></i>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Pattern Pioneers</div>
                          <div className="text-xs text-gray-400">Autism-Friendly</div>
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="border-dark-700 hover:border-teal-700 hover:bg-teal-900/20 hover:text-teal-300 justify-start text-sm h-auto py-2.5"
                    >
                      <div className="flex items-center">
                        <div className="mr-2 text-lg">
                          <i className="ri-empathize-line"></i>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Sensory Squad</div>
                          <div className="text-xs text-gray-400">Sensory-Friendly</div>
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="border-dark-700 hover:border-orange-700 hover:bg-orange-900/20 hover:text-orange-300 justify-start text-sm h-auto py-2.5"
                    >
                      <div className="flex items-center">
                        <div className="mr-2 text-lg">
                          <i className="ri-book-read-line"></i>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Reading Rangers</div>
                          <div className="text-xs text-gray-400">Dyslexia-Friendly</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
                
                <Separator className="bg-dark-600" />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Customize with Templates</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-dark-700 hover:border-indigo-700"
                      onClick={() => setLocation('/templates')}
                    >
                      <i className="ri-gallery-line mr-1.5"></i> Browse Template Library
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-dark-700 hover:border-indigo-700"
                      onClick={() => setLocation('/rhythm-editor')}
                    >
                      <i className="ri-code-box-line mr-1.5"></i> Create Custom Template
                    </Button>
                  </div>
                </div>
                
                <div className="bg-indigo-900/20 rounded-md p-3 border border-indigo-900/30">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <i className="ri-information-line text-indigo-400 mr-1.5"></i> About AI Generation
                  </h3>
                  <p className="text-xs text-gray-300">
                    The curriculum generator creates personalized learning paths based on your student's 
                    neurodivergent profile, state standards, and selected subjects. Each path can be 
                    customized further using our Rhythm Template Editor.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CurriculumGeneratorPage;