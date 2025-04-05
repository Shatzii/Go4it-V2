import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ChevronRight, Clock, Trophy, Calendar, Video, Award, CheckCircle } from "lucide-react";
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
            i < rating 
              ? "text-cyan-400 fill-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" 
              : "text-gray-700"
          }`}
        />
      ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            GET VERIFIED
          </h1>
          <h2 className="text-3xl font-semibold text-white mb-3">
            Athlete Evaluation System
          </h2>
          <p className="text-xl text-blue-400">
            The Future of Sports Performance Analysis
          </p>
        </div>
        
        <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-300">
          Our revolutionary GAR Rating System combines physical metrics, cognitive abilities, and 
          psychological factors to provide the most comprehensive athlete evaluation.
        </p>
        
        <div className="flex justify-center gap-4">
          {!user ? (
            <>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                <Link href="/auth">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-blue-500 text-blue-400 hover:text-blue-300">
                Learn More
              </Button>
            </>
          ) : (
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Featured Athletes Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Top Verified
            </span> Athletes
          </h2>
          <Button variant="ghost" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {featuredAthletes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAthletes.map((athlete) => (
              <Card key={athlete.id} className="overflow-hidden border border-gray-800 bg-black shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={athlete.coverImage}
                    alt={athlete.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-md py-1 px-2 text-sm text-white font-bold shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>VERIFIED</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                  </div>
                </div>
                
                <CardHeader className="pb-2 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={athlete.profileImage}
                        alt={athlete.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                        {athlete.starRating}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">{athlete.name}</CardTitle>
                      <p className="text-sm text-blue-400 font-medium mb-1">{athlete.sportPosition}</p>
                      <div className="flex items-center gap-1">
                        {renderStarRating(athlete.starRating)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="py-3">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">SPORT</span>
                      <span className="text-sm text-white">{athlete.sportPosition.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-col text-center">
                      <span className="text-xs text-gray-400">POSITION</span>
                      <span className="text-sm text-white">{athlete.sportPosition.split(' ').slice(1).join(' ')}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-xs text-gray-400">RATING</span>
                      <span className="text-sm text-cyan-400 font-bold">{athlete.starRating}.0</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{athlete.highlightText}</p>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">View Profile</Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                    <Video className="h-4 w-4" /> Highlights
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center p-12 border border-gray-800 rounded-lg bg-black/50">
            <p className="text-gray-400">No featured athletes available</p>
          </div>
        )}
      </section>

      {/* Blog Posts Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Blog
            </span> & News
          </h2>
          <Button variant="ghost" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="featured" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-gray-900 border border-gray-800">
            <TabsTrigger value="featured" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Featured</TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Training</TabsTrigger>
            <TabsTrigger value="nutrition" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Nutrition</TabsTrigger>
            <TabsTrigger value="recruiting" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Recruiting</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeTab === "featured" ? featuredBlogPosts : blogPosts)
                .filter(post => post.featured)
                .map((post) => (
                  <Card key={post.id} className="overflow-hidden border border-gray-800 bg-black shadow-lg transform transition-all duration-300 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]">
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
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">{post.category}</Badge>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(post.publishDate)}
                        </div>
                      </div>
                      <CardTitle className="text-xl text-white">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-gray-400">
                        {post.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button asChild variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
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
                  .filter((post) => post.category.toLowerCase() === category)
                  .map((post) => (
                    <Card key={post.id} className="overflow-hidden border border-gray-800 bg-black shadow-lg">
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
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">{post.category}</Badge>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(post.publishDate)}
                          </div>
                        </div>
                        <CardTitle className="text-xl text-white">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-gray-400">
                          {post.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button asChild variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
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
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            What Makes Us
          </span> Different
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-black border border-gray-800 shadow-lg transform transition-all duration-300 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)]">
            <CardHeader>
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <Video className="h-6 w-6 text-cyan-400" />
              </div>
              <CardTitle className="text-white">AI Video Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Upload your performance videos and get instant AI-powered analysis with personalized feedback and improvement tips.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-gray-800 shadow-lg transform transition-all duration-300 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)]">
            <CardHeader>
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <Trophy className="h-6 w-6 text-cyan-400" />
              </div>
              <CardTitle className="text-white">Sport Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Discover which sports best match your physical attributes, skills, and personal preferences through our advanced matching system.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border border-gray-800 shadow-lg transform transition-all duration-300 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)]">
            <CardHeader>
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <Award className="h-6 w-6 text-cyan-400" />
              </div>
              <CardTitle className="text-white">NCAA Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Track your path to NCAA eligibility with our comprehensive clearinghouse tools and guidance for student-athletes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to Elevate Your Athletic Journey?</h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of athletes who have discovered their potential and connected with coaches through our platform.
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