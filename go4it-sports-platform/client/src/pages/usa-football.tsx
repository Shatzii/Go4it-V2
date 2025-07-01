import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Star, 
  Users, 
  Trophy, 
  BookOpen, 
  Video, 
  CheckCircle,
  ExternalLink,
  Flag,
  Award,
  Target,
  Zap,
  Globe,
  Heart,
  GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";

export default function USAFootball() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [membershipType, setMembershipType] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    parentEmail: "",
    position: "",
    experience: "",
    schoolName: "",
    coachName: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalConditions: "",
    agreeToTerms: false,
    agreeToWaiver: false
  });

  const membershipTiers = [
    {
      name: "Youth Player",
      price: "$25/year",
      description: "For players ages 6-14",
      features: [
        "Official USA Football membership card",
        "Access to Heads Up Football curriculum",
        "Youth coaching resources",
        "Safety equipment guidelines",
        "Injury prevention training",
        "Player development tracking"
      ],
      color: "from-blue-500 to-cyan-500",
      icon: Star
    },
    {
      name: "High School Player",
      price: "$35/year",
      description: "For players ages 14-18",
      features: [
        "Everything in Youth Player",
        "Advanced technique training",
        "College recruitment resources",
        "Scholarship opportunity database",
        "Elite camp invitations",
        "Performance analytics dashboard"
      ],
      color: "from-purple-500 to-pink-500",
      icon: Trophy,
      popular: true
    },
    {
      name: "Coach Certification",
      price: "$75/year",
      description: "For coaches and mentors",
      features: [
        "USA Football coaching certification",
        "Complete Heads Up Football program",
        "Advanced safety protocols",
        "Player development curriculum",
        "Continuing education credits",
        "Coach community access"
      ],
      color: "from-green-500 to-teal-500",
      icon: Shield
    }
  ];

  const benefits = [
    {
      title: "Official USA Football Recognition",
      description: "Become a certified member of the national governing body for amateur football",
      icon: Flag,
      highlight: "Official Certification"
    },
    {
      title: "Heads Up Football Access",
      description: "Complete access to USA Football's premier player safety and development program",
      icon: Shield,
      highlight: "Safety First"
    },
    {
      title: "College Recruitment Network",
      description: "Direct access to college scouts and recruitment opportunities",
      icon: GraduationCap,
      highlight: "Scholarship Pipeline"
    },
    {
      title: "Elite Training Resources",
      description: "Professional-grade training materials and technique development",
      icon: Target,
      highlight: "Pro-Level Training"
    },
    {
      title: "Safety Certification",
      description: "Industry-leading safety protocols and injury prevention training",
      icon: Heart,
      highlight: "Injury Prevention"
    },
    {
      title: "National Tournament Access",
      description: "Eligibility for USA Football national championships and events",
      icon: Trophy,
      highlight: "Competition Ready"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms || !formData.agreeToWaiver) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and waiver to continue",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Registration Submitted",
      description: "Your USA Football membership application has been submitted. You'll receive confirmation within 24 hours.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-red-500 to-blue-500 rounded-full p-4 mr-4">
            <Flag className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              USA Football Membership
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Badge className="bg-gradient-to-r from-red-500 to-blue-500 text-white border-0">
                <Shield className="w-4 h-4 mr-1" />
                Official Affiliate
              </Badge>
              <Badge className="verified-badge">
                <CheckCircle className="w-4 h-4 mr-1" />
                Go4It Verified
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Join thousands of athletes nationwide through our official USA Football partnership. 
          Get certified, stay safe, and unlock your football potential.
        </p>
      </div>

      {/* Official Partnership Card */}
      <Card className="bg-gradient-to-br from-red-500/10 to-blue-500/10 border-red-500/30 mb-12">
        <CardContent className="p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-white rounded-lg p-4">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDg0Q0E0Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlVTQTwvdGV4dD4KPHRleHQgeD0iNTAiIHk9IjcwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Rm9vdGJhbGw8L3RleHQ+Cjwvc3ZnPgo="
                alt="USA Football Logo"
                className="w-16 h-16"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Official USA Football Affiliate</h3>
              <p className="text-slate-300 text-lg">
                Go4It Sports is proud to be an officially recognized USA Football affiliate, 
                providing direct access to membership benefits and certification programs.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">50,000+</div>
              <p className="text-slate-400">Active Members</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">15 Years</div>
              <p className="text-slate-400">Safety Leadership</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">National</div>
              <p className="text-slate-400">Recognition</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Benefits */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Membership Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 h-full achievement-glow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-red-500 to-blue-500 rounded-lg p-3">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{benefit.title}</h4>
                      <p className="text-slate-400 text-sm mb-3">{benefit.description}</p>
                      <Badge className="verified-badge text-xs">
                        {benefit.highlight}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Membership Tiers */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Membership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {membershipTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative ${tier.popular ? 'border-cyan-500 neon-glow' : 'border-slate-700'} bg-slate-800/50 h-full`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="verified-badge">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-lg bg-gradient-to-r ${tier.color} p-4 mb-4`}>
                    <tier.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{tier.price}</div>
                  <p className="text-slate-400">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-slate-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full neon-glow"
                    onClick={() => setMembershipType(tier.name)}
                  >
                    Select {tier.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Registration Form */}
      {membershipType && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-400" />
              USA Football Membership Registration
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="verified-badge">
                {membershipType} Selected
              </Badge>
              <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                Official USA Football Form
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-white">First Name *</Label>
                  <Input 
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                  <Input 
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-white">Email Address *</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dateOfBirth" className="text-white">Date of Birth *</Label>
                  <Input 
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position" className="text-white">Primary Position</Label>
                  <Select onValueChange={(value) => handleInputChange('position', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quarterback">Quarterback</SelectItem>
                      <SelectItem value="running-back">Running Back</SelectItem>
                      <SelectItem value="wide-receiver">Wide Receiver</SelectItem>
                      <SelectItem value="tight-end">Tight End</SelectItem>
                      <SelectItem value="offensive-line">Offensive Line</SelectItem>
                      <SelectItem value="defensive-line">Defensive Line</SelectItem>
                      <SelectItem value="linebacker">Linebacker</SelectItem>
                      <SelectItem value="defensive-back">Defensive Back</SelectItem>
                      <SelectItem value="special-teams">Special Teams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {membershipType !== "Coach Certification" && (
                <div>
                  <Label htmlFor="parentEmail" className="text-white">Parent/Guardian Email (if under 18) *</Label>
                  <Input 
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="schoolName" className="text-white">School/Team Name</Label>
                  <Input 
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="experience" className="text-white">Years of Experience</Label>
                  <Select onValueChange={(value) => handleInputChange('experience', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="2-3">2-3 years</SelectItem>
                      <SelectItem value="4-5">4-5 years</SelectItem>
                      <SelectItem value="6+">6+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                  />
                  <Label htmlFor="terms" className="text-white text-sm">
                    I agree to the USA Football Terms of Service and Privacy Policy *
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="waiver"
                    checked={formData.agreeToWaiver}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToWaiver: checked as boolean }))}
                  />
                  <Label htmlFor="waiver" className="text-white text-sm">
                    I agree to the liability waiver and understand the risks associated with football participation *
                  </Label>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setMembershipType("")}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
                <Button type="submit" className="neon-glow">
                  Complete USA Football Registration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Additional Resources */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Resources & Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                <ExternalLink className="w-4 h-4 mr-3" />
                USA Football Official Website
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                <Video className="w-4 h-4 mr-3" />
                Heads Up Football Training Videos
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                <Shield className="w-4 h-4 mr-3" />
                Safety Protocol Guidelines
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                <Award className="w-4 h-4 mr-3" />
                Certification Requirements
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-400" />
              Go4It Integration Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300 text-sm">Seamless GAR score integration</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300 text-sm">Automated progress tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300 text-sm">Enhanced profile verification</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300 text-sm">Priority customer support</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}