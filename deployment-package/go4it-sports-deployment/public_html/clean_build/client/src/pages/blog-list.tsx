import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

export default function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      // Use a proxy URL that will be forwarded through the Express server
      const response = await fetch('/api/blog-posts', {
        headers: {
          'X-Base-URL': 'http://localhost:5000'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
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

  // Extract unique categories from blog posts
  const categories = ["all", ...Array.from(new Set(blogPosts.map(post => post.category.toLowerCase())))];
  
  // Filter posts based on active category
  const filteredPosts = activeCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category.toLowerCase() === activeCategory);

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="pl-0 mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to home
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Blog
          </span> & News
        </h1>
        <p className="text-gray-400 max-w-3xl">
          Insights, updates, and stories about the world of sports, athlete development, 
          and everything related to performance improvement for neurodivergent athletes.
        </p>
      </div>
      
      <Tabs
        defaultValue="all"
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="w-full mb-8"
      >
        <TabsList className="mb-6 bg-gray-900 border border-gray-800 overflow-x-auto flex w-full justify-start">
          {categories.map(category => (
            <TabsTrigger
              key={category}
              value={category}
              className="capitalize data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden border border-gray-800 bg-black shadow-lg animate-pulse">
              <div className="h-48 bg-gray-800"></div>
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
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <Card 
              key={post.id} 
              className="overflow-hidden border border-gray-800 bg-black shadow-lg transform transition-all duration-300 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
            >
              {post.coverImage && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                    {post.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatDate(post.publishDate)}
                  </div>
                </div>
                <CardTitle className="text-xl text-white line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 text-gray-400">
                  {post.summary}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button asChild variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                  <Link href={`/blog/${post.slug}`}>Read Article</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No blog posts found</h3>
          <p className="text-gray-400 max-w-md mb-6">
            {activeCategory === "all"
              ? "There are no blog posts available at the moment. Please check back later."
              : `No blog posts in the "${activeCategory}" category yet. Please check another category or come back later.`}
          </p>
          {activeCategory !== "all" && (
            <Button onClick={() => setActiveCategory("all")} variant="outline">
              View all categories
            </Button>
          )}
        </div>
      )}
    </div>
  );
}