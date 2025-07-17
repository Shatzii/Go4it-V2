'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Globe, Calculator, BookOpen, GraduationCap, Target } from 'lucide-react';

// NCAA Sliding Scale Data
const NCAA_SLIDING_SCALE = {
  D1: [
    { gpa: 3.550, sat: 400, act: 37 },
    { gpa: 3.525, sat: 410, act: 38 },
    { gpa: 3.500, sat: 420, act: 39 },
    { gpa: 3.475, sat: 430, act: 40 },
    { gpa: 3.450, sat: 440, act: 41 },
    { gpa: 3.425, sat: 450, act: 41 },
    { gpa: 3.400, sat: 460, act: 42 },
    { gpa: 3.375, sat: 470, act: 43 },
    { gpa: 3.350, sat: 480, act: 44 },
    { gpa: 3.325, sat: 490, act: 44 },
    { gpa: 3.300, sat: 500, act: 45 },
    { gpa: 3.275, sat: 510, act: 46 },
    { gpa: 3.250, sat: 520, act: 47 },
    { gpa: 3.225, sat: 530, act: 47 },
    { gpa: 3.200, sat: 540, act: 48 },
    { gpa: 3.175, sat: 550, act: 49 },
    { gpa: 3.150, sat: 560, act: 50 },
    { gpa: 3.125, sat: 570, act: 50 },
    { gpa: 3.100, sat: 580, act: 51 },
    { gpa: 3.075, sat: 590, act: 52 },
    { gpa: 3.050, sat: 600, act: 53 },
    { gpa: 3.025, sat: 610, act: 53 },
    { gpa: 3.000, sat: 620, act: 54 },
    { gpa: 2.975, sat: 630, act: 55 },
    { gpa: 2.950, sat: 640, act: 56 },
    { gpa: 2.925, sat: 650, act: 56 },
    { gpa: 2.900, sat: 660, act: 57 },
    { gpa: 2.875, sat: 670, act: 58 },
    { gpa: 2.850, sat: 680, act: 59 },
    { gpa: 2.825, sat: 690, act: 59 },
    { gpa: 2.800, sat: 700, act: 60 },
    { gpa: 2.775, sat: 710, act: 61 },
    { gpa: 2.750, sat: 720, act: 62 },
    { gpa: 2.725, sat: 730, act: 62 },
    { gpa: 2.700, sat: 740, act: 63 },
    { gpa: 2.675, sat: 750, act: 64 },
    { gpa: 2.650, sat: 760, act: 65 },
    { gpa: 2.625, sat: 770, act: 65 },
    { gpa: 2.600, sat: 780, act: 66 },
    { gpa: 2.575, sat: 790, act: 67 },
    { gpa: 2.550, sat: 800, act: 68 },
    { gpa: 2.525, sat: 810, act: 68 },
    { gpa: 2.500, sat: 820, act: 69 },
    { gpa: 2.475, sat: 830, act: 70 },
    { gpa: 2.450, sat: 840, act: 71 },
    { gpa: 2.425, sat: 850, act: 71 },
    { gpa: 2.400, sat: 860, act: 72 },
    { gpa: 2.375, sat: 870, act: 73 },
    { gpa: 2.350, sat: 880, act: 74 },
    { gpa: 2.325, sat: 890, act: 74 },
    { gpa: 2.300, sat: 900, act: 75 }
  ],
  D2: [
    { gpa: 2.000, sat: 840, act: 70 },
    { gpa: 2.200, sat: 800, act: 68 },
    { gpa: 2.300, sat: 780, act: 66 }
  ]
};

// International Diploma Recognition Database
const INTERNATIONAL_DIPLOMAS = {
  'United Kingdom': {
    diplomas: ['A-Levels', 'GCSE', 'International Baccalaureate', 'BTEC'],
    recognized: true,
    requirements: 'Must complete NCAA-approved core courses or equivalent',
    gpaConversion: 'UK grades converted using NCAA approved scale'
  },
  'Canada': {
    diplomas: ['High School Diploma', 'Ontario Secondary School Diploma', 'Diplôme d\'études secondaires'],
    recognized: true,
    requirements: 'Provincial graduation requirements meet NCAA standards',
    gpaConversion: 'Canadian grades directly transferable'
  },
  'Australia': {
    diplomas: ['Higher School Certificate', 'Victorian Certificate of Education', 'International Baccalaureate'],
    recognized: true,
    requirements: 'Year 12 completion with NCAA-approved subjects',
    gpaConversion: 'ATAR scores converted to 4.0 scale'
  },
  'Germany': {
    diplomas: ['Abitur', 'Fachhochschulreife', 'International Baccalaureate'],
    recognized: true,
    requirements: 'Abitur with minimum grade requirements',
    gpaConversion: 'German grades converted using WES scale'
  },
  'France': {
    diplomas: ['Baccalauréat', 'International Baccalaureate'],
    recognized: true,
    requirements: 'Baccalauréat with NCAA-approved subjects',
    gpaConversion: 'French grades converted to 4.0 scale'
  },
  'India': {
    diplomas: ['CBSE Class XII', 'ICSE Class XII', 'State Board Class XII'],
    recognized: true,
    requirements: 'Class XII with minimum 60% aggregate',
    gpaConversion: 'Indian percentage converted to 4.0 scale'
  },
  'Brazil': {
    diplomas: ['Ensino Médio', 'International Baccalaureate'],
    recognized: true,
    requirements: 'Ensino Médio completion with NCAA subjects',
    gpaConversion: 'Brazilian grades converted using approved scale'
  },
  'Mexico': {
    diplomas: ['Bachillerato', 'Preparatoria', 'International Baccalaureate'],
    recognized: true,
    requirements: 'Bachillerato with NCAA-approved core courses',
    gpaConversion: 'Mexican grades converted to 4.0 scale'
  },
  'South Korea': {
    diplomas: ['High School Diploma', 'International Baccalaureate'],
    recognized: true,
    requirements: 'Korean high school diploma with core subjects',
    gpaConversion: 'Korean grades converted using approved scale'
  },
  'Japan': {
    diplomas: ['High School Diploma', 'International Baccalaureate'],
    recognized: true,
    requirements: 'Japanese high school completion with NCAA subjects',
    gpaConversion: 'Japanese grades converted to 4.0 scale'
  }
};

// Core Course Requirements
const CORE_COURSES = {
  english: { required: 4, description: 'English Literature, Composition, Speech' },
  mathematics: { required: 3, description: 'Algebra I, Geometry, Algebra II or higher' },
  science: { required: 2, description: 'Biology, Chemistry, Physics, or Physical Science' },
  socialStudies: { required: 2, description: 'History, Government, Geography, Economics' },
  additionalCore: { required: 1, description: 'Foreign Language, Computer Science, or additional from above' },
  additionalAcademic: { required: 4, description: 'Additional courses from any area above, Foreign Language, Comparative Religion, or Philosophy' }
};

interface EligibilityData {
  studentType: 'domestic' | 'international';
  gpa: number;
  satScore: number;
  actScore: number;
  division: 'D1' | 'D2' | 'D3';
  coreCourses: Record<string, number>;
  country?: string;
  diplomaType?: string;
  testType: 'SAT' | 'ACT' | 'Both';
}

export default function NCAAEligibilityTracker() {
  const [data, setData] = useState<EligibilityData>({
    studentType: 'domestic',
    gpa: 0,
    satScore: 0,
    actScore: 0,
    division: 'D1',
    coreCourses: {
      english: 0,
      mathematics: 0,
      science: 0,
      socialStudies: 0,
      additionalCore: 0,
      additionalAcademic: 0
    },
    testType: 'SAT'
  });

  const [eligibilityResult, setEligibilityResult] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Calculate NCAA Eligibility
  const calculateEligibility = () => {
    const scale = NCAA_SLIDING_SCALE[data.division];
    let eligible = false;
    let requiredTest = 0;
    let testMet = false;

    // Find required test score based on GPA
    for (const entry of scale) {
      if (data.gpa >= entry.gpa) {
        requiredTest = data.testType === 'SAT' ? entry.sat : entry.act;
        testMet = data.testType === 'SAT' ? data.satScore >= entry.sat : data.actScore >= entry.act;
        eligible = testMet;
        break;
      }
    }

    // Check core courses
    const totalCoreCompleted = Object.values(data.coreCourses).reduce((sum, count) => sum + count, 0);
    const coreCoursesNeeded = Object.entries(CORE_COURSES).reduce((sum, [_, req]) => sum + req.required, 0);
    const coresMet = totalCoreCompleted >= coreCoursesNeeded;

    // Individual core requirements
    const coreRequirementsMet = Object.entries(CORE_COURSES).every(([key, req]) => 
      data.coreCourses[key] >= req.required
    );

    const overallEligible = eligible && coresMet && coreRequirementsMet;

    // Generate recommendations
    const newRecommendations = [];
    if (!testMet) {
      newRecommendations.push(`${data.testType === 'SAT' ? 'SAT' : 'ACT'} score needs to be ${requiredTest} or higher`);
    }
    if (!coresMet) {
      newRecommendations.push(`Complete ${coreCoursesNeeded - totalCoreCompleted} more core courses`);
    }
    Object.entries(CORE_COURSES).forEach(([key, req]) => {
      if (data.coreCourses[key] < req.required) {
        newRecommendations.push(`Need ${req.required - data.coreCourses[key]} more ${key} courses`);
      }
    });

    setEligibilityResult({
      eligible: overallEligible,
      testMet,
      coresMet,
      coreRequirementsMet,
      requiredTest,
      totalCoreCompleted,
      coreCoursesNeeded
    });
    setRecommendations(newRecommendations);
  };

  useEffect(() => {
    calculateEligibility();
  }, [data]);

  const getEligibilityColor = (status: boolean) => {
    return status ? 'text-green-400' : 'text-red-400';
  };

  const getEligibilityIcon = (status: boolean) => {
    return status ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" />
            NCAA Eligibility Tracker
          </h1>
          <p className="text-slate-300 text-lg">
            Complete eligibility checker with sliding scale calculator and international student support
          </p>
          <div className="mt-4 p-3 bg-primary/20 border border-primary/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">STARTER Tier Feature</span>
              </div>
              <a href="/pricing" className="text-sm text-primary hover:text-primary/80 underline">
                Upgrade to unlock full access
              </a>
            </div>
          </div>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="international" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              International
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Core Courses
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Information */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Student Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Student Type</Label>
                    <Select value={data.studentType} onValueChange={(value: 'domestic' | 'international') => 
                      setData(prev => ({ ...prev, studentType: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="domestic">Domestic Student</SelectItem>
                        <SelectItem value="international">International Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Division</Label>
                    <Select value={data.division} onValueChange={(value: 'D1' | 'D2' | 'D3') => 
                      setData(prev => ({ ...prev, division: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="D1">Division I</SelectItem>
                        <SelectItem value="D2">Division II</SelectItem>
                        <SelectItem value="D3">Division III</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Core Course GPA</Label>
                    <Input
                      type="number"
                      step="0.01"
                      max="4.0"
                      value={data.gpa}
                      onChange={(e) => setData(prev => ({ ...prev, gpa: parseFloat(e.target.value) || 0 }))}
                      className="bg-slate-700 border-slate-600"
                      placeholder="3.0"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Test Score Preference</Label>
                    <Select value={data.testType} onValueChange={(value: 'SAT' | 'ACT' | 'Both') => 
                      setData(prev => ({ ...prev, testType: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAT">SAT Score</SelectItem>
                        <SelectItem value="ACT">ACT Score</SelectItem>
                        <SelectItem value="Both">Both Scores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(data.testType === 'SAT' || data.testType === 'Both') && (
                    <div>
                      <Label className="text-slate-300">SAT Score</Label>
                      <Input
                        type="number"
                        max="1600"
                        value={data.satScore}
                        onChange={(e) => setData(prev => ({ ...prev, satScore: parseInt(e.target.value) || 0 }))}
                        className="bg-slate-700 border-slate-600"
                        placeholder="1200"
                      />
                    </div>
                  )}

                  {(data.testType === 'ACT' || data.testType === 'Both') && (
                    <div>
                      <Label className="text-slate-300">ACT Score</Label>
                      <Input
                        type="number"
                        max="36"
                        value={data.actScore}
                        onChange={(e) => setData(prev => ({ ...prev, actScore: parseInt(e.target.value) || 0 }))}
                        className="bg-slate-700 border-slate-600"
                        placeholder="24"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sliding Scale Results */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Sliding Scale Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {eligibilityResult && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <span className="text-slate-300">Overall Eligibility</span>
                        <div className={`flex items-center gap-2 ${getEligibilityColor(eligibilityResult.eligible)}`}>
                          {getEligibilityIcon(eligibilityResult.eligible)}
                          <span className="font-semibold">
                            {eligibilityResult.eligible ? 'Eligible' : 'Not Eligible'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <span className="text-slate-300">Test Score Requirement</span>
                        <div className={`flex items-center gap-2 ${getEligibilityColor(eligibilityResult.testMet)}`}>
                          {getEligibilityIcon(eligibilityResult.testMet)}
                          <span className="font-semibold">
                            {eligibilityResult.testMet ? 'Met' : `Need ${eligibilityResult.requiredTest}+`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <span className="text-slate-300">Core Courses</span>
                        <div className={`flex items-center gap-2 ${getEligibilityColor(eligibilityResult.coresMet)}`}>
                          {getEligibilityIcon(eligibilityResult.coresMet)}
                          <span className="font-semibold">
                            {eligibilityResult.totalCoreCompleted}/{eligibilityResult.coreCoursesNeeded}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* International Tab */}
          <TabsContent value="international" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">International Student Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Country</Label>
                    <Select value={data.country} onValueChange={(value) => 
                      setData(prev => ({ ...prev, country: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(INTERNATIONAL_DIPLOMAS).map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {data.country && (
                    <>
                      <div>
                        <Label className="text-slate-300">Diploma Type</Label>
                        <Select value={data.diplomaType} onValueChange={(value) => 
                          setData(prev => ({ ...prev, diplomaType: value }))}>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue placeholder="Select your diploma type" />
                          </SelectTrigger>
                          <SelectContent>
                            {INTERNATIONAL_DIPLOMAS[data.country].diplomas.map(diploma => (
                              <SelectItem key={diploma} value={diploma}>{diploma}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Alert className="bg-slate-700 border-slate-600">
                        <Globe className="w-4 h-4" />
                        <AlertDescription className="text-slate-300">
                          <strong>Recognition Status:</strong> {INTERNATIONAL_DIPLOMAS[data.country].recognized ? 'Recognized' : 'Not Recognized'}
                          <br />
                          <strong>Requirements:</strong> {INTERNATIONAL_DIPLOMAS[data.country].requirements}
                          <br />
                          <strong>GPA Conversion:</strong> {INTERNATIONAL_DIPLOMAS[data.country].gpaConversion}
                        </AlertDescription>
                      </Alert>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Core Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(CORE_COURSES).map(([key, course]) => (
                <Card key={key} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-300">Courses Completed</Label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={data.coreCourses[key]}
                          onChange={(e) => setData(prev => ({
                            ...prev,
                            coreCourses: {
                              ...prev.coreCourses,
                              [key]: parseInt(e.target.value) || 0
                            }
                          }))}
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-slate-400 mb-1">
                          <span>Required: {course.required}</span>
                          <span>Completed: {data.coreCourses[key]}</span>
                        </div>
                        <Progress 
                          value={(data.coreCourses[key] / course.required) * 100} 
                          className="h-2"
                        />
                      </div>
                      <p className="text-sm text-slate-400">{course.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Eligibility Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {eligibilityResult && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className={`text-6xl font-bold mb-4 ${getEligibilityColor(eligibilityResult.eligible)}`}>
                        {eligibilityResult.eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                      </div>
                      <p className="text-slate-300">
                        {eligibilityResult.eligible 
                          ? 'You meet all NCAA requirements for athletic eligibility!'
                          : 'You need to complete the requirements below to become eligible.'
                        }
                      </p>
                    </div>

                    {recommendations.length > 0 && (
                      <div className="bg-slate-700 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          Action Items
                        </h4>
                        <ul className="space-y-2">
                          {recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-slate-300">
                              <span className="text-yellow-400">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-700 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white mb-1">{data.gpa.toFixed(2)}</div>
                        <div className="text-sm text-slate-400">Core GPA</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {data.testType === 'SAT' ? data.satScore : data.actScore}
                        </div>
                        <div className="text-sm text-slate-400">{data.testType} Score</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {Object.values(data.coreCourses).reduce((sum, count) => sum + count, 0)}
                        </div>
                        <div className="text-sm text-slate-400">Core Courses</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}