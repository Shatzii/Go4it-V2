'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Target, User, Calendar, FileText, CreditCard, CheckCircle } from 'lucide-react';

export default function SoccerRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Player Info
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    grade: '',
    school: '',
    playerPhone: '',
    playerEmail: '',

    // Parent/Guardian Info
    parentFirstName: '',
    parentLastName: '',
    parentPhone: '',
    parentEmail: '',
    relationship: '',

    // Division & Preferences
    preferredDivision: '',
    position: '',
    experience: '',

    // Emergency & Medical
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    allergies: '',

    // Agreements
    agreesToTerms: false,
    agreesToMedical: false,
    agreesToPhotos: false,
  });

  const totalSteps = 5;
  const stepTitles = [
    'Player Information',
    'Parent/Guardian Info',
    'Division Selection',
    'Emergency & Medical',
    'Terms & Payment',
  ];

  const divisions = [
    { id: 'u8', name: 'U8', ages: '6-8 years', available: true, cost: 180 },
    { id: 'u10', name: 'U10', ages: '9-10 years', available: true, cost: 200 },
    { id: 'u12', name: 'U12', ages: '11-12 years', available: true, cost: 220 },
    { id: 'u14', name: 'U14', ages: '13-14 years', available: true, cost: 240 },
    { id: 'u16', name: 'U16', ages: '15-16 years', available: true, cost: 260 },
    { id: 'u18', name: 'U18', ages: '17-18 years', available: false, cost: 280 },
  ];

  const positions = [
    'Goalkeeper (GK)',
    'Center Back (CB)',
    'Fullback (LB/RB)',
    'Defensive Midfielder (CDM)',
    'Central Midfielder (CM)',
    'Attacking Midfielder (CAM)',
    'Winger (LW/RW)',
    'Striker (ST)',
    'No Preference',
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would submit to your team registration API
    console.log('Soccer team registration submitted:', formData);
    setCurrentStep(6); // Success step
  };

  const selectedDivision = divisions.find((d) => d.id === formData.preferredDivision);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-700 border-b border-blue-600">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <Target className="w-6 h-6 text-white mr-2" />
            <Badge variant="outline" className="text-white border-white">
              FIFA Guidelines Soccer Program
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">⚽ Soccer Team Registration</h1>
          <p className="text-blue-100">
            Join our FIFA guidelines soccer program with technical development and tactical training
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        {currentStep <= totalSteps && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {stepTitles.map((title, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep > index + 1
                        ? 'bg-blue-600 text-white'
                        : currentStep === index + 1
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {currentStep > index + 1 ? '✓' : index + 1}
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        currentStep > index + 1 ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                Step {currentStep}: {stepTitles[currentStep - 1]}
              </h2>
            </div>
          </div>
        )}

        {/* Step 1: Player Information */}
        {currentStep === 1 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Player Information
              </CardTitle>
              <CardDescription className="text-slate-400">
                Tell us about the player who will be joining the soccer team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">First Name *</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Player's first name"
                  />
                </div>
                <div>
                  <Label className="text-white">Last Name *</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Player's last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Date of Birth *</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Current Grade</Label>
                  <Select onValueChange={(value) => updateFormData('grade', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="k">Kindergarten</SelectItem>
                      <SelectItem value="1">1st Grade</SelectItem>
                      <SelectItem value="2">2nd Grade</SelectItem>
                      <SelectItem value="3">3rd Grade</SelectItem>
                      <SelectItem value="4">4th Grade</SelectItem>
                      <SelectItem value="5">5th Grade</SelectItem>
                      <SelectItem value="6">6th Grade</SelectItem>
                      <SelectItem value="7">7th Grade</SelectItem>
                      <SelectItem value="8">8th Grade</SelectItem>
                      <SelectItem value="9">9th Grade</SelectItem>
                      <SelectItem value="10">10th Grade</SelectItem>
                      <SelectItem value="11">11th Grade</SelectItem>
                      <SelectItem value="12">12th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">School</Label>
                  <Input
                    value={formData.school}
                    onChange={(e) => updateFormData('school', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Current school"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Player Phone</Label>
                  <Input
                    value={formData.playerPhone}
                    onChange={(e) => updateFormData('playerPhone', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label className="text-white">Player Email</Label>
                  <Input
                    type="email"
                    value={formData.playerEmail}
                    onChange={(e) => updateFormData('playerEmail', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="player@email.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Parent/Guardian Info - Similar to Flag Football */}
        {currentStep === 2 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Parent/Guardian Information
              </CardTitle>
              <CardDescription className="text-slate-400">
                Primary contact and consent information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Parent/Guardian First Name *</Label>
                  <Input
                    value={formData.parentFirstName}
                    onChange={(e) => updateFormData('parentFirstName', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Parent/Guardian Last Name *</Label>
                  <Input
                    value={formData.parentLastName}
                    onChange={(e) => updateFormData('parentLastName', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Phone Number *</Label>
                  <Input
                    value={formData.parentPhone}
                    onChange={(e) => updateFormData('parentPhone', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label className="text-white">Email Address *</Label>
                  <Input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => updateFormData('parentEmail', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="parent@email.com"
                  />
                </div>
                <div>
                  <Label className="text-white">Relationship to Player</Label>
                  <Select onValueChange={(value) => updateFormData('relationship', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                      <SelectItem value="grandparent">Grandparent</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Division Selection */}
        {currentStep === 3 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Division & Position Selection
              </CardTitle>
              <CardDescription className="text-slate-400">
                Choose age division and preferred playing position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-white text-lg mb-4 block">Age Division *</Label>
                <RadioGroup
                  value={formData.preferredDivision}
                  onValueChange={(value) => updateFormData('preferredDivision', value)}
                  className="space-y-3"
                >
                  {divisions.map((division) => (
                    <div key={division.id} className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={division.id}
                        id={division.id}
                        disabled={!division.available}
                        className="text-white"
                      />
                      <Label
                        htmlFor={division.id}
                        className={`flex-1 p-3 rounded border cursor-pointer transition-all ${
                          formData.preferredDivision === division.id
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : division.available
                              ? 'bg-slate-700 border-slate-600 text-white hover:border-slate-500'
                              : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{division.name} Division</div>
                            <div className="text-sm opacity-80">Ages {division.ages}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${division.cost}</div>
                            <div className="text-sm">
                              {division.available ? 'Available' : 'Full'}
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white">Preferred Position</Label>
                <Select onValueChange={(value) => updateFormData('position', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select preferred position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position.toLowerCase()}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Previous Soccer Experience</Label>
                <Select onValueChange={(value) => updateFormData('experience', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No previous experience</SelectItem>
                    <SelectItem value="recreational">Recreational/backyard play</SelectItem>
                    <SelectItem value="league">Previous league experience</SelectItem>
                    <SelectItem value="competitive">Competitive/club experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        {currentStep <= totalSteps && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-slate-600 text-slate-300"
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white">
                Next Step
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
                Complete Registration
              </Button>
            )}
          </div>
        )}

        {/* Success Step */}
        {currentStep === 6 && (
          <Card className="bg-blue-600 border-blue-500 text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Registration Successful!</h2>
              <p className="text-blue-100 mb-6">
                Welcome to the Go4It Sports Soccer program! You'll receive team assignment and
                practice schedule information via email within 48 hours.
              </p>
              <div className="space-y-2 text-blue-100">
                <p>
                  <strong>Registration ID:</strong> SC-{Date.now()}
                </p>
                <p>
                  <strong>Division:</strong> {selectedDivision?.name}
                </p>
                <p>
                  <strong>Season Cost:</strong> ${selectedDivision?.cost}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
