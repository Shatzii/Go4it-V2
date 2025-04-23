import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Loader2, Upload, FileUp, Trash2, RefreshCw } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';

interface UploadedFile {
  name: string;
  size: number;
  created: string;
  modified: string;
}

interface DeployForm {
  filename: string;
  destination: string;
}

const UploaderPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [deployForm, setDeployForm] = useState<DeployForm>({
    filename: '',
    destination: ''
  });

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  // Query to fetch existing uploaded files
  const { data: filesData, isLoading: filesLoading, refetch: refetchFiles } = useQuery({
    queryKey: ['/api/uploader/files'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/uploader/files');
      return res.json();
    },
    enabled: !!user && user.role === 'admin',
  });

  // Mutation for file upload
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return fetch('/api/uploader/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }).then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.message || 'Upload failed');
          });
        }
        return res.json();
      });
    },
    onSuccess: () => {
      setSelectedFile(null);
      setUploadProgress(0);
      queryClient.invalidateQueries({ queryKey: ['/api/uploader/files'] });
      toast({
        title: 'Upload Success',
        description: 'File uploaded successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload Failed',
        description: error.message || 'An error occurred during upload',
        variant: 'destructive',
      });
    },
  });

  // Mutation for file deployment
  const deployMutation = useMutation({
    mutationFn: async (data: DeployForm) => {
      return fetch('/api/uploader/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      }).then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.message || 'Deployment failed');
          });
        }
        return res.json();
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Deployment Success',
        description: data.message || 'File deployed successfully',
      });
      setDeployForm({
        filename: '',
        destination: ''
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Deployment Failed',
        description: error.message || 'An error occurred during deployment',
        variant: 'destructive',
      });
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    // Simulate upload progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);

    try {
      await uploadMutation.mutateAsync(selectedFile);
    } finally {
      clearInterval(progressInterval);
      setUploadProgress(100);
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Handle file deployment
  const handleDeploy = () => {
    if (!deployForm.filename || !deployForm.destination) {
      toast({
        title: 'Missing Information',
        description: 'Both filename and destination are required',
        variant: 'destructive',
      });
      return;
    }

    deployMutation.mutateAsync(deployForm);
  };

  // Handle file selection for deployment
  const handleSelectFileForDeploy = (filename: string) => {
    setDeployForm(prev => ({ ...prev, filename }));
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // If not admin, show access denied
  if (user && user.role !== 'admin') {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page.
            <div className="mt-4">
              <Link href="/">
                <Button variant="outline">Return to Home</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Code Uploader</h1>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="deploy">Deploy Files</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Code Files</CardTitle>
              <CardDescription>
                Upload JavaScript, TypeScript, CSS, HTML, or JSON files to deploy to your server.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".js,.ts,.jsx,.tsx,.css,.json,.html"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center py-8">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <span className="text-lg font-medium">
                      {selectedFile ? selectedFile.name : 'Select a file or drag and drop'}
                    </span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {selectedFile 
                        ? `Size: ${formatFileSize(selectedFile.size)}` 
                        : 'JS, TS, JSX, TSX, CSS, JSON, or HTML up to 5MB'}
                    </span>
                  </label>
                </div>
                
                {uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-1">Uploading: {uploadProgress}%</div>
                    <Progress value={uploadProgress} className="h-2 w-full" />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setSelectedFile(null)}
                disabled={!selectedFile || uploadMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || uploadMutation.isPending}
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload File
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Uploaded Files</span>
                <Button variant="ghost" size="icon" onClick={() => refetchFiles()}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Recently uploaded files available for deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filesLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filesData?.files?.length > 0 ? (
                <div className="border rounded-md divide-y">
                  {filesData.files.map((file: UploadedFile) => (
                    <div key={file.name} className="flex items-center justify-between p-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {new Date(file.modified).toLocaleString()}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSelectFileForDeploy(file.name)}
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No files have been uploaded yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deploy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deploy Files</CardTitle>
              <CardDescription>
                Move uploaded files to their destination in the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Source File
                  </label>
                  <Input
                    value={deployForm.filename}
                    onChange={(e) => setDeployForm(prev => ({ ...prev, filename: e.target.value }))}
                    placeholder="Select a file from the uploaded files list"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Destination Path
                  </label>
                  <Input
                    value={deployForm.destination}
                    onChange={(e) => setDeployForm(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="e.g., client/src/components/MyComponent.tsx"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Specify the path where the file should be deployed
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setDeployForm({ filename: '', destination: '' })}
                disabled={deployMutation.isPending}
              >
                Reset
              </Button>
              <Button 
                onClick={handleDeploy} 
                disabled={!deployForm.filename || !deployForm.destination || deployMutation.isPending}
              >
                {deployMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Deploy File
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recently Uploaded Files</CardTitle>
              <CardDescription>
                Select a file to deploy from the list below
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filesLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filesData?.files?.length > 0 ? (
                <div className="border rounded-md divide-y">
                  {filesData.files.map((file: UploadedFile) => (
                    <div key={file.name} className="flex items-center justify-between p-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {new Date(file.modified).toLocaleString()}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSelectFileForDeploy(file.name)}
                      >
                        Select for Deploy
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No files have been uploaded yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UploaderPage;