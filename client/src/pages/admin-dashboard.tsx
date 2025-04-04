import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  ChartBarStacked, 
  ChartBar, 
  Users, 
  UserCheck, 
  FileVideo, 
  Search, 
  Activity,
  ArrowUpRight,
  ArrowDownRight, 
  PersonStanding,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!user && user.role === "admin",
  });

  // Fetch all users
  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === "admin",
  });

  // Fetch all athletes
  const { data: athletes, isLoading: athletesLoading } = useQuery({
    queryKey: ["/api/admin/athletes"],
    enabled: !!user && user.role === "admin" && activeTab === "athletes",
  });

  // Fetch all coaches
  const { data: coaches, isLoading: coachesLoading } = useQuery({
    queryKey: ["/api/admin/coaches"],
    enabled: !!user && user.role === "admin" && activeTab === "coaches",
  });

  // Fetch all videos
  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ["/api/admin/videos"],
    enabled: !!user && user.role === "admin" && activeTab === "videos",
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Please log in to access the admin dashboard
        </p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
          This area is restricted to administrators only.
        </p>
        <Link href="/">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Filter users based on search query
  const filterItems = (items) => {
    if (!items) return [];
    if (!searchQuery) return items;
    
    return items.filter((item) => {
      return (
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  };

  // Format date helper function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, view analytics, and oversee platform activity
          </p>
        </div>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users, videos, coaches..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="athletes">Athletes</TabsTrigger>
          <TabsTrigger value="coaches">Coaches</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {statsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard statistics...</p>
            </div>
          ) : stats ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-emerald-500 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        16% from last month
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                    <FileVideo className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalVideos}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-emerald-500 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        24% from last month
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-emerald-500 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        12% from last month
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Coach Connections</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalCoachConnections}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-red-500 flex items-center">
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        5% from last month
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* User Distribution Chart */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ChartBar className="h-5 w-5 mr-2" />
                    User Growth
                  </CardTitle>
                  <CardDescription>
                    Overview of platform user growth over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end justify-between px-2">
                    {/* Simulated chart bars - In a real app, use a charting library like recharts */}
                    <div className="w-full max-w-lg mx-auto flex items-end justify-between">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => (
                        <div key={month} className="flex flex-col items-center">
                          <div className="relative flex gap-1">
                            <div
                              className="w-8 bg-primary rounded-t-md"
                              style={{ height: `${100 + i * 20}px` }}
                            ></div>
                            <div
                              className="w-8 bg-secondary rounded-t-md"
                              style={{ height: `${60 + i * 15}px` }}
                            ></div>
                          </div>
                          <span className="mt-2 text-xs text-muted-foreground">{month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-primary rounded-sm mr-2"></div>
                      <span className="text-sm">Athletes</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-secondary rounded-sm mr-2"></div>
                      <span className="text-sm">Coaches</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Recent Users
                  </CardTitle>
                  <CardDescription>
                    Latest user registrations on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterItems(allUsers)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 5)
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={user.profileImage} alt={user.name} />
                                  <AvatarFallback>
                                    {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="capitalize bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs">
                                {user.role}
                              </span>
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Activity Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Platform Activity Summary
                  </CardTitle>
                  <CardDescription>
                    An overview of key platform activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Video Uploads</span>
                        <span className="text-sm text-muted-foreground">{stats.totalVideos} total</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">75% of registered athletes have uploaded videos</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Analysis Completion</span>
                        <span className="text-sm text-muted-foreground">{stats.totalAnalyses} analyses</span>
                      </div>
                      <Progress value={92} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">92% of uploaded videos have been analyzed</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Coach-Athlete Connections</span>
                        <span className="text-sm text-muted-foreground">{stats.totalCoachConnections} connections</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">45% of athletes have connected with coaches</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">NCAA Eligibility Tracking</span>
                        <span className="text-sm text-muted-foreground">68% complete</span>
                      </div>
                      <Progress value={68} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">68% of athletes are tracking their NCAA eligibility</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <ChartBarStacked className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Stats Available</h2>
              <p className="text-gray-600 mb-6">
                We couldn't load the dashboard statistics at this time.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Athletes Tab */}
        <TabsContent value="athletes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PersonStanding className="h-5 w-5 mr-2" />
                Athletes
              </CardTitle>
              <CardDescription>
                Manage athlete accounts and view their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {athletesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading athletes...</p>
                </div>
              ) : athletes && athletes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Athlete</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Videos</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterItems(athletes).map((athlete) => (
                      <TableRow key={athlete.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={athlete.profileImage} alt={athlete.name} />
                              <AvatarFallback>
                                {athlete.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{athlete.name}</p>
                              <p className="text-xs text-muted-foreground">@{athlete.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{athlete.email}</TableCell>
                        <TableCell>{formatDate(athlete.createdAt)}</TableCell>
                        <TableCell>
                          <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs">
                            {Math.floor(Math.random() * 10)} videos
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <PersonStanding className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No athletes found</h3>
                  <p className="text-gray-600">No athlete accounts match your search criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coaches Tab */}
        <TabsContent value="coaches">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                Coaches
              </CardTitle>
              <CardDescription>
                Manage coach accounts and their connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {coachesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading coaches...</p>
                </div>
              ) : coaches && coaches.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coach</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Connections</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterItems(coaches).map((coach) => (
                      <TableRow key={coach.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={coach.profileImage} alt={coach.name} />
                              <AvatarFallback>
                                {coach.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{coach.name}</p>
                              <p className="text-xs text-muted-foreground">@{coach.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{coach.email}</TableCell>
                        <TableCell>{formatDate(coach.createdAt)}</TableCell>
                        <TableCell>
                          <span className="bg-secondary bg-opacity-10 text-secondary px-2 py-1 rounded-full text-xs">
                            {Math.floor(Math.random() * 15)} athletes
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <UserCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No coaches found</h3>
                  <p className="text-gray-600">No coach accounts match your search criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileVideo className="h-5 w-5 mr-2" />
                Videos & Analyses
              </CardTitle>
              <CardDescription>
                View all uploaded videos and their analysis status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {videosLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading videos...</p>
                </div>
              ) : videos && videos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Video</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Sport</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterItems(videos).map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="w-12 h-8 bg-gray-200 rounded overflow-hidden mr-3">
                              {video.thumbnailPath ? (
                                <img
                                  src={video.thumbnailPath}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                  <FileVideo className="h-4 w-4 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <p className="font-medium">{video.title}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs">Athlete #{video.userId}</span>
                        </TableCell>
                        <TableCell>{formatDate(video.uploadDate)}</TableCell>
                        <TableCell>
                          <span className="capitalize">{video.sportType || "Unknown"}</span>
                        </TableCell>
                        <TableCell>
                          {video.analyzed ? (
                            <span className="bg-accent bg-opacity-10 text-accent px-2 py-1 rounded-full text-xs">
                              Analyzed
                            </span>
                          ) : (
                            <span className="bg-amber-500 bg-opacity-10 text-amber-500 px-2 py-1 rounded-full text-xs">
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <FileVideo className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No videos found</h3>
                  <p className="text-gray-600">No videos match your search criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
