import { useState, useEffect } from "react";
import { Bell, X, Check, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Connect to WebSocket for real-time notifications
    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/notifications`);
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      addNotification(notification);
    };

    // Load existing notifications
    fetchNotifications();

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: newNotification.id
      });
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Request notification permission on first load
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-slate-300 hover:text-cyan-400"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50">
          <Card className="bg-slate-900/95 backdrop-blur-xl border-cyan-500/20 max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="font-semibold text-slate-100">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-slate-400 hover:text-cyan-400"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-slate-800/50 transition-colors cursor-pointer",
                        !notification.read && "bg-slate-800/30"
                      )}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={cn(
                              "text-sm font-medium truncate",
                              notification.read ? "text-slate-300" : "text-slate-100"
                            )}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-cyan-400 rounded-full ml-2 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-500">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                            <div className="flex gap-1">
                              {notification.actionUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = notification.actionUrl!;
                                  }}
                                >
                                  {notification.actionText || 'View'}
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;

// Hook for sending notifications
export const useNotifications = () => {
  const sendNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    }).catch(console.error);
  };

  return { sendNotification };
};