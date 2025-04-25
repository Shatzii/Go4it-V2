import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlusCircle, Film, Eye, Edit, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function FilmComparison() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  // Fetch film comparisons for the current user
  const { data: comparisons, isLoading, error } = useQuery({
    queryKey: ['/api/film-comparisons'],
    staleTime: 10 * 1000, // 10 seconds
  });

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/film-comparisons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Comparison deleted",
          description: "Your film comparison has been deleted successfully.",
        });
        
        // Invalidate the query to refresh the list
        window.location.reload();
      } else {
        throw new Error("Failed to delete comparison");
      }
    } catch (error) {
      console.error("Error deleting comparison:", error);
      toast({
        title: "Error",
        description: "Failed to delete the comparison. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-center">Error Loading Comparisons</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Film Comparisons</h1>
          <p className="text-muted-foreground mt-2">
            Compare your technique with pros or track your progress over time
          </p>
        </div>
        <Button asChild>
          <Link href="/film-comparison-create">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Comparison
          </Link>
        </Button>
      </div>

      {comparisons && comparisons.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((comparison) => (
            <Card key={comparison.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{comparison.title}</CardTitle>
                <CardDescription>
                  {comparison.comparisonType === "self" 
                    ? "Self Comparison" 
                    : comparison.comparisonType === "pro" 
                      ? "Pro Comparison" 
                      : "Teammate Comparison"}
                </CardDescription>
                <div className="flex gap-1 mt-1">
                  {comparison.tags && comparison.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 text-xs bg-muted rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {comparison.description || "No description provided"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 p-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className={`px-2 py-0.5 rounded-full mr-2 ${
                    comparison.status === "completed" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                      : comparison.status === "shared"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                  }`}>
                    {comparison.status.charAt(0).toUpperCase() + comparison.status.slice(1)}
                  </span>
                  <span>
                    {new Date(comparison.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    asChild
                  >
                    <Link href={`/film-comparison/${comparison.id}`}>
                      <Eye className="w-4 h-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    asChild
                  >
                    <Link href={`/film-comparison-edit/${comparison.id}`}>
                      <Edit className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDelete(comparison.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed">
          <Film className="w-12 h-12 mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No Film Comparisons Yet</h2>
          <p className="mb-4 text-center text-muted-foreground">
            Create your first film comparison to analyze and improve your technique
          </p>
          <Button asChild>
            <Link href="/film-comparison-create">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Your First Comparison
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}