import React from 'react';
import { useMessaging } from '@/contexts/messaging-context';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageNotificationProps {
  className?: string;
}

export const MessageNotification: React.FC<MessageNotificationProps> = ({ className }) => {
  const { unreadCount } = useMessaging();
  
  if (unreadCount === 0) {
    return <Bell className={cn("h-5 w-5", className)} />;
  }
  
  return (
    <div className="relative">
      <Bell className={cn("h-5 w-5", className)} />
      <Badge 
        variant="destructive" 
        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </Badge>
    </div>
  );
};