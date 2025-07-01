import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, FileWarning, Shield } from "lucide-react";
import type { FileIntegrityCheck } from "@/types/security";

export function FileIntegrity() {
  const { data: fileChecks, isLoading } = useQuery<FileIntegrityCheck[]>({
    queryKey: ["/api/file-integrity"],
    refetchInterval: 120000, // Refetch every 2 minutes
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unchanged":
        return (
          <Badge className="bg-security-green/20 text-security-green border-security-green/30">
            Unchanged
          </Badge>
        );
      case "modified":
        return (
          <Badge className="bg-security-amber/20 text-security-amber border-security-amber/30">
            Modified
          </Badge>
        );
      case "quarantined":
        return (
          <Badge className="bg-security-red/20 text-security-red border-security-red/30">
            Quarantined
          </Badge>
        );
      case "deleted":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            Deleted
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            Unknown
          </Badge>
        );
    }
  };

  const getFileIcon = (fileType: string, status: string) => {
    if (status === "quarantined") {
      return <Shield className="text-security-red w-4 h-4" />;
    }
    if (status === "modified") {
      return <FileWarning className="text-security-amber w-4 h-4" />;
    }
    return <FileText className="text-security-green w-4 h-4" />;
  };

  const getFileName = (filePath: string) => {
    const parts = filePath.split('/');
    return parts[parts.length - 1] || filePath;
  };

  const getFileTypeDescription = (fileType: string) => {
    switch (fileType) {
      case "system_file":
        return "System file";
      case "configuration_file":
        return "Config file";
      case "application_config":
        return "App config";
      case "security_file":
        return "Security file";
      case "suspicious_file":
        return "Suspicious file";
      default:
        return fileType.replace(/_/g, ' ');
    }
  };

  const displayFiles = fileChecks?.slice(0, 4) || [];

  return (
    <Card className="bg-navy-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">File Integrity Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3 bg-navy-900 rounded-lg border border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    <div>
                      <div className="h-4 bg-gray-600 rounded w-32 mb-1"></div>
                      <div className="h-3 bg-gray-600 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-600 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : displayFiles.length > 0 ? (
            displayFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-navy-900 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {getFileIcon(file.fileType, file.status)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate" title={file.filePath}>
                      {getFileName(file.filePath)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {getFileTypeDescription(file.fileType)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(file.status)}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No file integrity checks available</p>
            </div>
          )}

          {!isLoading && displayFiles.length > 0 && (
            <div className="text-center pt-4">
              <Button
                variant="ghost"
                className="text-sm text-security-blue hover:text-blue-400 transition-colors"
              >
                View All Files ({fileChecks?.length || 0})
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
