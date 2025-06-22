
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, Calendar, BarChart3, CreditCard, Shield, LogOut, Bell } from 'lucide-react';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt="User avatar" />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-white border border-gray-200 shadow-lg" 
        align="end" 
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-gray-900">
              {user?.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-gray-500">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem 
          onClick={() => navigate('/notifications')}
          className="cursor-pointer hover:bg-gray-50 text-gray-700"
        >
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/dashboard')}
          className="cursor-pointer hover:bg-gray-50 text-gray-700"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/customer-profile')}
          className="cursor-pointer hover:bg-gray-50 text-gray-700"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/calendar')}
          className="cursor-pointer hover:bg-gray-50 text-gray-700"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span>Calendar</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/analytics')}
          className="cursor-pointer hover:bg-gray-50 text-gray-700"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          <span>Analytics</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/performance')}
          className="cursor-pointer hover:bg-gray-50 text-gray-700"
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Performance Reports</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer hover:bg-red-50 text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
