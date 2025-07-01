import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { aiService } from "@/lib/aiService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Clock, Info, RefreshCw, XCircle, Terminal, Shield, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HealingEvent {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
  status: 'complete' | 'in-progress' | 'pending';
}

export default function AISelfHealing() {
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<HealingEvent | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logContent, setLogContent] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  
  // Fetch healing events
  const { data: healingEvents = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/healing-events'],
    queryFn: async () => {
      const response = await aiService.getHealingEvents();
      return response.events || [];
    }
  });
  
  // Sort events by timestamp (newest first)
  const sortedEvents = [...healingEvents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true
    });
  };
  
  // Get icon based on event type
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  // Get status badge style
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'complete': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'in-progress': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'pending': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Analyze logs
  const handleAnalyze = async () => {
    if (!logContent.trim() || !issueDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both log content and issue description.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      await aiService.analyzeServerIssue(logContent, issueDescription);
      
      toast({
        title: "Analysis complete",
        description: "Server logs analyzed successfully. Check the events list for results.",
      });
      
      // Reset form
      setLogContent("");
      setIssueDescription("");
      
      // Refetch events
      await refetch();
      
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze server logs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Update event status
  const updateEventStatus = async (eventId: string, newStatus: 'complete' | 'in-progress' | 'pending') => {
    try {
      await aiService.updateHealingEventStatus(eventId, newStatus);
      
      toast({
        title: "Status updated",
        description: `Event status updated to ${newStatus}.`,
      });
      
      // Refresh the event list
      queryClient.invalidateQueries({ queryKey: ['/api/healing-events'] });
      
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update event status.",
        variant: "destructive"
      });
    }
  };
  
  const getEventTypeIcon = (title: string) => {
    if (title.includes("Security")) return <Shield className="h-5 w-5" />;
    if (title.includes("Performance")) return <Activity className="h-5 w-5" />;
    if (title.includes("Analysis")) return <Info className="h-5 w-5" />;
    if (title.includes("Self-Healing")) return <Terminal className="h-5 w-5" />;
    return <Info className="h-5 w-5" />;
  };
  
  // Sample server logs for demonstration
  const sampleLogs = `May 22 15:38:12 server systemd[1]: Started Application Server.
May 22 15:40:33 server kernel: [143667.485166] oom-kill:constraint=CONSTRAINT_NONE,nodemask=(null),cpuset=/,mems_allowed=0,global_oom,task_memcg=/user.slice/user-1000.slice/user@1000.service,task=node,pid=4521,uid=1000
May 22 15:40:33 server kernel: [143667.485217] Out of memory: Killed process 4521 (node) total-vm:1490304kB, anon-rss:1288436kB, file-rss:0kB, shmem-rss:0kB, UID:1000 pgtables:2516kB oom_score_adj:0
May 22 15:41:02 server systemd[1]: app.service: Main process exited, code=killed, status=9/KILL
May 22 15:41:02 server systemd[1]: app.service: Failed with result 'signal'`;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-primary" /> 
            <span>AI Self-Healing System</span>
          </CardTitle>
          <CardDescription>
            Automated server issue detection and recovery powered by PharaohAI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="events" className="space-y-4">
            <TabsList>
              <TabsTrigger value="events">Healing Events</TabsTrigger>
              <TabsTrigger value="analyze">Analyze Server Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Events List */}
                <div className="md:col-span-1 border rounded-lg overflow-hidden">
                  <div className="bg-muted p-3 font-medium flex items-center justify-between">
                    <span>Recent Events</span>
                    <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8 w-8 p-0">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="divide-y max-h-[500px] overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center">Loading events...</div>
                    ) : sortedEvents.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No healing events found. Analyze some server logs to get started.
                      </div>
                    ) : (
                      sortedEvents.map((event) => (
                        <div 
                          key={event.id} 
                          className={cn(
                            "p-3 cursor-pointer hover:bg-muted/50 transition-colors flex flex-col gap-2",
                            selectedEvent?.id === event.id && "bg-muted"
                          )}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">
                              {getEventTypeIcon(event.title)}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <h4 className="font-medium text-sm truncate">{event.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={cn("text-xs px-2 py-0", getStatusClass(event.status))}>
                                  <span className="flex items-center gap-1">
                                    {getStatusIcon(event.status)} {event.status}
                                  </span>
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(event.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="md:col-span-2 border rounded-lg">
                  {selectedEvent ? (
                    <div className="h-full flex flex-col">
                      <div className="bg-muted p-3 font-medium flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getEventIcon(selectedEvent.type)}
                          <span>Event Details</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusClass(selectedEvent.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(selectedEvent.status)} {selectedEvent.status}
                            </span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Detected on {formatDate(selectedEvent.timestamp)}
                        </p>
                        
                        <Separator className="my-3" />
                        
                        <div className="space-y-4 flex-1">
                          <div>
                            <h4 className="font-medium mb-1">Description</h4>
                            <div className="text-sm p-3 bg-muted/50 rounded-lg">
                              {/* Try to parse JSON if the description is JSON */}
                              {(() => {
                                try {
                                  const parsedData = JSON.parse(selectedEvent.description);
                                  if (Array.isArray(parsedData)) {
                                    return (
                                      <ul className="list-disc list-inside">
                                        {parsedData.map((item, index) => (
                                          <li key={index} className="mb-1">
                                            {typeof item === 'object' 
                                              ? item.command 
                                                ? `${item.command} - ${item.purpose}` 
                                                : JSON.stringify(item)
                                              : item}
                                          </li>
                                        ))}
                                      </ul>
                                    );
                                  } else if (typeof parsedData === 'object') {
                                    return (
                                      <div className="space-y-2">
                                        {Object.entries(parsedData).map(([key, value]) => (
                                          <div key={key}>
                                            <strong>{key}:</strong> {JSON.stringify(value)}
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  }
                                  return JSON.stringify(parsedData, null, 2);
                                } catch (e) {
                                  return selectedEvent.description;
                                }
                              })()}
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <h4 className="font-medium mb-2">Actions</h4>
                            <div className="flex items-center gap-2">
                              {selectedEvent.status !== 'complete' && (
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => updateEventStatus(selectedEvent.id, 'complete')}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Complete
                                </Button>
                              )}
                              
                              {selectedEvent.status !== 'in-progress' && selectedEvent.status !== 'complete' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateEventStatus(selectedEvent.id, 'in-progress')}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Start Healing
                                </Button>
                              )}
                              
                              {selectedEvent.status === 'in-progress' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateEventStatus(selectedEvent.id, 'pending')}
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  Pause Healing
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center p-8 text-center text-muted-foreground">
                      <div>
                        <Info className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <h3 className="font-medium mb-1">No Event Selected</h3>
                        <p className="text-sm max-w-md">
                          Select an event from the list to view details or use the "Analyze Server Logs" tab to detect new issues.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analyze" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium mb-2">Issue Description</h3>
                    <textarea
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Describe the server issue you're experiencing..."
                      className="w-full h-24 p-3 text-sm rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-base font-medium">Server Logs</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLogContent(sampleLogs)}
                      >
                        Load Sample
                      </Button>
                    </div>
                    <textarea
                      value={logContent}
                      onChange={(e) => setLogContent(e.target.value)}
                      placeholder="Paste your server logs here..."
                      className="w-full h-[300px] p-3 text-sm rounded-md border resize-none font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <Info className="h-5 w-5 text-primary" />
                      <span>How PharaohAI Self-Healing Works</span>
                    </h3>
                    
                    <ol className="list-decimal list-inside text-sm space-y-2 text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="font-bold text-primary">1.</span>
                        <span>Our local AI engine analyzes server logs to detect issues</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-primary">2.</span>
                        <span>The system identifies the root cause and severity</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-primary">3.</span>
                        <span>PharaohAI suggests specific commands to fix the problem</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-primary">4.</span>
                        <span>You can execute the commands automatically or manually</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-primary">5.</span>
                        <span>The healing event is tracked until resolution</span>
                      </li>
                    </ol>
                    
                    <div className="mt-4 bg-black/95 text-green-400 rounded p-3 text-sm font-mono">
                      <div className="opacity-80">$ pharaoh scan --auto-heal</div>
                      <div className="opacity-90 mt-1">[PHARAOH] Scanning server logs...</div>
                      <div className="opacity-90">[PHARAOH] Found 1 critical issue!</div>
                      <div className="opacity-90">[PHARAOH] Memory resource exhaustion detected</div>
                      <div className="opacity-90">[PHARAOH] Applying fix: Releasing cached memory</div>
                      <div className="text-yellow-400 mt-1">[PHARAOH] Fix applied successfully!</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-auto justify-end">
                    <Button
                      className="w-full"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !logContent.trim() || !issueDescription.trim()}
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Activity className="mr-2 h-4 w-4" />
                          Analyze Logs
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}