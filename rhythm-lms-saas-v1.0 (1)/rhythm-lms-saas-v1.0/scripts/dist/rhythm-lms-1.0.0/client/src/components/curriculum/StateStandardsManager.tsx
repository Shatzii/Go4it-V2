import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { StateStandard } from '@shared/schema';
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ChevronRight, Filter, PlusCircle } from 'lucide-react';

// US States for dropdown
const US_STATES = [
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
  { code: 'WY', name: 'Wyoming' },
];

// Common academic subjects
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

// Grade levels
const GRADE_LEVELS = [
  'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];

interface StateStandardsManagerProps {
  onStandardSelect?: (standard: StateStandard) => void;
  neurodivergentFocus?: boolean;
}

export const StateStandardsManager: React.FC<StateStandardsManagerProps> = ({ 
  onStandardSelect,
  neurodivergentFocus = true
}) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [newStandard, setNewStandard] = useState<Partial<StateStandard>>({
    stateCode: '',
    stateName: '',
    subject: '',
    gradeLevel: '',
    standardCode: '',
    description: '',
    category: '',
    subcategory: '',
    keywords: []
  });

  const queryClient = useQueryClient();

  // Fetch standards based on filters
  const { data: standards, isLoading } = useQuery({
    queryKey: ['/api/standards', selectedState, selectedSubject, selectedGrade],
    queryFn: async () => {
      if (!selectedState) return [];
      
      let url = `/api/standards?state=${selectedState}`;
      if (selectedSubject) url += `&subject=${selectedSubject}`;
      if (selectedGrade) url += `&grade=${selectedGrade}`;
      
      return apiRequest<StateStandard[]>({ url, method: 'GET' });
    },
    enabled: !!selectedState
  });

  // Add a new standard
  const addStandardMutation = useMutation({
    mutationFn: async (standardData: Partial<StateStandard>) => {
      return apiRequest({
        url: '/api/standards',
        method: 'POST',
        body: standardData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/standards'] });
      setIsAdding(false);
      setNewStandard({
        stateCode: '',
        stateName: '',
        subject: '',
        gradeLevel: '',
        standardCode: '',
        description: '',
        category: '',
        subcategory: '',
        keywords: []
      });
    }
  });

  // Update state name when state code is selected
  useEffect(() => {
    if (newStandard.stateCode) {
      const state = US_STATES.find(s => s.code === newStandard.stateCode);
      if (state) {
        setNewStandard(prev => ({ ...prev, stateName: state.name }));
      }
    }
  }, [newStandard.stateCode]);

  // Handle adding a new standard
  const handleAddStandard = () => {
    if (newStandard.stateCode && newStandard.subject && newStandard.standardCode && newStandard.description) {
      addStandardMutation.mutate(newStandard as StateStandard);
    }
  };

  // Filter standards by search query
  const filteredStandards = standards?.filter(standard => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      standard.description.toLowerCase().includes(query) ||
      standard.category.toLowerCase().includes(query) ||
      standard.standardCode.toLowerCase().includes(query) ||
      (standard.subcategory && standard.subcategory.toLowerCase().includes(query))
    );
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Academic Standards Manager</span>
          {neurodivergentFocus && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              Neurodivergent Focus
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Access and manage academic standards for all 50 US states, aligned with neurodivergent learning profiles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="browse">
          <TabsList className="mb-6">
            <TabsTrigger value="browse">Browse Standards</TabsTrigger>
            <TabsTrigger value="add">Add Standard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="state-select">State</Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger id="state-select">
                    <SelectValue placeholder="Select a state" />
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
                <Label htmlFor="subject-select">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject-select">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subjects</SelectItem>
                    {SUBJECTS.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="grade-select">Grade Level</Label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger id="grade-select">
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Grades</SelectItem>
                    {GRADE_LEVELS.map(grade => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search standards by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !selectedState ? (
              <div className="text-center p-8 text-muted-foreground">
                Please select a state to view standards
              </div>
            ) : filteredStandards && filteredStandards.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Standard Code</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStandards.map((standard) => (
                      <TableRow key={standard.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onStandardSelect && onStandardSelect(standard)}>
                        <TableCell className="font-medium">{standard.standardCode}</TableCell>
                        <TableCell>{standard.subject}</TableCell>
                        <TableCell>{standard.gradeLevel}</TableCell>
                        <TableCell className="max-w-md truncate">{standard.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{standard.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No standards found matching your criteria
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="add">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="new-state">State</Label>
                  <Select 
                    value={newStandard.stateCode as string} 
                    onValueChange={(value) => setNewStandard({...newStandard, stateCode: value})}
                  >
                    <SelectTrigger id="new-state">
                      <SelectValue placeholder="Select a state" />
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
                  <Label htmlFor="new-subject">Subject</Label>
                  <Select 
                    value={newStandard.subject as string} 
                    onValueChange={(value) => setNewStandard({...newStandard, subject: value})}
                  >
                    <SelectTrigger id="new-subject">
                      <SelectValue placeholder="Select a subject" />
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
                
                <div>
                  <Label htmlFor="new-grade">Grade Level</Label>
                  <Select 
                    value={newStandard.gradeLevel as string} 
                    onValueChange={(value) => setNewStandard({...newStandard, gradeLevel: value})}
                  >
                    <SelectTrigger id="new-grade">
                      <SelectValue placeholder="Select a grade" />
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
              </div>
              
              <div>
                <Label htmlFor="standard-code">Standard Code</Label>
                <Input 
                  id="standard-code" 
                  value={newStandard.standardCode as string} 
                  onChange={(e) => setNewStandard({...newStandard, standardCode: e.target.value})} 
                  placeholder="e.g., MATH.3.NBT.1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newStandard.description as string} 
                  onChange={(e) => setNewStandard({...newStandard, description: e.target.value})} 
                  placeholder="Describe the academic standard..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    value={newStandard.category as string} 
                    onChange={(e) => setNewStandard({...newStandard, category: e.target.value})} 
                    placeholder="e.g., Number & Operations"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                  <Input 
                    id="subcategory" 
                    value={newStandard.subcategory as string} 
                    onChange={(e) => setNewStandard({...newStandard, subcategory: e.target.value})} 
                    placeholder="e.g., Place Value"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Input 
                  id="keywords" 
                  value={newStandard.keywords?.join(', ') || ''} 
                  onChange={(e) => setNewStandard({
                    ...newStandard, 
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                  })} 
                  placeholder="e.g., place value, rounding, estimation"
                />
              </div>
              
              {neurodivergentFocus && (
                <div className="bg-purple-50 p-4 rounded-md border border-purple-200 mt-4">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Neurodivergent Learning Considerations</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Add specific accommodations and adaptations for different neurodivergent learning profiles.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label htmlFor="adhd-considerations" className="text-purple-800">ADHD Adaptations</Label>
                      <Textarea 
                        id="adhd-considerations" 
                        placeholder="Describe specific adaptations for students with ADHD..."
                        className="border-purple-200 focus-visible:ring-purple-400"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="autism-considerations" className="text-purple-800">Autism Spectrum Adaptations</Label>
                      <Textarea 
                        id="autism-considerations" 
                        placeholder="Describe specific adaptations for students with autism..."
                        className="border-purple-200 focus-visible:ring-purple-400"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dyslexia-considerations" className="text-purple-800">Dyslexia Adaptations</Label>
                      <Textarea 
                        id="dyslexia-considerations" 
                        placeholder="Describe specific adaptations for students with dyslexia..."
                        className="border-purple-200 focus-visible:ring-purple-400"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleAddStandard}
                  disabled={addStandardMutation.isPending || !newStandard.stateCode || !newStandard.subject || !newStandard.standardCode || !newStandard.description}
                >
                  {addStandardMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Standard
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};