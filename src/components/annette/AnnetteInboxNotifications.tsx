import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageCircle, Calendar, X, Star, Users } from 'lucide-react';
import { useServiceConnections } from '@/hooks/useServiceConnections';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AnnetteNotification {
  id: string;
  type: 'messaging_unlocked' | 'rebooking_suggestion' | 'connection_established' | 'trust_boost';
  title: string;
  message: string;
  actionLabel?: string;
  actionData?: any;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface AnnetteInboxNotificationsProps {
  className?: string;
}

export const AnnetteInboxNotifications: React.FC<AnnetteInboxNotificationsProps> = ({
  className
}) => {
  const { user } = useAuth();
  const { connections, rebookingSuggestions } = useServiceConnections();
  const [notifications, setNotifications] = useState<AnnetteNotification[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate notifications based on service connections and rebooking suggestions
  useEffect(() => {
    const newNotifications: AnnetteNotification[] = [];

    // Check for new messaging unlocks
    const messagingConnections = connections.filter(conn => conn.can_message);
    messagingConnections.forEach(conn => {
      if (conn.other_user) {
        newNotifications.push({
          id: `messaging_${conn.id}`,
          type: 'messaging_unlocked',
          title: 'Messaging Unlocked! 🎉',
          message: `You're now connected with ${conn.other_user.full_name}! You can message them directly from here on out.`,
          actionLabel: 'Send Message',
          actionData: { userId: conn.other_user.id },
          timestamp: new Date(conn.last_booked_date),
          read: false,
          priority: 'high'
        });
      }
    });

    // Check for rebooking suggestions
    rebookingSuggestions.forEach(suggestion => {
      const daysSince = Math.ceil((Date.now() - new Date(suggestion.last_booking_date).getTime()) / (1000 * 60 * 60 * 24));
      
      newNotifications.push({
        id: `rebook_${suggestion.provider_user_id}`,
        type: 'rebooking_suggestion',
        title: 'Perfect Time to Rebook! ⭐',
        message: `It's been ${daysSince} days since your last service with ${suggestion.provider_name}. Want to book again? Based on your pattern, you usually book ${suggestion.service_type} every ${suggestion.frequency_pattern || '2 weeks'}.`,
        actionLabel: 'Book Again',
        actionData: { providerId: suggestion.provider_user_id, serviceType: suggestion.service_type },
        timestamp: new Date(suggestion.suggested_date),
        read: false,
        priority: 'medium'
      });
    });

    // Check for trust boosts
    const trustedConnections = connections.filter(conn => 
      conn.connection_tier === 'trusted' || conn.connection_tier === 'network'
    );
    
    if (trustedConnections.length > 0) {
      const recentTrusted = trustedConnections.find(conn => {
        const daysSince = Math.ceil((Date.now() - new Date(conn.last_booked_date).getTime()) / (1000 * 60 * 60 * 24));
        return daysSince <= 7; // Within last week
      });

      if (recentTrusted && recentTrusted.other_user) {
        newNotifications.push({
          id: `trust_${recentTrusted.id}`,
          type: 'trust_boost',
          title: 'Trust Level Upgraded! 🏅',
          message: `You and ${recentTrusted.other_user.full_name} are basically HOUSIE-certified now. Your connection tier has been upgraded to ${recentTrusted.connection_tier}!`,
          timestamp: new Date(recentTrusted.last_booked_date),
          read: false,
          priority: 'high'
        });
      }
    }

    // Sort by priority and timestamp
    newNotifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    setNotifications(newNotifications.slice(0, 5)); // Limit to 5 most recent
  }, [connections, rebookingSuggestions]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAction = (notification: AnnetteNotification) => {
    switch (notification.type) {
      case 'messaging_unlocked':
        // Open messaging interface
        console.log('Opening message to:', notification.actionData?.userId);
        break;
      case 'rebooking_suggestion':
        // Open booking flow
        console.log('Opening booking for:', notification.actionData);
        break;
    }
    markAsRead(notification.id);
  };

  const getPriorityIcon = (type: AnnetteNotification['type']) => {
    switch (type) {
      case 'messaging_unlocked':
        return <MessageCircle className="w-4 h-4" />;
      case 'rebooking_suggestion':
        return <Calendar className="w-4 h-4" />;
      case 'trust_boost':
        return <Star className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: AnnetteNotification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-purple-700">
                Annette Inbox
              </CardTitle>
              <p className="text-sm text-purple-600">
                {unreadCount > 0 ? `${unreadCount} new updates` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
            <Button variant="ghost" size="sm">
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "border rounded-lg p-3 space-y-2 transition-all",
                !notification.read && "border-l-4 border-l-purple-500 bg-purple-50"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2 flex-1">
                  <Badge className={getPriorityColor(notification.priority)}>
                    {getPriorityIcon(notification.type)}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {notification.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissNotification(notification.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {notification.actionLabel && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleAction(notification)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {notification.actionLabel}
                  </Button>
                  {!notification.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
};