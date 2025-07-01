import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileArchive,
  HardDrive,
  History,
  Play,
  RefreshCw,
  RotateCcw,
  Settings,
  Shield,
  Upload
} from 'lucide-react';
import { Link } from 'wouter';

interface BackupJob {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  schedule: string;
  paths: string[];
  lastRun?: string;
  nextRun: string;
  status: 'active' | 'paused' | 'failed';
  size?: string;
  retention: number;
}

interface BackupHistory {
  id: string;
  jobId: string;
  timestamp: string;
  type: 'full' | 'incremental' | 'differential';
  size: string;
  duration: string;
  status: 'success' | 'failed' | 'running';
  files: number;
}

const BackupsPage: React.FC = () => {
  const [, params] = useRoute('/servers/:id/backups');
  const serverId = params?.id;
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [selectedBackup, setSelectedBackup] = useState<BackupHistory | null>(null);

  // Sample backup jobs
  const sampleJobs: BackupJob[] = [
    {
      id: 'job-1',
      name: 'System Configuration Backup',
      type: 'incremental',
      schedule: 'daily',
      paths: ['/etc', '/home', '/var/www'],
      lastRun: new Date(Date.now() - 2 * 3600000).toISOString(),
      nextRun: new Date(Date.now() + 22 * 3600000).toISOString(),
      status: 'active',
      size: '2.4 GB',
      retention: 30
    },
    {
      id: 'job-2',
      name: 'Database Backup',
      type: 'full',
      schedule: 'weekly',
      paths: ['/var/lib/mysql'],
      lastRun: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
      nextRun: new Date(Date.now() + 2 * 24 * 3600000).toISOString(),
      status: 'active',
      size: '850 MB',
      retention: 12
    }
  ];

  // Sample backup history
  const sampleHistory: BackupHistory[] = [
    {
      id: 'backup-1',
      jobId: 'job-1',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      type: 'incremental',
      size: '156 MB',
      duration: '2m 34s',
      status: 'success',
      files: 1247
    },
    {
      id: 'backup-2',
      jobId: 'job-2',
      timestamp: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
      type: 'full',
      size: '850 MB',
      duration: '8m 12s',
      status: 'success',
      files: 8934
    },
    {
      id: 'backup-3',
      jobId: 'job-1',
      timestamp: new Date(Date.now() - 26 * 3600000).toISOString(),
      type: 'incremental',
      size: '89 MB',
      duration: '1m 45s',
      status: 'success',
      files: 892
    }
  ];

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await apiRequest('POST', `/api/servers/${serverId}/backups/${jobId}/run`);
      if (!response.ok) throw new Error('Failed to create backup');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/servers/${serverId}/backups`] });
      toast({
        title: "Backup started",
        description: "Backup job has been initiated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Backup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Restore backup mutation
  const restoreBackupMutation = useMutation({
    mutationFn: async ({ backupId, targetPath }: { backupId: string, targetPath: string }) => {
      const response = await apiRequest('POST', `/api/servers/${serverId}/backups/${backupId}/restore`, { targetPath });
      if (!response.ok) throw new Error('Failed to restore backup');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Restore completed",
        description: "Backup has been restored successfully.",
      });
      setIsRestoring(null);
      setSelectedBackup(null);
    },
    onError: (error) => {
      toast({
        title: "Restore failed",
        description: error.message,
        variant: "destructive",
      });
      setIsRestoring(null);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'success': return 'bg-emerald-500';
      case 'paused': return 'bg-amber-500';
      case 'failed': return 'bg-rose-500';
      case 'running': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/servers">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Servers
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Backup</span> & Restore
            </h1>
          </div>
          <Button
            onClick={() => setIsCreatingJob(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-700"
          >
            <FileArchive className="mr-2 h-4 w-4" />
            New Backup Job
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Backup Jobs */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Backup Jobs</CardTitle>
                <CardDescription className="text-slate-400">
                  Automated backup schedules and configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleJobs.map((job) => (
                  <div key={job.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-white">{job.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`${getStatusColor(job.status)} text-white`}>
                            {job.status}
                          </Badge>
                          <Badge variant="outline" className="border-slate-700 text-slate-400">
                            {job.type}
                          </Badge>
                          <Badge variant="outline" className="border-slate-700 text-slate-400">
                            {job.schedule}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700"
                          onClick={() => createBackupMutation.mutate(job.id)}
                          disabled={createBackupMutation.isPending}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Paths:</span>
                        <p className="text-white">{job.paths.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Size:</span>
                        <p className="text-white">{job.size || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Last Run:</span>
                        <p className="text-white">{job.lastRun ? formatDate(job.lastRun) : 'Never'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Next Run:</span>
                        <p className="text-white">{formatDate(job.nextRun)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Backup History */}
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Backup History</CardTitle>
                <CardDescription className="text-slate-400">
                  Recent backup runs and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleHistory.map((backup) => (
                    <div
                      key={backup.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 hover:bg-slate-800 cursor-pointer"
                      onClick={() => setSelectedBackup(backup)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(backup.status)}`} />
                        <div>
                          <p className="text-white font-medium">{backup.type} backup</p>
                          <p className="text-sm text-slate-400">{formatDate(backup.timestamp)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{backup.size}</p>
                        <p className="text-sm text-slate-400">{backup.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Backup Details */}
          <div className="lg:col-span-1">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Backup Details</CardTitle>
                <CardDescription className="text-slate-400">
                  Information about selected backup
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedBackup ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400">Type</label>
                      <Badge className={`mt-1 ${getStatusColor(selectedBackup.status)} text-white`}>
                        {selectedBackup.type}
                      </Badge>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400">Timestamp</label>
                      <p className="text-sm text-white">{formatDate(selectedBackup.timestamp)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400">Size</label>
                      <p className="text-sm text-white">{selectedBackup.size}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400">Duration</label>
                      <p className="text-sm text-white">{selectedBackup.duration}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400">Files</label>
                      <p className="text-sm text-white">{selectedBackup.files.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-700"
                      >
                        <Download className="mr-2 h-3 w-3" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setIsRestoring(selectedBackup.id)}
                      >
                        <RotateCcw className="mr-2 h-3 w-3" />
                        Restore
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-400 mb-2">Select a backup</h3>
                    <p className="text-slate-500">
                      Click on a backup entry to view details and restore options.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Storage Stats */}
            <Card className="border-slate-800 bg-slate-900 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Storage Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Backups</span>
                    <span className="text-white">3.25 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Available Space</span>
                    <span className="text-white">12.8 GB</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500">20% of backup storage used</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Restore Dialog */}
      <Dialog open={!!isRestoring} onOpenChange={() => setIsRestoring(null)}>
        <DialogContent className="border-slate-800 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle>Restore Backup</DialogTitle>
            <DialogDescription className="text-slate-400">
              Choose where to restore the backup files
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400">Restore Path</label>
              <Input
                placeholder="/var/restore"
                className="border-slate-700 bg-slate-800 text-white"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="overwrite" />
              <label htmlFor="overwrite" className="text-sm text-slate-300">
                Overwrite existing files
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRestoring(null)}
              className="border-slate-700"
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                if (selectedBackup) {
                  restoreBackupMutation.mutate({
                    backupId: selectedBackup.id,
                    targetPath: '/var/restore'
                  });
                }
              }}
              disabled={restoreBackupMutation.isPending}
            >
              {restoreBackupMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                'Restore Backup'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BackupsPage;