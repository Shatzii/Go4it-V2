'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Trophy, 
  Users, 
  Star, 
  Calendar, 
  MapPin, 
  Clock, 
  GraduationCap,
  Target,
  Zap,
  CheckCircle,
  Dribbble
} from 'lucide-react';

interface RegistrationForm {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Guardian Info
  parentName: string;
  parentEmail: string;
  emergencyContact: string;
  emergencyPhone: string;
  
  // Event Selection
  eventType: 'open-house' | 'tryout' | 'both';
  
  // Universal One Interest
  universalOneInterest: boolean;
  academicPrograms: string[];
  needsAcademicSupport: boolean;
  
  // Sports Tryouts
  primarySport: string;
  secondarySports: string[];
  position: string;
  experience: string;
  previousTeams: string;
  
  // Specific Sport Tryouts
  flagFootballTryout: boolean;
  basketballTryout: boolean;
  soccerTryout: boolean;
  
  // Opt-ins
  garAnalysisOptIn: boolean;
  aiCoachingOptIn: boolean;
  recruitmentOptIn: boolean;
  
  // Additional
  transportationNeeds: boolean;
  dietaryRestrictions: string;
  specialAccommodations: string;
  
  // Account Creation
  createAccount: boolean;
  username: string;
  password: string;
}

export default function FridayNightLightsPage() {
  const [form, setForm] = useState<RegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    parentName: '',
    parentEmail: '',
    emergencyContact: '',
    emergencyPhone: '',
    eventType: 'both',
    universalOneInterest: false,
    academicPrograms: [],
    needsAcademicSupport: false,
    primarySport: '',
    secondarySports: [],
    position: '',
    experience: '',
    previousTeams: '',
    flagFootballTryout: false,
    basketballTryout: false,
    soccerTryout: false,
    garAnalysisOptIn: true,
    aiCoachingOptIn: true,
    recruitmentOptIn: true,
    transportationNeeds: false,
    dietaryRestrictions: '',
    specialAccommodations: '',
    createAccount: false,
    username: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/events/friday-night-lights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const result = await response.json();
      setSubmitResult(result);

      if (result.success) {
        console.log('Registration successful:', result);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitResult({ error: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateForm = (field: keyof RegistrationForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: 'academicPrograms' | 'secondarySports', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  if (submitResult?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-2xl mx-auto pt-16">
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Registration Confirmed!</h2>
              <p className="text-slate-300 mb-6">
                Welcome to Friday Night Lights! You're registered for our Universal One Open House and team tryouts.
              </p>
              
              {submitResult.aiRecommendations && (
                <div className="bg-slate-800/50 rounded-lg p-4 mb-6 text-left">
                  <h4 className="font-semibold text-blue-400 mb-2">AI Coach Recommendations</h4>
                  <p className="text-sm text-slate-300">{submitResult.aiRecommendations}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <strong className="text-orange-400">Registration ID:</strong>
                  <br />#{submitResult.registrationId}
                </div>
                <div>
                  <strong className="text-orange-400">Event Date:</strong>
                  <br />TBD - Check Email
                </div>
              </div>

              <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-orange-500 text-white font-bold text-lg px-6 py-2">
            <Star className="w-5 h-5 mr-2" />
            FRIDAY NIGHT LIGHTS
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            OPEN HOUSE & TRYOUTS
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Join us for Universal One Academy open house and team tryouts for flag football, basketball, and soccer
          </p>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <GraduationCap className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Universal One Academy</h3>
                <p className="text-sm text-slate-300">Learn about our comprehensive K-12 program for student athletes</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Team Tryouts</h3>
                <p className="text-sm text-slate-300">Tryout for flag football, basketball, and soccer teams</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">GAR Analysis</h3>
                <p className="text-sm text-slate-300">Free performance analysis and AI coaching session</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl">Event Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Event Type Selection */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">What interests you most?</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'open-house', label: 'Academy Open House', icon: GraduationCap },
                    { value: 'tryout', label: 'Team Tryouts', icon: Trophy },
                    { value: 'both', label: 'Both Events', icon: Star }
                  ].map(option => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={form.eventType === option.value ? "default" : "outline"}
                      className={`h-20 ${form.eventType === option.value ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                      onClick={() => updateForm('eventType', option.value)}
                    >
                      <div className="text-center">
                        <option.icon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">{option.label}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-700 my-6"></div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => updateForm('firstName', e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => updateForm('lastName', e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Guardian Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="parentName">Parent/Guardian Name</Label>
                    <Input
                      id="parentName"
                      value={form.parentName}
                      onChange={(e) => updateForm('parentName', e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parentEmail">Parent/Guardian Email</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      value={form.parentEmail}
                      onChange={(e) => updateForm('parentEmail', e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={form.emergencyContact}
                      onChange={(e) => updateForm('emergencyContact', e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={form.emergencyPhone}
                      onChange={(e) => updateForm('emergencyPhone', e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Universal One Academy Interest */}
              {(form.eventType === 'open-house' || form.eventType === 'both') && (
                <>
                  <div className="border-t border-slate-700 my-6"></div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Universal One Academy Interest</h3>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="checkbox"
                        id="universalOneInterest"
                        checked={form.universalOneInterest}
                        onChange={(e) => updateForm('universalOneInterest', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="universalOneInterest">
                        I'm interested in learning about Universal One Academy's K-12 program
                      </Label>
                    </div>

                    {form.universalOneInterest && (
                      <div className="space-y-4">
                        <div>
                          <Label>Academic Programs of Interest (select all that apply)</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {[
                              'College Prep', 'STEM Focus', 'Arts & Humanities', 
                              'Athletic Development', 'Special Education', 'Online Learning'
                            ].map(program => (
                              <div key={program} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`program-${program}`}
                                  checked={form.academicPrograms.includes(program)}
                                  onChange={() => toggleArrayField('academicPrograms', program)}
                                  className="w-4 h-4"
                                />
                                <Label htmlFor={`program-${program}`} className="text-sm">{program}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="needsAcademicSupport"
                            checked={form.needsAcademicSupport}
                            onChange={(e) => updateForm('needsAcademicSupport', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <Label htmlFor="needsAcademicSupport">
                            Student may need additional academic support services
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Team Tryouts */}
              {(form.eventType === 'tryout' || form.eventType === 'both') && (
                <>
                  <div className="border-t border-slate-700 my-6"></div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Team Tryouts</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Which sports are you trying out for? (select all that apply)</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="flagFootballTryout"
                              checked={form.flagFootballTryout}
                              onChange={(e) => updateForm('flagFootballTryout', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <Label htmlFor="flagFootballTryout" className="flex items-center gap-2">
                              <Trophy className="w-4 h-4" />
                              Flag Football
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="basketballTryout"
                              checked={form.basketballTryout}
                              onChange={(e) => updateForm('basketballTryout', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <Label htmlFor="basketballTryout" className="flex items-center gap-2">
                              <Dribbble className="w-4 h-4" />
                              Basketball
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="soccerTryout"
                              checked={form.soccerTryout}
                              onChange={(e) => updateForm('soccerTryout', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <Label htmlFor="soccerTryout" className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Soccer
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="primarySport">Primary Sport</Label>
                          <Select value={form.primarySport} onValueChange={(value) => updateForm('primarySport', value)}>
                            <SelectTrigger className="bg-slate-700 border-slate-600">
                              <SelectValue placeholder="Select primary sport" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flag-football">Flag Football</SelectItem>
                              <SelectItem value="basketball">Basketball</SelectItem>
                              <SelectItem value="soccer">Soccer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="position">Position/Role</Label>
                          <Input
                            id="position"
                            value={form.position}
                            onChange={(e) => updateForm('position', e.target.value)}
                            placeholder="e.g., Quarterback, Point Guard, Midfielder"
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select value={form.experience} onValueChange={(value) => updateForm('experience', value)}>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                            <SelectItem value="intermediate">Intermediate (2-4 years)</SelectItem>
                            <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                            <SelectItem value="elite">Elite/Competitive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="previousTeams">Previous Teams/Organizations</Label>
                        <Textarea
                          id="previousTeams"
                          value={form.previousTeams}
                          onChange={(e) => updateForm('previousTeams', e.target.value)}
                          placeholder="List any teams, clubs, or organizations you've played for..."
                          rows={3}
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Additional Services */}
              <div className="border-t border-slate-700 my-6"></div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Additional Services</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="garAnalysisOptIn"
                      checked={form.garAnalysisOptIn}
                      onChange={(e) => updateForm('garAnalysisOptIn', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="garAnalysisOptIn">
                      Yes, I want free GAR performance analysis during the event
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="aiCoachingOptIn"
                      checked={form.aiCoachingOptIn}
                      onChange={(e) => updateForm('aiCoachingOptIn', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="aiCoachingOptIn">
                      Yes, I want personalized AI coaching recommendations
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recruitmentOptIn"
                      checked={form.recruitmentOptIn}
                      onChange={(e) => updateForm('recruitmentOptIn', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="recruitmentOptIn">
                      Yes, I'm interested in college recruitment opportunities
                    </Label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="dietaryRestrictions">Dietary Restrictions/Allergies</Label>
                    <Input
                      id="dietaryRestrictions"
                      value={form.dietaryRestrictions}
                      onChange={(e) => updateForm('dietaryRestrictions', e.target.value)}
                      placeholder="List any dietary restrictions or allergies"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialAccommodations">Special Accommodations Needed</Label>
                    <Input
                      id="specialAccommodations"
                      value={form.specialAccommodations}
                      onChange={(e) => updateForm('specialAccommodations', e.target.value)}
                      placeholder="Any special accommodations needed"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Account Creation */}
              <div className="border-t border-slate-700 my-6"></div>
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="createAccount"
                    checked={form.createAccount}
                    onChange={(e) => updateForm('createAccount', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="createAccount">
                    Create a Go4It Sports account to track progress and access features
                  </Label>
                </div>

                {form.createAccount && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={form.username}
                        onChange={(e) => updateForm('username', e.target.value)}
                        required={form.createAccount}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={(e) => updateForm('password', e.target.value)}
                        required={form.createAccount}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="text-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 px-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Register for Friday Night Lights'}
                </Button>
              </div>

              {submitResult?.error && (
                <div className="text-center text-red-400 mt-4">
                  {submitResult.error}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}