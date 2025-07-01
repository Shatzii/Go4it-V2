import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  Play,
  Clock,
  Star,
  BookOpen,
  Video,
  Timer,
  Activity,
  TrendingUp,
  Award,
  Users,
  Search,
  Filter,
  ChevronRight,
  Heart,
  Zap,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Sport {
  id: string;
  name: string;
  category: 'team' | 'individual' | 'winter' | 'aquatic' | 'combat' | 'racquet';
  icon: string;
  popularity: number;
  participants: string;
  skillCategories: string[];
  description: string;
  olympicSport: boolean;
  seasonality: string[];
}

interface Skill {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  description: string;
  keyPoints: string[];
  commonMistakes: string[];
  progressionSteps: string[];
}

interface Drill {
  id: string;
  name: string;
  skillIds: string[];
  type: 'technical' | 'conditioning' | 'tactical' | 'mental';
  duration: number;
  equipment: string[];
  instructions: string[];
  progressions: string[];
  reps: string;
  sets: string;
  restPeriod: string;
  targetMetrics: string[];
  videoUrl?: string;
}

interface TrainingProgram {
  id: string;
  sportId: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // weeks
  sessionsPerWeek: number;
  focusAreas: string[];
  weeklyProgression: {
    week: number;
    drills: string[];
    objectives: string[];
    assessments: string[];
  }[];
}

export default function MultiSportSystem() {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'drills' | 'programs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Top 12 sports (top 10 international + baseball + ski jumping)
  const sports: Sport[] = [
    {
      id: 'soccer',
      name: 'Soccer (Football)',
      category: 'team',
      icon: '⚽',
      popularity: 100,
      participants: '4+ billion',
      skillCategories: ['Ball Control', 'Passing', 'Shooting', 'Defending', 'Goalkeeping'],
      description: 'The world\'s most popular sport, emphasizing technical skill, tactical awareness, and physical conditioning.',
      olympicSport: true,
      seasonality: ['Year-round']
    },
    {
      id: 'basketball',
      name: 'Basketball',
      category: 'team',
      icon: '🏀',
      popularity: 95,
      participants: '2.2+ billion',
      skillCategories: ['Shooting', 'Dribbling', 'Passing', 'Defense', 'Rebounding'],
      description: 'Fast-paced team sport requiring agility, coordination, and strategic thinking.',
      olympicSport: true,
      seasonality: ['Year-round']
    },
    {
      id: 'cricket',
      name: 'Cricket',
      category: 'team',
      icon: '🏏',
      popularity: 90,
      participants: '2.5+ billion',
      skillCategories: ['Batting', 'Bowling', 'Fielding', 'Wicket Keeping', 'Strategy'],
      description: 'Strategic team sport emphasizing precision, patience, and tactical execution.',
      olympicSport: false,
      seasonality: ['Spring', 'Summer', 'Fall']
    },
    {
      id: 'tennis',
      name: 'Tennis',
      category: 'racquet',
      icon: '🎾',
      popularity: 85,
      participants: '1+ billion',
      skillCategories: ['Forehand', 'Backhand', 'Serve', 'Volley', 'Movement'],
      description: 'Individual racquet sport requiring power, precision, and mental toughness.',
      olympicSport: true,
      seasonality: ['Year-round']
    },
    {
      id: 'volleyball',
      name: 'Volleyball',
      category: 'team',
      icon: '🏐',
      popularity: 80,
      participants: '900+ million',
      skillCategories: ['Serving', 'Passing', 'Setting', 'Attacking', 'Blocking'],
      description: 'Team sport emphasizing coordination, timing, and explosive power.',
      olympicSport: true,
      seasonality: ['Year-round']
    },
    {
      id: 'table_tennis',
      name: 'Table Tennis',
      category: 'racquet',
      icon: '🏓',
      popularity: 75,
      participants: '875+ million',
      skillCategories: ['Forehand Drive', 'Backhand', 'Serve', 'Spin', 'Footwork'],
      description: 'Fast-paced indoor sport requiring quick reflexes and precise technique.',
      olympicSport: true,
      seasonality: ['Year-round']
    },
    {
      id: 'badminton',
      name: 'Badminton',
      category: 'racquet',
      icon: '🏸',
      popularity: 70,
      participants: '220+ million',
      skillCategories: ['Clear', 'Drop', 'Smash', 'Serve', 'Net Play'],
      description: 'High-speed racquet sport emphasizing agility and tactical shot placement.',
      olympicSport: true,
      seasonality: ['Year-round']
    },
    {
      id: 'golf',
      name: 'Golf',
      category: 'individual',
      icon: '⛳',
      popularity: 65,
      participants: '390+ million',
      skillCategories: ['Drive', 'Iron Play', 'Short Game', 'Putting', 'Course Management'],
      description: 'Precision sport requiring technical skill, mental focus, and strategic thinking.',
      olympicSport: true,
      seasonality: ['Spring', 'Summer', 'Fall']
    },
    {
      id: 'swimming',
      name: 'Swimming',
      category: 'aquatic',
      icon: '🏊',
      popularity: 60,
      participants: '1.5+ billion',
      skillCategories: ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Starts & Turns'],
      description: 'Full-body aquatic sport emphasizing technique, endurance, and breathing control.',
      olympicSport: true,
      seasonality: ['Year-round']
    },
    {
      id: 'athletics',
      name: 'Track & Field',
      category: 'individual',
      icon: '🏃',
      popularity: 55,
      participants: '500+ million',
      skillCategories: ['Sprinting', 'Distance Running', 'Jumping', 'Throwing', 'Hurdling'],
      description: 'Collection of athletic events testing speed, strength, endurance, and technique.',
      olympicSport: true,
      seasonality: ['Spring', 'Summer', 'Fall']
    },
    {
      id: 'baseball',
      name: 'Baseball',
      category: 'team',
      icon: '⚾',
      popularity: 50,
      participants: '500+ million',
      skillCategories: ['Hitting', 'Pitching', 'Fielding', 'Base Running', 'Catching'],
      description: 'Strategic team sport combining individual skills with tactical team play.',
      olympicSport: false,
      seasonality: ['Spring', 'Summer', 'Fall']
    },
    {
      id: 'ski_jumping',
      name: 'Ski Jumping',
      category: 'winter',
      icon: '🎿',
      popularity: 30,
      participants: '10+ million',
      skillCategories: ['Takeoff', 'Flight Position', 'Landing', 'Equipment Control', 'Mental Preparation'],
      description: 'Winter sport requiring courage, technique, and precise timing for aerial performance.',
      olympicSport: true,
      seasonality: ['Winter']
    }
  ];

  // Skills database for each sport
  const skillsDatabase: Record<string, Skill[]> = {
    soccer: [
      {
        id: 'ball_control',
        name: 'First Touch Ball Control',
        category: 'Ball Control',
        difficulty: 'beginner',
        description: 'Master receiving and controlling the ball with various body parts',
        keyPoints: ['Soft touch', 'Body positioning', 'Eye on ball', 'Quick setup for next action'],
        commonMistakes: ['Hard first touch', 'Wrong body position', 'Not watching ball'],
        progressionSteps: ['Stationary control', 'Moving control', 'Under pressure', 'Match situations']
      },
      {
        id: 'passing_accuracy',
        name: 'Short Passing Accuracy',
        category: 'Passing',
        difficulty: 'beginner',
        description: 'Develop precise short-range passing with both feet',
        keyPoints: ['Plant foot placement', 'Contact point on ball', 'Follow through', 'Target selection'],
        commonMistakes: ['Poor plant foot', 'Wrong contact point', 'No follow through'],
        progressionSteps: ['Static passing', 'Moving passes', 'One-touch', 'Long range']
      },
      {
        id: 'shooting_power',
        name: 'Power Shooting',
        category: 'Shooting',
        difficulty: 'intermediate',
        description: 'Generate power and accuracy in shooting situations',
        keyPoints: ['Body over ball', 'Clean strike', 'Follow through low', 'Quick setup'],
        commonMistakes: ['Leaning back', 'Poor technique', 'Rushing shot'],
        progressionSteps: ['Stationary shots', 'Running shots', 'Under pressure', 'Different angles']
      }
    ],
    basketball: [
      {
        id: 'free_throw',
        name: 'Free Throw Shooting',
        category: 'Shooting',
        difficulty: 'beginner',
        description: 'Develop consistent free throw shooting form and routine',
        keyPoints: ['Consistent routine', 'Proper arc', 'Follow through', 'Mental focus'],
        commonMistakes: ['Inconsistent routine', 'Flat shot', 'Poor follow through'],
        progressionSteps: ['Form shooting', 'Short range', 'Free throw line', 'Game pressure']
      },
      {
        id: 'ball_handling',
        name: 'Advanced Ball Handling',
        category: 'Dribbling',
        difficulty: 'advanced',
        description: 'Master advanced dribbling moves and combinations',
        keyPoints: ['Low dribble', 'Change of pace', 'Protection', 'Court vision'],
        commonMistakes: ['High dribble', 'Predictable moves', 'Poor protection'],
        progressionSteps: ['Basic dribbling', 'Combo moves', 'Game speed', 'Under pressure']
      }
    ],
    tennis: [
      {
        id: 'forehand_drive',
        name: 'Forehand Drive',
        category: 'Forehand',
        difficulty: 'beginner',
        description: 'Master the fundamental forehand stroke with topspin',
        keyPoints: ['Unit turn', 'Low to high swing', 'Contact point', 'Follow through'],
        commonMistakes: ['Late preparation', 'Wrong contact point', 'No follow through'],
        progressionSteps: ['Shadow swings', 'Fed balls', 'Rally practice', 'Match play']
      },
      {
        id: 'serve_technique',
        name: 'First Serve Technique',
        category: 'Serve',
        difficulty: 'intermediate',
        description: 'Develop powerful and accurate first serve',
        keyPoints: ['Smooth toss', 'Full extension', 'Pronation', 'Follow through'],
        commonMistakes: ['Poor toss', 'Rushing motion', 'No pronation'],
        progressionSteps: ['Toss practice', 'Slow motion', 'Half court', 'Full power']
      }
    ]
  };

  // Drills database for each sport
  const drillsDatabase: Record<string, Drill[]> = {
    soccer: [
      {
        id: 'cone_dribbling',
        name: 'Cone Dribbling Circuit',
        skillIds: ['ball_control'],
        type: 'technical',
        duration: 15,
        equipment: ['10 cones', 'Soccer ball'],
        instructions: [
          'Set up 10 cones in a straight line, 2 yards apart',
          'Dribble through cones using both feet',
          'Focus on close ball control and change of direction',
          'Complete circuit forward and backward'
        ],
        progressions: ['Add speed', 'Use one foot only', 'Add defensive pressure'],
        reps: '5 circuits',
        sets: '3',
        restPeriod: '60 seconds',
        targetMetrics: ['Time to complete', 'Ball touches', 'Control rating']
      },
      {
        id: 'passing_squares',
        name: 'Passing in Squares',
        skillIds: ['passing_accuracy'],
        type: 'technical',
        duration: 20,
        equipment: ['4 cones', 'Soccer ball', '2-4 players'],
        instructions: [
          'Create 15x15 yard square with cones',
          'Players pass ball around square perimeter',
          'Focus on weight and accuracy of passes',
          'Switch directions regularly'
        ],
        progressions: ['Increase pace', 'One touch only', 'Add movement'],
        reps: '2 minutes',
        sets: '4',
        restPeriod: '90 seconds',
        targetMetrics: ['Pass completion %', 'Pass speed', 'First touch quality']
      }
    ],
    basketball: [
      {
        id: 'form_shooting',
        name: 'Form Shooting Progression',
        skillIds: ['free_throw'],
        type: 'technical',
        duration: 20,
        equipment: ['Basketball', 'Hoop'],
        instructions: [
          'Start 3 feet from basket',
          'Focus on proper shooting form',
          'Make 5 shots before moving back',
          'Progress to free throw line'
        ],
        progressions: ['Add movement', 'Increase distance', 'Add time pressure'],
        reps: '5 makes per spot',
        sets: '3',
        restPeriod: '2 minutes',
        targetMetrics: ['Shooting percentage', 'Arc consistency', 'Follow through']
      }
    ],
    tennis: [
      {
        id: 'forehand_wall',
        name: 'Forehand Wall Practice',
        skillIds: ['forehand_drive'],
        type: 'technical',
        duration: 15,
        equipment: ['Tennis ball', 'Wall or backboard'],
        instructions: [
          'Stand 10 feet from wall',
          'Hit forehand drives against wall',
          'Focus on consistent contact point',
          'Maintain rally rhythm'
        ],
        progressions: ['Add topspin', 'Vary pace', 'Add movement'],
        reps: '50 hits',
        sets: '3',
        restPeriod: '3 minutes',
        targetMetrics: ['Consecutive hits', 'Contact point consistency', 'Ball control']
      }
    ]
  };

  const filteredSports = sports.filter(sport => {
    const matchesSearch = sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sport.skillCategories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || sport.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const renderSportOverview = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search sports or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Categories</option>
          <option value="team">Team Sports</option>
          <option value="individual">Individual Sports</option>
          <option value="racquet">Racquet Sports</option>
          <option value="aquatic">Aquatic Sports</option>
          <option value="winter">Winter Sports</option>
        </select>
      </div>

      {/* Sports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSports.map((sport, index) => (
          <motion.div
            key={sport.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card 
              className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300"
              onClick={() => setSelectedSport(sport)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{sport.icon}</div>
                  <div className="flex gap-1">
                    {sport.olympicSport && (
                      <Badge className="bg-gold-100 text-gold-700 text-xs">Olympic</Badge>
                    )}
                    <Badge variant="outline" className="text-xs capitalize">
                      {sport.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{sport.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {sport.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Global Participants</div>
                    <div className="font-medium text-blue-600">{sport.participants}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Popularity</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${sport.popularity}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-2">Key Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {sport.skillCategories.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {sport.skillCategories.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{sport.skillCategories.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  Explore Skills & Drills
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="text-center p-4">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-gold-500" />
          <div className="text-2xl font-bold">{sports.filter(s => s.olympicSport).length}</div>
          <div className="text-sm text-gray-600">Olympic Sports</div>
        </Card>
        <Card className="text-center p-4">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold">{sports.length}</div>
          <div className="text-sm text-gray-600">Total Sports</div>
        </Card>
        <Card className="text-center p-4">
          <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold">150+</div>
          <div className="text-sm text-gray-600">Skills Available</div>
        </Card>
        <Card className="text-center p-4">
          <Activity className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold">300+</div>
          <div className="text-sm text-gray-600">Training Drills</div>
        </Card>
      </div>
    </div>
  );

  const renderSkillDetails = (sport: Sport) => {
    const skills = skillsDatabase[sport.id] || [];
    const filteredSkills = skills.filter(skill => 
      difficultyFilter === 'all' || skill.difficulty === difficultyFilter
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Skills for {sport.name}</h3>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="elite">Elite</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSkills.map((skill) => (
            <Card key={skill.id} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                  <Badge variant={
                    skill.difficulty === 'beginner' ? 'secondary' :
                    skill.difficulty === 'intermediate' ? 'default' :
                    skill.difficulty === 'advanced' ? 'destructive' : 'outline'
                  }>
                    {skill.difficulty}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">{skill.category}</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{skill.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Key Points</h4>
                    <ul className="text-sm space-y-1">
                      {skill.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Common Mistakes</h4>
                    <ul className="text-sm space-y-1">
                      {skill.commonMistakes.map((mistake, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          {mistake}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">Progression Steps</h4>
                    <div className="space-y-1">
                      {skill.progressionSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                            {index + 1}
                          </div>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Skills Available</h3>
            <p className="text-gray-600">
              Skills for {sport.name} are being developed. Check back soon!
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderDrillDetails = (sport: Sport) => {
    const drills = drillsDatabase[sport.id] || [];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Training Drills for {sport.name}</h3>

        <div className="space-y-4">
          {drills.map((drill) => (
            <Card key={drill.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{drill.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {drill.type}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {drill.duration} min
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Equipment Needed</h4>
                      <div className="flex flex-wrap gap-1">
                        {drill.equipment.map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Instructions</h4>
                      <ol className="text-sm space-y-1">
                        {drill.instructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-lg">{drill.sets}</div>
                        <div className="text-xs text-gray-600">Sets</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-lg">{drill.reps}</div>
                        <div className="text-xs text-gray-600">Reps</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-lg">{drill.restPeriod}</div>
                        <div className="text-xs text-gray-600">Rest</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Target Metrics</h4>
                      <div className="space-y-1">
                        {drill.targetMetrics.map((metric, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <BarChart3 className="w-4 h-4 text-green-500" />
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Progressions</h4>
                      <ul className="text-sm space-y-1">
                        {drill.progressions.map((progression, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            {progression}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button>
                    <Play className="w-4 h-4 mr-2" />
                    Start Drill
                  </Button>
                  <Button variant="outline">
                    <Video className="w-4 h-4 mr-2" />
                    Watch Demo
                  </Button>
                  <Button variant="outline">
                    <Timer className="w-4 h-4 mr-2" />
                    Set Timer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {drills.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Drills Available</h3>
            <p className="text-gray-600">
              Training drills for {sport.name} are being developed. Check back soon!
            </p>
          </div>
        )}
      </div>
    );
  };

  if (selectedSport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedSport(null)}>
            ← Back to Sports
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{selectedSport.icon}</div>
            <div>
              <h2 className="text-2xl font-bold">{selectedSport.name}</h2>
              <p className="text-gray-600">{selectedSport.description}</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="drills">Drills</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="mt-6">
            <div className="bg-white rounded-lg p-6">
              {renderSkillDetails(selectedSport)}
            </div>
          </TabsContent>

          <TabsContent value="drills" className="mt-6">
            <div className="bg-white rounded-lg p-6">
              {renderDrillDetails(selectedSport)}
            </div>
          </TabsContent>

          <TabsContent value="programs" className="mt-6">
            <div className="bg-white rounded-lg p-6">
              <div className="text-center py-12">
                <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Training Programs Coming Soon</h3>
                <p className="text-gray-600">
                  Structured training programs for {selectedSport.name} are in development.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="go4it-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Multi-Sport Training System
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="bg-white rounded-lg p-6">
        {renderSportOverview()}
      </div>
    </div>
  );
}