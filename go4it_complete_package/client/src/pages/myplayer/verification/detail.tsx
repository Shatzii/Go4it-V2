import { useParams, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronLeft, 
  Play, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  CalendarClock, 
  Video, 
  FileCheck, 
  UserCircle,
  MessageSquare,
  Download
} from "lucide-react";

export default function VerificationDetail() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();

  // This would be fetched from the API in a real implementation
  const verification = {
    id: parseInt(params.id),
    title: "Advanced Shooting Drills",
    submissionDate: "2024-04-04T15:30:00Z",
    status: "pending", // 'pending', 'verified', 'rejected'
    workoutType: "Shooting",
    duration: 45,
    description: "Completed a series of advanced shooting drills focusing on catch-and-shoot, off-the-dribble, and fadeaway shots. Worked on proper form and follow-through throughout the session.",
    athleteNotes: "Felt good about my form today. The fadeaway shots were challenging but I noticed improvement by the end of the session.",
    location: "West High School Gym",
    xpReward: 350,
    athlete: {
      id: 1,
      name: user?.name || "Marcus Johnson",
      avatar: null
    },
    checkpoints: [
      {
        id: 1,
        timestamp: "00:02:15",
        title: "Warm-up complete",
        description: "Dynamic stretching and light shooting warm-up",
        imageUrl: null
      },
      {
        id: 2,
        timestamp: "00:15:45",
        title: "Catch-and-shoot drills",
        description: "20 shots from 5 different positions",
        imageUrl: null
      },
      {
        id: 3,
        timestamp: "00:28:30",
        title: "Off-the-dribble shots",
        description: "Completed pull-up jumpers and step-backs",
        imageUrl: null
      },
      {
        id: 4,
        timestamp: "00:39:15",
        title: "Fadeaway practice",
        description: "Working on balance and shot consistency",
        imageUrl: null
      }
    ],
    videos: [
      {
        id: 1,
        title: "Full Workout Session",
        description: "Complete recording of the 45-minute workout",
        duration: "45:12",
        thumbnailUrl: null,
        videoUrl: "#"
      },
      {
        id: 2,
        title: "Form Highlights",
        description: "Key moments showcasing proper shooting form",
        duration: "02:34",
        thumbnailUrl: null,
        videoUrl: "#"
      }
    ],
    verifier: null, // Would be populated for verified/rejected
    verificationDate: null, // Would be populated for verified/rejected
    verifierNotes: null, // Would be populated for verified/rejected
    rejectionReason: null // Would be populated for rejected
  };

  // Get status badge variant
  const getStatusBadge = () => {
    switch(verification.status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-600/20 flex items-center">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-600/20 flex items-center">
            <XCircle className="mr-1 h-3 w-3" /> Needs Revision
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/workout-verification")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Verification
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{verification.title}</CardTitle>
                  <CardDescription>
                    {verification.workoutType} • {verification.duration} minutes
                  </CardDescription>
                </div>
                {getStatusBadge()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium mb-2">Workout Description</h3>
                  <p className="text-sm text-muted-foreground">{verification.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      Submitted on {new Date(verification.submissionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>+{verification.xpReward} XP Reward</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-base font-medium mb-2">Workout Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {verification.videos.map((video) => (
                      <div key={video.id} className="border rounded-lg overflow-hidden">
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <Play className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium">{video.title}</h4>
                          <p className="text-sm text-muted-foreground mb-1">{video.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs flex items-center">
                              <Video className="h-3 w-3 mr-1" />
                              {video.duration}
                            </span>
                            <Button size="sm" variant="ghost">
                              <Play className="h-3 w-3 mr-1" /> Play
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-base font-medium mb-2">Workout Checkpoints</h3>
                  <div className="space-y-4">
                    {verification.checkpoints.map((checkpoint, index) => (
                      <div key={checkpoint.id} className="relative pl-6 pb-6">
                        {/* Timeline connector */}
                        {index < verification.checkpoints.length - 1 && (
                          <div className="absolute top-6 left-3 bottom-0 w-0.5 bg-muted"></div>
                        )}
                        {/* Timeline point */}
                        <div className="absolute top-1 left-0 w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center bg-background">
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                        
                        <div className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium">{checkpoint.title}</h4>
                            <span className="text-xs text-muted-foreground">{checkpoint.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{checkpoint.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {verification.status === "rejected" && verification.rejectionReason && (
                  <>
                    <Separator />
                    <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md">
                      <h3 className="text-base font-medium text-red-600 dark:text-red-400 mb-1">Feedback from Coach</h3>
                      <p className="text-sm text-red-600 dark:text-red-400">{verification.rejectionReason}</p>
                    </div>
                  </>
                )}

                {verification.status === "verified" && verification.verifierNotes && (
                  <>
                    <Separator />
                    <div className="p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-md">
                      <h3 className="text-base font-medium text-green-600 dark:text-green-400 mb-1">Coach's Feedback</h3>
                      <p className="text-sm text-green-600 dark:text-green-400">{verification.verifierNotes}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t pt-4">
              {verification.status === "pending" && (
                <Button variant="outline">Cancel Submission</Button>
              )}
              {verification.status === "rejected" && (
                <Button>Resubmit with Changes</Button>
              )}
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download Record
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Athlete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={verification.athlete.avatar || ""} alt={verification.athlete.name} />
                  <AvatarFallback>{verification.athlete.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{verification.athlete.name}</p>
                  <p className="text-sm text-muted-foreground">Athlete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {verification.athleteNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Athlete Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{verification.athleteNotes}</p>
              </CardContent>
            </Card>
          )}

          {verification.status === "verified" && verification.verifier && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verified By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <UserCircle className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{verification.verifier}</p>
                    <p className="text-sm text-muted-foreground">
                      {verification.verificationDate && 
                        `Verified on ${new Date(verification.verificationDate).toLocaleDateString()}`
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{verification.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">{verification.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm text-muted-foreground">{verification.workoutType}</p>
              </div>
              <div>
                <p className="text-sm font-medium">XP Reward</p>
                <p className="text-sm text-muted-foreground">+{verification.xpReward} XP</p>
              </div>
            </CardContent>
          </Card>

          {verification.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    Your workout is awaiting verification from a coach. You'll receive a notification once it's been reviewed.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Average review time: 24-48 hours
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" /> Contact Coach
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}