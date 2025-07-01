import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  StateStandard, 
  NeurodivergentProfile, 
  CurriculumPath,
  AcademicUnit
} from '@shared/schema';
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
  Check, 
  ArrowRight, 
  Filter,
  Save,
  Eye,
  FileEdit,
  Brain,
  Sparkles,
  BookOpen
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// US States for dropdown
const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  // ... add all states
];

// Grade levels
const GRADE_LEVELS = [
  'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];

// Subjects
const SUBJECTS = [
  'Mathematics', 
  'Science', 
  'English/Language Arts', 
  'Social Studies/History',
  'Computer Science',
  'Arts',
  'Physical Education',
  'Foreign Languages',
  'STEM'
];

// Learning paces
const LEARNING_PACES = [
  { value: 'Accelerated', label: 'Accelerated Pace' },
  { value: 'Standard', label: 'Standard Pace' },
  { value: 'Extended', label: 'Extended Pace (Extra Time)' }
];

interface CurriculumPathGeneratorProps {
  studentId?: number;
  profileId?: number;
  initialState?: 'browse' | 'create';
}

export const CurriculumPathGenerator: React.FC<CurriculumPathGeneratorProps> = ({ 
  studentId,
  profileId,
  initialState = 'browse'
}) => {
  const [activeTab, setActiveTab] = useState(initialState);
  const [selectedStateCode, setSelectedStateCode] = useState<string>('');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedPace, setSelectedPace] = useState<string>('Standard');
  const [selectedProfile, setSelectedProfile] = useState<number | null>(profileId || null);
  const [selectedStandards, setSelectedStandards] = useState<number[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<{ unitId: string; adaptations: { original: string; adapted: string; reason: string; }[] }[]>([]);
  const [presentationPreferences, setPresentationPreferences] = useState({
    visualElements: 'Standard',
    audioElements: 'Standard',
    textElements: 'Standard',
    interactiveElements: 'Standard'
  });
  const [assessmentAdaptations, setAssessmentAdaptations] = useState({
    timeModifications: false,
    formatModifications: false,
    contentModifications: false,
    environmentalModifications: false,
    details: ''
  });

  const queryClient = useQueryClient();

  // Query to get all profiles
  const { data: profiles } = useQuery({
    queryKey: ['/api/profiles'],
    queryFn: async () => {
      return apiRequest<NeurodivergentProfile[]>({
        url: '/api/profiles',
        method: 'GET'
      });
    }
  });

  // Query to get student profiles if studentId is provided
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

  // Query to get curriculum paths for student
  const { data: curriculumPaths, isLoading: isLoadingPaths } = useQuery({
    queryKey: ['/api/students', studentId, 'curriculum-paths'],
    queryFn: async () => {
      return apiRequest<CurriculumPath[]>({
        url: `/api/students/${studentId}/curriculum-paths`,
        method: 'GET'
      });
    },
    enabled: !!studentId && activeTab === 'browse'
  });

  // Query to get state standards
  const { data: standards, isLoading: isLoadingStandards } = useQuery({
    queryKey: ['/api/standards', selectedStateCode, selectedSubject, selectedGradeLevel],
    queryFn: async () => {
      if (!selectedStateCode || !selectedSubject || !selectedGradeLevel) return [];
      
      return apiRequest<StateStandard[]>({
        url: `/api/standards?state=${selectedStateCode}&subject=${selectedSubject}&grade=${selectedGradeLevel}`,
        method: 'GET'
      });
    },
    enabled: !!selectedStateCode && !!selectedSubject && !!selectedGradeLevel && activeTab === 'create'
  });

  // Query to get academic units
  const { data: units, isLoading: isLoadingUnits } = useQuery({
    queryKey: ['/api/units', selectedSubject, selectedGradeLevel],
    queryFn: async () => {
      if (!selectedSubject || !selectedGradeLevel) return [];
      
      return apiRequest<AcademicUnit[]>({
        url: `/api/units?subject=${selectedSubject}&grade=${selectedGradeLevel}`,
        method: 'GET'
      });
    },
    enabled: !!selectedSubject && !!selectedGradeLevel && activeTab === 'create'
  });

  // Mutation to create curriculum path
  const createPathMutation = useMutation({
    mutationFn: async (pathData: any) => {
      return apiRequest({
        url: '/api/curriculum-paths',
        method: 'POST',
        body: pathData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/students', studentId, 'curriculum-paths'] });
      setActiveTab('browse');
      // Reset form
      setSelectedStateCode('');
      setSelectedGradeLevel('');
      setSelectedSubject('');
      setSelectedPace('Standard');
      setSelectedStandards([]);
      setSelectedUnits([]);
      setPresentationPreferences({
        visualElements: 'Standard',
        audioElements: 'Standard',
        textElements: 'Standard',
        interactiveElements: 'Standard'
      });
      setAssessmentAdaptations({
        timeModifications: false,
        formatModifications: false,
        contentModifications: false,
        environmentalModifications: false,
        details: ''
      });
    }
  });

  // Effect to set selected profile when profileId changes
  useEffect(() => {
    if (profileId) {
      setSelectedProfile(profileId);
    }
  }, [profileId]);

  // Handle toggling a standard selection
  const toggleStandardSelection = (standardId: number) => {
    if (selectedStandards.includes(standardId)) {
      setSelectedStandards(selectedStandards.filter(id => id !== standardId));
    } else {
      setSelectedStandards([...selectedStandards, standardId]);
    }
  };

  // Handle toggling a unit selection
  const toggleUnitSelection = (unitId: string) => {
    if (selectedUnits.some(u => u.unitId === unitId)) {
      setSelectedUnits(selectedUnits.filter(u => u.unitId !== unitId));
    } else {
      setSelectedUnits([...selectedUnits, { unitId, adaptations: [] }]);
    }
  };

  // Handle adding an adaptation to a unit
  const addAdaptation = (unitId: string) => {
    const unitIndex = selectedUnits.findIndex(u => u.unitId === unitId);
    if (unitIndex >= 0) {
      const updatedUnits = [...selectedUnits];
      updatedUnits[unitIndex].adaptations.push({ original: '', adapted: '', reason: '' });
      setSelectedUnits(updatedUnits);
    }
  };

  // Handle updating an adaptation
  const updateAdaptation = (unitId: string, adaptationIndex: number, field: 'original' | 'adapted' | 'reason', value: string) => {
    const unitIndex = selectedUnits.findIndex(u => u.unitId === unitId);
    if (unitIndex >= 0) {
      const updatedUnits = [...selectedUnits];
      updatedUnits[unitIndex].adaptations[adaptationIndex][field] = value;
      setSelectedUnits(updatedUnits);
    }
  };

  // Handle creating a curriculum path
  const handleCreatePath = () => {
    // Basic validation
    if (!selectedStateCode || !selectedGradeLevel || !selectedSubject || !selectedProfile) {
      alert('Please fill in all required fields');
      return;
    }

    if (selectedUnits.length === 0) {
      alert('Please select at least one unit');
      return;
    }

    // Find selected profile
    const profile = [...(profiles || []), ...(studentProfiles || [])].find(p => p.id === selectedProfile);
    if (!profile) {
      alert('Selected profile not found');
      return;
    }

    // Gather selected standards data
    const standardsData = (standards || [])
      .filter(s => selectedStandards.includes(s.id))
      .map(s => ({ id: s.id, code: s.standardCode }));

    // Create the curriculum path
    const pathData = {
      studentId: studentId || null,
      profileId: selectedProfile,
      gradeLevel: selectedGradeLevel,
      subject: selectedSubject,
      stateCode: selectedStateCode,
      standardsVersion: 'current', // This could be more dynamic
      standards: standardsData,
      units: selectedUnits,
      pace: selectedPace,
      presentationPreferences,
      assessmentAdaptations
    };

    createPathMutation.mutate(pathData);
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
        return <Sparkles className="h-5 w-5 text-orange-600" />;
      case 'Autism':
        return <Brain className="h-5 w-5 text-blue-600" />;
      case 'Dyslexia':
        return <BookOpen className="h-5 w-5 text-green-600" />;
      default:
        return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personalized Curriculum Path Generator</CardTitle>
        <CardDescription>
          Create and manage customized learning paths for neurodivergent students based on state standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="browse">Browse Paths</TabsTrigger>
            <TabsTrigger value="create">Create Path</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            {isLoadingPaths ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !curriculumPaths || curriculumPaths.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <p className="mb-4">No curriculum paths found for this student.</p>
                <Button onClick={() => setActiveTab('create')}>
                  Create New Path
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {curriculumPaths.map(path => {
                  // Find the profile
                  const profile = [...(profiles || []), ...(studentProfiles || [])].find(p => p.id === path.profileId);
                  
                  return (
                    <div 
                      key={path.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className={`p-4 ${profile ? getProfileColorClass(profile.type) : 'bg-gray-100'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {profile && getProfileIcon(profile.type)}
                            <div className="ml-2">
                              <h3 className="font-medium">{path.subject} - Grade {path.gradeLevel}</h3>
                              <p className="text-sm">{profile?.name || 'Unknown Profile'}</p>
                            </div>
                          </div>
                          <Badge>{path.stateCode} Standards</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-sm font-medium block">Learning Pace</span>
                            <span className="text-sm">{path.pace}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium block">Units</span>
                            <span className="text-sm">{path.units.length} units selected</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium block">Created</span>
                            <span className="text-sm">{new Date(path.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <Accordion type="single" collapsible>
                          <AccordionItem value="details">
                            <AccordionTrigger>View Path Details</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Presentation Preferences</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    <div>
                                      <span className="text-xs block">Visual</span>
                                      <Badge variant="outline">{path.presentationPreferences.visualElements}</Badge>
                                    </div>
                                    <div>
                                      <span className="text-xs block">Audio</span>
                                      <Badge variant="outline">{path.presentationPreferences.audioElements}</Badge>
                                    </div>
                                    <div>
                                      <span className="text-xs block">Text</span>
                                      <Badge variant="outline">{path.presentationPreferences.textElements}</Badge>
                                    </div>
                                    <div>
                                      <span className="text-xs block">Interactive</span>
                                      <Badge variant="outline">{path.presentationPreferences.interactiveElements}</Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Assessment Adaptations</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    <div>
                                      <span className="text-xs block">Time</span>
                                      <Badge variant={path.assessmentAdaptations.timeModifications ? "default" : "outline"}>
                                        {path.assessmentAdaptations.timeModifications ? "Modified" : "Standard"}
                                      </Badge>
                                    </div>
                                    <div>
                                      <span className="text-xs block">Format</span>
                                      <Badge variant={path.assessmentAdaptations.formatModifications ? "default" : "outline"}>
                                        {path.assessmentAdaptations.formatModifications ? "Modified" : "Standard"}
                                      </Badge>
                                    </div>
                                    <div>
                                      <span className="text-xs block">Content</span>
                                      <Badge variant={path.assessmentAdaptations.contentModifications ? "default" : "outline"}>
                                        {path.assessmentAdaptations.contentModifications ? "Modified" : "Standard"}
                                      </Badge>
                                    </div>
                                    <div>
                                      <span className="text-xs block">Environment</span>
                                      <Badge variant={path.assessmentAdaptations.environmentalModifications ? "default" : "outline"}>
                                        {path.assessmentAdaptations.environmentalModifications ? "Modified" : "Standard"}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {path.assessmentAdaptations.details && (
                                    <div className="mt-2">
                                      <span className="text-xs block">Details</span>
                                      <p className="text-sm">{path.assessmentAdaptations.details}</p>
                                    </div>
                                  )}
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Selected Units</h4>
                                  <ul className="space-y-2">
                                    {path.units.map((unit, index) => (
                                      <li key={index} className="text-sm">
                                        {unit.unitId}
                                        {unit.adaptations && unit.adaptations.length > 0 && (
                                          <span className="text-xs ml-2">({unit.adaptations.length} adaptations)</span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        
                        <div className="flex justify-end gap-2 mt-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Preview
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Preview this curriculum path</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="default" size="sm">
                                  <FileEdit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit this curriculum path</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create">
            <div className="space-y-6">
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h3 className="text-base font-medium text-blue-800 mb-2">Creating a New Curriculum Path</h3>
                <p className="text-sm text-blue-700">
                  This tool helps you build personalized learning paths for neurodivergent students 
                  by combining state standards, academic units, and neurodivergent learning profiles.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-base font-medium">1. Basic Information</h3>
                  
                  <div>
                    <Label htmlFor="profile-select">Neurodivergent Profile<span className="text-red-500">*</span></Label>
                    <Select 
                      value={selectedProfile?.toString() || ''} 
                      onValueChange={(value) => setSelectedProfile(parseInt(value))}
                    >
                      <SelectTrigger id="profile-select">
                        <SelectValue placeholder="Select a profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentProfiles && studentProfiles.length > 0 && (
                          <>
                            <SelectItem value="" disabled>Student's Profiles</SelectItem>
                            {studentProfiles.map(profile => (
                              <SelectItem key={profile.id} value={profile.id.toString()}>
                                {profile.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="" disabled>---------</SelectItem>
                          </>
                        )}
                        
                        <SelectItem value="" disabled>All Profiles</SelectItem>
                        {profiles?.map(profile => (
                          <SelectItem key={profile.id} value={profile.id.toString()}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="grade-select">Grade Level<span className="text-red-500">*</span></Label>
                      <Select 
                        value={selectedGradeLevel} 
                        onValueChange={setSelectedGradeLevel}
                      >
                        <SelectTrigger id="grade-select">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADE_LEVELS.map(grade => (
                            <SelectItem key={grade} value={grade}>
                              Grade {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject-select">Subject<span className="text-red-500">*</span></Label>
                      <Select 
                        value={selectedSubject} 
                        onValueChange={setSelectedSubject}
                      >
                        <SelectTrigger id="subject-select">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECTS.map(subject => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state-select">State Standards<span className="text-red-500">*</span></Label>
                      <Select 
                        value={selectedStateCode} 
                        onValueChange={setSelectedStateCode}
                      >
                        <SelectTrigger id="state-select">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map(state => (
                            <SelectItem key={state.code} value={state.code}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="pace-select">Learning Pace<span className="text-red-500">*</span></Label>
                      <Select 
                        value={selectedPace} 
                        onValueChange={setSelectedPace}
                      >
                        <SelectTrigger id="pace-select">
                          <SelectValue placeholder="Select pace" />
                        </SelectTrigger>
                        <SelectContent>
                          {LEARNING_PACES.map(pace => (
                            <SelectItem key={pace.value} value={pace.value}>
                              {pace.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">2. Presentation Preferences</h3>
                  
                  <div>
                    <Label htmlFor="visual-elements">Visual Elements</Label>
                    <RadioGroup
                      value={presentationPreferences.visualElements}
                      onValueChange={(value) => setPresentationPreferences({...presentationPreferences, visualElements: value})}
                      className="flex space-x-2 mt-1"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Standard" id="visual-standard" />
                        <Label htmlFor="visual-standard" className="text-sm">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Enhanced" id="visual-enhanced" />
                        <Label htmlFor="visual-enhanced" className="text-sm">Enhanced</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Reduced" id="visual-reduced" />
                        <Label htmlFor="visual-reduced" className="text-sm">Reduced</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="audio-elements">Audio Elements</Label>
                    <RadioGroup
                      value={presentationPreferences.audioElements}
                      onValueChange={(value) => setPresentationPreferences({...presentationPreferences, audioElements: value})}
                      className="flex space-x-2 mt-1"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Standard" id="audio-standard" />
                        <Label htmlFor="audio-standard" className="text-sm">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Enhanced" id="audio-enhanced" />
                        <Label htmlFor="audio-enhanced" className="text-sm">Enhanced</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Reduced" id="audio-reduced" />
                        <Label htmlFor="audio-reduced" className="text-sm">Reduced</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="text-elements">Text Elements</Label>
                    <RadioGroup
                      value={presentationPreferences.textElements}
                      onValueChange={(value) => setPresentationPreferences({...presentationPreferences, textElements: value})}
                      className="flex space-x-2 mt-1"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Standard" id="text-standard" />
                        <Label htmlFor="text-standard" className="text-sm">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Enhanced" id="text-enhanced" />
                        <Label htmlFor="text-enhanced" className="text-sm">Enhanced</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Reduced" id="text-reduced" />
                        <Label htmlFor="text-reduced" className="text-sm">Reduced</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Simplified" id="text-simplified" />
                        <Label htmlFor="text-simplified" className="text-sm">Simplified</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="interactive-elements">Interactive Elements</Label>
                    <RadioGroup
                      value={presentationPreferences.interactiveElements}
                      onValueChange={(value) => setPresentationPreferences({...presentationPreferences, interactiveElements: value})}
                      className="flex space-x-2 mt-1"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Standard" id="interactive-standard" />
                        <Label htmlFor="interactive-standard" className="text-sm">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Enhanced" id="interactive-enhanced" />
                        <Label htmlFor="interactive-enhanced" className="text-sm">Enhanced</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Reduced" id="interactive-reduced" />
                        <Label htmlFor="interactive-reduced" className="text-sm">Reduced</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="standards" className="border-b">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <div className="mr-2">3. Select Standards</div>
                      {selectedStandards.length > 0 && (
                        <Badge variant="outline">{selectedStandards.length} selected</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {!selectedStateCode || !selectedSubject || !selectedGradeLevel ? (
                      <div className="text-center p-6 text-muted-foreground">
                        Please select a state, subject, and grade level to view standards
                      </div>
                    ) : isLoadingStandards ? (
                      <div className="flex justify-center items-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : !standards || standards.length === 0 ? (
                      <div className="text-center p-6 text-muted-foreground">
                        No standards found for the selected criteria
                      </div>
                    ) : (
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]"></TableHead>
                              <TableHead>Code</TableHead>
                              <TableHead className="w-[60%]">Description</TableHead>
                              <TableHead>Category</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {standards.map(standard => (
                              <TableRow 
                                key={standard.id} 
                                className="cursor-pointer"
                                onClick={() => toggleStandardSelection(standard.id)}
                              >
                                <TableCell>
                                  <div className={`w-5 h-5 rounded-sm border flex items-center justify-center ${selectedStandards.includes(standard.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                    {selectedStandards.includes(standard.id) && (
                                      <Check className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">{standard.standardCode}</TableCell>
                                <TableCell>{standard.description}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{standard.category}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="units">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <div className="mr-2">4. Select Academic Units</div>
                      {selectedUnits.length > 0 && (
                        <Badge variant="outline">{selectedUnits.length} selected</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {!selectedSubject || !selectedGradeLevel ? (
                      <div className="text-center p-6 text-muted-foreground">
                        Please select a subject and grade level to view units
                      </div>
                    ) : isLoadingUnits ? (
                      <div className="flex justify-center items-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : !units || units.length === 0 ? (
                      <div className="text-center p-6 text-muted-foreground">
                        No units found for the selected criteria
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {units.map(unit => (
                          <div key={unit.id} className="border rounded-md overflow-hidden">
                            <div 
                              className={`p-4 flex justify-between items-center ${selectedUnits.some(u => u.unitId === unit.id.toString()) ? 'bg-blue-50' : 'bg-white'}`}
                              onClick={() => toggleUnitSelection(unit.id.toString())}
                            >
                              <div>
                                <h4 className="font-medium">{unit.title}</h4>
                                <p className="text-sm text-muted-foreground">{unit.description.substring(0, 100)}...</p>
                              </div>
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedUnits.some(u => u.unitId === unit.id.toString()) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                {selectedUnits.some(u => u.unitId === unit.id.toString()) && (
                                  <Check className="h-4 w-4 text-white" />
                                )}
                              </div>
                            </div>
                            
                            {selectedUnits.some(u => u.unitId === unit.id.toString()) && (
                              <div className="p-4 border-t">
                                <div className="flex justify-between items-center mb-3">
                                  <h5 className="text-sm font-medium">Unit Adaptations</h5>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => addAdaptation(unit.id.toString())}
                                  >
                                    Add Adaptation
                                  </Button>
                                </div>
                                
                                {selectedUnits.find(u => u.unitId === unit.id.toString())?.adaptations.map((adaptation, index) => (
                                  <div key={index} className="mb-3 p-3 border rounded-md space-y-2">
                                    <div>
                                      <Label className="text-xs">Original Content</Label>
                                      <input
                                        type="text"
                                        className="w-full p-2 border rounded-md text-sm"
                                        value={adaptation.original}
                                        onChange={(e) => updateAdaptation(unit.id.toString(), index, 'original', e.target.value)}
                                        placeholder="Describe the original content or activity..."
                                      />
                                    </div>
                                    
                                    <div>
                                      <Label className="text-xs">Adapted Content</Label>
                                      <input
                                        type="text"
                                        className="w-full p-2 border rounded-md text-sm"
                                        value={adaptation.adapted}
                                        onChange={(e) => updateAdaptation(unit.id.toString(), index, 'adapted', e.target.value)}
                                        placeholder="Describe how it should be adapted..."
                                      />
                                    </div>
                                    
                                    <div>
                                      <Label className="text-xs">Reason for Adaptation</Label>
                                      <input
                                        type="text"
                                        className="w-full p-2 border rounded-md text-sm"
                                        value={adaptation.reason}
                                        onChange={(e) => updateAdaptation(unit.id.toString(), index, 'reason', e.target.value)}
                                        placeholder="Why is this adaptation needed?"
                                      />
                                    </div>
                                  </div>
                                ))}
                                
                                {selectedUnits.find(u => u.unitId === unit.id.toString())?.adaptations.length === 0 && (
                                  <div className="text-sm text-muted-foreground">
                                    No adaptations added yet. Click the button above to add one.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="assessment-adaptations">
                  <AccordionTrigger>
                    5. Assessment Adaptations
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="time-modifications"
                            checked={assessmentAdaptations.timeModifications}
                            onChange={(e) => setAssessmentAdaptations({...assessmentAdaptations, timeModifications: e.target.checked})}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="time-modifications">Extended Time</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="format-modifications"
                            checked={assessmentAdaptations.formatModifications}
                            onChange={(e) => setAssessmentAdaptations({...assessmentAdaptations, formatModifications: e.target.checked})}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="format-modifications">Format Adaptations</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="content-modifications"
                            checked={assessmentAdaptations.contentModifications}
                            onChange={(e) => setAssessmentAdaptations({...assessmentAdaptations, contentModifications: e.target.checked})}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="content-modifications">Content Adjustments</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="environmental-modifications"
                            checked={assessmentAdaptations.environmentalModifications}
                            onChange={(e) => setAssessmentAdaptations({...assessmentAdaptations, environmentalModifications: e.target.checked})}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="environmental-modifications">Environmental Accommodations</Label>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="adaptation-details">Additional Details</Label>
                        <textarea
                          id="adaptation-details"
                          value={assessmentAdaptations.details}
                          onChange={(e) => setAssessmentAdaptations({...assessmentAdaptations, details: e.target.value})}
                          placeholder="Provide additional details about necessary assessment adaptations..."
                          className="w-full p-2 border rounded-md h-24"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setActiveTab('browse')}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePath}
                  disabled={createPathMutation.isPending}
                >
                  {createPathMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Create Curriculum Path
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};