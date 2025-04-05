import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ChevronRight, Clock, Trophy, Calendar, Video } from "lucide-react";
import { useAuth } from "../contexts/auth-context";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  coverImage: string | null;
  authorId: number;
  category: string;
  publishDate: string;
  featured: boolean;
  slug: string;
  tags: string[];
}

interface FeaturedAthlete {
  id: number;
  userId: number;
  coverImage: string;
  featuredVideo: string | null;
  highlightText: string;
  sportPosition: string;
  starRating: number;
  featuredStats: Record<string, any> | null;
  featuredDate: string;
  order: number;
  active: boolean;
  name: string;
  username: string;
  profileImage: string;
}

export default function HomePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("featured");

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const { data: featuredBlogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts/featured"],
    enabled: activeTab === "featured",
  });

  const { data: featuredAthletes = [] } = useQuery<FeaturedAthlete[]>({
    queryKey: ["/api/featured-athletes"],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStarRating = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Logo */}
      <div className="flex justify-start mb-8">
        <img 
          src="/assets/IMG_3534.jpeg" 
          alt="Get Verified Logo" 
          className="h-16 md:h-20"
        />
      </div>
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
            GET VERIFIED
          </h1>
          <h2 className="text-4xl font-bold text-white mb-4">
            Combine Tour
          </h2>
          <p className="text-xl text-blue-400 font-semibold">
            The Future of Athlete Evaluation & Placement
          </p>
        </div>
        <div className="max-w-4xl mx-auto mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 text-white">GAR Rating System</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <span className="text-blue-400 font-bold">60%</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-blue-400">Physical</h4>
                  <p className="text-sm text-gray-300">Sprint, Agility, Strength & Coordination</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <span className="text-purple-400 font-bold">20%</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-purple-400">Cognitive</h4>
                  <p className="text-sm text-gray-300">Decision-Making & Learning Style</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <span className="text-green-400 font-bold">20%</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-green-400">Psychological</h4>
                  <p className="text-sm text-gray-300">Confidence & Team Dynamics</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img 
              src="/assets/combine-hero.jpg" 
              alt="Athletes at Combine" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
        <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-300">
          Our revolutionary GAR Rating System combines physical metrics, cognitive abilities, and psychological factors to provide the most comprehensive athlete evaluation available.
        </p>
        <div className="flex justify-center gap-4">
          {!user ? (
            <>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                <Link href="/auth">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </>
          ) : (
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Featured Athletes Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Athletes</h2>
          <Button variant="ghost" className="flex items-center gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {featuredAthletes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAthletes.map((athlete) => (
              <Card key={athlete.id} className="overflow-hidden border-0 bg-gradient-to-b from-gray-800/60 to-gray-900 shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={athlete.coverImage}
                    alt={athlete.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      {renderStarRating(athlete.starRating)}
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={athlete.profileImage}
                        alt={athlete.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {athlete.starRating}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{athlete.name}</CardTitle>
                      <p className="text-sm text-gray-400">{athlete.sportPosition}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{athlete.highlightText}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Profile</Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Video className="h-4 w-4" /> Watch Highlights
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center p-12 border border-gray-700 rounded-lg bg-gray-800/30">
            <p className="text-gray-400">No featured athletes available</p>
          </div>
        )}
      </section>

      {/* Blog Posts Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Blog & News</h2>
          <Button variant="ghost" className="flex items-center gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="featured" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="recruiting">Recruiting</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeTab === "featured" ? featuredBlogPosts : blogPosts)
                .filter(post => post.featured)
                .map((post) => (
                  <Card key={post.id} className="overflow-hidden border-0 bg-gradient-to-b from-gray-800/60 to-gray-900 shadow-lg">
                    {post.coverImage && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(post.publishDate)}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/blog/${post.slug}`}>Read Article</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {["training", "nutrition", "recruiting"].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts
                  .filter((post) => post.category === category)
                  .map((post) => (
                    <Card key={post.id} className="overflow-hidden border-0 bg-gradient-to-b from-gray-800/60 to-gray-900 shadow-lg">
                      {post.coverImage && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(post.publishDate)}
                          </div>
                        </div>
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {post.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href={`/blog/${post.slug}`}>Read Article</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Key Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">What Makes Us Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-b from-gray-800/60 to-gray-900 border-0 shadow-lg">
            <CardHeader>
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle>AI Video Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Upload your performance videos and get instant AI-powered analysis with personalized feedback and improvement tips.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-gray-800/60 to-gray-900 border-0 shadow-lg">
            <CardHeader>
              <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle>Sport Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Discover which sports best match your physical attributes, skills, and personal preferences through our advanced matching system.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-gray-800/60 to-gray-900 border-0 shadow-lg">
            <CardHeader>
              <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle>NCAA Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Track your path to NCAA eligibility with our comprehensive clearinghouse tools and guidance for student-athletes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to Elevate Your Athletic Journey?</h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of athletes who have discovered their potential and connected with coaches through Go4it.
        </p>
        {!user ? (
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/auth">Get Started Today</Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        )}
      </section>
    </div>
  );
}