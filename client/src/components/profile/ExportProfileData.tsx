import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Save, FileDown, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useQuery } from '@tanstack/react-query';
import { generateAthletePDF } from '@/utils/pdf-generator';
import { toast } from '@/hooks/use-toast';

/**
 * Component for exporting user profile data in different formats
 */
export function ExportProfileData() {
  const { user } = useAuth();
  const [includeGarScores, setIncludeGarScores] = useState(true);
  const [includeHighlights, setIncludeHighlights] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Fetch profile data
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({ 
    queryKey: ['/api/athlete-profiles', user?.id],
    enabled: !!user
  });
  
  // Fetch GAR scores
  const { data: garScores, isLoading: isLoadingGarScores } = useQuery({
    queryKey: ['/api/gar-scores', user?.id],
    enabled: !!user && includeGarScores
  });
  
  // Fetch highlights
  const { data: highlights, isLoading: isLoadingHighlights } = useQuery({
    queryKey: ['/api/highlights', { userId: user?.id }],
    enabled: !!user && includeHighlights
  });
  
  // Fetch recommendations
  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['/api/recommendations', user?.id],
    enabled: !!user && includeRecommendations
  });
  
  const isLoading = isLoadingProfile || 
    (includeGarScores && isLoadingGarScores) || 
    (includeHighlights && isLoadingHighlights) || 
    (includeRecommendations && isLoadingRecommendations);
    
  // Generate and download PDF report
  const downloadPDF = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const pdf = await generateAthletePDF(
        user,
        profileData,
        includeGarScores ? garScores : null,
        includeHighlights ? highlights : [],
        includeRecommendations ? recommendations : []
      );
      
      // Create download link
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Go4It_Athlete_Report_${user.username}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Your report has been generated and downloaded",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate the PDF report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Export data as JSON
  const exportJson = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive",
      });
      return;
    }
    
    // Compile data based on user selections
    const exportData = {
      userInfo: user,
      profileData: profileData || {},
      ...(includeGarScores && { garScores: garScores || {} }),
      ...(includeHighlights && { highlights: highlights || [] }),
      ...(includeRecommendations && { recommendations: recommendations || [] })
    };
    
    // Create download link
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Go4It_Data_${user.username}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Your data has been exported as JSON",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Export Your Data</CardTitle>
        <CardDescription>
          Download your profile information and performance data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="include-gar-scores" className="flex flex-col gap-1">
              <span>Include GAR Scores</span>
              <span className="text-sm text-muted-foreground">
                Performance metrics and analytics
              </span>
            </Label>
            <Switch 
              id="include-gar-scores" 
              checked={includeGarScores} 
              onCheckedChange={setIncludeGarScores} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="include-highlights" className="flex flex-col gap-1">
              <span>Include Highlights</span>
              <span className="text-sm text-muted-foreground">
                Your recorded performance highlights
              </span>
            </Label>
            <Switch 
              id="include-highlights" 
              checked={includeHighlights} 
              onCheckedChange={setIncludeHighlights} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="include-recommendations" className="flex flex-col gap-1">
              <span>Include Recommendations</span>
              <span className="text-sm text-muted-foreground">
                Training and improvement suggestions
              </span>
            </Label>
            <Switch 
              id="include-recommendations" 
              checked={includeRecommendations} 
              onCheckedChange={setIncludeRecommendations} 
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          disabled={isLoading || isGenerating}
          onClick={exportJson}
          className="flex gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Export JSON
        </Button>
        
        <Button
          onClick={downloadPDF}
          disabled={isLoading || isGenerating}
          className="flex gap-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Generate PDF Report
        </Button>
      </CardFooter>
    </Card>
  );
}