"use client";
import { useEffect } from "react";

export default function PWAClient() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js");
    }
  }, []);
  return null;
}
