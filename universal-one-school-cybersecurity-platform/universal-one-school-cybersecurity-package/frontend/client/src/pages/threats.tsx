import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Threat } from "@/types/security";

export default function Threats() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: threats, isLoading } = useQuery<Threat[]>({
    queryKey: ["/api/threats"],
    refetchInterval: 30000,
  });

  const updateThreatMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/threats/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/threats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Threat Updated",
        description: "Threat status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update threat status.",
        variant: "destructive",
      });
    },
  });

  const performThreatScanMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/scan/threats");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Threat Scan Started",
        description: "AI threat scanning has been initiated.",
      });
      // Refetch threats after a delay to show new results
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/threats"] });
      }, 5000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start threat scan.",
        variant: "destructive",
      });
    },
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="severity-critical">Critical</Badge>;
      case "high":
        return <Badge className="severity-high">High</Badge>;
      case "medium":
        return <Badge className="severity-medium">Medium</Badge>;
      case "low":
        return <Badge className="severity-low">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-security-green" />;
      case "investigating":
        return <Clock className="w-4 h-4 text-security-amber" />;
      default:
        return <XCircle className="w-4 h-4 text-security-red" />;
    }
  };

  const filteredThreats = threats?.filter((threat) => {
    const matchesSearch = threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || threat.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || threat.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  }) || [];

  const threatCounts = {
    total: threats?.length || 0,
    active: threats?.filter(t => t.status === "active").length || 0,
    investigating: threats?.filter(t => t.status === "investigating").length || 0,
    resolved: threats?.filter(t => t.status === "resolved").length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Threat Management</h1>
          <p className="text-gray-400 mt-1">Monitor and respond to security threats</p>
        </div>
        <Button
          onClick={() => performThreatScanMutation.mutate()}
          disabled={performThreatScanMutation.isPending}
          className="bg-security-blue hover:bg-blue-600"
        >
          {performThreatScanMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 loading-spinner"></div>
              <span>Scanning...</span>
            </div>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Run Threat Scan
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-navy-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Threats</p>
                <p className="text-2xl font-bold text-white">{threatCounts.total}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-navy-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-bold text-security-red">{threatCounts.active}</p>
              </div>
              <XCircle className="w-8 h-8 text-security-red" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-navy-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Investigating</p>
                <p className="text-2xl font-bold text-security-amber">{threatCounts.investigating}</p>
              </div>
              <Clock className="w-8 h-8 text-security-amber" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-navy-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-security-green">{threatCounts.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-security-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-navy-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search threats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-navy-900 border-gray-600 text-white"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-navy-900 border-gray-600 text-white">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent className="bg-navy-800 border-gray-600">
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-navy-900 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-navy-800 border-gray-600">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Threats List */}
      <Card className="bg-navy-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Threats ({filteredThreats.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse p-4 border border-gray-600 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-64"></div>
                      <div className="h-3 bg-gray-600 rounded w-96"></div>
                    </div>
                    <div className="h-6 bg-gray-600 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredThreats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>No threats found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredThreats.map((threat) => (
                <div
                  key={threat.id}
                  className="p-4 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(threat.status)}
                        <h3 className="text-white font-medium">{threat.title}</h3>
                        {getSeverityBadge(threat.severity)}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{threat.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Type: {threat.type}</span>
                        {threat.sourceIp && <span>Source: {threat.sourceIp}</span>}
                        {threat.detectedAt && (
                          <span>
                            Detected {formatDistanceToNow(new Date(threat.detectedAt), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {threat.status === "active" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateThreatMutation.mutate({ id: threat.id, status: "investigating" })}
                            disabled={updateThreatMutation.isPending}
                            className="border-security-amber text-security-amber hover:bg-security-amber/10"
                          >
                            Investigate
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateThreatMutation.mutate({ id: threat.id, status: "resolved" })}
                            disabled={updateThreatMutation.isPending}
                            className="bg-security-green hover:bg-green-600"
                          >
                            Resolve
                          </Button>
                        </>
                      )}
                      {threat.status === "investigating" && (
                        <Button
                          size="sm"
                          onClick={() => updateThreatMutation.mutate({ id: threat.id, status: "resolved" })}
                          disabled={updateThreatMutation.isPending}
                          className="bg-security-green hover:bg-green-600"
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
