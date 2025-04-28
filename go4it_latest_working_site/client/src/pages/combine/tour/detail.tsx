import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/query-client";
import { queryClient } from "@/lib/query-client";
import { formatCombineEvent } from "@/lib/combine-utils";
import { FormattedCombineEvent } from "@/lib/combine-utils";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  Ticket, 
  FileText, 
  ChevronLeft,
  Award,
  Star,
  Phone,
  Mail,
  Share2,
  Heart,
  Bookmark
} from "lucide-react";

export default function CombineTourDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Fetch event details
  const { data: event = {}, isLoading, error } = useQuery<any>({
    queryKey: [`/api/combine-tour/events/${id}`],
    enabled: !!id,
  });

  // Fetch registration status if user is logged in
  const { data: registrationStatus = {}, isLoading: isLoadingRegistration } = useQuery<any>({
    queryKey: [`/api/combine-tour/registration-status?eventId=${id}`],
    enabled: !!id && !!user,
  });

  // Format date strings for display
  const formattedEvent = formatCombineEvent({
    ...event,
    isRegistered: registrationStatus?.isRegistered || false,
  });

  // Handle registration
  const registerMutation = useMutation({
    mutationFn: async () => {
      return apiRequest({
        url: `/api/combine-tour/register/${id}`,
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Registration successful!",
        description: "You have been registered for this event",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/combine-tour/registration-status?eventId=${id}`] });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Could not register for this event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle event status visual cues
  const getStatusColor = (status: string) => {
    if (!status) return "bg-blue-100 text-blue-800";
    
    switch (status.toLowerCase()) {
      case 'upcoming':
        return "bg-blue-100 text-blue-800";
      case 'ongoing':
        return "bg-green-100 text-green-800";
      case 'completed':
        return "bg-gray-100 text-gray-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      case 'filling_fast':
        return "bg-yellow-100 text-yellow-800";
      case 'sold_out':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Register for event
  const handleRegister = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to register for this event",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate();
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // Implementation would include backend call to save preference
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    // Implementation would include backend call to save preference
  };

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/combine-tour">
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the event you're looking for.
          </p>
          <Link href="/combine-tour">
            <Button>Browse All Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/combine-tour">
        <Button variant="ghost" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Events
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="relative rounded-lg overflow-hidden mb-8">
        <div className="h-72 md:h-96 bg-gradient-to-r from-indigo-500 to-purple-700 relative">
          {formattedEvent.featuredImage ? (
            <img 
              src={formattedEvent.featuredImage} 
              alt={formattedEvent.name} 
              className="w-full h-full object-cover opacity-75" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Award className="h-24 w-24 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{formattedEvent.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{formattedEvent.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{formattedEvent.dateFormatted}</span>
              </div>
              <Badge className={formattedEvent.statusClass}>
                {formattedEvent.statusText}
              </Badge>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              {formattedEvent.price !== undefined && (
                <Badge variant="outline" className="bg-white/10 text-white border-none">
                  <DollarSign className="mr-1 h-4 w-4" />
                  {formattedEvent.price === 0 ? 'Free' : `$${formattedEvent.price}`}
                </Badge>
              )}
              {formattedEvent.sportTypes?.map((sport, idx) => (
                <Badge key={idx} variant="outline" className="bg-white/10 text-white border-none">
                  {sport}
                </Badge>
              ))}
              {formattedEvent.ageGroups?.map((age, idx) => (
                <Badge key={idx} variant="outline" className="bg-white/10 text-white border-none">
                  {age}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="athletes">Athletes</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                <p className="mb-6 text-muted-foreground">
                  {formattedEvent.description || 
                    "Join us for this exciting combine event! Athletes will be evaluated on various skills and metrics relevant to their sport. Get seen by coaches and scouts while testing your abilities against other talented athletes."}
                </p>

                {/* Details list */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Date & Time</h3>
                      <p className="text-muted-foreground">
                        {formattedEvent.dateFormatted} at {formattedEvent.timeFormatted}
                        {formattedEvent.endDateFormatted && 
                          ` - ${formattedEvent.endDateFormatted}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-muted-foreground">{formattedEvent.location}</p>
                      {formattedEvent.venueDetails && (
                        <p className="text-muted-foreground">{formattedEvent.venueDetails}</p>
                      )}
                    </div>
                  </div>
                  
                  {(formattedEvent.sportTypes && formattedEvent.sportTypes.length > 0) && (
                    <div className="flex items-start">
                      <Award className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Sports</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {formattedEvent.sportTypes.map((sport, idx) => (
                            <Badge key={idx} variant="secondary">{sport}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(formattedEvent.ageGroups && formattedEvent.ageGroups.length > 0) && (
                    <div className="flex items-start">
                      <Users className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Age Groups</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {formattedEvent.ageGroups.map((age, idx) => (
                            <Badge key={idx} variant="secondary">{age}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Organizer information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Organizer</h2>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src="/organizer-logo.png" alt="Go4It Sports" />
                    <AvatarFallback>G4S</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Go4It Sports</h3>
                    <p className="text-muted-foreground text-sm">Official combine tour event</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  {formattedEvent.contactEmail && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${formattedEvent.contactEmail}`} className="text-sm hover:underline">
                        {formattedEvent.contactEmail}
                      </a>
                    </div>
                  )}
                  
                  {formattedEvent.contactPhone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${formattedEvent.contactPhone}`} className="text-sm hover:underline">
                        {formattedEvent.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="w-24 flex-shrink-0 text-muted-foreground">
                        8:00 AM
                      </div>
                      <div>
                        <h3 className="font-medium">Check-in & Registration</h3>
                        <p className="text-muted-foreground text-sm">
                          Arrive early to complete all paperwork and get prepared
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-24 flex-shrink-0 text-muted-foreground">
                        9:00 AM
                      </div>
                      <div>
                        <h3 className="font-medium">Warmup & Orientation</h3>
                        <p className="text-muted-foreground text-sm">
                          Group warmup and orientation about the testing process
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-24 flex-shrink-0 text-muted-foreground">
                        10:00 AM
                      </div>
                      <div>
                        <h3 className="font-medium">Testing Begins</h3>
                        <p className="text-muted-foreground text-sm">
                          Athletic testing stations (40-yard dash, vertical jump, etc.)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-24 flex-shrink-0 text-muted-foreground">
                        12:30 PM
                      </div>
                      <div>
                        <h3 className="font-medium">Lunch Break</h3>
                        <p className="text-muted-foreground text-sm">
                          Athletes will have time to rest and refuel
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-24 flex-shrink-0 text-muted-foreground">
                        1:30 PM
                      </div>
                      <div>
                        <h3 className="font-medium">Skill Development</h3>
                        <p className="text-muted-foreground text-sm">
                          Sport-specific drills and coaching
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-24 flex-shrink-0 text-muted-foreground">
                        3:30 PM
                      </div>
                      <div>
                        <h3 className="font-medium">Scrimmages</h3>
                        <p className="text-muted-foreground text-sm">
                          Live play scenarios and competitions
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-24 flex-shrink-0 text-muted-foreground">
                        5:00 PM
                      </div>
                      <div>
                        <h3 className="font-medium">Closing & Results</h3>
                        <p className="text-muted-foreground text-sm">
                          Final remarks and distribution of evaluation results
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground italic">
                      Note: Schedule is subject to change. All athletes should plan to attend the entire day.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="athletes">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Registered Athletes</h2>
                
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Athlete list unavailable</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    The list of registered athletes will be available closer to the event date or after registration.
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="faq">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg">What should I bring to the combine?</h3>
                    <p className="text-muted-foreground mt-1">
                      Bring appropriate athletic clothing, footwear for your sport, water bottle, 
                      snacks, and any sport-specific equipment (if specified). Don't forget a valid ID 
                      and your registration confirmation.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">How will I receive my combine results?</h3>
                    <p className="text-muted-foreground mt-1">
                      Results will be available in your Go4It Sports athlete profile typically within 
                      48 hours after the event. We'll also email you when your results are ready to view.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">Can parents/guardians attend?</h3>
                    <p className="text-muted-foreground mt-1">
                      Yes, parents and guardians are welcome to attend. There will be designated 
                      viewing areas at most stations. We ask that parents respect the testing environment 
                      and allow coaches to work with athletes.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">What happens if it rains?</h3>
                    <p className="text-muted-foreground mt-1">
                      Many of our combines have indoor facilities available. In case of severe weather, 
                      we may reschedule certain portions of the event. Updates will be sent to registered 
                      athletes via email and text.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">Is there a refund policy?</h3>
                    <p className="text-muted-foreground mt-1">
                      Registrations can be fully refunded up to 14 days before the event. After that, 
                      refunds are available at 50% up to 3 days before the event. No refunds are available 
                      after that, but you may transfer your registration to another athlete.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <Card className="p-6">
            {formattedEvent.price !== undefined && (
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold">
                  {formattedEvent.price === 0 ? 'Free' : `$${formattedEvent.price}`}
                </h2>
                <p className="text-muted-foreground">Registration Fee</p>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Registration status or deadline */}
              {formattedEvent.spotsAvailable !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spots Available:</span>
                  <span className="font-medium">
                    {formattedEvent.spotsAvailable} / {formattedEvent.totalSpots}
                  </span>
                </div>
              )}
              
              {formattedEvent.registrationDeadlineFormatted && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Registration Deadline:</span>
                  <span className="font-medium">{formattedEvent.registrationDeadlineFormatted}</span>
                </div>
              )}
              
              <Separator />
              
              {/* Registration button */}
              {formattedEvent.isRegistered ? (
                <div className="space-y-3">
                  <div className="bg-green-50 text-green-700 p-3 rounded-md text-center">
                    <span className="font-medium">You're Registered!</span>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Check your email for event details and confirmation.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={registerMutation.isPending || formattedEvent.status === 'completed' || formattedEvent.status === 'cancelled'}
                    onClick={handleRegister}
                  >
                    {registerMutation.isPending ? (
                      <>Registering...</>
                    ) : (
                      <>Register Now</>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    By registering, you agree to our <Link href="/terms" className="underline">Terms & Conditions</Link>
                  </p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Location Card */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Event Location</h3>
            
            <div className="bg-muted rounded-lg h-48 mb-4 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
              {/* Map would go here in a complete implementation */}
            </div>
            
            <p className="font-medium">{formattedEvent.location}</p>
            <p className="text-muted-foreground text-sm">
              {formattedEvent.city && formattedEvent.state ? 
                `${formattedEvent.city}, ${formattedEvent.state}` : ''}
            </p>
          </Card>
          
          {/* Share Card */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Share Event</h3>
            
            <div className="flex space-x-2 mb-4">
              <Button variant="outline" size="icon" onClick={toggleLike}>
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={toggleSave}>
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-indigo-500 text-indigo-500' : ''}`} />
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Help spread the word about this combine event with other athletes in your network!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 h-10 w-32">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="relative rounded-lg overflow-hidden mb-8">
        <Skeleton className="h-72 md:h-96 w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <Skeleton className="h-10 w-full max-w-md" />
          </div>

          <Card className="p-6 mb-6">
            <Skeleton className="h-7 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />

            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start">
                  <Skeleton className="h-5 w-5 mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          </Card>
          
          <Card className="p-6">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}