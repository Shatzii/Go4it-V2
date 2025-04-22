import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@/utils/date-formatter';
import { Loader2, Download, FileDown } from 'lucide-react';

/**
 * Component for exporting user profile data in various formats
 * Allows selection of data categories and export formats
 */
const ExportProfileData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [exportOptions, setExportOptions] = useState({
    personalInfo: true,
    garScores: true,
    highlights: true,
    recommendations: true
  });
  
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json'>('pdf');
  const [isLoading, setIsLoading] = useState(false);
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>Please log in to export your data</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const handleOptionChange = (option: keyof typeof exportOptions) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  // Fetch data from API for selected categories
  const fetchUserData = async () => {
    const data: Record<string, any> = {};
    
    if (exportOptions.personalInfo && user) {
      // User data is already available in context
      const basicInfo: Record<string, any> = {
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        role: user.role || ''
      };
      
      // Check if we have any profile data from the API
      try {
        const profile = await fetch(`/api/athletes/${user.id}/profile`).then(res => {
          if (res.ok) return res.json();
          return null;
        });
        
        if (profile) {
          basicInfo.height = profile.height;
          basicInfo.weight = profile.weight;
          basicInfo.age = profile.age;
          basicInfo.school = profile.school;
          basicInfo.graduationYear = profile.graduationYear;
          basicInfo.sports = profile.sportsInterest;
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // Continue without profile data
      }
      
      data.personalInfo = basicInfo;
    }
    
    if (exportOptions.garScores && user) {
      try {
        const garScores = await fetch(`/api/gar-scores/${user.id}`).then(res => {
          if (res.ok) return res.json();
          return {};
        });
        data.garScores = garScores;
      } catch (error) {
        console.error('Error fetching GAR scores:', error);
        // Continue without showing error toast to allow export to proceed with available data
        data.garScores = {
          note: "GAR scores could not be loaded"
        };
      }
    }
    
    if (exportOptions.highlights && user) {
      try {
        const highlights = await fetch(`/api/highlights?userId=${user.id}`).then(res => {
          if (res.ok) return res.json();
          return [];
        });
        data.highlights = highlights;
      } catch (error) {
        console.error('Error fetching highlights:', error);
        // Continue without showing error toast to allow export to proceed with available data
        data.highlights = [];
      }
    }
    
    if (exportOptions.recommendations && user) {
      try {
        const recommendations = await fetch(`/api/recommendations/${user.id}`).then(res => {
          if (res.ok) return res.json();
          return [];
        });
        data.recommendations = recommendations;
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        // Continue without showing error toast to allow export to proceed with available data
        data.recommendations = [];
      }
    }
    
    return data;
  };
  
  const generatePDF = (data: Record<string, any>) => {
    const doc = new jsPDF();
    const currentDate = formatDate(new Date());
    
    // Add title and header
    doc.setFontSize(20);
    doc.text('Go4It Sports - Athlete Data Export', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${currentDate}`, 14, 28);
    doc.text(`Athlete: ${user?.name || 'Athlete'}`, 14, 36);
    
    let yPosition = 45;
    
    // Personal Information
    if (data.personalInfo) {
      doc.setFontSize(16);
      doc.text('Personal Information', 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      const personalInfo = data.personalInfo;
      
      const infoTable = [
        ['ID', personalInfo.id?.toString() || 'N/A'],
        ['Name', personalInfo.name || 'N/A'],
        ['Username', personalInfo.username || 'N/A'],
        ['Email', personalInfo.email || 'N/A'],
        ['Height', personalInfo.height ? `${personalInfo.height} cm` : 'N/A'],
        ['Weight', personalInfo.weight ? `${personalInfo.weight} kg` : 'N/A'],
        ['Age', personalInfo.age?.toString() || 'N/A'],
        ['School', personalInfo.school || 'N/A'],
        ['Graduation Year', personalInfo.graduationYear?.toString() || 'N/A'],
        ['Sports', Array.isArray(personalInfo.sports) ? personalInfo.sports.join(', ') : 'N/A'],
        ['Member Since', formatDate(new Date(personalInfo.createdAt))]
      ];
      
      (doc as any).autoTable({
        startY: yPosition,
        head: [['Attribute', 'Value']],
        body: infoTable,
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 230] }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // GAR Scores
    if (data.garScores) {
      doc.setFontSize(16);
      doc.text('Growth and Ability Rating (GAR) Scores', 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      const garScores = data.garScores;
      
      const scoresTable = Object.entries(garScores).map(([category, score]) => 
        [category, typeof score === 'number' ? score.toString() : 'N/A']
      );
      
      (doc as any).autoTable({
        startY: yPosition,
        head: [['Category', 'Score']],
        body: scoresTable,
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 230] }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
      
      // Check if we need to add a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    }
    
    // Highlight information
    if (data.highlights && data.highlights.length > 0) {
      doc.setFontSize(16);
      doc.text('Video Highlights', 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      
      const highlightsTable = data.highlights.map((highlight: any) => [
        highlight.title || 'Untitled',
        highlight.description || 'No description',
        formatDate(new Date(highlight.createdAt)),
        highlight.tags ? highlight.tags.join(', ') : 'No tags'
      ]);
      
      (doc as any).autoTable({
        startY: yPosition,
        head: [['Title', 'Description', 'Date', 'Tags']],
        body: highlightsTable,
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 230] }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
      
      // Check if we need to add a new page
      if (yPosition > 270 && data.recommendations && data.recommendations.length > 0) {
        doc.addPage();
        yPosition = 20;
      }
    }
    
    // Recommendations
    if (data.recommendations && data.recommendations.length > 0) {
      doc.setFontSize(16);
      doc.text('Coach Recommendations', 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      
      const recommendationsTable = data.recommendations.map((rec: any) => [
        rec.coachName || 'Unknown Coach',
        rec.sportType || 'General',
        rec.recommendationText || 'No recommendation text',
        formatDate(new Date(rec.createdAt))
      ]);
      
      (doc as any).autoTable({
        startY: yPosition,
        head: [['Coach', 'Sport', 'Recommendation', 'Date']],
        body: recommendationsTable,
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 230] }
      });
    }
    
    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
      doc.text('Go4It Sports', 14, doc.internal.pageSize.getHeight() - 10);
    }
    
    return doc;
  };
  
  const generateJSON = (data: Record<string, any>) => {
    return JSON.stringify(data, null, 2);
  };
  
  const handleExport = async () => {
    try {
      setIsLoading(true);
      
      const userData = await fetchUserData();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const fileName = `go4it_${user.username || 'athlete'}_data_export`;
      
      if (exportFormat === 'pdf') {
        const doc = generatePDF(userData);
        doc.save(`${fileName}.pdf`);
      } else {
        // Download as JSON
        const json = generateJSON(userData);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      toast({
        title: 'Export Complete',
        description: `Your data has been exported as ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your data. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Export</CardTitle>
        <CardDescription>
          Select the data you want to export and the preferred format
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Categories</h3>
            
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="personalInfo" 
                  checked={exportOptions.personalInfo} 
                  onCheckedChange={() => handleOptionChange('personalInfo')} 
                />
                <Label htmlFor="personalInfo">Personal Information</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="garScores" 
                  checked={exportOptions.garScores} 
                  onCheckedChange={() => handleOptionChange('garScores')} 
                />
                <Label htmlFor="garScores">GAR Scores</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="highlights" 
                  checked={exportOptions.highlights} 
                  onCheckedChange={() => handleOptionChange('highlights')} 
                />
                <Label htmlFor="highlights">Highlights</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recommendations" 
                  checked={exportOptions.recommendations} 
                  onCheckedChange={() => handleOptionChange('recommendations')} 
                />
                <Label htmlFor="recommendations">Coach Recommendations</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Export Format</h3>
            
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pdf" 
                  checked={exportFormat === 'pdf'} 
                  onCheckedChange={() => setExportFormat('pdf')} 
                />
                <Label htmlFor="pdf">PDF Document</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="json" 
                  checked={exportFormat === 'json'} 
                  onCheckedChange={() => setExportFormat('json')} 
                />
                <Label htmlFor="json">JSON Data</Label>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleExport} 
            disabled={isLoading || !(exportOptions.personalInfo || exportOptions.garScores || exportOptions.highlights || exportOptions.recommendations)}
            className="w-full mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Export Data
              </>
            )}
          </Button>
          
          <div className="text-sm text-gray-500 mt-4">
            <p>Your data will be downloaded directly to your device. We do not store copies of exported files.</p>
            <p className="mt-2">All data categories may not be available if you haven't uploaded content or received feedback.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportProfileData;