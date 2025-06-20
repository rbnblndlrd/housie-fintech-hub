import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getUserDropdownItems, getNavigationItems, NavigationItem } from '@/utils/navigationConfig';
import { useNotifications } from '@/hooks/useNotifications';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { CreamPill } from '@/components/ui/cream-pill';
import DynamicNavigation from './DynamicNavigation';
import NotificationDropdown from './NotificationDropdown';
import SubscriptionStatusModal from './SubscriptionStatusModal';

const Header = () => {
  const { user, logout } = useAuth();
  const { subscriptionData, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { notifications, loading, unreadCount, markAsRead } = useNotifications();

  // Preload the logo image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setLogoLoaded(true);
    img.src = '/lovable-uploads/8e4dab5f-fc1a-4bae-9e52-c88e60c0a67d.png';
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDropdownAction = (item: NavigationItem) => {
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.action === 'notifications') {
      setNotificationDropdownOpen(true);
    } else if (item.href) {
      navigate(item.href);
    }
  };

  const handleDiamondClick = () => {
    setSubscriptionModalOpen(true);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const getDiamondIcon = () => {
    if (subscriptionLoading) return '💎';
    
    const tier = subscriptionData.subscription_tier?.toLowerCase() || 'free';
    switch (tier) {
      case 'pro':
        return '🏆';
      case 'premium':
        return '💎';
      case 'starter':
        return '🚀';
      default:
        return '🆓';
    }
  };

  const getDiamondTooltip = () => {
    if (subscriptionLoading) return 'Loading subscription...';
    
    const tier = subscriptionData.subscription_tier || 'free';
    return `Current plan: ${tier.charAt(0).toUpperCase() + tier.slice(1)}`;
  };

  const userDropdownItems = getUserDropdownItems(user);
  const navigationItems = getNavigationItems(user);

  const enhancedDropdownItems: NavigationItem[] = user ? [
    { 
      label: "Notifications", 
      href: "", 
      icon: <Bell className="h-4 w-4" />, 
      action: "notifications",
      badge: unreadCount > 0 ? unreadCount : undefined,
      separator: false
    },
    { separator: true, label: "", href: "", icon: "" },
    ...userDropdownItems
  ] : userDropdownItems;

  return (
    <TooltipProvider>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            {/* Left: Logo - Fixed width container */}
            <div className="flex justify-start">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-2 w-24 h-8"
              >
                <img 
                  src="/lovable-uploads/8e4dab5f-fc1a-4bae-9e52-c88e60c0a67d.png" 
                  alt="HOUSIE" 
                  className={`h-8 w-auto transition-opacity duration-200 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                  style={{ 
                    imageRendering: 'crisp-edges',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                />
              </button>
            </div>
            
            {/* Center: Navigation - Fixed positioning */}
            <div className="flex justify-center">
              <DynamicNavigation items={navigationItems} />
            </div>
            
            {/* Right: User Menu - Fixed width container */}
            <div className="flex justify-end">
              {user && (
                <div className="flex items-center space-x-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDiamondClick}
                        className="text-white hover:text-gray-300 hover:bg-gray-800 text-lg w-10 h-10 p-0"
                      >
                        {getDiamondIcon()}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getDiamondTooltip()}</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-800">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.profile_image || undefined} alt={user.user_metadata?.full_name || user.email} />
                          <AvatarFallback className="bg-gray-700 text-white">
                            {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          {user.user_metadata?.full_name && (
                            <p className="font-medium">{user.user_metadata.full_name}</p>
                          )}
                          {user.email && (
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      
                      {enhancedDropdownItems.map((item, index) => {
                        if (item.separator) {
                          return <DropdownMenuSeparator key={index} />;
                        }
                        
                        return (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => handleDropdownAction(item)}
                            className="cursor-pointer"
                          >
                            <span className="mr-2">{item.icon}</span>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <CreamPill variant="notification" size="default" className="ml-2">
                                {item.badge > 99 ? '99+' : item.badge}
                              </CreamPill>
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <SubscriptionStatusModal 
        open={subscriptionModalOpen} 
        onOpenChange={setSubscriptionModalOpen} 
      />

      {/* Notification Dropdown Modal */}
      {notificationDropdownOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setNotificationDropdownOpen(false)}>
          <div className="fixed top-16 right-4 w-96 bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <NotificationDropdown
              notifications={notifications}
              loading={loading}
              onMarkAsRead={markAsRead}
            />
          </div>
        </div>
      )}
    </TooltipProvider>
  );
};

export default Header;
