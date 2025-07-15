'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Check, AlertCircle, Trophy, Video, Users, BookOpen } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'achievement' | 'video' | 'team' | 'course'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load notifications from API
    fetchNotifications()
    
    // Set up real-time notifications
    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'notification') {
        addNotification(data.notification)
      }
    }

    return () => ws.close()
  }, [])

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length
    setUnreadCount(count)
  }, [notifications])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192.png'
      })
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST'
      })
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      )
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-4 h-4 text-yellow-500" />
      case 'video': return <Video className="w-4 h-4 text-blue-500" />
      case 'team': return <Users className="w-4 h-4 text-green-500" />
      case 'course': return <BookOpen className="w-4 h-4 text-purple-500" />
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />
      default: return <Bell className="w-4 h-4 text-slate-400" />
    }
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission()
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 rounded-lg shadow-xl border border-slate-700 z-50">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                      notification.read 
                        ? 'bg-slate-800 hover:bg-slate-700' 
                        : 'bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30'
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id)
                      }
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-slate-400 text-xs mt-1">
                          {notification.message}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {Notification.permission === 'default' && (
            <div className="p-4 border-t border-slate-700">
              <button
                onClick={requestNotificationPermission}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Enable Browser Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}