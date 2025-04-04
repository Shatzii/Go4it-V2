import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, CheckCircle, Clock, XCircle, MessageSquare, Send } from "lucide-react";

export default function CoachConnection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch coach connections
  const { data: connections, isLoading: connectionsLoading } = useQuery({
    queryKey: ["/api/connections"],
    enabled: !!user,
  });

  // Fetch all coaches (for athletes to browse)
  const { data: allCoaches, isLoading: coachesLoading } = useQuery({
    queryKey: ["/api/coaches"],
    enabled: !!user && user.role === "athlete",
  });

  // Update connection status mutation
  const updateConnectionMutation = useMutation({
    mutationFn: async ({ connectionId, status }: { connectionId: number; status: string }) => {
      return await apiRequest("PUT", `/api/connections/${connectionId}`, {
        connectionStatus: status,
      });
    },
    onSuccess: () => {
      toast({
        title: "Connection updated",
        description: "The connection status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating the connection status.",
        variant: "destructive",
      });
    },
  });

  // Create connection mutation
  const createConnectionMutation = useMutation({
    mutationFn: async ({ coachId, notes }: { coachId: number; notes: string }) => {
      return await apiRequest("POST", "/api/connections", {
        coachId,
        notes,
      });
    },
    onSuccess: () => {
      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent to the coach.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
    },
    onError: (error) => {
      toast({
        title: "Request failed",
        description: error.message || "There was an error sending the connection request.",
        variant: "destructive",
      });
    },
  });

  // Filter connections based on tab and search query
  const filteredConnections = connections
    ? connections.filter((connection) => {
        const matchesStatus =
          activeTab === "all" ||
          (activeTab === "pending" && connection.connectionStatus === "pending") ||
          (activeTab === "accepted" && connection.connectionStatus === "accepted") ||
          (activeTab === "rejected" && connection.connectionStatus === "rejected");

        const otherUser = connection.otherUser;
        const matchesSearch =
          !searchQuery ||
          otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          otherUser.username.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
      })
    : [];

  // Filter coaches based on search query
  const filteredCoaches = allCoaches
    ? allCoaches.filter(
        (coach) =>
          !searchQuery ||
          coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coach.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handle connection status update
  const handleUpdateStatus = (connectionId: number, status: string) => {
    updateConnectionMutation.mutate({ connectionId, status });
  };

  // Handle connection request
  const handleConnect = (coachId: number) => {
    createConnectionMutation.mutate({
      coachId,
      notes: "I'm interested in connecting with you as a coach.",
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Coach Connection</h1>
        <p className="text-gray-600 mb-6">
          Please log in to connect with coaches or athletes
        </p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral mb-2">
            {user.role === "athlete" ? "Coach Connection" : "Athlete Connection"}
          </h1>
          <p className="text-gray-600">
            {user.role === "athlete"
              ? "Connect with coaches that match your athletic profile"
              : "Manage your connections with potential athletes"}
          </p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {user.role === "athlete" ? "Your Coach Connections" : "Your Athlete Connections"}
              </CardTitle>
              <CardDescription>
                {user.role === "athlete"
                  ? "View and manage your connections with coaches"
                  : "View and manage your connections with athletes"}
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0 relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search connections..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {connectionsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading connections...</p>
                </div>
              ) : filteredConnections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredConnections.map((connection) => (
                    <div key={connection.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={connection.otherUser.profileImage} alt={connection.otherUser.name} />
                          <AvatarFallback>
                            {connection.otherUser.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-neutral">{connection.otherUser.name}</h3>
                          <p className="text-xs text-gray-600">{connection.otherUser.username}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <Badge
                          className={
                            connection.connectionStatus === "accepted"
                              ? "bg-accent"
                              : connection.connectionStatus === "rejected"
                              ? "bg-destructive"
                              : "bg-secondary"
                          }
                        >
                          {connection.connectionStatus.charAt(0).toUpperCase() + connection.connectionStatus.slice(1)}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          {connection.notes || "No additional notes"}
                        </p>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        Connected: {new Date(connection.connectionDate).toLocaleDateString()}
                      </div>

                      <div className="flex gap-2">
                        {connection.connectionStatus === "pending" ? (
                          user.role === "coach" || (user.role === "admin" && connection.athleteId === user.id) ? (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleUpdateStatus(connection.id, "accepted")}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleUpdateStatus(connection.id, "rejected")}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" className="flex-1" disabled>
                              <Clock className="h-4 w-4 mr-1" />
                              Awaiting Response
                            </Button>
                          )
                        ) : (
                          <Button variant="default" size="sm" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No connections found</h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    {activeTab === "all"
                      ? "You don't have any connections yet."
                      : `You don't have any ${activeTab} connections.`}
                  </p>
                  {user.role === "athlete" && activeTab === "all" && (
                    <Button onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
                      Find Coaches
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Find Coaches section - only for athletes */}
      {user.role === "athlete" && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Find Coaches
                </CardTitle>
                <CardDescription>
                  Discover and connect with coaches that match your sports interests
                </CardDescription>
              </div>
              <div className="mt-4 md:mt-0 relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search coaches..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {coachesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading coaches...</p>
              </div>
            ) : filteredCoaches && filteredCoaches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCoaches.map((coach) => {
                  // Check if already connected
                  const existingConnection = connections?.find(
                    (c) => c.coachId === coach.id
                  );

                  return (
                    <div key={coach.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={coach.profileImage} alt={coach.name} />
                          <AvatarFallback>
                            {coach.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-neutral">{coach.name}</h3>
                          <p className="text-xs text-gray-600">{coach.username}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {coach.bio || "No bio available"}
                      </p>

                      {existingConnection ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled
                        >
                          {existingConnection.connectionStatus === "accepted"
                            ? "Connected"
                            : existingConnection.connectionStatus === "rejected"
                            ? "Connection Declined"
                            : "Connection Pending"}
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={() => handleConnect(coach.id)}
                          disabled={createConnectionMutation.isPending}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No coaches found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your search query or check back later for new coaches.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
