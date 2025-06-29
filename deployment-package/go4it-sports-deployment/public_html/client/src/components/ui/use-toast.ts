// Adapted from shadcn/ui toast component
import { useState, useEffect } from "react";

type ToastType = "default" | "destructive" | "success";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (props: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  toasts: Toast[];
}

const DEFAULT_TOAST_DURATION = 5000; // 5 seconds

export function useToast(): ToastContextType {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = "default", duration = DEFAULT_TOAST_DURATION }: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
      duration,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return {
    toast,
    dismiss,
    toasts,
  };
}