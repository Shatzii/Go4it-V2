import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  ArrowUpRight, 
  Share2, 
  Tag 
} from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  coverImage: string | null;
  authorId: number | null;
  category: string;
  publishDate: string;
  featured: boolean;
  slug: string;
  tags: string[];
}

export default function BlogPostPage() {
  const { slug } = useParams();
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog-posts', slug],
    queryFn: async () => {
      // Use a proxy URL that will be forwarded through the Express server
      const response = await fetch(`/api/blog-posts/${slug}`, {
        headers: {
          'X-Base-URL': 'http://localhost:5000'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      return response.json();
    }
  });

  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | GO4IT Sports`;
    }
    window.scrollTo(0, 0);
  }, [post]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full h-6 bg-gray-800 rounded animate-pulse mb-4" />
          <div className="w-2/3 h-6 bg-gray-800 rounded animate-pulse mb-8" />
          <div className="w-full h-64 bg-gray-800 rounded animate-pulse mb-8" />
          <div className="w-full space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-full h-4 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card className="border-red-800 bg-red-950/30">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">Blog Post Not Found</h2>
              <p className="text-gray-400 mb-6">
                Sorry, we couldn't find the blog post you're looking for.
              </p>
              <Link href="/">
                <Button variant="secondary">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="pl-0">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to articles
          </Button>
        </Link>
      </div>
      
      <article>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
              {post.category}
            </Badge>
            
            <div className="flex items-center text-gray-400 text-sm">
              <Calendar className="mr-1 h-3 w-3" />
              {formatDate(post.publishDate)}
            </div>
            
            {post.authorId && (
              <div className="flex items-center text-gray-400 text-sm">
                <User className="mr-1 h-3 w-3" />
                Admin
              </div>
            )}
          </div>
          
          {post.summary && (
            <p className="text-lg text-gray-300 leading-relaxed italic border-l-4 border-cyan-500/50 pl-4 py-1">
              {post.summary}
            </p>
          )}
        </header>
        
        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-800">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto object-cover aspect-video"
            />
          </div>
        )}
        
        <div className="prose prose-invert prose-cyan max-w-none">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
        
        <footer className="mt-10 pt-6 border-t border-gray-800">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags && post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-gray-400">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share this article
            </Button>
            
            <Link href="/blog">
              <Button variant="outline" size="sm">
                More articles
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}