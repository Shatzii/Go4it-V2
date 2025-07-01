import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  GraduationCap, 
  Code, 
  Briefcase, 
  Heart, 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  Trophy,
  Users,
  Brain,
  Target,
  TrendingUp
} from 'lucide-react';

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  education: string;
  major?: string;
  graduationYear?: string;
  gpa?: string;
  experience: string;
  programmingBackground: string;
  motivationalEssay: string;
  portfolioUrl?: string;
  preferredTrack: string;
  programType: 'full-time' | 'part-time';
  startDate: string;
  hasLaptop: boolean;
  canCommitTime: boolean;
  agreeToTerms: boolean;
}

export default function InternshipApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ApplicationFormData>>({});
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ApplicationFormData>();

  const applicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      return await apiRequest('POST', '/api/internship/apply', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Application Submitted!",
        description: `Your application ID is ${data.applicationId}. Check your email for next steps.`,
      });
      setCurrentStep(5); // Success step
    },
    onError: (error) => {
      toast({
        title: "Application Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const tracks = [
    { id: 'healthcare', name: 'Healthcare AI', salary: '$95K-120K', demand: 'Very High' },
    { id: 'finance', name: 'Financial Services AI', salary: '$100K-130K', demand: 'High' },
    { id: 'manufacturing', name: 'Manufacturing AI', salary: '$90K-115K', demand: 'High' },
    { id: 'education', name: 'Education AI', salary: '$85K-110K', demand: 'Growing' },
    { id: 'professional', name: 'Professional Services AI', salary: '$88K-118K', demand: 'High' },
    { id: 'general', name: 'General AI Development', salary: '$85K-120K', demand: 'High' }
  ];

  const onSubmit = (data: ApplicationFormData) => {
    applicationMutation.mutate(data);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getProgressPercentage = () => {
    return ((currentStep - 1) / 4) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Join the Shatzii AI Internship Program
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Build your career in AI engineering with our world-class 12-month program
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <Progress value={getProgressPercentage()} className="h-2" />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round(getProgressPercentage())}% Complete</span>
            </div>
          </div>
        </div>

        {/* Program Highlights */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700 text-center">
              <CardContent className="p-4">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Average Starting Salary</p>
                <p className="text-lg font-bold text-white">$85K-130K</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 text-center">
              <CardContent className="p-4">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Job Placement Rate</p>
                <p className="text-lg font-bold text-white">95%+</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 text-center">
              <CardContent className="p-4">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Alumni Network</p>
                <p className="text-lg font-bold text-white">500+</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 text-center">
              <CardContent className="p-4">
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Real Projects</p>
                <p className="text-lg font-bold text-white">Live Clients</p>
              </CardContent>
            </Card>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                    <Input
                      id="fullName"
                      {...register('fullName', { required: 'Full name is required' })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="John Smith"
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="portfolioUrl" className="text-white">Portfolio/GitHub URL</Label>
                    <Input
                      id="portfolioUrl"
                      {...register('portfolioUrl')}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="https://github.com/yourname"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Education & Experience */}
          {currentStep === 2 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education & Experience
                </CardTitle>
                <CardDescription>Your academic and professional background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="education" className="text-white">Education Level *</Label>
                  <Select onValueChange={(value) => setValue('education', value)} required>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School / GED</SelectItem>
                      <SelectItem value="some-college">Some College</SelectItem>
                      <SelectItem value="associates">Associate's Degree</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="bootcamp">Coding Bootcamp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="major" className="text-white">Major/Field of Study</Label>
                    <Input
                      id="major"
                      {...register('major')}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Computer Science"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gpa" className="text-white">GPA (if applicable)</Label>
                    <Input
                      id="gpa"
                      {...register('gpa')}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="3.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="programmingBackground" className="text-white">Programming Experience *</Label>
                  <Textarea
                    id="programmingBackground"
                    {...register('programmingBackground', { required: 'Programming background is required' })}
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                    placeholder="Describe your programming experience, languages you know, projects you've built..."
                  />
                  {errors.programmingBackground && (
                    <p className="text-red-400 text-sm mt-1">{errors.programmingBackground.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="experience" className="text-white">Work Experience *</Label>
                  <Textarea
                    id="experience"
                    {...register('experience', { required: 'Work experience is required' })}
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                    placeholder="Describe your relevant work experience, internships, projects..."
                  />
                  {errors.experience && (
                    <p className="text-red-400 text-sm mt-1">{errors.experience.message}</p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button onClick={prevStep} variant="outline">
                    Previous
                  </Button>
                  <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Program Selection */}
          {currentStep === 3 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Program Selection
                </CardTitle>
                <CardDescription>Choose your specialization and program type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white text-lg font-medium mb-4 block">
                    Choose Your Specialization Track *
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tracks.map((track) => (
                      <div
                        key={track.id}
                        className="p-4 border border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
                        onClick={() => setValue('preferredTrack', track.id)}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="radio"
                            {...register('preferredTrack', { required: 'Please select a track' })}
                            value={track.id}
                            className="text-purple-600"
                          />
                          <h3 className="font-medium text-white">{track.name}</h3>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>Starting Salary: {track.salary}</p>
                          <p>Demand: {track.demand}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.preferredTrack && (
                    <p className="text-red-400 text-sm mt-2">{errors.preferredTrack.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-white text-lg font-medium mb-4 block">
                    Program Type *
                  </Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('programType', value as 'full-time' | 'part-time')}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 p-4 border border-slate-600 rounded-lg">
                      <RadioGroupItem value="full-time" id="full-time" />
                      <div className="flex-1">
                        <Label htmlFor="full-time" className="text-white font-medium">
                          Full-Time (12 months)
                        </Label>
                        <p className="text-sm text-gray-400">
                          40 hours/week • $15,000 tuition • Faster completion
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border border-slate-600 rounded-lg">
                      <RadioGroupItem value="part-time" id="part-time" />
                      <div className="flex-1">
                        <Label htmlFor="part-time" className="text-white font-medium">
                          Part-Time (18 months)
                        </Label>
                        <p className="text-sm text-gray-400">
                          25 hours/week • $15,000 tuition • Work while learning
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="startDate" className="text-white">Preferred Start Date *</Label>
                  <Select onValueChange={(value) => setValue('startDate', value)} required>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select your preferred start date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-07">July 2025 Cohort</SelectItem>
                      <SelectItem value="2025-10">October 2025 Cohort</SelectItem>
                      <SelectItem value="2026-01">January 2026 Cohort</SelectItem>
                      <SelectItem value="2026-04">April 2026 Cohort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between">
                  <Button onClick={prevStep} variant="outline">
                    Previous
                  </Button>
                  <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Final Details */}
          {currentStep === 4 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Tell Us Your Story
                </CardTitle>
                <CardDescription>Help us understand your motivation and goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="motivationalEssay" className="text-white">
                    Why do you want to join the Shatzii AI Internship Program? *
                  </Label>
                  <Textarea
                    id="motivationalEssay"
                    {...register('motivationalEssay', { 
                      required: 'Motivational essay is required',
                      minLength: {
                        value: 100,
                        message: 'Please write at least 100 characters'
                      }
                    })}
                    className="bg-slate-700 border-slate-600 text-white min-h-[150px]"
                    placeholder="Tell us about your passion for AI, your career goals, and how this program fits into your plans..."
                  />
                  {errors.motivationalEssay && (
                    <p className="text-red-400 text-sm mt-1">{errors.motivationalEssay.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hasLaptop" 
                      {...register('hasLaptop', { required: 'This field is required' })}
                    />
                    <Label htmlFor="hasLaptop" className="text-white">
                      I have access to a laptop suitable for development work *
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="canCommitTime" 
                      {...register('canCommitTime', { required: 'This field is required' })}
                    />
                    <Label htmlFor="canCommitTime" className="text-white">
                      I can commit the required time for my chosen program type *
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="agreeToTerms" 
                      {...register('agreeToTerms', { required: 'You must agree to the terms' })}
                    />
                    <Label htmlFor="agreeToTerms" className="text-white">
                      I agree to the program terms and $15,000 tuition commitment *
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={prevStep} variant="outline">
                    Previous
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={applicationMutation.isPending}
                  >
                    {applicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && (
            <Card className="bg-slate-800 border-slate-700 text-center">
              <CardContent className="p-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  Application Submitted Successfully!
                </h2>
                <p className="text-gray-300 mb-6">
                  Thank you for applying to the Shatzii AI Internship Program. 
                  We've received your application and will review it within 2-3 business days.
                </p>
                
                <div className="bg-slate-700 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-white mb-2">Next Steps:</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>1. Check your email for confirmation</li>
                    <li>2. Complete technical assessment when invited</li>
                    <li>3. Prepare for video interview</li>
                    <li>4. Receive acceptance notification</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => window.location.href = '/'}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}