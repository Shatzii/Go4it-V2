import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  RefreshCw, 
  Loader2, 
  AlertTriangle,
  FileText,
  Upload,
  Terminal,
  CheckCircle,
  XCircle,
  MessageSquare,
  Info
} from "lucide-react";
import { format } from 'date-fns';

export default function SystemLogsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string | null>(null);

  // Fetch system logs
  const { 
    data: logsData, 
    isLoading: logsLoading,
    refetch: refetchLogs,
    error: logsError
  } = useQuery({
    queryKey: ["/api/uploader/logs"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">System Logs</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
          This area is restricted to administrators only.
        </p>
        <Link href="/">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Get unique action types
  const actionTypes = logsData?.logs 
    ? [...new Set(logsData.logs.map((log: any) => log.action))] 
    : [];

  // Filter logs based on search query and action filter
  const filteredLogs = logsData?.logs?.filter((log: any) => {
    // Apply action type filter if set
    if (actionFilter && log.action !== actionFilter) {
      return false;
    }
    
    // Apply search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        (log.user && log.user.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Helper function to get action badge
  const getActionBadge = (action: string) => {
    const actionColors: Record<string, { color: string, icon: React.ReactNode }> = {
      'UPLOAD': { 
        color: 'bg-blue-100 text-blue-800 hover:bg-blue-200', 
        icon: <Upload className="h-3 w-3 mr-1" /> 
      },
      'DEPLOY': { 
        color: 'bg-green-100 text-green-800 hover:bg-green-200',
        icon: <Terminal className="h-3 w-3 mr-1" />
      },
      'ERROR': { 
        color: 'bg-red-100 text-red-800 hover:bg-red-200',
        icon: <XCircle className="h-3 w-3 mr-1" />
      },
      'AI': { 
        color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        icon: <MessageSquare className="h-3 w-3 mr-1" />
      }
    };

    const defaultStyle = { 
      color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      icon: <Info className="h-3 w-3 mr-1" />
    };

    const style = actionColors[action] || defaultStyle;

    return (
      <Badge 
        variant="outline" 
        className={`flex items-center ${style.color} cursor-pointer`}
        onClick={() => setActionFilter(actionFilter === action ? null : action)}
      >
        {style.icon}
        {action}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-2"
            onClick={() => navigate("/admin-dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Button>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral mb-2">
            System Logs
          </h1>
          <p className="text-gray-600">
            View system activity logs and deployment history
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetchLogs()}
          className="mt-4 md:mt-0"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Logs
        </Button>
      </div>

      {/* Search and filter */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {actionFilter && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActionFilter(null)}
                  className="h-8 px-2 text-xs"
                >
                  Clear Filter
                </Button>
              )}
              {actionTypes.map((action: string) => (
                <span key={action}>
                  {getActionBadge(action)}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {logsLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Loading system logs...</p>
        </div>
      ) : logsError ? (
        <Card className="mb-6">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Error Loading Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-red-600">
              {logsError instanceof Error 
                ? logsError.message 
                : "An unknown error occurred while fetching system logs."}
            </p>
            <Button 
              variant="outline" 
              onClick={() => refetchLogs()} 
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                System Activity Logs
              </CardTitle>
              <CardDescription>
                {actionFilter 
                  ? `Showing logs for action type: ${actionFilter}` 
                  : "Showing all system activity logs"}
                {searchQuery && ` • Search: "${searchQuery}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLogs?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          {getActionBadge(log.action)}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate" title={log.details}>
                            {log.details}
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.user ? (
                            <span className="font-medium">{log.user}</span>
                          ) : (
                            <span className="text-gray-500 italic">system</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery || actionFilter 
                    ? "No logs match your search/filter criteria" 
                    : "No system logs available"}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}