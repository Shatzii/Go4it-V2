import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SportRecommendationCard } from "@/components/dashboard/sport-recommendation-card";
import { Award, ChartBarStacked, Medal, Target, UploadCloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function SportRecommendations() {
  const { user } = useAuth();

  // Fetch sport recommendations
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["/api/athletes", user?.id, "/recommendations"],
    enabled: !!user && user.role === "athlete",
  });

  // Fetch athlete profile
  const { data: athleteProfile } = useQuery({
    queryKey: ["/api/athletes", user?.id, "/profile"],
    enabled: !!user && user.role === "athlete",
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Sport Recommendations</h1>
        <p className="text-gray-600 mb-6">
          Please log in to view your personalized sport recommendations
        </p>
        <Link href="/auth">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  if (user.role !== "athlete") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Sport Recommendations</h1>
        <p className="text-gray-600 mb-6">
          Sport recommendations are only available for athlete accounts.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral mb-2">
            Sport Recommendations
          </h1>
          <p className="text-gray-600">
            Personalized sport suggestions based on your motion analysis and physical attributes
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/upload-video">
            <Button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg flex items-center">
              <UploadCloud className="h-5 w-5 mr-2" />
              Upload New Video
            </Button>
          </Link>
        </div>
      </div>

      {/* Athletic Profile Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartBarStacked className="h-5 w-5 mr-2" />
            Athletic Profile Summary
          </CardTitle>
          <CardDescription>
            Your recommendations are based on the following athletic attributes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {athleteProfile ? (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-neutral mb-2">Physical Attributes</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Height:</span>
                      <span className="font-medium">{athleteProfile.height || "Not set"} cm</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{athleteProfile.weight || "Not set"} kg</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{athleteProfile.age || "Not set"} years</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-neutral mb-2">Motion Score</h3>
                  <div className="mb-2">
                    <Progress value={athleteProfile.motionScore} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Overall:</span>
                    <span className="font-medium text-accent">{athleteProfile.motionScore}%</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-neutral mb-2">Sports Interest</h3>
                  <div className="flex flex-wrap gap-1">
                    {athleteProfile.sportsInterest && athleteProfile.sportsInterest.length > 0 ? (
                      athleteProfile.sportsInterest.map((sport) => (
                        <span key={sport} className="bg-primary bg-opacity-10 text-primary px-2 py-0.5 rounded-full text-xs">
                          {sport}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600 text-sm">No sports interests set</span>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-neutral mb-2">Academic</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">School:</span>
                      <span className="font-medium">{athleteProfile.school || "Not set"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Graduation:</span>
                      <span className="font-medium">{athleteProfile.graduationYear || "Not set"}</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="col-span-4 text-center py-6">
                <p className="text-gray-600">Complete your athlete profile to improve recommendations</p>
                <Link href="/profile">
                  <Button variant="outline" className="mt-2">Update Profile</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Your Sport Matches
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your athletic profile...</p>
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          <div className="space-y-6">
            {recommendations.map((recommendation, index) => (
              <SportRecommendationCard 
                key={recommendation.id} 
                recommendation={recommendation}
                index={index}
              />
            ))}

            <div className="bg-white p-6 rounded-lg mt-8">
              <h3 className="font-medium text-lg mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                How to Improve Your Recommendations
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="bg-primary bg-opacity-10 text-primary p-1 rounded-full mr-3 mt-0.5">
                    <Medal className="h-4 w-4" />
                  </div>
                  <span>Upload more videos for analysis to get more accurate recommendations</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary bg-opacity-10 text-primary p-1 rounded-full mr-3 mt-0.5">
                    <Medal className="h-4 w-4" />
                  </div>
                  <span>Complete all fields in your athlete profile for better matching</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary bg-opacity-10 text-primary p-1 rounded-full mr-3 mt-0.5">
                    <Medal className="h-4 w-4" />
                  </div>
                  <span>Try different sports and movements in your uploaded videos</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Recommendations Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Upload videos of yourself playing sports to get AI-powered sport recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/upload-video">
                <Button>Upload a Video</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">Complete Your Profile</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
