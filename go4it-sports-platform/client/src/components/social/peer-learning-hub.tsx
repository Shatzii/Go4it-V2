import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Star,
  MessageCircle,
  Trophy,
  Clock,
  Target,
  Heart,
  Share2,
  Video,
  BookOpen,
  Award,
  TrendingUp,
  UserPlus,
  Calendar,
  MapPin,
  Send,
  Bookmark,
  ThumbsUp,
  ChevronRight,
  Filter,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyGroup {
  id: string;
  name: string;
  sport: string;
  description: string;
  members: number;
  maxMembers: number;
  averageGAR: number;
  nextSession: string;
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isJoined: boolean;
  isPublic: boolean;
  tags: string[];
  recentActivity: string[];
}

interface PeerMentor {
  id: string;
  name: string;
  avatar: string;
  sport: string;
  garScore: number;
  mentees: number;
  specialties: string[];
  rating: number;
  reviews: number;
  availability: 'available' | 'busy' | 'offline';
  pricePerHour?: number;
  responseTime: string;
  successStories: number;
  bio: string;
}

interface TeamChallenge {
  id: string;
  title: string;
  description: string;
  sport: string;
  participants: number;
  maxParticipants: number;
  prize: string;
  deadline: string;
  difficulty: string;
  rules: string[];
  requirements: string[];
  isParticipating: boolean;
  timeRemaining: string;
}

interface SocialPost {
  id: string;
  author: {
    name: string;
    garScore: number;
    sport: string;
    avatar: string;
    level: string;
  };
  content: string;
  type: 'achievement' | 'question' | 'tip' | 'celebration' | 'challenge';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  tags: string[];
}

interface PeerLearningHubProps {
  currentUser: {
    id: string;
    name: string;
    garScore: number;
    sport: string;
    level: string;
  };
}

export default function PeerLearningHub({ currentUser }: PeerLearningHubProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'mentors' | 'challenges'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSport, setFilterSport] = useState('all');
  const [newPost, setNewPost] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<PeerMentor | null>(null);

  // Sample data - in production, this would come from API
  const studyGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'Elite Speed Training',
      sport: 'Track & Field',
      description: 'Advanced sprint techniques and speed development for competitive athletes',
      members: 18,
      maxMembers: 25,
      averageGAR: 89.5,
      nextSession: '2025-06-12T15:00:00',
      topic: 'Acceleration Mechanics',
      level: 'advanced',
      isJoined: true,
      isPublic: true,
      tags: ['sprinting', 'technique', 'biomechanics'],
      recentActivity: ['New training video uploaded', '3 members completed drill challenge']
    },
    {
      id: '2',
      name: 'Beginner Basketball Fundamentals',
      sport: 'Basketball',
      description: 'Learn the basics of basketball with supportive peer community',
      members: 12,
      maxMembers: 20,
      averageGAR: 72.3,
      nextSession: '2025-06-11T18:30:00',
      topic: 'Shooting Form',
      level: 'beginner',
      isJoined: false,
      isPublic: true,
      tags: ['shooting', 'fundamentals', 'form'],
      recentActivity: ['Group study session scheduled', 'New member joined']
    }
  ];

  const peerMentors: PeerMentor[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: '/api/placeholder/150/150',
      sport: 'Track & Field',
      garScore: 94.8,
      mentees: 15,
      specialties: ['Sprint Training', 'Race Strategy', 'Mental Preparation'],
      rating: 4.9,
      reviews: 47,
      availability: 'available',
      pricePerHour: 45,
      responseTime: '< 2 hours',
      successStories: 23,
      bio: 'Former Olympic sprinter with 8 years coaching experience. Specialized in developing explosive speed and race tactics.'
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      avatar: '/api/placeholder/150/150',
      sport: 'Basketball',
      garScore: 91.2,
      mentees: 8,
      specialties: ['Shooting Mechanics', 'Court Vision', 'Game IQ'],
      rating: 4.8,
      reviews: 32,
      availability: 'busy',
      pricePerHour: 35,
      responseTime: '< 4 hours',
      successStories: 18,
      bio: 'College basketball coach helping players master fundamentals and develop basketball intelligence.'
    }
  ];

  const teamChallenges: TeamChallenge[] = [
    {
      id: '1',
      title: '30-Day Speed Challenge',
      description: 'Improve your 40-yard dash time over 30 days with daily training and progress tracking',
      sport: 'Track & Field',
      participants: 156,
      maxParticipants: 200,
      prize: '$500 + Equipment Package',
      deadline: '2025-07-10',
      difficulty: 'Intermediate',
      rules: ['Daily training log required', 'Weekly progress videos', 'Peer support encouraged'],
      requirements: ['Baseline 40-yard dash time', 'Commitment to daily training'],
      isParticipating: true,
      timeRemaining: '23 days remaining'
    },
    {
      id: '2',
      title: 'Free Throw Masters',
      description: 'Challenge to achieve 90%+ free throw accuracy with proper form analysis',
      sport: 'Basketball',
      participants: 89,
      maxParticipants: 150,
      prize: 'Custom Basketball + Training Session',
      deadline: '2025-06-25',
      difficulty: 'Beginner',
      rules: ['Submit 100 free throw attempts weekly', 'Form analysis feedback'],
      requirements: ['Basketball access', 'Video recording capability'],
      isParticipating: false,
      timeRemaining: '15 days remaining'
    }
  ];

  const socialPosts: SocialPost[] = [
    {
      id: '1',
      author: {
        name: 'Alex Rivera',
        garScore: 87.5,
        sport: 'Soccer',
        avatar: '/api/placeholder/100/100',
        level: 'Advanced'
      },
      content: 'Just achieved my personal best GAR score of 87.5! The key was focusing on my first touch and decision-making under pressure. Thanks to everyone in the Advanced Soccer Tactics group for the support! 🔥',
      type: 'achievement',
      timestamp: '2 hours ago',
      likes: 23,
      comments: 8,
      shares: 4,
      isLiked: false,
      media: {
        type: 'video',
        url: '/api/placeholder/video',
        thumbnail: '/api/placeholder/300/200'
      },
      tags: ['achievement', 'soccer', 'personal-best']
    },
    {
      id: '2',
      author: {
        name: 'Jordan Park',
        garScore: 79.2,
        sport: 'Basketball',
        avatar: '/api/placeholder/100/100',
        level: 'Intermediate'
      },
      content: 'Quick tip for improving shooting consistency: Focus on your follow-through and keep your shooting hand relaxed. This simple adjustment improved my accuracy by 15% in just one week!',
      type: 'tip',
      timestamp: '5 hours ago',
      likes: 45,
      comments: 12,
      shares: 18,
      isLiked: true,
      tags: ['tip', 'basketball', 'shooting']
    }
  ];

  const handleJoinGroup = (groupId: string) => {
    console.log('Joining group:', groupId);
  };

  const handleBookMentor = (mentorId: string) => {
    console.log('Booking mentor:', mentorId);
  };

  const handleJoinChallenge = (challengeId: string) => {
    console.log('Joining challenge:', challengeId);
  };

  const handleLikePost = (postId: string) => {
    console.log('Liking post:', postId);
  };

  const renderFeed = () => (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your training progress, ask questions, or celebrate achievements..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[80px] resize-none border-gray-200"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                  <Button variant="outline" size="sm">
                    <Target className="w-4 h-4 mr-2" />
                    Challenge
                  </Button>
                </div>
                <Button size="sm" disabled={!newPost.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {socialPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{post.author.name}</span>
                      <Badge variant="outline" className="text-xs">
                        GAR {post.author.garScore}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {post.author.sport}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">{post.timestamp}</div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      post.type === 'achievement' && "border-green-300 text-green-700",
                      post.type === 'tip' && "border-blue-300 text-blue-700",
                      post.type === 'question' && "border-purple-300 text-purple-700"
                    )}
                  >
                    {post.type}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-800 leading-relaxed">{post.content}</p>
                  {post.media && (
                    <div className="mt-3 rounded-lg overflow-hidden">
                      {post.media.type === 'video' ? (
                        <div className="relative bg-black rounded-lg">
                          <img 
                            src={post.media.thumbnail} 
                            alt="Video thumbnail"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button size="sm" className="rounded-full">
                              <Video className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={post.media.url} 
                          alt="Post media"
                          className="w-full h-auto rounded-lg"
                        />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "text-gray-600 hover:text-red-600",
                        post.isLiked && "text-red-600"
                      )}
                      onClick={() => handleLikePost(post.id)}
                    >
                      <Heart className={cn("w-4 h-4 mr-2", post.isLiked && "fill-current")} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                      <Share2 className="w-4 h-4 mr-2" />
                      {post.shares}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-yellow-600">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderGroups = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search study groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterSport}
          onChange={(e) => setFilterSport(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Sports</option>
          <option value="basketball">Basketball</option>
          <option value="track">Track & Field</option>
          <option value="soccer">Soccer</option>
        </select>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studyGroups.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{group.sport}</Badge>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          group.level === 'beginner' && "bg-green-100 text-green-700",
                          group.level === 'intermediate' && "bg-yellow-100 text-yellow-700",
                          group.level === 'advanced' && "bg-red-100 text-red-700"
                        )}
                      >
                        {group.level}
                      </Badge>
                    </div>
                  </div>
                  {group.isJoined && (
                    <Badge className="bg-green-100 text-green-700">Joined</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{group.members}</div>
                    <div className="text-xs text-gray-500">of {group.maxMembers} members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{group.averageGAR}</div>
                    <div className="text-xs text-gray-500">Avg GAR Score</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Next: {group.topic}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{new Date(group.nextSession).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {group.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button 
                  className="w-full"
                  variant={group.isJoined ? "outline" : "default"}
                  onClick={() => handleJoinGroup(group.id)}
                >
                  {group.isJoined ? (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      View Group
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join Group
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMentors = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search mentors by sport or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {peerMentors.map((mentor) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={mentor.avatar} />
                  <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{mentor.name}</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="outline">{mentor.sport}</Badge>
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    mentor.availability === 'available' && "bg-green-500",
                    mentor.availability === 'busy' && "bg-yellow-500",
                    mentor.availability === 'offline' && "bg-gray-400"
                  )} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{mentor.garScore}</div>
                    <div className="text-xs text-gray-500">GAR Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{mentor.mentees}</div>
                    <div className="text-xs text-gray-500">Mentees</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(mentor.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {mentor.rating} ({mentor.reviews})
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {mentor.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{mentor.specialties.length - 3}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{mentor.bio}</p>

                <div className="space-y-2 mb-4 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Response time:</span>
                    <span>{mentor.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success stories:</span>
                    <span>{mentor.successStories}</span>
                  </div>
                  {mentor.pricePerHour && (
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span>${mentor.pricePerHour}/hour</span>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full"
                  disabled={mentor.availability === 'offline'}
                  onClick={() => handleBookMentor(mentor.id)}
                >
                  {mentor.availability === 'offline' ? 'Offline' : 'Book Session'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Challenges</h2>
        <Button>
          <Trophy className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teamChallenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{challenge.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{challenge.sport}</Badge>
                      <Badge variant="secondary">{challenge.difficulty}</Badge>
                      {challenge.isParticipating && (
                        <Badge className="bg-green-100 text-green-700">Participating</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">{challenge.participants}</div>
                    <div className="text-xs text-gray-500">participants</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Prize</span>
                  </div>
                  <div className="text-yellow-700">{challenge.prize}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Deadline</div>
                    <div className="font-medium">{new Date(challenge.deadline).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Time Remaining</div>
                    <div className="font-medium text-red-600">{challenge.timeRemaining}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Requirements:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {challenge.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Rules:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {challenge.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  variant={challenge.isParticipating ? "outline" : "default"}
                  onClick={() => handleJoinChallenge(challenge.id)}
                >
                  {challenge.isParticipating ? (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Progress
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Join Challenge
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="go4it-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6" />
            Peer Learning Hub
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="feed" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <MessageCircle className="w-4 h-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Users className="w-4 h-4" />
            Study Groups
          </TabsTrigger>
          <TabsTrigger value="mentors" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Star className="w-4 h-4" />
            Mentors
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Trophy className="w-4 h-4" />
            Challenges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6">
          {renderFeed()}
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          {renderGroups()}
        </TabsContent>

        <TabsContent value="mentors" className="mt-6">
          {renderMentors()}
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          {renderChallenges()}
        </TabsContent>
      </Tabs>
    </div>
  );
}