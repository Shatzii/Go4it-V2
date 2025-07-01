import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Crown, Users, UserPlus, Calendar, Clock, Target, CheckCircle, AlertCircle, 
  MessageSquare, Send, FileText, Award, TrendingUp, Brain, Zap
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function InternManagement() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Security Guard: Only SpacePharaoh can access Intern Management
  useEffect(() => {
    if (!isLoading && (!user || user.email !== 'SpaceP@shatzii.com')) {
      setLocation('/login');
      return;
    }
  }, [user, isLoading, setLocation]);
  
  const [activeInterns, setActiveInterns] = useState([
    {
      id: 1,
      name: "Alex Chen",
      email: "alex.chen@shatzii.com",
      specialization: "AI Development",
      startDate: "2025-06-01",
      performance: 94,
      tasksCompleted: 47,
      currentProject: "Roofing AI Enhancement",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Sarah Rodriguez",
      email: "sarah.rodriguez@shatzii.com",
      specialization: "Frontend Development",
      startDate: "2025-06-15",
      performance: 89,
      tasksCompleted: 32,
      currentProject: "Master Control UI",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "David Park",
      email: "david.park@shatzii.com", 
      specialization: "Backend Development",
      startDate: "2025-06-10",
      performance: 91,
      tasksCompleted: 38,
      currentProject: "API Optimization",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Emma Thompson",
      email: "emma.thompson@shatzii.com",
      specialization: "Data Science",
      startDate: "2025-06-05",
      performance: 96,
      tasksCompleted: 52,
      currentProject: "AI Model Training",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Implement Real-time Alerts System",
      description: "Build notification system for Master Control dashboard",
      assignedTo: "Alex Chen",
      priority: "high",
      dueDate: "2025-07-05",
      status: "in-progress",
      category: "AI Development",
      estimatedHours: 16
    },
    {
      id: 2,
      title: "Optimize Database Queries",
      description: "Improve performance of analytics queries by 50%",
      assignedTo: "David Park",
      priority: "medium",
      dueDate: "2025-07-08",
      status: "assigned",
      category: "Backend",
      estimatedHours: 12
    },
    {
      id: 3,
      title: "Design Mobile UI Components", 
      description: "Create responsive components for mobile dashboard",
      assignedTo: "Sarah Rodriguez",
      priority: "medium",
      dueDate: "2025-07-10",
      status: "completed",
      category: "Frontend",
      estimatedHours: 20
    },
    {
      id: 4,
      title: "Train Sentiment Analysis Model",
      description: "Improve customer feedback analysis accuracy to 97%",
      assignedTo: "Emma Thompson",
      priority: "high",
      dueDate: "2025-07-12",
      status: "in-progress",
      category: "Data Science",
      estimatedHours: 24
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
    category: "",
    estimatedHours: 8
  });

  const [selectedIntern, setSelectedIntern] = useState<any>(null);
  const [message, setMessage] = useState("");

  // Verify SpacePharaoh access
  if (!user || user.email !== "SpaceP@shatzii.com") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">Supreme Access Required</h2>
            <p className="text-red-300">Intern Management restricted to SpacePharaoh only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const createTask = () => {
    if (!newTask.title || !newTask.assignedTo) return;
    
    const task = {
      id: tasks.length + 1,
      ...newTask,
      status: "assigned" as const
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
      category: "",
      estimatedHours: 8
    });
  };

  const sendMessage = () => {
    if (!selectedIntern || !message) return;
    
    // Simulate sending message
    console.log(`Message sent to ${selectedIntern.name}: ${message}`);
    setMessage("");
    setSelectedIntern(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400";
      case "in-progress": return "text-blue-400";
      case "assigned": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-amber-900/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
              Intern Management System
            </h1>
            <Users className="w-12 h-12 text-blue-400" />
          </div>
          <p className="text-lg text-slate-300">
            SpacePharaoh's Command Center for Intern Delegation & Management
          </p>
          <div className="flex gap-2 justify-center mt-2">
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black">
              PHARAOH COMMAND
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              {activeInterns.length} ACTIVE INTERNS
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-blue-300">{activeInterns.length}</div>
                  <div className="text-sm text-blue-400">Active Interns</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-green-300">
                    {tasks.filter(t => t.status === 'completed').length}
                  </div>
                  <div className="text-sm text-green-400">Tasks Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="w-8 h-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-purple-300">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-purple-400">In Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-8 h-8 text-amber-400" />
                <div>
                  <div className="text-2xl font-bold text-amber-300">92%</div>
                  <div className="text-sm text-amber-400">Avg Performance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="interns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="interns">Intern Directory</TabsTrigger>
            <TabsTrigger value="tasks">Task Management</TabsTrigger>
            <TabsTrigger value="delegate">Delegate New Task</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="interns" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {activeInterns.map((intern) => (
                <Card key={intern.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <img 
                        src={intern.avatar} 
                        alt={intern.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-slate-200">{intern.name}</CardTitle>
                        <CardDescription>{intern.specialization}</CardDescription>
                        <Badge variant="outline" className="mt-1">
                          {intern.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Performance</span>
                        <span className="text-green-400 font-bold">{intern.performance}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tasks Completed</span>
                        <span className="text-blue-400">{intern.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Current Project</span>
                        <span className="text-purple-400 text-sm">{intern.currentProject}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedIntern(intern)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Award className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-200">{task.title}</h3>
                          <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-slate-400 mb-3">{task.description}</p>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Assigned to:</span>
                            <div className="text-blue-400">{task.assignedTo}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Due Date:</span>
                            <div className="text-amber-400">{task.dueDate}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Category:</span>
                            <div className="text-purple-400">{task.category}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Est. Hours:</span>
                            <div className="text-green-400">{task.estimatedHours}h</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {task.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : task.status === 'in-progress' ? (
                          <Clock className="w-6 h-6 text-blue-400" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-yellow-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="delegate" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Delegate New Task
                </CardTitle>
                <CardDescription>Assign tasks to interns with specific requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Task Title</label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Enter task title"
                      className="bg-slate-700/50 border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Assign to Intern</label>
                    <Select 
                      value={newTask.assignedTo} 
                      onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600">
                        <SelectValue placeholder="Select intern" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeInterns.map((intern) => (
                          <SelectItem key={intern.id} value={intern.name}>
                            {intern.name} - {intern.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Description</label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Detailed task description and requirements"
                    className="bg-slate-700/50 border-slate-600 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Priority</label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(value) => setNewTask({...newTask, priority: value})}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Due Date</label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="bg-slate-700/50 border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Category</label>
                    <Input
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      placeholder="e.g., Frontend, Backend"
                      className="bg-slate-700/50 border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Est. Hours</label>
                    <Input
                      type="number"
                      value={newTask.estimatedHours}
                      onChange={(e) => setNewTask({...newTask, estimatedHours: parseInt(e.target.value)})}
                      className="bg-slate-700/50 border-slate-600"
                    />
                  </div>
                </div>

                <Button 
                  onClick={createTask}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                  disabled={!newTask.title || !newTask.assignedTo}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Delegate Task
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-blue-400">Direct Messaging</CardTitle>
                  <CardDescription>Communicate directly with interns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select onValueChange={(value) => {
                    const intern = activeInterns.find(i => i.name === value);
                    setSelectedIntern(intern);
                  }}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600">
                      <SelectValue placeholder="Select intern to message" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeInterns.map((intern) => (
                        <SelectItem key={intern.id} value={intern.name}>
                          {intern.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedIntern && (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img 
                            src={selectedIntern.avatar} 
                            alt={selectedIntern.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-slate-200">{selectedIntern.name}</div>
                            <div className="text-sm text-slate-400">{selectedIntern.specialization}</div>
                          </div>
                        </div>
                      </div>

                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="bg-slate-700/50 border-slate-600 min-h-[120px]"
                      />

                      <Button 
                        onClick={sendMessage}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!message}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-green-400">Quick Actions</CardTitle>
                  <CardDescription>Rapid intern management commands</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Team Meeting
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Progress Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Award className="w-4 h-4 mr-2" />
                    Performance Reviews
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Training Sessions
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    Emergency Task Reassignment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}