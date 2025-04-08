import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Clock } from "lucide-react";

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

export default function FeaturedBlogPosts() {
  const [activeTab, setActiveTab] = useState("featured");

  const { data: blogPosts = [], isLoading: isLoadingAll } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/blog-posts');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json();
    }
  });

  const { data: featuredBlogPosts = [], isLoading: isLoadingFeatured } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts/featured"],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/blog-posts/featured');
      if (!response.ok) {
        throw new Error('Failed to fetch featured blog posts');
      }
      return response.json();
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Blog
          </span> & News
        </h2>
        <Button asChild variant="ghost" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
          <Link href="/blog">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {isLoadingAll && isLoadingFeatured ? (
        // Show loading skeleton for tabs
        <div className="flex mb-6 overflow-x-auto">
          <div className="flex-shrink-0 w-24 h-10 bg-gray-800 rounded-md animate-pulse mr-2"></div>
          <div className="flex-shrink-0 w-24 h-10 bg-gray-800 rounded-md animate-pulse mr-2"></div>
          <div className="flex-shrink-0 w-24 h-10 bg-gray-800 rounded-md animate-pulse mr-2"></div>
          <div className="flex-shrink-0 w-24 h-10 bg-gray-800 rounded-md animate-pulse"></div>
        </div>
      ) : (
        <Tabs defaultValue="featured" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-gray-900 border border-gray-800">
            <TabsTrigger value="featured" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Featured</TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Training</TabsTrigger>
            <TabsTrigger value="nutrition" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Nutrition</TabsTrigger>
            <TabsTrigger value="recruiting" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Recruiting</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-0">
            <div className="relative">
              {/* Left Shadow Overlay */}
              <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none"></div>
              
              {/* Right Shadow Overlay */}
              <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none"></div>
              
              {/* Carousel - Mobile Friendly */}
              <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                <div className="flex gap-4 min-w-max">
                  {isLoadingFeatured ? (
                    // Loading skeleton
                    Array(3).fill(0).map((_, i) => (
                      <Card key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] overflow-hidden border border-gray-800 bg-black shadow-lg animate-pulse">
                        <div className="h-40 bg-gray-800"></div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-16 h-5 bg-gray-800 rounded"></div>
                            <div className="w-24 h-4 bg-gray-800 rounded"></div>
                          </div>
                          <div className="w-full h-6 bg-gray-800 rounded mb-2"></div>
                          <div className="w-full h-12 bg-gray-800 rounded"></div>
                        </CardHeader>
                        <CardFooter className="pt-0">
                          <div className="w-full h-8 bg-gray-800 rounded"></div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : featuredBlogPosts.length > 0 ? (
                    featuredBlogPosts
                      .map((post) => (
                        <Card key={post.id} className="flex-shrink-0 w-[280px] sm:w-[320px] overflow-hidden border border-gray-800 bg-black shadow-lg transform transition-all duration-300 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                          {post.coverImage && (
                            <div className="h-40 overflow-hidden">
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">{post.category}</Badge>
                              <div className="flex items-center text-sm text-gray-400">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatDate(post.publishDate)}
                              </div>
                            </div>
                            <CardTitle className="text-lg text-white line-clamp-1">{post.title}</CardTitle>
                            <CardDescription className="line-clamp-2 text-gray-400 text-sm">
                              {post.summary}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="pt-0">
                            <Button asChild variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                              <Link href={`/blog/${post.slug}`}>Read Article</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                  ) : (
                    <div className="flex justify-center items-center w-full p-12">
                      <p className="text-gray-400">No featured blog posts available</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Navigation Dots */}
              {featuredBlogPosts.length > 0 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {Array.from({ length: Math.min(Math.ceil(featuredBlogPosts.length / 4), 3) }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-gray-700'} transition-all duration-300`}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {["training", "nutrition", "recruiting"].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="relative">
                {/* Left Shadow Overlay */}
                <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none"></div>
                
                {/* Right Shadow Overlay */}
                <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none"></div>
                
                {/* Carousel - Mobile Friendly */}
                <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                  <div className="flex gap-4 min-w-max">
                    {isLoadingAll ? (
                      // Loading skeleton
                      Array(3).fill(0).map((_, i) => (
                        <Card key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] overflow-hidden border border-gray-800 bg-black shadow-lg animate-pulse">
                          <div className="h-40 bg-gray-800"></div>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-16 h-5 bg-gray-800 rounded"></div>
                              <div className="w-24 h-4 bg-gray-800 rounded"></div>
                            </div>
                            <div className="w-full h-6 bg-gray-800 rounded mb-2"></div>
                            <div className="w-full h-12 bg-gray-800 rounded"></div>
                          </CardHeader>
                          <CardFooter className="pt-0">
                            <div className="w-full h-8 bg-gray-800 rounded"></div>
                          </CardFooter>
                        </Card>
                      ))
                    ) : blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase()).length > 0 ? (
                      blogPosts
                        .filter(post => post.category.toLowerCase() === category.toLowerCase())
                        .map((post) => (
                          <Card key={post.id} className="flex-shrink-0 w-[280px] sm:w-[320px] overflow-hidden border border-gray-800 bg-black shadow-lg transform transition-all duration-300 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                            {post.coverImage && (
                              <div className="h-40 overflow-hidden">
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">{post.category}</Badge>
                                <div className="flex items-center text-sm text-gray-400">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {formatDate(post.publishDate)}
                                </div>
                              </div>
                              <CardTitle className="text-lg text-white line-clamp-1">{post.title}</CardTitle>
                              <CardDescription className="line-clamp-2 text-gray-400 text-sm">
                                {post.summary}
                              </CardDescription>
                            </CardHeader>
                            <CardFooter className="pt-0">
                              <Button asChild variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                                <Link href={`/blog/${post.slug}`}>Read Article</Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                    ) : (
                      <div className="flex justify-center items-center w-full p-12">
                        <p className="text-gray-400">No {category} blog posts available</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Navigation Dots */}
                {blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase()).length > 0 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: Math.min(Math.ceil(blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase()).length / 4), 3) }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-gray-700'} transition-all duration-300`}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </section>
  );
}