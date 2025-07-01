import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import ProfileMedia from "@/components/enhanced/profile-media";
import StarRating from "@/components/enhanced/star-rating";
import { 
  User, 
  GraduationCap, 
  Trophy, 
  Settings, 
  Save, 
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Video,
  Camera
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: academicRecord } = useQuery({
    queryKey: ["/api/academic"],
    enabled: !!user,
  });

  const { data: achievements } = useQuery({
    queryKey: ["/api/achievements"],
    enabled: !!user,
  });

  const { data: garScores } = useQuery({
    queryKey: ["/api/gar-scores"],
    enabled: !!user,
  });

  const [profileForm, setProfileForm] = useState({
    firstName: (user as any)?.firstName || "",
    lastName: (user as any)?.lastName || "",
    email: (user as any)?.email || "",
    phone: "",
    location: "",
    bio: "",
  });

  const [academicForm, setAcademicForm] = useState({
    gpa: (academicRecord as any)?.gpa || "",
    creditsCompleted: (academicRecord as any)?.creditsCompleted || "",
    satScore: (academicRecord as any)?.satScore || "",
    courses: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/users/${user?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAcademicMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/academic", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/academic/${user?.id}`] });
      toast({
        title: "Academic Record Updated",
        description: "Your academic information has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProfileSave = () => {
    updateProfileMutation.mutate(profileForm);
  };

  const handleAcademicSave = () => {
    updateAcademicMutation.mutate({
      ...academicForm,
      gpa: parseFloat(academicForm.gpa),
      creditsCompleted: parseInt(academicForm.creditsCompleted),
      satScore: parseInt(academicForm.satScore),
    });
  };

  const getRoleDisplay = (role: string) => {
    const roleMap = {
      student: "Student Athlete",
      coach: "Coach",
      parent: "Parent",
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-slate-300 text-lg">
          Manage your account information and academic records
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="go4it-card mb-8">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <User className="text-white h-10 w-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-slate-300 mb-2">@{user?.username}</p>
              <Badge variant="secondary" className="text-primary bg-primary/20">
                {getRoleDisplay(user?.role || "")}
              </Badge>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "destructive" : "outline"}
              className="shrink-0"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="media" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="media" className="data-[state=active]:bg-primary">
            <Camera className="w-4 h-4 mr-2" />
            Media & Profile
          </TabsTrigger>
          <TabsTrigger value="personal" className="data-[state=active]:bg-primary">
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="academic" className="data-[state=active]:bg-primary">
            Academic
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-primary">
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Media & Profile Tab */}
        <TabsContent value="media">
          <ProfileMedia user={user} garScores={garScores || []} />
        </TabsContent>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card className="go4it-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-white">
                  Personal Information
                </CardTitle>
                {isEditing && (
                  <Button 
                    onClick={handleProfileSave}
                    disabled={updateProfileMutation.isPending}
                    className="bg-primary hover:bg-blue-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="bg-slate-700 border-slate-600 text-white disabled:opacity-60 neurodivergent-focus"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="bg-slate-700 border-slate-600 text-white disabled:opacity-60 neurodivergent-focus"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    disabled={!isEditing}
                    className="bg-slate-700 border-slate-600 text-white disabled:opacity-60 pl-10 neurodivergent-focus"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-700 border-slate-600 text-white disabled:opacity-60 pl-10 neurodivergent-focus"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="location"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-700 border-slate-600 text-white disabled:opacity-60 pl-10 neurodivergent-focus"
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="bg-slate-700 border-slate-600 text-white disabled:opacity-60 neurodivergent-focus"
                  placeholder="Tell us about yourself, your goals, and your athletic journey..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Information */}
        <TabsContent value="academic">
          <Card className="go4it-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-white">
                  Academic Records
                </CardTitle>
                <Button 
                  onClick={handleAcademicSave}
                  disabled={updateAcademicMutation.isPending}
                  className="bg-primary hover:bg-blue-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateAcademicMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* NCAA Eligibility Status */}
              <div className="bg-success/10 rounded-lg p-4 border border-success/20">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="text-success h-6 w-6" />
                  <div>
                    <h3 className="font-medium text-success">NCAA Eligibility Status</h3>
                    <p className="text-slate-300 text-sm">
                      {academicRecord?.isNcaaEligible ? "Eligible" : "Review Required"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gpa" className="text-white">Current GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={academicForm.gpa}
                    onChange={(e) => setAcademicForm({ ...academicForm, gpa: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white neurodivergent-focus"
                    placeholder="3.75"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credits" className="text-white">Credits Completed</Label>
                  <Input
                    id="credits"
                    type="number"
                    min="0"
                    value={academicForm.creditsCompleted}
                    onChange={(e) => setAcademicForm({ ...academicForm, creditsCompleted: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white neurodivergent-focus"
                    placeholder="86"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sat" className="text-white">SAT Score</Label>
                  <Input
                    id="sat"
                    type="number"
                    min="400"
                    max="1600"
                    value={academicForm.satScore}
                    onChange={(e) => setAcademicForm({ ...academicForm, satScore: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white neurodivergent-focus"
                    placeholder="1240"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courses" className="text-white">Current Courses</Label>
                <Textarea
                  id="courses"
                  value={academicForm.courses}
                  onChange={(e) => setAcademicForm({ ...academicForm, courses: e.target.value })}
                  rows={4}
                  className="bg-slate-700 border-slate-600 text-white neurodivergent-focus"
                  placeholder="List your current courses (one per line)..."
                />
              </div>

              {/* Academic Progress Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <h4 className="font-medium text-white mb-2">Progress to Graduation</h4>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {Math.round(((academicRecord?.creditsCompleted || 0) / (academicRecord?.totalCreditsRequired || 120)) * 100)}%
                  </div>
                  <p className="text-slate-400 text-sm">
                    {academicRecord?.creditsCompleted || 0} of {academicRecord?.totalCreditsRequired || 120} credits
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <h4 className="font-medium text-white mb-2">NCAA Requirements</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 text-sm">GPA (3.5+ required)</span>
                      <Badge variant={parseFloat(academicForm.gpa) >= 3.5 ? "default" : "destructive"}>
                        {parseFloat(academicForm.gpa) >= 3.5 ? "✓" : "✗"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 text-sm">SAT (1010+ required)</span>
                      <Badge variant={parseInt(academicForm.satScore) >= 1010 ? "default" : "destructive"}>
                        {parseInt(academicForm.satScore) >= 1010 ? "✓" : "✗"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements">
          <Card className="go4it-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {achievements && achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                            <Trophy className="text-success h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{achievement.title}</h4>
                            <p className="text-slate-300 text-sm">{achievement.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="text-success bg-success/20">
                                +{achievement.xpReward} XP
                              </Badge>
                              <span className="text-slate-400 text-xs">
                                <Calendar className="inline h-3 w-3 mr-1" />
                                {new Date(achievement.earnedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Star className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No Achievements Yet</h3>
                    <p className="text-slate-300 mb-4">
                      Complete drills, upload videos, and improve your skills to earn achievements!
                    </p>
                    <Button className="bg-primary hover:bg-blue-600">
                      Start Training
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
