import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { 
  ChevronLeft, 
  User, 
  Star, 
  Share2, 
  Heart, 
  Video, 
  ImageIcon, 
  Trophy, 
  Calendar, 
  Mail, 
  School, 
  MapPin, 
  Flag,
  Activity,
  MessageSquare,
  Download
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SpotlightProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();

  // This would be fetched from the API in a real implementation
  const profile = {
    id: parseInt(params.id),
    name: "Marcus Johnson",
    sport: "Basketball",
    position: "Point Guard",
    school: "West High School",
    graduationYear: 2025,
    location: "Atlanta, GA",
    height: "6'2\"",
    weight: "185 lbs",
    email: "marcusjohnson@example.com",
    phone: "(555) 123-4567",
    image: null,
    coverImage: null,
    bio: "I'm a dedicated point guard with strong ball-handling skills and court vision. My basketball journey started at age 6, and I've been working hard to improve every aspect of my game. I dream of playing college basketball and eventually reaching the NBA. Currently averaging 21.5 points and 8.3 assists per game while maintaining a 3.8 GPA.",
    highlights: "Breaking ankles with his crossover since 2020",
    stats: {
      points: 21.5,
      assists: 8.3,
      rebounds: 4.2,
      steals: 2.1,
      blocks: 0.5,
      fieldGoalPercentage: 48.3,
      threePointPercentage: 39.1
    },
    academics: {
      gpa: 3.8,
      satScore: 1320,
      actScore: 28,
      academicHonors: ["National Honor Society", "Math Club President"]
    },
    highlights: [
      {
        id: 1,
        title: "Season Highlights",
        thumbnailUrl: null,
        videoUrl: "#",
        description: "Best plays from the 2023-2024 season"
      },
      {
        id: 2,
        title: "State Championship Game",
        thumbnailUrl: null,
        videoUrl: "#",
        description: "25 points, 10 assists in the championship game"
      }
    ],
    achievements: [
      "All-State First Team 2023",
      "Regional MVP 2023",
      "Team Captain",
      "School record for assists in a game (15)"
    ],
    upcomingEvents: [
      {
        id: 1,
        title: "Atlanta Summer Basketball Camp",
        date: "July 15-20, 2024",
        location: "Atlanta Sports Center"
      },
      {
        id: 2,
        title: "East Coast Elite Showcase",
        date: "August 5-7, 2024",
        location: "Washington, DC"
      }
    ],
    views: 1240,
    likes: 325,
    followers: 217
  };

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/nextup-spotlight")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Spotlight
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src="" alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-center">{profile.name}</CardTitle>
                <CardDescription className="text-center">
                  {profile.position} | {profile.sport}
                </CardDescription>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm">
                    <Heart className="mr-1 h-4 w-4" /> Follow
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="mr-1 h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <School className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{profile.school}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Class of {profile.graduationYear}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{profile.height} | {profile.weight}</span>
                </div>
                <div className="flex items-center">
                  <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">GPA: {profile.academics.gpa}</span>
                </div>
              </div>

              <Separator className="my-4" />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex flex-col items-center">
                  <span className="font-medium text-foreground">{profile.views}</span>
                  <span>Views</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium text-foreground">{profile.likes}</span>
                  <span>Likes</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium text-foreground">{profile.followers}</span>
                  <span>Followers</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Contact Information</h3>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm truncate">{profile.email}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="academics">Academics</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>About Marcus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6">{profile.bio}</p>

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">Achievements & Honors</h3>
                    <ul className="space-y-1">
                      {profile.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Key Stats</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center bg-muted rounded-lg p-3">
                        <span className="text-2xl font-bold">{profile.stats.points}</span>
                        <span className="text-xs text-muted-foreground">PPG</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted rounded-lg p-3">
                        <span className="text-2xl font-bold">{profile.stats.assists}</span>
                        <span className="text-xs text-muted-foreground">APG</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted rounded-lg p-3">
                        <span className="text-2xl font-bold">{profile.stats.rebounds}</span>
                        <span className="text-xs text-muted-foreground">RPG</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted rounded-lg p-3">
                        <span className="text-2xl font-bold">{profile.stats.steals}</span>
                        <span className="text-xs text-muted-foreground">SPG</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="highlights" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Highlight Videos</CardTitle>
                  <CardDescription>
                    Check out Marcus's best plays and performances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.highlights.map((highlight) => (
                      <Card key={highlight.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <Video className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{highlight.title}</CardTitle>
                          <CardDescription>{highlight.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full">Watch Video</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Season Statistics</CardTitle>
                  <CardDescription>
                    2023-2024 basketball season statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex flex-col items-center bg-muted rounded-lg p-4">
                      <span className="text-3xl font-bold">{profile.stats.points}</span>
                      <span className="text-sm text-muted-foreground">Points Per Game</span>
                    </div>
                    <div className="flex flex-col items-center bg-muted rounded-lg p-4">
                      <span className="text-3xl font-bold">{profile.stats.assists}</span>
                      <span className="text-sm text-muted-foreground">Assists Per Game</span>
                    </div>
                    <div className="flex flex-col items-center bg-muted rounded-lg p-4">
                      <span className="text-3xl font-bold">{profile.stats.rebounds}</span>
                      <span className="text-sm text-muted-foreground">Rebounds Per Game</span>
                    </div>
                    <div className="flex flex-col items-center bg-muted rounded-lg p-4">
                      <span className="text-3xl font-bold">{profile.stats.steals}</span>
                      <span className="text-sm text-muted-foreground">Steals Per Game</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Field Goal %</span>
                        <span>{profile.stats.fieldGoalPercentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${profile.stats.fieldGoalPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Three Point %</span>
                        <span>{profile.stats.threePointPercentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${profile.stats.threePointPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academics" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>
                    Classroom achievements and academic record
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex flex-col items-center bg-muted rounded-lg p-4">
                      <span className="text-3xl font-bold">{profile.academics.gpa}</span>
                      <span className="text-sm text-muted-foreground">GPA (4.0 Scale)</span>
                    </div>
                    <div className="flex flex-col items-center bg-muted rounded-lg p-4">
                      <span className="text-3xl font-bold">{profile.academics.satScore}</span>
                      <span className="text-sm text-muted-foreground">SAT Score</span>
                    </div>
                    <div className="flex flex-col items-center bg-muted rounded-lg p-4">
                      <span className="text-3xl font-bold">{profile.academics.actScore}</span>
                      <span className="text-sm text-muted-foreground">ACT Score</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Academic Honors</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.academics.academicHonors.map((honor, index) => (
                        <Badge key={index} variant="secondary">{honor}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Where to see Marcus play or participate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.upcomingEvents.map((event) => (
                      <Card key={event.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{event.date}</span>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                          <Button className="mt-4" variant="outline">
                            Add to Calendar
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}