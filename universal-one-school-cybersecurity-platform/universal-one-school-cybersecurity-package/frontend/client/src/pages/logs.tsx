import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import type { Log } from "@/types/security";

export default function Logs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const { data: logs, isLoading } = useQuery<Log[]>({
    queryKey: ["/api/logs"],
    refetchInterval: 30000,
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge className="severity-critical">ERROR</Badge>;
      case "warn":
        return <Badge className="severity-medium">WARN</Badge>;
      case "info":
        return <Badge className="severity-low">INFO</Badge>;
      case "debug":
        return <Badge variant="outline">DEBUG</Badge>;
      default:
        return <Badge variant="outline">{level.toUpperCase()}</Badge>;
    }
  };

  const filteredLogs = logs?.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesSource = sourceFilter === "all" || log.source === sourceFilter;
    
    return matchesSearch && matchesLevel && matchesSource;
  }) || [];

  const logCounts = {
    total: logs?.length || 0,
    error: logs?.filter(l => l.level === "error").length || 0,
    warn: logs?.filter(l => l.level === "warn").length || 0,
    info: logs?.filter(l => l.level === "info").length || 0,
  };

  const uniqueSources = Array.from(new Set(logs?.map(log => log.source) || []));

  const exportLogs = () => {
    const csvContent = [
      "Timestamp,Level,Source,Message",
      ...filteredLogs.map(log => 
        `"${log.timestamp}","${log.level}","${log.source}","${log.message.replace(/"/g, '""')}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${format(new Date(), "yyyy-MM-dd-HHmm")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Log Analysis</h1>
          <p className="text-gray-400 mt-1">Monitor system logs and security events</p>
        </div>
        <Button
          onClick={exportLogs}
          className="bg-security-blue hover:bg-blue-600"
          disabled={filteredLogs.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-navy-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Logs</p>
                <p className="text-2xl font-bold text-white">{logCounts.total.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-navy-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Errors</p>
                <p className="text-2xl font-bold text-security-red">{logCounts.error}</p>
              </div>
              <div className="w-8 h-8 bg-security-red/20 rounded-lg flex items-center justify-center">
                <span className="text-security-red font-bold text-sm">E</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-navy-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Warnings</p>
                <p className="text-2xl font-bold text-security-amber">{logCounts.warn}</p>
              </div>
              <div className="w-8 h-8 bg-security-amber/20 rounded-lg flex items-center justify-center">
                <span className="text-security-amber font-bold text-sm">W</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-navy-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Info</p>
                <p className="text-2xl font-bold text-security-blue">{logCounts.info}</p>
              </div>
              <div className="w-8 h-8 bg-security-blue/20 rounded-lg flex items-center justify-center">
                <span className="text-security-blue font-bold text-sm">I</span>
              </div>
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
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-navy-900 border-gray-600 text-white"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-navy-900 border-gray-600 text-white">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent className="bg-navy-800 border-gray-600">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-navy-900 border-gray-600 text-white">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent className="bg-navy-800 border-gray-600">
                <SelectItem value="all">All Sources</SelectItem>
                {uniqueSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-navy-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Logs ({filteredLogs.length.toLocaleString()})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse p-3 border border-gray-600 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="h-4 bg-gray-600 rounded w-20"></div>
                    <div className="h-4 bg-gray-600 rounded w-16"></div>
                    <div className="h-4 bg-gray-600 rounded flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>No logs found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-3 p-3 bg-navy-900 rounded border border-gray-600 hover:border-gray-500 transition-colors font-mono text-sm"
                >
                  <span className="text-gray-500 text-xs min-w-0 flex-shrink-0">
                    {log.timestamp ? 
                      format(new Date(log.timestamp), "HH:mm:ss") : 
                      "--:--:--"
                    }
                  </span>
                  <div className="min-w-0 flex-shrink-0">
                    {getLevelBadge(log.level)}
                  </div>
                  <span className="text-gray-400 text-xs min-w-0 flex-shrink-0">
                    [{log.source}]
                  </span>
                  <span className="text-gray-300 flex-1 break-words">
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
