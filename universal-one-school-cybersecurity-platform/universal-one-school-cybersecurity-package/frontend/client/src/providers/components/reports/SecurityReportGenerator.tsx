import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from 'date-fns';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Download, 
  FileText, 
  MoreHorizontal, 
  RefreshCw, 
  Shield, 
  ShieldAlert, 
  Printer 
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Define the form schema
const formSchema = z.object({
  reportType: z.string({
    required_error: "Please select a report type",
  }),
  timeframe: z.string({
    required_error: "Please select a timeframe",
  }),
  format: z.string({
    required_error: "Please select a format",
  })
});

interface SecurityReportGeneratorProps {
  clientId?: number;
}

export function SecurityReportGenerator({ clientId }: SecurityReportGeneratorProps) {
  const { toast } = useToast();
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  
  // Setup form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportType: "security_summary",
      timeframe: "last_30_days",
      format: "pdf"
    },
  });
  
  // Fetch report templates
  const { data: reportTemplates = [], isLoading: loadingTemplates } = useQuery({
    queryKey: ['/api/reports/templates'],
    queryFn: async () => {
      // In a real app, we would fetch these from the API
      return [
        { 
          id: "security_summary", 
          name: "Security Summary Report", 
          description: "Overview of security incidents, alerts, and threats" 
        },
        { 
          id: "compliance", 
          name: "Compliance Report", 
          description: "Detailed compliance status for regulatory frameworks" 
        },
        { 
          id: "threat_intelligence", 
          name: "Threat Intelligence Report", 
          description: "Analysis of detected threats and vulnerabilities" 
        },
        { 
          id: "incident_response", 
          name: "Incident Response Report", 
          description: "Summary of security incidents and response actions" 
        },
        { 
          id: "network_security", 
          name: "Network Security Assessment", 
          description: "Evaluation of network security posture" 
        }
      ];
    }
  });
  
  // Fetch previous reports
  const { data: previousReports = [], isLoading: loadingPreviousReports, refetch: refetchReports } = useQuery({
    queryKey: ['/api/reports', clientId],
    queryFn: async () => {
      // In a real app, we would fetch these from the API
      return [
        { 
          id: 1, 
          title: "Monthly Security Summary", 
          type: "security_summary",
          format: "pdf",
          createdAt: new Date(2025, 4, 1),
          status: "completed",
          url: "#"
        },
        { 
          id: 2, 
          title: "Q1 Compliance Report", 
          type: "compliance",
          format: "excel",
          createdAt: new Date(2025, 3, 15),
          status: "completed",
          url: "#"
        },
        { 
          id: 3, 
          title: "Network Vulnerability Assessment", 
          type: "network_security",
          format: "pdf",
          createdAt: new Date(2025, 3, 5),
          status: "completed",
          url: "#"
        }
      ];
    }
  });
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setGeneratingReport(true);
    
    try {
      // In a real app, we would send this to the API and get a response
      // For demo purposes, we'll simulate a delay and then return a success
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Set a fake report URL
      const fakeReportUrl = "#report-generated";
      setReportUrl(fakeReportUrl);
      
      toast({
        title: "Report generated successfully",
        description: `Your ${getReportTypeName(values.reportType)} has been generated.`,
      });
      
      // Refetch the list of reports to include the new one
      refetchReports();
    } catch (error) {
      toast({
        title: "Failed to generate report",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingReport(false);
    }
  };
  
  // Get report type name from ID
  const getReportTypeName = (reportTypeId: string): string => {
    const template = reportTemplates.find(t => t.id === reportTypeId);
    return template?.name || reportTypeId;
  };
  
  // Format timestamps
  const formatDate = (date: Date | string): string => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Get icon for report type
  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'security_summary':
        return <Shield className="h-4 w-4" />;
      case 'compliance':
        return <CheckCircle className="h-4 w-4" />;
      case 'threat_intelligence':
        return <AlertCircle className="h-4 w-4" />;
      case 'incident_response':
        return <ShieldAlert className="h-4 w-4" />;
      case 'network_security':
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Get icon for report format
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'excel':
        return <FileText className="h-4 w-4" />;
      case 'csv':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Security Report</CardTitle>
              <CardDescription>
                Create comprehensive security reports for analysis, compliance, or presentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="reportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={generatingReport}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a report type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingTemplates ? (
                              <div className="flex items-center justify-center p-4">
                                <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
                              </div>
                            ) : (
                              reportTemplates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  <div className="flex items-center">
                                    {getReportTypeIcon(template.id)}
                                    <span className="ml-2">{template.name}</span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {reportTemplates.find(t => t.id === field.value)?.description || ''}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeframe</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={generatingReport}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a timeframe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
                            <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                            <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                            <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The time period to include in the report
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Format</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={generatingReport}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pdf">PDF Document</SelectItem>
                            <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                            <SelectItem value="csv">CSV File</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The file format for the generated report
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex pt-2">
                    <Button 
                      type="submit" 
                      className="ml-auto"
                      disabled={generatingReport}
                    >
                      {generatingReport ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating Report...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            
            {reportUrl && (
              <CardFooter className="border-t bg-gray-800 p-4">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Report generated successfully</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={reportUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>
                Previously generated security reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPreviousReports ? (
                <div className="flex items-center justify-center p-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : previousReports.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <FileText className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No reports found</h3>
                  <p className="text-gray-400 mt-2">
                    Generate your first report to see it here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {previousReports.map(report => (
                    <div 
                      key={report.id} 
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center">
                        {getReportTypeIcon(report.type)}
                        <div className="ml-3">
                          <h4 className="font-medium">{report.title}</h4>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(report.createdAt)}</span>
                            <span className="mx-2">•</span>
                            {getFormatIcon(report.format)}
                            <span className="ml-1">{report.format.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={report.url} download>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => refetchReports()} 
                className="ml-auto" 
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingPreviousReports ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}