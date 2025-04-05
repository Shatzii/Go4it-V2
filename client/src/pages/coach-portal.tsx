import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { 
  Search,
  ChevronDown,
  Users,
  MessageSquare,
  Calendar,
  Clipboard,
  Star,
  CheckCircle2,
  Clock,
  Filter,
  Inbox,
  Send,
  CheckCheck,
  ListFilter,
  MoreVertical,
  UserPlus,
  Eye,
  FileVideo,
  Trash2,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Plus,
  Video,
  FileText,
  BookOpen,
  Award,
  Bell,
  Briefcase,
  School,
  Trophy,
  Lightbulb,
  Bookmark,
  User
} from "lucide-react";

// Types for the coach portal
interface Athlete {
  id: number;
  name: string;
  avatarUrl?: string;
  sport: string;
  position: string;
  class: string; // Freshman, Sophomore, etc.
  gpa: number;
  testScores: {
    sat?: number;
    act?: number;
  };
  starRating: number;
  school: string;
  location: string;
  height: string;
  weight: string;
  highlights: number;
  status: 'interested' | 'contacted' | 'committed' | 'signed' | 'watchlist';
  lastContact?: Date;
  email: string;
  phone: string;
  notes: string;
  keyStats: {
    name: string;
    value: string;
  }[];
}

interface RecruitingClass {
  year: number;
  positions: {
    name: string;
    targeted: number;
    committed: number;
    signed: number;
    limit: number;
  }[];
  athletes: {
    id: number;
    name: string;
    position: string;
    status: 'committed' | 'signed';
    starRating: number;
    date: Date;
  }[];
}

interface ScheduledEvent {
  id: number;
  title: string;
  type: 'visit' | 'call' | 'evaluation' | 'camp' | 'game' | 'meeting';
  date: Date;
  location?: string;
  athletes: {
    id: number;
    name: string;
    avatarUrl?: string;
  }[];
  notes?: string;
  status: 'scheduled' | 'completed' | 'canceled';
}

interface Message {
  id: number;
  sender: {
    id: number;
    name: string;
    avatarUrl?: string;
    role: 'coach' | 'athlete' | 'system';
  };
  recipient: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
}

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  relatedTo?: {
    type: 'athlete' | 'event';
    id: number;
    name: string;
  };
}

export default function CoachPortal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [filters, setFilters] = useState({
    sport: "all",
    position: "all",
    starRating: "all",
    status: "all",
    class: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("athletes");
  
  // Fetch athletes from API
  const { data: athletes, isLoading: isAthletesLoading } = useQuery({
    queryKey: ['/api/coach/athletes', filters],
    enabled: !!user,
  });
  
  // Fetch recruiting class data
  const { data: recruitingClass, isLoading: isRecruitingClassLoading } = useQuery({
    queryKey: ['/api/coach/recruiting-class'],
    enabled: !!user && activeTab === "recruiting",
  });
  
  // Fetch scheduled events
  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ['/api/coach/events'],
    enabled: !!user && activeTab === "schedule",
  });
  
  // Fetch messages
  const { data: messages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ['/api/coach/messages'],
    enabled: !!user && activeTab === "messages",
  });
  
  // Fetch tasks
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['/api/coach/tasks'],
    enabled: !!user && activeTab === "tasks",
  });
  
  // Mock data for demo purposes
  const mockAthletes: Athlete[] = [
    {
      id: 1,
      name: "Marcus Johnson",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      sport: "Basketball",
      position: "Point Guard",
      class: "Senior",
      gpa: 3.8,
      testScores: { sat: 1320 },
      starRating: 4,
      school: "Washington High School",
      location: "Seattle, WA",
      height: "6'2\"",
      weight: "185 lbs",
      highlights: 12,
      status: "interested",
      lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      email: "marcus.johnson@example.com",
      phone: "(206) 555-1234",
      notes: "Exceptional court vision and leadership. Team captain for 2 years.",
      keyStats: [
        { name: "PPG", value: "18.5" },
        { name: "APG", value: "7.2" },
        { name: "SPG", value: "2.1" },
        { name: "3PT%", value: "42%" }
      ]
    },
    {
      id: 2,
      name: "Sophia Rodriguez",
      avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
      sport: "Soccer",
      position: "Striker",
      class: "Junior",
      gpa: 3.9,
      testScores: { act: 30 },
      starRating: 5,
      school: "Eastside Prep",
      location: "Portland, OR",
      height: "5'8\"",
      weight: "145 lbs",
      highlights: 18,
      status: "contacted",
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      email: "sophia.r@example.com",
      phone: "(503) 555-6789",
      notes: "Top goal scorer in the state. Incredible speed and finishing ability.",
      keyStats: [
        { name: "Goals", value: "32" },
        { name: "Assists", value: "14" },
        { name: "Shots on Goal", value: "78%" },
        { name: "Minutes", value: "1620" }
      ]
    },
    {
      id: 3,
      name: "Tyler Williams",
      avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      sport: "Football",
      position: "Quarterback",
      class: "Junior",
      gpa: 3.5,
      testScores: { sat: 1280 },
      starRating: 4,
      school: "Central High",
      location: "Dallas, TX",
      height: "6'3\"",
      weight: "210 lbs",
      highlights: 14,
      status: "committed",
      lastContact: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      email: "t.williams@example.com",
      phone: "(214) 555-4321",
      notes: "Strong arm and good mobility. Needs work on progression reads.",
      keyStats: [
        { name: "Pass Yards", value: "2850" },
        { name: "TD/INT", value: "32/8" },
        { name: "Comp %", value: "65%" },
        { name: "Rush Yards", value: "420" }
      ]
    },
    {
      id: 4,
      name: "Jamal Thompson",
      avatarUrl: "https://randomuser.me/api/portraits/men/18.jpg",
      sport: "Football",
      position: "Defensive End",
      class: "Senior",
      gpa: 3.2,
      testScores: { act: 27 },
      starRating: 5,
      school: "South County HS",
      location: "Miami, FL",
      height: "6'5\"",
      weight: "245 lbs",
      highlights: 9,
      status: "signed",
      lastContact: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      email: "jamal.thompson@example.com",
      phone: "(305) 555-7890",
      notes: "Dominant pass rusher with great motor. Team defensive MVP.",
      keyStats: [
        { name: "Sacks", value: "14" },
        { name: "TFL", value: "22" },
        { name: "FF", value: "3" },
        { name: "40 Time", value: "4.65s" }
      ]
    },
    {
      id: 5,
      name: "Emma Chen",
      avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      sport: "Volleyball",
      position: "Setter",
      class: "Sophomore",
      gpa: 4.0,
      testScores: { sat: 1450 },
      starRating: 3,
      school: "Valley High",
      location: "Los Angeles, CA",
      height: "5'10\"",
      weight: "155 lbs",
      highlights: 6,
      status: "watchlist",
      lastContact: undefined,
      email: "emma.chen@example.com",
      phone: "(310) 555-2468",
      notes: "Exceptional volleyball IQ. Great potential for growth.",
      keyStats: [
        { name: "Assists", value: "856" },
        { name: "Aces", value: "42" },
        { name: "Digs", value: "215" },
        { name: "Blocks", value: "22" }
      ]
    }
  ];
  
  const mockRecruitingClass: RecruitingClass = {
    year: new Date().getFullYear() + 1,
    positions: [
      { name: "Point Guard", targeted: 2, committed: 1, signed: 0, limit: 2 },
      { name: "Shooting Guard", targeted: 1, committed: 0, signed: 1, limit: 1 },
      { name: "Small Forward", targeted: 2, committed: 1, signed: 0, limit: 2 },
      { name: "Power Forward", targeted: 1, committed: 0, signed: 0, limit: 1 },
      { name: "Center", targeted: 1, committed: 0, signed: 1, limit: 1 }
    ],
    athletes: [
      { 
        id: 101, 
        name: "DeAndre Smith", 
        position: "Point Guard", 
        status: 'committed', 
        starRating: 4, 
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) 
      },
      { 
        id: 102, 
        name: "James Wilson", 
        position: "Shooting Guard", 
        status: 'signed', 
        starRating: 4, 
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) 
      },
      { 
        id: 103, 
        name: "Michael Carter", 
        position: "Small Forward", 
        status: 'committed', 
        starRating: 3, 
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
      },
      { 
        id: 104, 
        name: "Anthony Davis", 
        position: "Center", 
        status: 'signed', 
        starRating: 5, 
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) 
      }
    ]
  };
  
  const mockEvents: ScheduledEvent[] = [
    {
      id: 1,
      title: "Campus Visit - Marcus Johnson",
      type: 'visit',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "Main Campus",
      athletes: [
        { id: 1, name: "Marcus Johnson", avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg" }
      ],
      notes: "Full campus tour, meeting with academic advisors, and team practice observation.",
      status: 'scheduled'
    },
    {
      id: 2,
      title: "Evaluation Camp",
      type: 'camp',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      location: "University Sports Complex",
      athletes: [
        { id: 1, name: "Marcus Johnson", avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 2, name: "Sophia Rodriguez", avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg" },
        { id: 5, name: "Emma Chen", avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg" }
      ],
      notes: "Annual evaluation camp for top prospects. Full day event.",
      status: 'scheduled'
    },
    {
      id: 3,
      title: "Phone Call - Sophia Rodriguez",
      type: 'call',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      athletes: [
        { id: 2, name: "Sophia Rodriguez", avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg" }
      ],
      notes: "Discussed scholarship options and academic programs.",
      status: 'completed'
    },
    {
      id: 4,
      title: "Game Evaluation - Valley High vs. Central",
      type: 'evaluation',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      location: "Valley High School",
      athletes: [
        { id: 5, name: "Emma Chen", avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg" }
      ],
      notes: "Regional championship game. Focus on Emma's performance under pressure.",
      status: 'scheduled'
    }
  ];
  
  const mockMessages: Message[] = [
    {
      id: 1,
      sender: {
        id: 1,
        name: "Marcus Johnson",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        role: 'athlete'
      },
      recipient: {
        id: 999,
        name: "Coach Williams"
      },
      content: "Thank you for the information about the campus visit. I'm really looking forward to seeing the facilities and meeting the team!",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isRead: true
    },
    {
      id: 2,
      sender: {
        id: 2,
        name: "Sophia Rodriguez",
        avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
        role: 'athlete'
      },
      recipient: {
        id: 999,
        name: "Coach Williams"
      },
      content: "I enjoyed our call yesterday. I have a few more questions about the academic support programs for student-athletes. Could we schedule another call soon?",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isRead: false
    },
    {
      id: 3,
      sender: {
        id: 999,
        name: "Coach Williams",
        role: 'coach'
      },
      recipient: {
        id: 5,
        name: "Emma Chen",
        avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      },
      content: "Hi Emma, I'll be at your championship game this weekend. Looking forward to seeing you play! Good luck!",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isRead: true
    },
    {
      id: 4,
      sender: {
        id: 0,
        name: "System",
        role: 'system'
      },
      recipient: {
        id: 999,
        name: "Coach Williams"
      },
      content: "New highlight video uploaded by Jamal Thompson. View the video in his profile.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isRead: true
    }
  ];
  
  const mockTasks: Task[] = [
    {
      id: 1,
      title: "Review Marcus Johnson's highlight tape",
      description: "New footage from championship game. Evaluate court vision and defensive positioning.",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'pending',
      relatedTo: {
        type: 'athlete',
        id: 1,
        name: 'Marcus Johnson'
      }
    },
    {
      id: 2,
      title: "Call Sophia's parents about academic scholarships",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      status: 'in_progress',
      relatedTo: {
        type: 'athlete',
        id: 2,
        name: 'Sophia Rodriguez'
      }
    },
    {
      id: 3,
      title: "Prepare for evaluation camp",
      description: "Finalize drills and assessment criteria. Prepare evaluation sheets for all coaches.",
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      status: 'in_progress',
      relatedTo: {
        type: 'event',
        id: 2,
        name: 'Evaluation Camp'
      }
    },
    {
      id: 4,
      title: "Submit final recruiting budget report",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'completed'
    }
  ];
  
  // Use API data if available, otherwise use mock data
  const displayedAthletes = athletes || mockAthletes;
  const displayedRecruitingClass = recruitingClass || mockRecruitingClass;
  const displayedEvents = events || mockEvents;
  const displayedMessages = messages || mockMessages;
  const displayedTasks = tasks || mockTasks;
  
  // Contact athlete mutation
  const contactAthleteMutation = useMutation({
    mutationFn: async (athleteId: number) => {
      return await apiRequest('POST', `/api/coach/athletes/${athleteId}/contact`, {});
    },
    onSuccess: () => {
      toast({
        title: "Contact Recorded",
        description: "The contact has been recorded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/coach/athletes'] });
    }
  });
  
  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async ({ athleteId, note }: { athleteId: number, note: string }) => {
      return await apiRequest('POST', `/api/coach/athletes/${athleteId}/notes`, { note });
    },
    onSuccess: () => {
      toast({
        title: "Note Added",
        description: "Your note has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/coach/athletes'] });
    }
  });
  
  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      return await apiRequest('PATCH', `/api/coach/tasks/${taskId}`, { status: 'completed' });
    },
    onSuccess: () => {
      toast({
        title: "Task Completed",
        description: "The task has been marked as completed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/coach/tasks'] });
    }
  });
  
  // Helper functions
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatDateWithTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'interested': return "text-blue-500 bg-blue-500/10";
      case 'contacted': return "text-amber-500 bg-amber-500/10";
      case 'committed': return "text-green-500 bg-green-500/10";
      case 'signed': return "text-purple-500 bg-purple-500/10";
      case 'watchlist': return "text-gray-500 bg-gray-500/10";
      case 'scheduled': return "text-blue-500 bg-blue-500/10";
      case 'completed': return "text-green-500 bg-green-500/10";
      case 'canceled': return "text-red-500 bg-red-500/10";
      case 'pending': return "text-amber-500 bg-amber-500/10";
      case 'in_progress': return "text-blue-500 bg-blue-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return "text-red-500 bg-red-500/10";
      case 'medium': return "text-amber-500 bg-amber-500/10";
      case 'low': return "text-green-500 bg-green-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };
  
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'visit': return <MapPin className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'evaluation': return <Eye className="h-4 w-4" />;
      case 'camp': return <Users className="h-4 w-4" />;
      case 'game': return <Trophy className="h-4 w-4" />;
      case 'meeting': return <Briefcase className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };
  
  // Filter and search athletes
  const filteredAthletes = displayedAthletes.filter((athlete) => {
    // Apply search
    if (searchValue && !athlete.name.toLowerCase().includes(searchValue.toLowerCase())) {
      return false;
    }
    
    // Apply filters
    if (filters.sport !== "all" && athlete.sport !== filters.sport) {
      return false;
    }
    if (filters.position !== "all" && athlete.position !== filters.position) {
      return false;
    }
    if (filters.starRating !== "all" && athlete.starRating !== parseInt(filters.starRating)) {
      return false;
    }
    if (filters.status !== "all" && athlete.status !== filters.status) {
      return false;
    }
    if (filters.class !== "all" && athlete.class !== filters.class) {
      return false;
    }
    
    return true;
  });
  
  // Loading states
  const isLoading = isAthletesLoading || isRecruitingClassLoading || isEventsLoading || isMessagesLoading || isTasksLoading;
  
  if (isLoading && !displayedAthletes.length) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coach Portal</h1>
          <p className="text-muted-foreground">Manage recruiting, scheduling, and team communications</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => setActiveTab("messages")}>
            <Bell className="mr-2 h-4 w-4" />
            <span className="relative">
              Messages
              {displayedMessages.filter(m => !m.isRead && m.sender.role !== 'coach').length > 0 && (
                <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">
                  {displayedMessages.filter(m => !m.isRead && m.sender.role !== 'coach').length}
                </span>
              )}
            </span>
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("tasks")}>
            <Clipboard className="mr-2 h-4 w-4" />
            Tasks
          </Button>
        </div>
      </div>
      
      {/* Main tabs */}
      <Tabs defaultValue="athletes" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="athletes" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Athletes
          </TabsTrigger>
          <TabsTrigger value="recruiting" className="flex items-center">
            <Star className="mr-2 h-4 w-4" />
            Recruiting Class
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center">
            <Clipboard className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
        </TabsList>
        
        {/* Athletes Tab */}
        <TabsContent value="athletes" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search athletes by name..."
                  className="pl-8"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Athlete
            </Button>
          </div>
          
          {showFilters && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="sport-filter">Sport</Label>
                    <Select
                      value={filters.sport}
                      onValueChange={(value) => handleFilterChange("sport", value)}
                    >
                      <SelectTrigger id="sport-filter">
                        <SelectValue placeholder="All Sports" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sports</SelectItem>
                        <SelectItem value="Basketball">Basketball</SelectItem>
                        <SelectItem value="Football">Football</SelectItem>
                        <SelectItem value="Soccer">Soccer</SelectItem>
                        <SelectItem value="Volleyball">Volleyball</SelectItem>
                        <SelectItem value="Baseball">Baseball</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="position-filter">Position</Label>
                    <Select
                      value={filters.position}
                      onValueChange={(value) => handleFilterChange("position", value)}
                    >
                      <SelectTrigger id="position-filter">
                        <SelectValue placeholder="All Positions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Positions</SelectItem>
                        <SelectItem value="Point Guard">Point Guard</SelectItem>
                        <SelectItem value="Quarterback">Quarterback</SelectItem>
                        <SelectItem value="Striker">Striker</SelectItem>
                        <SelectItem value="Defensive End">Defensive End</SelectItem>
                        <SelectItem value="Setter">Setter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="star-filter">Star Rating</Label>
                    <Select
                      value={filters.starRating}
                      onValueChange={(value) => handleFilterChange("starRating", value)}
                    >
                      <SelectTrigger id="star-filter">
                        <SelectValue placeholder="Any Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Rating</SelectItem>
                        <SelectItem value="5">5 Star</SelectItem>
                        <SelectItem value="4">4 Star</SelectItem>
                        <SelectItem value="3">3 Star</SelectItem>
                        <SelectItem value="2">2 Star</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => handleFilterChange("status", value)}
                    >
                      <SelectTrigger id="status-filter">
                        <SelectValue placeholder="Any Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Status</SelectItem>
                        <SelectItem value="interested">Interested</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="committed">Committed</SelectItem>
                        <SelectItem value="signed">Signed</SelectItem>
                        <SelectItem value="watchlist">Watchlist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="class-filter">Class</Label>
                    <Select
                      value={filters.class}
                      onValueChange={(value) => handleFilterChange("class", value)}
                    >
                      <SelectTrigger id="class-filter">
                        <SelectValue placeholder="Any Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Class</SelectItem>
                        <SelectItem value="Freshman">Freshman</SelectItem>
                        <SelectItem value="Sophomore">Sophomore</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({
                      sport: "all",
                      position: "all",
                      starRating: "all",
                      status: "all",
                      class: "all",
                    })}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {filteredAthletes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAthletes.map((athlete) => (
                <Card 
                  key={athlete.id} 
                  className="overflow-hidden hover:border-primary cursor-pointer transition-colors"
                  onClick={() => setSelectedAthlete(athlete)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between">
                      <Badge className={`${getStatusColor(athlete.status)} capitalize`}>
                        {athlete.status}
                      </Badge>
                      <div className="flex text-amber-400">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < athlete.starRating ? "fill-current" : "text-muted"}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={athlete.avatarUrl} alt={athlete.name} />
                        <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{athlete.name}</h3>
                        <div className="text-sm text-muted-foreground">{athlete.position} • {athlete.class}</div>
                        <div className="text-sm">{athlete.school}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-1 text-sm mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{athlete.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{athlete.sport}</span>
                      </div>
                      <div className="flex items-center">
                        <FileVideo className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{athlete.highlights} Highlights</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>GPA: {athlete.gpa}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {athlete.keyStats.map((stat, idx) => (
                        <Badge key={idx} variant="outline" className="font-mono">
                          {stat.name}: {stat.value}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        {athlete.lastContact ? `Last Contact: ${formatDate(athlete.lastContact)}` : 'No contact yet'}
                      </span>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Athletes Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={() => {
                setFilters({
                  sport: "all",
                  position: "all",
                  starRating: "all",
                  status: "all",
                  class: "all",
                });
                setSearchValue("");
              }}>
                Reset All Filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Recruiting Class Tab */}
        <TabsContent value="recruiting" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{displayedRecruitingClass.year} Recruiting Class</h2>
            
            <Select defaultValue={displayedRecruitingClass.year.toString()}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={displayedRecruitingClass.year.toString()}>
                  {displayedRecruitingClass.year}
                </SelectItem>
                <SelectItem value={(displayedRecruitingClass.year + 1).toString()}>
                  {displayedRecruitingClass.year + 1}
                </SelectItem>
                <SelectItem value={(displayedRecruitingClass.year + 2).toString()}>
                  {displayedRecruitingClass.year + 2}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Position Breakdown</CardTitle>
              <CardDescription>
                Current recruiting targets and commitments by position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Target #</TableHead>
                    <TableHead>Committed</TableHead>
                    <TableHead>Signed</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRecruitingClass.positions.map((position, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{position.name}</TableCell>
                      <TableCell>{position.targeted} / {position.limit}</TableCell>
                      <TableCell>{position.committed}</TableCell>
                      <TableCell>{position.signed}</TableCell>
                      <TableCell>
                        <Badge className={
                          position.committed + position.signed >= position.limit 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-amber-500/10 text-amber-500"
                        }>
                          {position.committed + position.signed >= position.limit 
                            ? "Complete" 
                            : `Need ${position.limit - (position.committed + position.signed)}`}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Current Commitments</CardTitle>
              <CardDescription>
                Athletes committed or signed to the {displayedRecruitingClass.year} class
              </CardDescription>
            </CardHeader>
            <CardContent>
              {displayedRecruitingClass.athletes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedRecruitingClass.athletes.map((athlete) => (
                      <TableRow key={athlete.id}>
                        <TableCell className="font-medium">{athlete.name}</TableCell>
                        <TableCell>{athlete.position}</TableCell>
                        <TableCell>
                          <Badge className={`capitalize ${getStatusColor(athlete.status)}`}>
                            {athlete.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex text-amber-400">
                            {Array(5).fill(0).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < athlete.starRating ? "fill-current" : "text-muted"}`} 
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(athlete.date)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No commitments or signings yet</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Commitment
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="flex justify-between">
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="all">All Events</TabsTrigger>
                </TabsList>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </div>
              
              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>
                      Scheduled activities with recruits and team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {displayedEvents.filter(e => new Date(e.date) >= new Date() && e.status !== 'canceled').length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Athletes</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayedEvents
                            .filter(e => new Date(e.date) >= new Date() && e.status !== 'canceled')
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map((event) => (
                              <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    {getEventIcon(event.type)}
                                    <span className="ml-2 capitalize">{event.type}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{formatDateWithTime(event.date)}</TableCell>
                                <TableCell>
                                  <div className="flex -space-x-2">
                                    {event.athletes.slice(0, 3).map((athlete) => (
                                      <Avatar key={athlete.id} className="h-6 w-6 border-2 border-background">
                                        <AvatarImage src={athlete.avatarUrl} alt={athlete.name} />
                                        <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {event.athletes.length > 3 && (
                                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                        +{event.athletes.length - 3}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{event.location || "—"}</TableCell>
                                <TableCell>
                                  <Badge className={`capitalize ${getStatusColor(event.status)}`}>
                                    {event.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>View Details</DropdownMenuItem>
                                      <DropdownMenuItem>Edit Event</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive">Cancel Event</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6">
                        <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No upcoming events scheduled</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="past">
                <Card>
                  <CardHeader>
                    <CardTitle>Past Events</CardTitle>
                    <CardDescription>
                      Previous activities with recruits and team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {displayedEvents.filter(e => new Date(e.date) < new Date() || e.status === 'completed').length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Athletes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayedEvents
                            .filter(e => new Date(e.date) < new Date() || e.status === 'completed')
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((event) => (
                              <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    {getEventIcon(event.type)}
                                    <span className="ml-2 capitalize">{event.type}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{formatDateWithTime(event.date)}</TableCell>
                                <TableCell>
                                  <div className="flex -space-x-2">
                                    {event.athletes.slice(0, 3).map((athlete) => (
                                      <Avatar key={athlete.id} className="h-6 w-6 border-2 border-background">
                                        <AvatarImage src={athlete.avatarUrl} alt={athlete.name} />
                                        <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {event.athletes.length > 3 && (
                                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                        +{event.athletes.length - 3}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={`capitalize ${getStatusColor(event.status)}`}>
                                    {event.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6">
                        <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No past events found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>All Events</CardTitle>
                    <CardDescription>
                      Complete event schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {displayedEvents.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Athletes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayedEvents
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map((event) => (
                              <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    {getEventIcon(event.type)}
                                    <span className="ml-2 capitalize">{event.type}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{formatDateWithTime(event.date)}</TableCell>
                                <TableCell>
                                  <div className="flex -space-x-2">
                                    {event.athletes.slice(0, 3).map((athlete) => (
                                      <Avatar key={athlete.id} className="h-6 w-6 border-2 border-background">
                                        <AvatarImage src={athlete.avatarUrl} alt={athlete.name} />
                                        <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {event.athletes.length > 3 && (
                                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                        +{event.athletes.length - 3}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={`capitalize ${getStatusColor(event.status)}`}>
                                    {event.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6">
                        <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No events found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Tabs defaultValue="inbox" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="inbox" className="flex items-center">
                  <Inbox className="h-4 w-4 mr-2" />
                  Inbox
                  {displayedMessages.filter(m => !m.isRead && m.sender.role !== 'coach').length > 0 && (
                    <span className="ml-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">
                      {displayedMessages.filter(m => !m.isRead && m.sender.role !== 'coach').length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Sent
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
              </TabsList>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
            
            <TabsContent value="inbox">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Inbox</CardTitle>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search messages..."
                        className="w-[250px]"
                      />
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {displayedMessages.filter(m => m.sender.role !== 'coach').length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[240px]">From</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead className="text-right">Date</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedMessages
                          .filter(m => m.sender.role !== 'coach')
                          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                          .map((message) => (
                            <TableRow key={message.id} className={message.isRead ? "" : "font-semibold bg-muted/30"}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={message.sender.avatarUrl} alt={message.sender.name} />
                                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className={message.isRead ? "" : "font-semibold"}>
                                      {message.sender.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {message.sender.role === 'athlete' ? 'Recruit' : 'System'}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`line-clamp-1 ${message.isRead ? "" : "font-semibold"}`}>
                                  {message.content}
                                </span>
                              </TableCell>
                              <TableCell className="text-right text-sm text-muted-foreground">
                                {formatDateWithTime(message.timestamp)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon">
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <CheckCheck className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-10">
                      <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Your inbox is empty</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sent">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Sent Messages</CardTitle>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search messages..."
                        className="w-[250px]"
                      />
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {displayedMessages.filter(m => m.sender.role === 'coach').length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[240px]">To</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead className="text-right">Date</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedMessages
                          .filter(m => m.sender.role === 'coach')
                          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                          .map((message) => (
                            <TableRow key={message.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={message.recipient.avatarUrl} alt={message.recipient.name} />
                                    <AvatarFallback>{message.recipient.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    {message.recipient.name}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="line-clamp-1">
                                  {message.content}
                                </span>
                              </TableCell>
                              <TableCell className="text-right text-sm text-muted-foreground">
                                {formatDateWithTime(message.timestamp)}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-10">
                      <Send className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No sent messages</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>System Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {displayedMessages.filter(m => m.sender.role === 'system').length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Notification</TableHead>
                          <TableHead className="text-right">Date</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedMessages
                          .filter(m => m.sender.role === 'system')
                          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                          .map((message) => (
                            <TableRow key={message.id} className={message.isRead ? "" : "font-semibold bg-muted/30"}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Bell className="h-4 w-4" />
                                  </div>
                                  <span className={message.isRead ? "" : "font-semibold"}>
                                    {message.content}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right text-sm text-muted-foreground">
                                {formatDateWithTime(message.timestamp)}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon">
                                  <CheckCheck className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-10">
                      <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No notifications</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <h2 className="text-xl font-bold">Tasks</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pending Tasks */}
            <Card>
              <CardHeader className="pb-3 bg-muted/50">
                <CardTitle className="text-base flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-amber-500" />
                  Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="p-4 space-y-4">
                    {displayedTasks.filter(t => t.status === 'pending').map((task) => (
                      <div key={task.id} className="border rounded-md p-3 hover:border-primary transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium line-clamp-1">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            Due: {formatDate(task.dueDate)}
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => completeTaskMutation.mutate(task.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        {task.relatedTo && (
                          <div className="mt-2 flex items-center text-xs">
                            <Badge variant="outline" className="font-normal">
                              {task.relatedTo.type === 'athlete' ? (
                                <User className="h-3 w-3 mr-1" />
                              ) : (
                                <Calendar className="h-3 w-3 mr-1" />
                              )}
                              {task.relatedTo.name}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                    {displayedTasks.filter(t => t.status === 'pending').length === 0 && (
                      <div className="text-center py-6">
                        <CheckCheck className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No pending tasks</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* In Progress Tasks */}
            <Card>
              <CardHeader className="pb-3 bg-muted/50">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-blue-500" />
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="p-4 space-y-4">
                    {displayedTasks.filter(t => t.status === 'in_progress').map((task) => (
                      <div key={task.id} className="border rounded-md p-3 hover:border-primary transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium line-clamp-1">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            Due: {formatDate(task.dueDate)}
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => completeTaskMutation.mutate(task.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        {task.relatedTo && (
                          <div className="mt-2 flex items-center text-xs">
                            <Badge variant="outline" className="font-normal">
                              {task.relatedTo.type === 'athlete' ? (
                                <User className="h-3 w-3 mr-1" />
                              ) : (
                                <Calendar className="h-3 w-3 mr-1" />
                              )}
                              {task.relatedTo.name}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                    {displayedTasks.filter(t => t.status === 'in_progress').length === 0 && (
                      <div className="text-center py-6">
                        <Lightbulb className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No tasks in progress</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Completed Tasks */}
            <Card>
              <CardHeader className="pb-3 bg-muted/50">
                <CardTitle className="text-base flex items-center">
                  <CheckCheck className="h-5 w-5 mr-2 text-green-500" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="p-4 space-y-4">
                    {displayedTasks.filter(t => t.status === 'completed').map((task) => (
                      <div key={task.id} className="border rounded-md p-3 hover:border-primary transition-colors cursor-pointer opacity-70">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium line-clamp-1 line-through">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            Due: {formatDate(task.dueDate)}
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        {task.relatedTo && (
                          <div className="mt-2 flex items-center text-xs">
                            <Badge variant="outline" className="font-normal">
                              {task.relatedTo.type === 'athlete' ? (
                                <User className="h-3 w-3 mr-1" />
                              ) : (
                                <Calendar className="h-3 w-3 mr-1" />
                              )}
                              {task.relatedTo.name}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                    {displayedTasks.filter(t => t.status === 'completed').length === 0 && (
                      <div className="text-center py-6">
                        <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No completed tasks</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Athlete detail sheet */}
      {selectedAthlete && (
        <Sheet open={!!selectedAthlete} onOpenChange={() => setSelectedAthlete(null)}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader className="pb-4">
              <SheetTitle>Athlete Profile</SheetTitle>
              <SheetDescription>
                View and manage athlete details
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-2 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedAthlete.avatarUrl} alt={selectedAthlete.name} />
                  <AvatarFallback>{selectedAthlete.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedAthlete.name}</h2>
                  <p className="text-muted-foreground">{selectedAthlete.position} • {selectedAthlete.class}</p>
                  <div className="flex items-center mt-1">
                    <Badge className={`${getStatusColor(selectedAthlete.status)} capitalize`}>
                      {selectedAthlete.status}
                    </Badge>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <div className="flex text-amber-400">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < selectedAthlete.starRating ? "fill-current" : "text-muted"}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${selectedAthlete.email}`} className="text-sm hover:underline">
                      {selectedAthlete.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${selectedAthlete.phone}`} className="text-sm hover:underline">
                      {selectedAthlete.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{selectedAthlete.location}</span>
                  </div>
                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{selectedAthlete.school}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Academics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">GPA</div>
                    <div className="font-medium">{selectedAthlete.gpa}</div>
                  </div>
                  {selectedAthlete.testScores.sat && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">SAT</div>
                      <div className="font-medium">{selectedAthlete.testScores.sat}</div>
                    </div>
                  )}
                  {selectedAthlete.testScores.act && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">ACT</div>
                      <div className="font-medium">{selectedAthlete.testScores.act}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Athletics</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Sport</div>
                    <div className="font-medium">{selectedAthlete.sport}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Position</div>
                    <div className="font-medium">{selectedAthlete.position}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Height</div>
                    <div className="font-medium">{selectedAthlete.height}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Weight</div>
                    <div className="font-medium">{selectedAthlete.weight}</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Key Stats</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAthlete.keyStats.map((stat, idx) => (
                      <Badge key={idx} variant="outline" className="font-mono">
                        {stat.name}: {stat.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm mb-3">{selectedAthlete.notes}</p>
                
                <div className="space-y-2">
                  <Label htmlFor="add-note">Add Note</Label>
                  <Input id="add-note" placeholder="Add a new note..." />
                  <Button 
                    className="w-full"
                    onClick={() => {
                      addNoteMutation.mutate({ 
                        athleteId: selectedAthlete.id, 
                        note: (document.getElementById('add-note') as HTMLInputElement).value 
                      });
                    }}
                  >
                    Save Note
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Highlights</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((idx) => (
                    <div 
                      key={idx} 
                      className="aspect-video bg-muted rounded-md flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                    >
                      <Play className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <FileVideo className="h-4 w-4 mr-2" />
                  View All Highlights
                </Button>
              </div>
            </div>
            
            <SheetFooter className="mt-6">
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button variant="outline" onClick={() => contactAthleteMutation.mutate(selectedAthlete.id)}>
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}