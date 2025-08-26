"use client";
import { useEffect } from "react";

export default function PWAClient() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.info('SW registered', reg.scope))
        .catch((err) => console.info('SW registration failed', err));
    }
  }, []);
  return null;
}
