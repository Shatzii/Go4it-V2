import React from "react";
import { MobileVideoCapture } from "./MobileVideoCapture";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MobileVideoCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCaptureComplete: (videoId: number) => void;
  sportType?: string;
}

export function MobileVideoCaptureDialog({
  open,
  onOpenChange,
  onCaptureComplete,
  sportType
}: MobileVideoCaptureDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg p-0 h-[80vh] flex flex-col">
        <div className="p-4 pb-0">
          <DialogHeader>
            <DialogTitle>Record Performance</DialogTitle>
            <DialogDescription>
              Capture your performance for instant GAR analysis
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto">
          <MobileVideoCapture
            onClose={() => onOpenChange(false)}
            onCaptureComplete={onCaptureComplete}
            sportType={sportType}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}