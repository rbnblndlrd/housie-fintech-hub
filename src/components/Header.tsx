import React, { useState } from 'react';
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
import { Diamond } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getUserDropdownItems, getNavigationItems } from '@/utils/navigationConfig';
import DynamicNavigation from './DynamicNavigation';
import NotificationBell from './NotificationBell';
import SubscriptionStatusModal from './SubscriptionStatusModal';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDropdownAction = (item: any) => {
    if (item.action === 'logout') {
      handleLogout();
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

  const userDropdownItems = getUserDropdownItems(user);
  const navigationItems = getNavigationItems(user);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              {/* HOUSIE Logo/Home Link */}
              <button
                onClick={handleLogoClick}
                className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                HOUSIE
              </button>
              
              <DynamicNavigation items={navigationItems} />
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <NotificationBell />
                
                {/* Diamond Icon for Subscription Status */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDiamondClick}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  title="View current subscription plan and features"
                >
                  <Diamond className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.profile_image || undefined} alt={user.user_metadata?.full_name || user.email} />
                        <AvatarFallback>
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
                    
                    {userDropdownItems.map((item, index) => {
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
                          {item.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </nav>
      </header>

      <SubscriptionStatusModal 
        open={subscriptionModalOpen} 
        onOpenChange={setSubscriptionModalOpen} 
      />
    </>
  );
};

export default Header;
