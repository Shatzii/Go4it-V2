import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Video, 
  BarChart3, 
  FileCheck, 
  History, 
  Plus,
  Calendar
} from "lucide-react";
import { Link } from "wouter";

export default function WorkoutVerification() {
  const { user } = useAuth();
  const { toast } = useToast();

  // This would be fetched from the API in a real implementation
  const verifications = {
    pending: [
      {
        id: 1,
        title: "Advanced Shooting Drills",
        submissionDate: "2024-04-04T15:30:00Z",
        status: "pending",
        workoutType: "Shooting",
        duration: 45,
        videoCount: 2,
        xpReward: 350,
      },
      {
        id: 2,
        title: "Conditioning Training",
        submissionDate: "2024-04-02T09:15:00Z",
        status: "pending",
        workoutType: "Conditioning",
        duration: 60,
        videoCount: 3,
        xpReward: 400,
      }
    ],
    verified: [
      {
        id: 3,
        title: "Ball Handling Circuit",
        submissionDate: "2024-03-30T14:00:00Z",
        verificationDate: "2024-03-31T10:20:00Z",
        status: "verified",
        workoutType: "Ball Handling",
        duration: 30,
        videoCount: 1,
        xpReward: 250,
        verifier: "Coach Williams"
      },
      {
        id: 4,
        title: "Leg Day Strength Training",
        submissionDate: "2024-03-28T16:45:00Z",
        verificationDate: "2024-03-29T09:10:00Z",
        status: "verified",
        workoutType: "Strength",
        duration: 50,
        videoCount: 2,
        xpReward: 350,
        verifier: "Coach Thompson"
      },
      {
        id: 5,
        title: "Morning Cardio Session",
        submissionDate: "2024-03-25T07:30:00Z",
        verificationDate: "2024-03-25T18:05:00Z",
        status: "verified",
        workoutType: "Cardio",
        duration: 40,
        videoCount: 1,
        xpReward: 300,
        verifier: "Coach Williams"
      }
    ],
    rejected: [
      {
        id: 6,
        title: "Jump Training",
        submissionDate: "2024-03-22T11:20:00Z",
        verificationDate: "2024-03-23T13:30:00Z",
        status: "rejected",
        workoutType: "Plyometrics",
        duration: 35,
        videoCount: 1,
        xpReward: 275,
        verifier: "Coach Johnson",
        rejectionReason: "Video quality too low to verify movements. Please resubmit with clearer footage."
      }
    ]
  };

  // Progress stats
  const stats = {
    weeklyGoal: 5,
    weeklyCompleted: 3,
    totalVerified: 27,
    xpEarned: 7650,
    streakDays: 12
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workout Verification</h1>
          <p className="text-muted-foreground mt-1">
            Track and verify your training sessions
          </p>
        </div>
        <Button asChild>
          <Link href="/submit-verification">
            <Plus className="mr-2 h-4 w-4" /> Submit New Workout
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-1 text-sm">
              <span>{stats.weeklyCompleted} of {stats.weeklyGoal} workouts</span>
              <span>{Math.round((stats.weeklyCompleted / stats.weeklyGoal) * 100)}%</span>
            </div>
            <Progress value={(stats.weeklyCompleted / stats.weeklyGoal) * 100} className="h-2 mb-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Weekly Goal: {stats.weeklyGoal}</span>
              <span>{stats.weeklyGoal - stats.weeklyCompleted} remaining</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <History className="mr-2 h-5 w-5 text-green-500" />
              Workout Consistency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold mb-1">{stats.streakDays}</span>
              <span className="text-sm text-muted-foreground">Day Workout Streak</span>
              <span className="text-sm mt-2">{stats.totalVerified} Total Verified Workouts</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-500" />
              XP Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold mb-1">{stats.xpEarned.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">XP Earned from Workouts</span>
              <span className="text-sm mt-2">+{verifications.pending.reduce((total, v) => total + v.xpReward, 0)} XP Pending</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            Pending 
            <Badge variant="secondary" className="ml-2">{verifications.pending.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verified 
            <Badge variant="secondary" className="ml-2">{verifications.verified.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Needs Revision 
            <Badge variant="secondary" className="ml-2">{verifications.rejected.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="m-0">
          {verifications.pending.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifications.pending.map((verification) => (
                <Card key={verification.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{verification.title}</CardTitle>
                      <Badge variant="secondary" className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" /> Pending
                      </Badge>
                    </div>
                    <CardDescription>
                      Submitted on {new Date(verification.submissionDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                      <div>
                        <p className="text-sm font-medium">{verification.workoutType}</p>
                        <p className="text-xs text-muted-foreground">Type</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{verification.duration} min</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{verification.videoCount}</p>
                        <p className="text-xs text-muted-foreground">Videos</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Awaiting review</span>
                      <span className="text-sm font-medium">+{verification.xpReward} XP</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/verification/${verification.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
              <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No pending verifications</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                You don't have any workout submissions awaiting verification.
              </p>
              <Button asChild>
                <Link href="/submit-verification">Submit a Workout</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="verified" className="m-0">
          {verifications.verified.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifications.verified.map((verification) => (
                <Card key={verification.id} className="overflow-hidden border-green-200 dark:border-green-950">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{verification.title}</CardTitle>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-600/20 flex items-center">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    </div>
                    <CardDescription>
                      Verified on {new Date(verification.verificationDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                      <div>
                        <p className="text-sm font-medium">{verification.workoutType}</p>
                        <p className="text-xs text-muted-foreground">Type</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{verification.duration} min</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{verification.videoCount}</p>
                        <p className="text-xs text-muted-foreground">Videos</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">By {verification.verifier}</span>
                      <span className="text-sm font-medium text-green-600">+{verification.xpReward} XP</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/verification/${verification.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No verified workouts yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Submit your workouts for verification to start earning XP.
              </p>
              <Button asChild>
                <Link href="/submit-verification">Submit Your First Workout</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="m-0">
          {verifications.rejected.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifications.rejected.map((verification) => (
                <Card key={verification.id} className="overflow-hidden border-red-200 dark:border-red-950">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{verification.title}</CardTitle>
                      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-600/20 flex items-center">
                        <XCircle className="mr-1 h-3 w-3" /> Needs Revision
                      </Badge>
                    </div>
                    <CardDescription>
                      Reviewed on {new Date(verification.verificationDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {verification.rejectionReason}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">By {verification.verifier}</span>
                      <span className="text-sm font-medium">{verification.xpReward} XP Missed</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex gap-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/verification/${verification.id}`}>View Details</Link>
                    </Button>
                    <Button className="w-full">Resubmit</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No rejected submissions</h3>
              <p className="text-muted-foreground text-center max-w-md">
                All your workout submissions are in good standing.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}