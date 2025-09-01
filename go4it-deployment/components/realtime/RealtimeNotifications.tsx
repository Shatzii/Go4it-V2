'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface RealtimeNotification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
}

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);

  useEffect(() => {
    // Simulate real-time notifications
    const generateNotification = () => {
      const notificationTypes = ['success', 'warning', 'info'];
      const messages = [
        {
          type: 'success',
          title: 'Analysis Complete',
          message: 'Your GAR score has been updated!',
        },
        { type: 'info', title: 'New Achievement', message: 'You unlocked a new skill badge!' },
        {
          type: 'warning',
          title: 'Training Reminder',
          message: "Don't forget your daily training session!",
        },
        {
          type: 'success',
          title: 'Ranking Update',
          message: 'You moved up 2 positions in your region!',
        },
        { type: 'info', title: 'StarPath Progress', message: 'You gained 50 XP in Ball Control!' },
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const newNotification: RealtimeNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: randomMessage.type as 'success' | 'warning' | 'info',
        title: randomMessage.title,
        message: randomMessage.message,
        timestamp: Date.now(),
        duration: 5000,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 5)); // Keep only last 5

      // Auto-remove after duration
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
      }, newNotification.duration || 5000);
    };

    // Generate initial notification
    setTimeout(() => generateNotification(), 2000);

    // Generate notifications every 10-15 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        // 70% chance
        generateNotification();
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColorClasses = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out ${getColorClasses(notification.type)} animate-in slide-in-from-right`}
        >
          <div className="flex items-start gap-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{notification.title}</h4>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm mt-1 opacity-90">{notification.message}</p>
              <div className="text-xs opacity-75 mt-2">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// WebSocket hook for real-time notifications (simplified version)
export function useRealtimeNotifications() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true);

    // Simulate receiving messages
    const interval = setInterval(() => {
      const messages = [
        'GAR analysis completed for your latest video',
        'New skill unlocked: Advanced Ball Control',
        'You gained 50 XP in technical skills',
        'Ranking updated: You moved up 3 positions',
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setLastMessage(randomMessage);
    }, 15000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  return { isConnected, lastMessage };
}
