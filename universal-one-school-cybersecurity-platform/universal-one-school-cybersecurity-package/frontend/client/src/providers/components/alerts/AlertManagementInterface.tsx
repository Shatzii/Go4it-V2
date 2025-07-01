import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, MoreVertical, CheckCircle, Clock, X, AlertTriangle, Filter, RefreshCw } from 'lucide-react';

// Temporary interface until schema is fully imported
interface Alert {
  id: number;
  title: string;
  description?: string;
  severity: string;
  status?: string;
  createdAt?: Date | string;
  source?: string;
  type?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
}

interface AlertManagementProps {
  clientId?: number;
}

type AlertStatus = 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'closed' | 'all';

export function AlertManagementInterface({ clientId }: AlertManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AlertStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isResolvingAlert, setIsResolvingAlert] = useState(false);
  
  // Fetch alerts with optional filtering
  const { data: alerts = [], isLoading, refetch } = useQuery<Alert[]>({
    queryKey: ['/api/alerts', clientId, statusFilter],
    queryFn: async () => {
      const url = new URL('/api/alerts', window.location.origin);
      
      if (clientId) {
        url.searchParams.append('clientId', clientId.toString());
      }
      
      if (statusFilter !== 'all') {
        url.searchParams.append('status', statusFilter);
      }
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
  // Update alert status mutation
  const updateAlertMutation = useMutation({
    mutationFn: async ({ alertId, status, notes }: { alertId: number, status: string, notes?: string }) => {
      const response = await fetch(`/api/alerts/${alertId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      
      if (!response.ok) throw new Error('Failed to update alert status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: 'Alert Updated',
        description: 'The alert status has been updated successfully.'
      });
      setIsDetailsOpen(false);
      setSelectedAlert(null);
      setIsResolvingAlert(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive'
      });
      setIsResolvingAlert(false);
    }
  });
  
  // Filter alerts by search query
  const filteredAlerts = alerts.filter(alert => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      alert.title.toLowerCase().includes(searchLower) ||
      (alert.description && alert.description.toLowerCase().includes(searchLower)) ||
      alert.severity.toLowerCase().includes(searchLower) ||
      (alert.source && alert.source.toLowerCase().includes(searchLower))
    );
  });
  
  // Handle resolving an alert
  const handleResolveAlert = async (notes: string = 'Resolved by user') => {
    if (!selectedAlert) return;
    
    setIsResolvingAlert(true);
    
    await updateAlertMutation.mutate({
      alertId: selectedAlert.id,
      status: 'resolved',
      notes
    });
  };
  
  // Handle acknowledging an alert
  const handleAcknowledgeAlert = async (alert: Alert) => {
    await updateAlertMutation.mutate({
      alertId: alert.id,
      status: 'acknowledged',
      notes: 'Acknowledged by user'
    });
  };
  
  // Handle changing alert status
  const handleStatusChange = async (alert: Alert, status: string) => {
    await updateAlertMutation.mutate({
      alertId: alert.id,
      status,
      notes: `Status changed to ${status} by user`
    });
  };
  
  // Get severity badge color
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-red-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-600">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Badge className="bg-blue-600">New</Badge>;
      case 'acknowledged':
        return <Badge className="bg-violet-600">Acknowledged</Badge>;
      case 'investigating':
        return <Badge className="bg-amber-600">Investigating</Badge>;
      case 'resolved':
        return <Badge className="bg-green-600">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Format date for display
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleString();
  };
  
  // Open alert details dialog
  const openAlertDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDetailsOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search alerts by title, description, or severity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === 'all' ? 'All Alerts' : `Status: ${statusFilter}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Alerts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('new')}>
                New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('acknowledged')}>
                Acknowledged
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('investigating')}>
                Investigating
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('resolved')}>
                Resolved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('closed')}>
                Closed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No alerts found</h3>
          <p className="text-gray-400 mt-2">
            {searchQuery ? 'Try adjusting your search query' : 'There are no alerts matching the current filters'}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg border-gray-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow 
                  key={alert.id}
                  onClick={() => openAlertDetails(alert)}
                  className="cursor-pointer hover:bg-gray-800/50"
                >
                  <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                  <TableCell className="font-medium">{alert.title}</TableCell>
                  <TableCell>{getStatusBadge(alert.status || 'new')}</TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {formatDate(alert.createdAt)}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {alert.source || 'System'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            openAlertDetails(alert);
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {(!alert.status || alert.status === 'new') && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcknowledgeAlert(alert);
                            }}
                          >
                            Acknowledge
                          </DropdownMenuItem>
                        )}
                        {(alert.status === 'acknowledged') && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(alert, 'investigating');
                            }}
                          >
                            Start Investigation
                          </DropdownMenuItem>
                        )}
                        {(alert.status === 'acknowledged' || alert.status === 'investigating') && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAlert(alert);
                              handleResolveAlert();
                            }}
                          >
                            Resolve Alert
                          </DropdownMenuItem>
                        )}
                        {alert.status === 'resolved' && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(alert, 'closed');
                            }}
                          >
                            Close Alert
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Alert Details Dialog */}
      {selectedAlert && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {selectedAlert.title}
                <span className="ml-2">
                  {getSeverityBadge(selectedAlert.severity)}
                </span>
              </DialogTitle>
              <DialogDescription>
                Alert details and management options
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-300">
                    {selectedAlert.description || 'No description provided.'}
                  </p>
                </div>
                
                {selectedAlert.metadata && (
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-medium mb-2">Additional Details</h3>
                    <div className="text-sm text-gray-300 space-y-2">
                      {Object.entries(selectedAlert.metadata as Record<string, any>).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="font-medium w-1/3">{key}:</span>
                          <span className="w-2/3">
                            {typeof value === 'object' 
                              ? JSON.stringify(value) 
                              : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Alert Information</h3>
                  <div className="text-sm text-gray-300 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ID:</span>
                      <span>{selectedAlert.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span>{getStatusBadge(selectedAlert.status || 'new')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created:</span>
                      <span>{formatDate(selectedAlert.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Source:</span>
                      <span>{selectedAlert.source || 'System'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span>{selectedAlert.type || 'Alert'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {(!selectedAlert.status || selectedAlert.status === 'new') && (
                    <Button 
                      className="w-full" 
                      onClick={() => handleAcknowledgeAlert(selectedAlert)}
                      disabled={updateAlertMutation.isPending}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Acknowledge
                    </Button>
                  )}
                  
                  {selectedAlert.status === 'acknowledged' && (
                    <Button 
                      className="w-full" 
                      onClick={() => handleStatusChange(selectedAlert, 'investigating')}
                      disabled={updateAlertMutation.isPending}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Start Investigation
                    </Button>
                  )}
                  
                  {(selectedAlert.status === 'acknowledged' || selectedAlert.status === 'investigating') && (
                    <Button 
                      className="w-full bg-green-700 hover:bg-green-600"
                      onClick={() => handleResolveAlert('Issue resolved by user')}
                      disabled={isResolvingAlert || updateAlertMutation.isPending}
                    >
                      {isResolvingAlert ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Resolve Alert
                    </Button>
                  )}
                  
                  {selectedAlert.status === 'resolved' && (
                    <Button 
                      variant="outline"
                      className="w-full" 
                      onClick={() => handleStatusChange(selectedAlert, 'closed')}
                      disabled={updateAlertMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Close Alert
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDetailsOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}