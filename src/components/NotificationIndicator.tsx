
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationIndicator = () => {
  const { user } = useAuth();
  const { unreadCount, loading } = useNotifications();
  const navigate = useNavigate();

  console.log('🔔 NotificationIndicator render:', { 
    user: !!user, 
    loading, 
    unreadCount 
  });

  if (!user) {
    console.log('🔔 No user, not rendering indicator');
    return null;
  }

  const handleClick = () => {
    console.log('🔔 Notification indicator clicked, navigating to /notifications');
    navigate('/notifications');
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleClick}
      className="relative h-8 w-8 hover:bg-gray-700 focus:bg-gray-700"
    >
      <Bell className="h-4 w-4 text-white" />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-gray-900">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </Button>
  );
};

export default NotificationIndicator;
