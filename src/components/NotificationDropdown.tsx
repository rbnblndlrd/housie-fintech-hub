
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, CreditCard, Star, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  booking_id?: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  loading,
  onMarkAsRead,
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_booking':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'booking_confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'payment_received':
        return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case 'review_received':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'booking_cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center">
        <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="max-h-96">
      <div className="px-4 py-3 border-b">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
      </div>
      <ScrollArea className="max-h-80">
        <div className="divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => !notification.read && onMarkAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {notifications.some(n => !n.read) && (
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm"
            onClick={() => {
              notifications
                .filter(n => !n.read)
                .forEach(n => onMarkAsRead(n.id));
            }}
          >
            Mark all as read
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
