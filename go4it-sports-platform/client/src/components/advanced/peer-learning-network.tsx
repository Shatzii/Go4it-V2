import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Star, 
  Trophy, 
  Video, 
  Calendar,
  Search,
  UserPlus,
  Heart,
  Share2,
  BookOpen,
  Target,
  Zap
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import StarRating from "../enhanced/star-rating";

interface StudyGroup {
  id: string;
  name: string;
  sport: string;
  members: number;
  maxMembers: number;
  averageGAR: number;
  nextSession: string;
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isJoined: boolean;
}

interface PeerMentor {
  id: string;
  name: string;
  sport: string;
  garScore: number;
  mentees: number;
  specialties: string[];
  rating: number;
  reviews: number;
  availability: 'available' | 'busy' | 'offline';
  pricePerHour?: number;
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
  isParticipating: boolean;
}

interface SocialPost {
  id: string;
  author: {
    name: string;
    garScore: number;
    sport: string;
    avatar: string;
  };
  content: string;
  type: 'achievement' | 'question' | 'tip' | 'celebration';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  media?: string;
}

export default function PeerLearningNetwork() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');

  const studyGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'Elite Basketball Fundamentals',
      sport: 'Basketball',
      members: 8,
      maxMembers: 12,
      averageGAR: 89,
      nextSession: 'Today 7:00 PM',
      topic: 'Advanced Shooting Mechanics',
      level: 'advanced',
      isJoined: true
    },
    {
      id: '2',
      name: 'Soccer Strategy Masters',
      sport: 'Soccer',
      members: 15,
      maxMembers: 20,
      averageGAR: 92,
      nextSession: 'Tomorrow 6:30 PM',
      topic: 'Tactical Positioning',
      level: 'advanced',
      isJoined: false
    },
    {
      id: '3',
      name: 'Tennis Technique Clinic',
      sport: 'Tennis',
      members: 6,
      maxMembers: 10,
      averageGAR: 76,
      nextSession: 'Friday 4:00 PM',
      topic: 'Serve Consistency',
      level: 'intermediate',
      isJoined: false
    }
  ];

  const peerMentors: PeerMentor[] = [
    {
      id: '1',
      name: 'Marcus Thompson',
      sport: 'Basketball',
      garScore: 96,
      mentees: 12,
      specialties: ['Shooting', 'Mental Game', 'Leadership'],
      rating: 4.9,
      reviews: 47,
      availability: 'available',
      pricePerHour: 50
    },
    {
      id: '2',
      name: 'Sofia Rodriguez',
      sport: 'Soccer',
      garScore: 94,
      mentees: 18,
      specialties: ['Footwork', 'Game Strategy', 'Fitness'],
      rating: 4.8,
      reviews: 62,
      availability: 'busy'
    },
    {
      id: '3',
      name: 'Alex Chen',
      sport: 'Tennis',
      garScore: 91,
      mentees: 8,
      specialties: ['Technique', 'Mental Training', 'Match Play'],
      rating: 4.7,
      reviews: 33,
      availability: 'available',
      pricePerHour: 40
    }
  ];

  const teamChallenges: TeamChallenge[] = [
    {
      id: '1',
      title: 'December Fitness Challenge',
      description: 'Complete 100 hours of training across your team this month',
      sport: 'Multi-Sport',
      participants: 234,
      maxParticipants: 500,
      prize: 'Team Equipment Package ($2,500 value)',
      deadline: '2024-12-31',
      difficulty: 'Intermediate',
      isParticipating: true
    },
    {
      id: '2',
      title: 'Perfect Form Week',
      description: 'Achieve 90+ technique scores in 5 consecutive training sessions',
      sport: 'Basketball',
      participants: 89,
      maxParticipants: 200,
      prize: 'Private Coaching Session with Pro Athlete',
      deadline: '2024-12-20',
      difficulty: 'Advanced',
      isParticipating: false
    }
  ];

  const socialPosts: SocialPost[] = [
    {
      id: '1',
      author: {
        name: 'Emma Wilson',
        garScore: 88,
        sport: 'Basketball',
        avatar: '/api/placeholder/40/40'
      },
      content: 'Just hit my personal best GAR score of 88! The visualization techniques from our study group really helped. Thank you @Marcus for the amazing coaching tips! 🏀',
      type: 'achievement',
      timestamp: '2 hours ago',
      likes: 23,
      comments: 8,
      shares: 3,
      isLiked: false,
      media: '/api/placeholder/400/300'
    },
    {
      id: '2',
      author: {
        name: 'Jordan Lee',
        garScore: 76,
        sport: 'Soccer',
        avatar: '/api/placeholder/40/40'
      },
      content: 'Quick tip for better ball control: Practice juggling while walking backwards. It forces you to maintain better balance and touch. Works every time!',
      type: 'tip',
      timestamp: '4 hours ago',
      likes: 42,
      comments: 15,
      shares: 12,
      isLiked: true
    },
    {
      id: '3',
      author: {
        name: 'Taylor Martinez',
        garScore: 82,
        sport: 'Tennis',
        avatar: '/api/placeholder/40/40'
      },
      content: 'Looking for study partners for the upcoming tournament prep. Anyone interested in forming a practice group for serves and returns?',
      type: 'question',
      timestamp: '6 hours ago',
      likes: 18,
      comments: 12,
      shares: 2,
      isLiked: false
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'advanced': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-slate-400 bg-slate-400/20 border-slate-400/30';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-400 bg-green-400/20';
      case 'busy': return 'text-yellow-400 bg-yellow-400/20';
      case 'offline': return 'text-slate-400 bg-slate-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return Trophy;
      case 'question': return MessageSquare;
      case 'tip': return BookOpen;
      case 'celebration': return Heart;
      default: return MessageSquare;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Peer Learning Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">1,247</div>
              <p className="text-slate-400 text-sm">Active Learners</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">89</div>
              <p className="text-slate-400 text-sm">Study Groups</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">156</div>
              <p className="text-slate-400 text-sm">Expert Mentors</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">47</div>
              <p className="text-slate-400 text-sm">Team Challenges</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="groups" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="groups" className="data-[state=active]:bg-blue-500">
            Study Groups
          </TabsTrigger>
          <TabsTrigger value="mentors" className="data-[state=active]:bg-purple-500">
            Peer Mentors
          </TabsTrigger>
          <TabsTrigger value="challenges" className="data-[state=active]:bg-green-500">
            Team Challenges
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-cyan-500">
            Social Feed
          </TabsTrigger>
        </TabsList>

        {/* Study Groups Tab */}
        <TabsContent value="groups">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search study groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button className="neon-glow">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studyGroups.map((group) => (
                <Card key={group.id} className="bg-slate-800/50 border-slate-700 achievement-glow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-white mb-1">{group.name}</h4>
                        <p className="text-sm text-slate-400">{group.sport}</p>
                      </div>
                      <Badge className={getLevelColor(group.level)}>
                        {group.level.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Members</span>
                        <span className="text-white">{group.members}/{group.maxMembers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Average GAR</span>
                        <StarRating garScore={group.averageGAR} size="sm" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Next Session</span>
                        <span className="text-cyan-400">{group.nextSession}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                      <h5 className="font-medium text-white mb-1">Current Topic</h5>
                      <p className="text-sm text-slate-400">{group.topic}</p>
                    </div>

                    <Button 
                      className={`w-full ${group.isJoined ? 'border-green-400 text-green-400 hover:bg-green-400/10' : 'neon-glow'}`}
                      variant={group.isJoined ? 'outline' : 'default'}
                    >
                      {group.isJoined ? (
                        <>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Join Session
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
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Peer Mentors Tab */}
        <TabsContent value="mentors">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peerMentors.map((mentor) => (
              <Card key={mentor.id} className="bg-slate-800/50 border-purple-500/30 achievement-glow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/api/placeholder/48/48" />
                      <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{mentor.name}</h4>
                      <p className="text-sm text-slate-400">{mentor.sport}</p>
                      <Badge className={getAvailabilityColor(mentor.availability)}>
                        {mentor.availability.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <StarRating garScore={mentor.garScore} size="sm" />
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(mentor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-400">({mentor.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mentees</span>
                      <span className="text-white">{mentor.mentees}</span>
                    </div>
                    {mentor.pricePerHour && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rate</span>
                        <span className="text-green-400">${mentor.pricePerHour}/hr</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium text-white mb-2">Specialties</h5>
                    <div className="flex flex-wrap gap-1">
                      {mentor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400/10" 
                      variant="outline"
                      size="sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button 
                      className="flex-1 neon-glow" 
                      size="sm"
                      disabled={mentor.availability === 'offline'}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Challenges Tab */}
        <TabsContent value="challenges">
          <div className="space-y-6">
            {teamChallenges.map((challenge) => (
              <Card key={challenge.id} className="bg-slate-800/50 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">{challenge.title}</h4>
                      <p className="text-slate-400 mb-2">{challenge.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>{challenge.sport}</span>
                        <span>•</span>
                        <span>{challenge.difficulty}</span>
                        <span>•</span>
                        <span>Ends {new Date(challenge.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge className="verified-badge">
                      <Trophy className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-1">{challenge.participants}</div>
                      <p className="text-xs text-slate-400">Participants</p>
                    </div>
                    <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">{challenge.maxParticipants}</div>
                      <p className="text-xs text-slate-400">Max Spots</p>
                    </div>
                    <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-400 mb-1">
                        <Trophy className="w-5 h-5 mx-auto" />
                      </div>
                      <p className="text-xs text-slate-400">Prize</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 mb-4 border border-yellow-500/30">
                    <h5 className="font-medium text-white mb-1">Prize</h5>
                    <p className="text-sm text-yellow-400">{challenge.prize}</p>
                  </div>

                  <Button 
                    className={`w-full ${challenge.isParticipating ? 'border-green-400 text-green-400 hover:bg-green-400/10' : 'neon-glow'}`}
                    variant={challenge.isParticipating ? 'outline' : 'default'}
                  >
                    {challenge.isParticipating ? (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        View Progress
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Join Challenge
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Social Feed Tab */}
        <TabsContent value="social">
          <div className="space-y-6">
            {socialPosts.map((post) => {
              const IconComponent = getPostTypeIcon(post.type);
              return (
                <Card key={post.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-white">{post.author.name}</h5>
                          <StarRating garScore={post.author.garScore} size="sm" showScore={false} />
                          <Badge variant="outline" className="text-xs">
                            {post.author.sport}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">{post.timestamp}</p>
                      </div>
                      <IconComponent className="w-5 h-5 text-cyan-400" />
                    </div>

                    <p className="text-slate-300 mb-4">{post.content}</p>

                    {post.media && (
                      <div className="mb-4">
                        <img 
                          src={post.media} 
                          alt="Post media" 
                          className="w-full max-w-md rounded-lg"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <button className={`flex items-center gap-1 hover:text-red-400 transition-colors ${post.isLiked ? 'text-red-400' : ''}`}>
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-400' : ''}`} />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                        {post.shares}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}