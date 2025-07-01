import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X, Shield, Search } from "lucide-react";
import type { Alert } from "@/types/security";

interface AlertModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: string) => void;
}

export function AlertModal({ alert, isOpen, onClose, onAction }: AlertModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!alert) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-security-red";
      case "high":
        return "text-security-red";
      case "medium":
        return "text-security-amber";
      case "low":
        return "text-security-blue";
      default:
        return "text-gray-400";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge className="bg-security-red/20 text-security-red border-security-red/30">
            CRITICAL
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            HIGH
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-security-amber/20 text-security-amber border-security-amber/30">
            MEDIUM
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-security-blue/20 text-security-blue border-security-blue/30">
            LOW
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            {severity.toUpperCase()}
          </Badge>
        );
    }
  };

  const getRecommendedActions = (type: string, severity: string) => {
    const actions = [];
    
    switch (type) {
      case "threat_detected":
        actions.push("Isolate affected workstation immediately");
        actions.push("Review access logs for the past 24 hours");
        actions.push("Contact incident response team");
        if (severity === "critical") {
          actions.push("Notify stakeholders");
        }
        break;
      case "network_anomaly":
        actions.push("Monitor network traffic patterns");
        actions.push("Check for unauthorized devices");
        actions.push("Review firewall logs");
        break;
      case "suspicious_file_detected":
        actions.push("Quarantine the suspicious file");
        actions.push("Run full system scan");
        actions.push("Check file origin and permissions");
        break;
      default:
        actions.push("Investigate the alert details");
        actions.push("Check system logs");
        actions.push("Monitor for related activities");
    }
    
    return actions;
  };

  const handleAction = async (action: string) => {
    if (!onAction) return;
    
    setIsProcessing(true);
    try {
      await onAction(action);
      onClose();
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const recommendedActions = getRecommendedActions(alert.type, alert.severity);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-navy-800 border-gray-700 max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-white">
              Critical Security Alert
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <div className={`w-12 h-12 ${alert.severity === 'critical' ? 'bg-security-red/20' : 'bg-security-amber/20'} rounded-lg flex items-center justify-center`}>
              <AlertTriangle className={`${getSeverityColor(alert.severity)} w-6 h-6`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-white">{alert.title}</h4>
                {getSeverityBadge(alert.severity)}
              </div>
              <p className="text-sm text-gray-400">
                {alert.description}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Type: {alert.type} • {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : 'Unknown time'}
              </div>
            </div>
          </div>

          <div className="bg-navy-900 rounded-lg p-4 border border-gray-600">
            <h5 className="text-sm font-medium text-white mb-3 flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Recommended Actions:
            </h5>
            <ul className="text-sm text-gray-400 space-y-2">
              {recommendedActions.map((action, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-security-blue mr-2">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-3">
            {alert.severity === "critical" && (
              <Button
                onClick={() => handleAction("isolate")}
                disabled={isProcessing}
                className="flex-1 bg-security-red hover:bg-red-600 text-white font-medium"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 loading-spinner"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Isolate System
                  </>
                )}
              </Button>
            )}
            <Button
              onClick={() => handleAction("investigate")}
              disabled={isProcessing}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium"
            >
              Investigate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
