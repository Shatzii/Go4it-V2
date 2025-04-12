import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  MessageCircle, 
  Bell, 
  Settings, 
  Heart, 
  Share2, 
  MessageSquare, 
  UserPlus, 
  Video, 
  Star, 
  Calendar, 
  Activity, 
  Bookmark, 
  PlayCircle, 
  Award, 
  MoreHorizontal, 
  FileText, 
  Search,
  Send,
  Image,
  MapPin,
  ThumbsUp,
  Clock
} from 'lucide-react';

/**
 * Athlete Social Connection Hub
 * A platform for athletes to connect, share achievements, find mentors, and build their network
 */
export default function AthleteSocialHub() {
  const [activeTab, setActiveTab] = useState("feed");
  const [postContent, setPostContent] = useState("");
  const { toast } = useToast();

  // Sample data for athletes
  const athletes = [
    {
      id: 1,
      name: "Michael James",
      username: "mjames22",
      avatar: "/avatars/michael.jpg",
      sport: "Basketball",
      level: "Elite Prospect",
      followers: 423,
      following: 156,
      achievements: ["3-Point Contest Winner", "All-State Team", "Summer League MVP"],
      location: "Dallas, TX",
      recentActivity: "Posted a new highlight video",
      isFollowing: true
    },
    {
      id: 2,
      name: "Jessica Williams",
      username: "jwilliams15",
      avatar: "/avatars/jessica.jpg",
      sport: "Soccer",
      level: "Rising Star",
      followers: 312,
      following: 208,
      achievements: ["State Champion", "Goal Scoring Leader", "Team Captain"],
      location: "Portland, OR",
      recentActivity: "Attending Summer Elite Camp",
      isFollowing: true
    },
    {
      id: 3,
      name: "Tyrone Jackson",
      username: "tjackson7",
      avatar: "/avatars/tyrone.jpg",
      sport: "Football",
      level: "Elite Prospect",
      followers: 512,
      following: 187,
      achievements: ["State Champion", "All-Conference Team", "4.3s 40-yard dash"],
      location: "Miami, FL",
      recentActivity: "Posted combine results",
      isFollowing: false
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      username: "erodriguez12",
      avatar: "/avatars/emma.jpg",
      sport: "Volleyball",
      level: "Rising Star",
      followers: 276,
      following: 204,
      achievements: ["State Semifinals", "Team MVP", "Perfect Setting Award"],
      location: "Chicago, IL",
      recentActivity: "Shared skill development drill",
      isFollowing: false
    },
    {
      id: 5,
      name: "David Chen",
      username: "dchen8",
      avatar: "/avatars/david.jpg",
      sport: "Swimming",
      level: "Standout Performer",
      followers: 198,
      following: 150,
      achievements: ["Regional Champion 100m Freestyle", "School Record Holder"],
      location: "San Jose, CA",
      recentActivity: "Posted new personal best time",
      isFollowing: true
    }
  ];

  // Sample data for posts
  const posts = [
    {
      id: 1,
      user: athletes[0],
      content: "Just finished an amazing practice session! Working on my 3-point shot and ball handling. 🏀 #GrindNeverStops #BasketballLife",
      media: "/videos/basketball-training.jpg",
      mediaType: "image",
      likes: 87,
      comments: 12,
      shares: 5,
      time: "2 hours ago",
      liked: true,
      saved: false
    },
    {
      id: 2,
      user: athletes[1],
      content: "Proud to announce I've been invited to the Elite Soccer Camp this summer! Can't wait to learn from the best coaches and players. ⚽️ #SoccerJourney #EliteCamp",
      media: null,
      mediaType: null,
      likes: 124,
      comments: 23,
      shares: 8,
      time: "5 hours ago",
      liked: false,
      saved: true
    },
    {
      id: 3,
      user: athletes[2],
      content: "My combine results are in! 40-yard: 4.38s, Vertical: 38.5\", Bench press: 18 reps. All the hard work is paying off! 💪 #CombineReady #FootballLife",
      media: "/videos/combine-results.jpg",
      mediaType: "image",
      likes: 157,
      comments: 31,
      shares: 14,
      time: "1 day ago",
      liked: true,
      saved: true
    },
    {
      id: 4,
      user: athletes[4],
      content: "New personal best in 100m freestyle! 49.37 seconds. Coach says I'm on track for nationals qualification. 🏊‍♂️ #SwimLife #PersonalBest",
      media: "/videos/swimming-race.jpg",
      mediaType: "image",
      likes: 92,
      comments: 15,
      shares: 3,
      time: "2 days ago",
      liked: false,
      saved: false
    },
    {
      id: 5,
      user: athletes[3],
      content: "Check out this setting drill that helped me improve my accuracy and consistency! Perfect for any volleyball players looking to level up their game. #VolleyballDrills #SkillDevelopment",
      media: "/videos/volleyball-drill.mp4",
      mediaType: "video",
      likes: 73,
      comments: 18,
      shares: 22,
      time: "3 days ago",
      liked: true,
      saved: false
    }
  ];

  // Sample data for events
  const events = [
    {
      id: 1,
      title: "Summer Elite Combine",
      description: "Showcase your skills to college recruiters and pro scouts",
      date: "June 15, 2025",
      time: "9:00 AM - 3:00 PM",
      location: "Metro Sports Complex, Dallas, TX",
      attendees: 156,
      sports: ["Basketball", "Football"],
      isRegistered: true
    },
    {
      id: 2,
      title: "Leadership & Team Building Workshop",
      description: "Develop leadership skills essential for team success",
      date: "July 8, 2025",
      time: "1:00 PM - 4:00 PM",
      location: "Student Athletic Center, Houston, TX",
      attendees: 68,
      sports: ["All Sports"],
      isRegistered: false
    },
    {
      id: 3,
      title: "Fall Prospect Camp",
      description: "Get noticed by college coaches and recruiters",
      date: "September 24, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "University Athletic Center, Austin, TX",
      attendees: 224,
      sports: ["Basketball", "Football", "Soccer", "Volleyball"],
      isRegistered: false
    }
  ];

  // Sample data for messages
  const messages = [
    {
      id: 1,
      user: athletes[0],
      messages: [
        { id: 1, content: "Hey, saw your highlight video. That crossover move was sick!", sent: false, time: "Yesterday, 4:32 PM" },
        { id: 2, content: "Thanks man! Been working on it all summer. What did you think of the step-back three?", sent: true, time: "Yesterday, 4:45 PM" },
        { id: 3, content: "That was even better! You free to run some 1-on-1 this weekend?", sent: false, time: "Yesterday, 5:01 PM" },
        { id: 4, content: "Definitely! Saturday morning at the park courts?", sent: true, time: "Yesterday, 5:10 PM" },
        { id: 5, content: "Perfect, see you there at 10!", sent: false, time: "Yesterday, 5:15 PM" }
      ],
      unread: 0
    },
    {
      id: 2,
      user: athletes[1],
      messages: [
        { id: 1, content: "Congrats on making it to the Elite Camp!", sent: true, time: "2 days ago, 3:15 PM" },
        { id: 2, content: "Thank you! I'm so excited. Are you going to any camps this summer?", sent: false, time: "2 days ago, 3:30 PM" },
        { id: 3, content: "I'm doing the Performance Academy in July. I heard it's really good for skill development.", sent: true, time: "2 days ago, 3:42 PM" }
      ],
      unread: 1
    },
    {
      id: 3,
      user: athletes[2],
      messages: [
        { id: 1, content: "Those combine numbers are impressive! What's your training routine like?", sent: true, time: "1 day ago, 10:22 AM" },
        { id: 2, content: "Thanks! I do strength training 3x a week, speed work 2x, and skill training every day. Plus a lot of recovery work.", sent: false, time: "1 day ago, 11:05 AM" },
        { id: 3, content: "Would you mind sharing your speed workout? I'm trying to improve my 40 time.", sent: true, time: "1 day ago, 11:18 AM" },
        { id: 4, content: "For sure! I'll send you my program later today.", sent: false, time: "1 day ago, 11:25 AM" }
      ],
      unread: 2
    }
  ];

  // Sample recommended mentors
  const mentors = [
    {
      id: 1,
      name: "Coach Thompson",
      avatar: "/avatars/coach1.jpg",
      sport: "Basketball",
      specialty: "Shooting & Ball Handling",
      experience: "15 years",
      rating: 4.9,
      athletes: 143,
      available: true
    },
    {
      id: 2,
      name: "Coach Rodriguez",
      avatar: "/avatars/coach2.jpg",
      sport: "Soccer",
      specialty: "Footwork & Game Strategy",
      experience: "12 years",
      rating: 4.8,
      athletes: 127,
      available: true
    },
    {
      id: 3,
      name: "Coach Williams",
      avatar: "/avatars/coach3.jpg",
      sport: "Football",
      specialty: "Speed & Strength",
      experience: "20 years",
      rating: 4.7,
      athletes: 189,
      available: false
    }
  ];

  const handleFollow = (athleteId: number) => {
    toast({
      title: "Following athlete",
      description: "You are now following this athlete"
    });
  };

  const handleUnfollow = (athleteId: number) => {
    toast({
      title: "Unfollowed athlete",
      description: "You are no longer following this athlete"
    });
  };

  const handleLike = (postId: number) => {
    toast({
      title: "Liked post",
      description: "You liked this post"
    });
  };

  const handleSave = (postId: number) => {
    toast({
      title: "Post saved",
      description: "Post saved to your bookmarks"
    });
  };

  const handleSubmitPost = () => {
    if (postContent.trim()) {
      toast({
        title: "Post created",
        description: "Your post has been published"
      });
      setPostContent("");
    }
  };

  const handleRegisterEvent = (eventId: number) => {
    toast({
      title: "Registration successful",
      description: "You've registered for this event"
    });
  };

  const handleConnectMentor = (mentorId: number) => {
    toast({
      title: "Connection request sent",
      description: "Your request has been sent to the mentor"
    });
  };

  return (
    <>
      <Helmet>
        <title>Athlete Social Hub | Go4It Sports</title>
      </Helmet>
      
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Athlete Social Hub</h1>
            <p className="text-muted-foreground">
              Connect with athletes, share achievements, and build your network
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Profile Section */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/avatars/user.jpg" alt="Profile" />
                  <AvatarFallback>AP</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">Alex Patterson</CardTitle>
                <Badge className="mt-1">Basketball • Point Guard</Badge>
                <CardDescription className="mt-2">Standout Performer</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 text-center gap-2 mb-4">
                <div className="flex flex-col">
                  <span className="text-lg font-bold">487</span>
                  <span className="text-xs text-muted-foreground">Connections</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">32</span>
                  <span className="text-xs text-muted-foreground">Posts</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">15</span>
                  <span className="text-xs text-muted-foreground">Achievements</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '85%' }} />
                </div>
                
                <Button className="w-full mt-4" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Complete Profile
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Recent Achievements</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">District Championship MVP</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">3-Point Contest Winner</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">All-Conference Team</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  View All Achievements
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="feed">
                  <Activity className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Feed</span>
                </TabsTrigger>
                <TabsTrigger value="discover">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Discover</span>
                </TabsTrigger>
                <TabsTrigger value="mentors">
                  <Star className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Mentors</span>
                </TabsTrigger>
                <TabsTrigger value="events">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Events</span>
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Messages</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Feed Tab */}
              <TabsContent value="feed" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src="/avatars/user.jpg" alt="Profile" />
                          <AvatarFallback>AP</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea 
                            placeholder="Share your achievements, questions, or training insights..." 
                            className="resize-none"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                          />
                          <div className="flex justify-between mt-3">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Image className="h-4 w-4 mr-2" />
                                Photo
                              </Button>
                              <Button variant="outline" size="sm">
                                <Video className="h-4 w-4 mr-2" />
                                Video
                              </Button>
                            </div>
                            <Button size="sm" onClick={handleSubmitPost} disabled={!postContent.trim()}>
                              <Send className="h-4 w-4 mr-2" />
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={post.user.avatar} alt={post.user.name} />
                            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{post.user.name}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>@{post.user.username}</span>
                              <span className="mx-1">•</span>
                              <span>{post.time}</span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Save Post</DropdownMenuItem>
                            <DropdownMenuItem>Report Post</DropdownMenuItem>
                            <DropdownMenuItem>Hide Posts from this User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm mb-3">{post.content}</p>
                      
                      {post.media && (
                        <div className="rounded-md overflow-hidden mb-3">
                          {post.mediaType === 'image' ? (
                            <img 
                              src={post.media} 
                              alt="Post media" 
                              className="w-full object-cover" 
                              style={{ maxHeight: '400px' }}
                            />
                          ) : (
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                <Button variant="outline" className="bg-black/50 text-white border-white/20 hover:bg-black/70">
                                  <PlayCircle className="h-6 w-6 mr-2" />
                                  Play Video
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground" 
                            onClick={() => handleLike(post.id)}
                          >
                            <Heart className={`h-4 w-4 mr-1 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <Share2 className="h-4 w-4 mr-1" />
                            {post.shares}
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSave(post.id)}
                          className="text-muted-foreground"
                        >
                          <Bookmark className={`h-4 w-4 ${post.saved ? 'fill-primary text-primary' : ''}`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button variant="outline" className="w-full">
                  Load More Posts
                </Button>
              </TabsContent>
              
              {/* Discover Tab */}
              <TabsContent value="discover" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Discover Athletes</CardTitle>
                    <CardDescription>
                      Find and connect with athletes in your sport or location
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="flex items-center space-x-2 p-2">
                      <Input placeholder="Search athletes, sports, or locations..." className="flex-1" />
                      <Button>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                      {athletes.map((athlete) => (
                        <Card key={athlete.id} className="flex overflow-hidden">
                          <CardContent className="p-4 flex-1">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarImage src={athlete.avatar} alt={athlete.name} />
                                <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold truncate">{athlete.name}</h3>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <span>@{athlete.username}</span>
                                      <span className="mx-1">•</span>
                                      <span>{athlete.sport}</span>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="ml-2 truncate">
                                    {athlete.level}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>{athlete.location}</span>
                                </div>
                                
                                <div className="flex items-center space-x-3 mt-2 text-xs">
                                  <div>
                                    <span className="font-semibold">{athlete.followers}</span>
                                    <span className="ml-1 text-muted-foreground">Followers</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold">{athlete.following}</span>
                                    <span className="ml-1 text-muted-foreground">Following</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center mt-3">
                                  {athlete.isFollowing ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="w-full"
                                      onClick={() => handleUnfollow(athlete.id)}
                                    >
                                      Following
                                    </Button>
                                  ) : (
                                    <Button 
                                      size="sm" 
                                      className="w-full"
                                      onClick={() => handleFollow(athlete.id)}
                                    >
                                      <UserPlus className="h-4 w-4 mr-2" />
                                      Follow
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline">
                      Load More Athletes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Mentors Tab */}
              <TabsContent value="mentors" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Find a Mentor</CardTitle>
                    <CardDescription>
                      Connect with experienced coaches and former athletes who can help you improve
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {mentors.map((mentor) => (
                          <Card key={mentor.id}>
                            <CardHeader className="text-center pb-2">
                              <Avatar className="h-16 w-16 mx-auto">
                                <AvatarImage src={mentor.avatar} alt={mentor.name} />
                                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <CardTitle className="mt-2 text-lg">{mentor.name}</CardTitle>
                              <Badge>{mentor.sport}</Badge>
                            </CardHeader>
                            <CardContent className="text-center pb-2">
                              <div className="text-sm text-muted-foreground mb-3">
                                {mentor.specialty}
                              </div>
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="flex flex-col items-center">
                                  <span className="text-sm font-medium">{mentor.experience}</span>
                                  <span className="text-xs text-muted-foreground">Experience</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium mr-1">{mentor.rating}</span>
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  </div>
                                  <span className="text-xs text-muted-foreground">Rating</span>
                                </div>
                              </div>
                              <div className="text-sm mb-3">
                                <span className="font-medium">{mentor.athletes}</span>
                                <span className="text-muted-foreground"> athletes mentored</span>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button 
                                className="w-full" 
                                disabled={!mentor.available}
                                onClick={() => handleConnectMentor(mentor.id)}
                              >
                                {mentor.available ? 'Connect with Mentor' : 'Currently Unavailable'}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Want to become a mentor?</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          If you have experience and knowledge to share, consider applying to become a mentor on the Go4It platform.
                        </p>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Apply to Mentor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Events Tab */}
              <TabsContent value="events" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>
                      Find and register for combines, camps, workshops, and other events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {events.map((event) => (
                        <div key={event.id} className="border rounded-md p-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="flex items-start gap-3">
                              <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{event.title}</h3>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm mt-2">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span>{event.date}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {event.sports.map((sport) => (
                                    <Badge key={sport} variant="outline">{sport}</Badge>
                                  ))}
                                  <Badge variant="secondary">
                                    <Users className="h-3 w-3 mr-1" />
                                    {event.attendees} Attending
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {event.isRegistered ? (
                              <div className="flex flex-col gap-2 items-center">
                                <Badge variant="default" className="mb-1">Registered</Badge>
                                <Button variant="outline" size="sm">View Details</Button>
                              </div>
                            ) : (
                              <Button onClick={() => handleRegisterEvent(event.id)}>Register</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline">
                      Explore All Events
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Messages Tab */}
              <TabsContent value="messages" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>
                      Stay connected with your teammates, coaches, and mentors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {messages.map((conversation) => (
                        <div 
                          key={conversation.id} 
                          className="flex items-center gap-3 p-3 rounded-md hover:bg-accent cursor-pointer"
                        >
                          <Avatar>
                            <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                            <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <h3 className="font-semibold truncate">{conversation.user.name}</h3>
                              <span className="text-xs text-muted-foreground">
                                {conversation.messages[conversation.messages.length - 1].time.split(',')[0]}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.messages[conversation.messages.length - 1].content}
                            </p>
                          </div>
                          {conversation.unread > 0 && (
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-xs text-white">{conversation.unread}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      New Message
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}