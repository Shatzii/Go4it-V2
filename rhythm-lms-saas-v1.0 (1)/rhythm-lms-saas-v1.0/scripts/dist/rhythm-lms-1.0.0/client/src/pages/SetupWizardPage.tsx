import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useLocation } from 'wouter';

interface SetupData {
  // Student Information
  studentInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gradeLevel: string;
    stateCode: string;
  };
  // Learning Profile
  learningProfile: {
    neurodivergentType: string[];
    learningStyles: string[];
    interests: string[];
    challenges: string[];
  };
  // Accessibility Preferences
  accessibility: {
    textSize: 'normal' | 'large' | 'extra-large';
    contrast: 'normal' | 'high' | 'reduced';
    motionReduction: boolean;
    audioSupport: boolean;
    visualSupports: boolean;
  };
  // Superhero Identity
  superheroIdentity: {
    name: string;
    theme: string;
    avatar: string;
    powers: string[];
  };
  // English with Sports (if applicable)
  englishSports: {
    enabled: boolean;
    sportsInterests: string[];
    englishFocus: string[];
    certificationGoals: string[];
  };
  // Parent/Guardian Settings
  parentSettings: {
    progressReports: 'daily' | 'weekly' | 'monthly';
    notifications: boolean;
    parentalControls: boolean;
    timeRestrictions: boolean;
  };
}

const SetupWizardPage: React.FC = () => {
  const [_, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState<SetupData>({
    studentInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gradeLevel: '',
      stateCode: ''
    },
    learningProfile: {
      neurodivergentType: [],
      learningStyles: [],
      interests: [],
      challenges: []
    },
    accessibility: {
      textSize: 'normal',
      contrast: 'normal',
      motionReduction: false,
      audioSupport: false,
      visualSupports: false
    },
    superheroIdentity: {
      name: '',
      theme: '',
      avatar: '',
      powers: []
    },
    englishSports: {
      enabled: false,
      sportsInterests: [],
      englishFocus: [],
      certificationGoals: []
    },
    parentSettings: {
      progressReports: 'weekly',
      notifications: true,
      parentalControls: false,
      timeRestrictions: false
    }
  });

  const totalSteps = 7;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const usStates = [
    { code: 'TX', name: 'Texas' },
    { code: 'AL', name: 'Alabama' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'CO', name: 'Colorado' },
    { code: 'GA', name: 'Georgia' },
    { code: 'CA', name: 'California' },
    { code: 'FL', name: 'Florida' },
    { code: 'NY', name: 'New York' }
  ];

  const gradeLevels = ['Pre-K', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'College'];

  const superheroThemes = [
    {
      id: 'focus-force',
      name: 'Focus Force',
      description: 'Harness your energy into focused learning and powerful attention',
      color: 'purple',
      icon: 'ri-focus-3-line',
      idealFor: 'ADHD'
    },
    {
      id: 'pattern-pioneers',
      name: 'Pattern Pioneers',
      description: 'Discover hidden patterns and solve complex problems with systematic thinking',
      color: 'blue',
      icon: 'ri-brain-line',
      idealFor: 'Autism'
    },
    {
      id: 'sensory-squad',
      name: 'Sensory Squad',
      description: 'Transform heightened sensory awareness into extraordinary perception abilities',
      color: 'teal',
      icon: 'ri-empathize-line',
      idealFor: 'Sensory Processing'
    },
    {
      id: 'vision-voyagers',
      name: 'Vision Voyagers',
      description: 'See the world differently and navigate learning with unique visual approaches',
      color: 'orange',
      icon: 'ri-eye-line',
      idealFor: 'Dyslexia'
    }
  ];

  const updateSetupData = (section: keyof SetupData, data: any) => {
    setSetupData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
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

  const completeSetup = async () => {
    try {
      // Save setup data to backend
      const response = await fetch('/api/setup/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setupData)
      });

      if (response.ok) {
        // Redirect to dashboard
        setLocation('/dashboard/1');
      }
    } catch (error) {
      console.error('Setup completion error:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <i className="ri-user-6-line mr-2 text-indigo-400"></i>
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <Input
                    id="firstName"
                    value={setupData.studentInfo.firstName}
                    onChange={(e) => updateSetupData('studentInfo', { firstName: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <Input
                    id="lastName"
                    value={setupData.studentInfo.lastName}
                    onChange={(e) => updateSetupData('studentInfo', { lastName: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth" className="text-gray-300">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={setupData.studentInfo.dateOfBirth}
                  onChange={(e) => updateSetupData('studentInfo', { dateOfBirth: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Grade Level</Label>
                  <Select onValueChange={(value) => updateSetupData('studentInfo', { gradeLevel: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeLevels.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-gray-300">State</Label>
                  <Select onValueChange={(value) => updateSetupData('studentInfo', { stateCode: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map(state => (
                        <SelectItem key={state.code} value={state.code}>{state.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <i className="ri-brain-line mr-2 text-indigo-400"></i>
                Learning Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-300 text-lg mb-4 block">Learning Differences (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['ADHD', 'Autism Spectrum', 'Dyslexia', 'Dyscalculia', 'Processing Differences', 'None'].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={setupData.learningProfile.neurodivergentType.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateSetupData('learningProfile', {
                              neurodivergentType: [...setupData.learningProfile.neurodivergentType, type]
                            });
                          } else {
                            updateSetupData('learningProfile', {
                              neurodivergentType: setupData.learningProfile.neurodivergentType.filter(t => t !== type)
                            });
                          }
                        }}
                        className="border-slate-600"
                      />
                      <Label htmlFor={type} className="text-gray-300">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div>
                <Label className="text-gray-300 text-lg mb-4 block">Learning Styles (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Visual Learning', 'Audio Learning', 'Hands-on Learning', 'Reading/Writing', 'Movement-based', 'Social Learning'].map(style => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={style}
                        checked={setupData.learningProfile.learningStyles.includes(style)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateSetupData('learningProfile', {
                              learningStyles: [...setupData.learningProfile.learningStyles, style]
                            });
                          } else {
                            updateSetupData('learningProfile', {
                              learningStyles: setupData.learningProfile.learningStyles.filter(s => s !== style)
                            });
                          }
                        }}
                        className="border-slate-600"
                      />
                      <Label htmlFor={style} className="text-gray-300">{style}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <i className="ri-settings-5-line mr-2 text-indigo-400"></i>
                Accessibility Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-300 text-lg mb-4 block">Text Size</Label>
                <RadioGroup
                  value={setupData.accessibility.textSize}
                  onValueChange={(value) => updateSetupData('accessibility', { textSize: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal" className="text-gray-300">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large" className="text-gray-300">Large</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="extra-large" id="extra-large" />
                    <Label htmlFor="extra-large" className="text-gray-300">Extra Large</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-gray-300 text-lg mb-4 block">Contrast Level</Label>
                <RadioGroup
                  value={setupData.accessibility.contrast}
                  onValueChange={(value) => updateSetupData('accessibility', { contrast: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="contrast-normal" />
                    <Label htmlFor="contrast-normal" className="text-gray-300">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="contrast-high" />
                    <Label htmlFor="contrast-high" className="text-gray-300">High Contrast</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reduced" id="contrast-reduced" />
                    <Label htmlFor="contrast-reduced" className="text-gray-300">Reduced Contrast</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="motionReduction" className="text-gray-300">Reduce Motion</Label>
                  <Switch
                    id="motionReduction"
                    checked={setupData.accessibility.motionReduction}
                    onCheckedChange={(checked) => updateSetupData('accessibility', { motionReduction: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="audioSupport" className="text-gray-300">Audio Support</Label>
                  <Switch
                    id="audioSupport"
                    checked={setupData.accessibility.audioSupport}
                    onCheckedChange={(checked) => updateSetupData('accessibility', { audioSupport: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="visualSupports" className="text-gray-300">Visual Supports</Label>
                  <Switch
                    id="visualSupports"
                    checked={setupData.accessibility.visualSupports}
                    onCheckedChange={(checked) => updateSetupData('accessibility', { visualSupports: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <i className="ri-superhero-line mr-2 text-indigo-400"></i>
                Choose Your Superhero Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="superheroName" className="text-gray-300">Superhero Name</Label>
                <Input
                  id="superheroName"
                  value={setupData.superheroIdentity.name}
                  onChange={(e) => updateSetupData('superheroIdentity', { name: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Choose your superhero name"
                />
              </div>

              <div>
                <Label className="text-gray-300 text-lg mb-4 block">Superhero Theme</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {superheroThemes.map(theme => (
                    <motion.div
                      key={theme.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          setupData.superheroIdentity.theme === theme.id
                            ? `border-${theme.color}-500 bg-${theme.color}-900/20`
                            : 'border-slate-600 bg-slate-800'
                        }`}
                        onClick={() => updateSetupData('superheroIdentity', { theme: theme.id })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-full bg-${theme.color}-600 flex items-center justify-center`}>
                              <i className={`${theme.icon} text-white`}></i>
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{theme.name}</h3>
                              <p className={`text-xs text-${theme.color}-400`}>Ideal for {theme.idealFor}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-400">{theme.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <i className="ri-basketball-line mr-2 text-indigo-400"></i>
                English with Sports (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableEnglishSports"
                  checked={setupData.englishSports.enabled}
                  onCheckedChange={(checked) => updateSetupData('englishSports', { enabled: checked })}
                />
                <Label htmlFor="enableEnglishSports" className="text-gray-300">
                  Enable English with Sports Dual Certification Program
                </Label>
              </div>

              {setupData.englishSports.enabled && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-gray-300 text-lg mb-4 block">Sports Interests</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Basketball', 'Football', 'Soccer', 'Baseball', 'Tennis', 'Swimming', 'Track & Field', 'Gymnastics', 'Volleyball'].map(sport => (
                        <div key={sport} className="flex items-center space-x-2">
                          <Checkbox
                            id={sport}
                            checked={setupData.englishSports.sportsInterests.includes(sport)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateSetupData('englishSports', {
                                  sportsInterests: [...setupData.englishSports.sportsInterests, sport]
                                });
                              } else {
                                updateSetupData('englishSports', {
                                  sportsInterests: setupData.englishSports.sportsInterests.filter(s => s !== sport)
                                });
                              }
                            }}
                            className="border-slate-600"
                          />
                          <Label htmlFor={sport} className="text-gray-300">{sport}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300 text-lg mb-4 block">English Focus Areas</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['Sports Journalism', 'Creative Writing', 'Technical Writing', 'Public Speaking', 'Literature Analysis', 'Research & Citations'].map(focus => (
                        <div key={focus} className="flex items-center space-x-2">
                          <Checkbox
                            id={focus}
                            checked={setupData.englishSports.englishFocus.includes(focus)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateSetupData('englishSports', {
                                  englishFocus: [...setupData.englishSports.englishFocus, focus]
                                });
                              } else {
                                updateSetupData('englishSports', {
                                  englishFocus: setupData.englishSports.englishFocus.filter(f => f !== focus)
                                });
                              }
                            }}
                            className="border-slate-600"
                          />
                          <Label htmlFor={focus} className="text-gray-300">{focus}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <i className="ri-parent-line mr-2 text-indigo-400"></i>
                Parent/Guardian Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-300 text-lg mb-4 block">Progress Report Frequency</Label>
                <RadioGroup
                  value={setupData.parentSettings.progressReports}
                  onValueChange={(value) => updateSetupData('parentSettings', { progressReports: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily" className="text-gray-300">Daily Updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly" className="text-gray-300">Weekly Reports</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="text-gray-300">Monthly Summaries</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="text-gray-300">Email Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={setupData.parentSettings.notifications}
                    onCheckedChange={(checked) => updateSetupData('parentSettings', { notifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="parentalControls" className="text-gray-300">Parental Controls</Label>
                  <Switch
                    id="parentalControls"
                    checked={setupData.parentSettings.parentalControls}
                    onCheckedChange={(checked) => updateSetupData('parentSettings', { parentalControls: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="timeRestrictions" className="text-gray-300">Time Restrictions</Label>
                  <Switch
                    id="timeRestrictions"
                    checked={setupData.parentSettings.timeRestrictions}
                    onCheckedChange={(checked) => updateSetupData('parentSettings', { timeRestrictions: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <i className="ri-check-line mr-2 text-green-400"></i>
                Setup Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <i className="ri-shield-star-line text-4xl text-white"></i>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome, {setupData.superheroIdentity.name || setupData.studentInfo.firstName}!
                </h2>
                <p className="text-gray-400 mb-6">
                  Your personalized learning environment is ready. Let's start your educational adventure!
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">Your Learning Profile Summary:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{setupData.studentInfo.firstName} {setupData.studentInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Grade:</span>
                    <span className="text-white">{setupData.studentInfo.gradeLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">State:</span>
                    <span className="text-white">{usStates.find(s => s.code === setupData.studentInfo.stateCode)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Superhero Identity:</span>
                    <span className="text-white">{setupData.superheroIdentity.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Theme:</span>
                    <span className="text-white">{superheroThemes.find(t => t.id === setupData.superheroIdentity.theme)?.name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 py-6 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Rhythm-LMS Setup</h1>
            <div className="text-sm">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            <i className="ri-arrow-left-line mr-1"></i>
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button onClick={completeSetup} className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <i className="ri-rocket-line mr-1"></i>
              Start Learning!
            </Button>
          ) : (
            <Button onClick={nextStep} className="bg-gradient-to-r from-indigo-600 to-purple-600">
              Next
              <i className="ri-arrow-right-line ml-1"></i>
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default SetupWizardPage;