'use client';

import { useEffect } from 'react';
import { registerServiceWorker, setupInstallPrompt, setupNetworkListeners } from '@/lib/pwa-utils';

export default function PWAInit() {
  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Setup install prompt handler
    setupInstallPrompt();

    // Setup network status listeners
    setupNetworkListeners(
      () => {
        // Online callback - could trigger sync
        if ('serviceWorker' in navigator && 'sync' in (window as any).ServiceWorkerRegistration.prototype) {
          navigator.serviceWorker.ready.then((registration: any) => {
            registration.sync.register('sync-gar-data');
          });
        }
      },
      () => {
        // Offline callback - could show notification
      }
    );

    // Check for updates periodically
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Check for updates every 5 minutes
        const updateInterval = setInterval(() => {
          registration.update();
        }, 5 * 60 * 1000);

        return () => clearInterval(updateInterval);
      });
    }
  }, []);

  // This component renders nothing
  return null;
}
