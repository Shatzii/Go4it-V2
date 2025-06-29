import React, { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg transition-all transform-gpu animate-slideIn border ${
            toast.variant === "destructive"
              ? "bg-red-900/90 border-red-800 text-white"
              : toast.variant === "success"
              ? "bg-green-900/90 border-green-800 text-white"
              : "bg-gray-900/90 border-gray-800 text-white"
          }`}
          style={{ backdropFilter: "blur(8px)" }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {toast.variant === "destructive" ? (
                <AlertCircle className="h-5 w-5 text-red-400" />
              ) : toast.variant === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h3 className="font-medium text-sm mb-1">{toast.title}</h3>
              )}
              {toast.description && (
                <p className="text-sm opacity-90">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="flex-shrink-0 ml-1 p-1 rounded-full hover:bg-gray-800/50"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}