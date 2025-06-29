import React, { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowUpToLine, 
  FileIcon, 
  Loader2, 
  RefreshCw, 
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft
} from "lucide-react";
import { formatDistanceToNow, format } from 'date-fns';

export default function SystemStatusPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [deployToken, setDeployToken] = useState("");

  // Fetch system status
  const { 
    data: statusData, 
    isLoading: statusLoading,
    refetch: refetchStatus,
    error: statusError
  } = useQuery({
    queryKey: ["/api/uploader/status"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Deploy latest ZIP mutation
  const deployMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/uploader/run-deploy", { token: deployToken });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Deployment Successful",
        description: `${data.deployedFile} was successfully deployed to build directory.`,
        variant: "default",
      });
      refetchStatus();
      setDeployToken("");
    },
    onError: (error: Error) => {
      console.error("Deployment error:", error);
      toast({
        title: "Deployment Failed",
        description: error.message || "There was a problem deploying the file. Check token and try again.",
        variant: "destructive",
      });
    }
  });

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">System Status</h1>
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

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            System Status
          </h1>
          <p className="text-gray-600">
            Monitor system status, deployment history, and manage deployments
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetchStatus()}
          className="mt-4 md:mt-0"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
      </div>

      {statusLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Loading system status...</p>
        </div>
      ) : statusError ? (
        <Card className="mb-6">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Error Loading Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-red-600">
              {statusError instanceof Error 
                ? statusError.message 
                : "An unknown error occurred while fetching system status."}
            </p>
            <Button 
              variant="outline" 
              onClick={() => refetchStatus()} 
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Last Uploaded File */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Last Uploaded File
                </CardTitle>
                <CardDescription>
                  Most recent file uploaded to the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {statusData?.lastUploadedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FileIcon className="h-5 w-5 mr-2 text-blue-500" />
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium truncate" title={statusData.lastUploadedFile.name}>
                          {statusData.lastUploadedFile.name}
                        </p>
                        <div className="flex text-sm text-gray-500">
                          <span className="mr-3">{formatFileSize(statusData.lastUploadedFile.size)}</span>
                          <span>{statusData.lastUploadedFile.isZip && <Badge variant="outline">ZIP</Badge>}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Uploaded: {format(new Date(statusData.lastUploadedFile.created), 'PPP p')}</p>
                      <p>
                        {formatDistanceToNow(new Date(statusData.lastUploadedFile.modified), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    <p>No files have been uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Build Directory Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowUpToLine className="h-5 w-5 mr-2" />
                  Build Directory
                </CardTitle>
                <CardDescription>
                  Current build deployment status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {statusData?.buildInfo?.exists ? (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <div>
                        <p className="font-medium">Build Active</p>
                        <p className="text-sm text-gray-500">Contains {statusData.buildInfo.files} files</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Size: {formatFileSize(statusData.buildInfo.size)}</p>
                      <p>
                        Last Updated: {format(new Date(statusData.buildInfo.modified), 'PPP p')}
                        <span className="ml-2 text-xs">
                          ({formatDistanceToNow(new Date(statusData.buildInfo.modified), { addSuffix: true })})
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500 flex flex-col items-center">
                    <AlertTriangle className="h-8 w-8 mb-2 text-amber-500" />
                    <p>No build deployment found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Run Deployment Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Run Deployment
              </CardTitle>
              <CardDescription>
                Deploy the latest ZIP file to the build directory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="deployToken" className="text-sm font-medium">
                    Deployment Token
                  </label>
                  <Input
                    id="deployToken"
                    type="password"
                    placeholder="Enter deployment token from .env file"
                    value={deployToken}
                    onChange={(e) => setDeployToken(e.target.value)}
                    className="max-w-md"
                  />
                  <p className="text-xs text-gray-500">
                    This token is required for security purposes. 
                    It must match the DEPLOY_SECRET_KEY in your environment variables.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {statusData?.lastUploadedFile?.isZip ? (
                    <>Latest ZIP: <span className="font-medium">{statusData.lastUploadedFile.name}</span></>
                  ) : (
                    "No ZIP files available for deployment"
                  )}
                </p>
              </div>
              <Button 
                onClick={() => deployMutation.mutate()}
                disabled={!deployToken || !statusData?.lastUploadedFile?.isZip || deployMutation.isPending}
              >
                {deployMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <ArrowUpToLine className="h-4 w-4 mr-2" />
                    Run Deployment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Server Time */}
          <div className="text-sm text-gray-500 text-right">
            Server time: {format(new Date(statusData?.serverTime), 'PPP p')}
          </div>
        </>
      )}
    </div>
  );
}