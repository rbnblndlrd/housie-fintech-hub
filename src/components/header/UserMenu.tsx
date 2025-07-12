import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useSubscriptionData } from '@/hooks/useSubscriptionData';
import { getAnalyticsMenuItems, NavigationItem } from '@/utils/navigationConfig';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronDown, 
  UserRound, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Minus,
  Crown,
  Star,
  Zap,
  Shield,
  UserCheck,
  Home,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { currentRole, switchRole } = useRoleSwitch();
  const navigate = useNavigate();
  const { subscriptionData, openSubscriptionPortal } = useSubscriptionData();
  const [currentStatus, setCurrentStatus] = useState('Available');
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRoleSwitch = async () => {
    const newRole = currentRole === 'customer' ? 'provider' : 'customer';
    await switchRole(newRole);
  };

  const handleDropdownAction = (item: NavigationItem) => {
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.href) {
      navigate(item.href);
    }
  };

  const handleStatusChange = (status: string) => {
    setCurrentStatus(status);
    // Here you would typically save the status to your backend
    console.log('Status changed to:', status);
  };

  const analyticsMenuItems = useMemo(() => {
    return getAnalyticsMenuItems();
  }, []);

  const getSubscriptionIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'premium':
        return <Crown className="h-4 w-4 text-purple-200" />;
      case 'professional':
        return <Sparkles className="h-4 w-4 text-yellow-200" />;
      case 'starter':
        return <Star className="h-4 w-4 text-gray-300" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-red-200" />;
      default:
        return <Zap className="h-4 w-4 text-amber-600" />;
    }
  };

  const getSubscriptionGradient = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'premium':
        return 'from-purple-600 via-purple-700 to-indigo-800 shadow-purple-500/50'; // Diamond - shiny purple
      case 'professional':
        return 'from-yellow-400 via-yellow-500 to-amber-600 shadow-yellow-500/50'; // Gold - shiny gold
      case 'starter':
        return 'from-gray-400 via-gray-500 to-slate-600 shadow-gray-500/30'; // Silver
      case 'admin':
        return 'from-red-600 via-red-700 to-red-800 shadow-red-500/50'; // Special admin
      default:
        return 'from-amber-600 via-orange-600 to-orange-700 shadow-orange-500/30'; // Bronze (free)
    }
  };

  const getSubscriptionLabel = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'premium':
        return 'Premium Plan (Diamond)';
      case 'professional':
        return 'Professional Plan (Gold)';
      case 'starter':
        return 'Starter Plan (Silver)';
      case 'admin':
        return 'Admin Access';
      default:
        return 'Free Plan (Bronze)';
    }
  };

  const getShinyEffect = (tier: string) => {
    if (tier.toLowerCase() === 'premium' || tier.toLowerCase() === 'professional') {
      return 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 relative overflow-hidden';
    }
    return '';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'Busy':
        return <Minus className="h-3 w-3 text-red-500" />;
      case 'Away':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'Do Not Disturb':
        return <AlertTriangle className="h-3 w-3 text-gray-500" />;
      default:
        return <CheckCircle className="h-3 w-3 text-green-500" />;
    }
  };

  if (!user) return null;

  const userInitials = user.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-auto p-2 rounded-lg hover:bg-gray-800 flex items-center gap-2">
          <UserRound className="h-8 w-8 text-gray-300" />
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-white">{userName}</span>
            <div className="flex items-center gap-1">
              {getStatusIcon(currentStatus)}
              <UserCheck className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-gray-300">{currentStatus} • Verified</span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-slate-900 border-slate-700 shadow-2xl z-50 fintech-card" align="end" forceMount>
        {/* User Info Section with Subscription-Based Gradient Header */}
        <div className={`p-4 bg-gradient-to-r ${getSubscriptionGradient(subscriptionData.subscription_tier)} rounded-t-lg mb-2 shadow-lg ${getShinyEffect(subscriptionData.subscription_tier)}`}>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <UserRound className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-lg drop-shadow-sm">{userName}</p>
              <p className="text-white/80 text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {currentRole === 'provider' ? 'Service Provider' : 'Customer'}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Subscription Info Row */}
          <div 
            className={`mt-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-200 group ${getShinyEffect(subscriptionData.subscription_tier)}`}
            onClick={() => navigate('/pricing')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSubscriptionIcon(subscriptionData.subscription_tier)}
                <div>
                  <span className="text-white font-medium text-sm">{getSubscriptionLabel(subscriptionData.subscription_tier)}</span>
                  <p className="text-white/70 text-xs">Active subscription</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-white/80 group-hover:text-white transition-colors">
                <span className="text-xs font-medium">Manage</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Status Management with Modern Design */}
        <div className="px-2 mb-2">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 data-[state=open]:bg-slate-700/50">
              <div className="flex items-center gap-3 w-full">
                {getStatusIcon(currentStatus)}
                <UserCheck className="h-4 w-4 text-emerald-400" />
                <div className="flex-1">
                  <span className="text-white font-medium">{currentStatus}</span>
                  <p className="text-emerald-400 text-xs">Verified Account</p>
                </div>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-slate-900 border-slate-700 w-48" sideOffset={8} alignOffset={-4}>
              <DropdownMenuItem
                onClick={() => handleStatusChange('Available')}
                className="cursor-pointer text-white hover:bg-slate-800 focus:bg-slate-800"
              >
                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                <span>Available</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('Busy')}
                className="cursor-pointer text-white hover:bg-slate-800 focus:bg-slate-800"
              >
                <Minus className="h-4 w-4 text-red-500 mr-3" />
                <span>Busy</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('Away')}
                className="cursor-pointer text-white hover:bg-slate-800 focus:bg-slate-800"
              >
                <Clock className="h-4 w-4 text-yellow-500 mr-3" />
                <span>Away</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('Do Not Disturb')}
                className="cursor-pointer text-white hover:bg-slate-800 focus:bg-slate-800"
              >
                <AlertTriangle className="h-4 w-4 text-gray-500 mr-3" />
                <span>Do Not Disturb</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </div>
        
        <DropdownMenuSeparator className="bg-slate-700 my-2" />
        
        {/* Main Navigation Items with Modern Icons and Gradients */}
        <div className="px-2 space-y-1">
          <DropdownMenuItem
            onClick={() => navigate(currentRole === 'customer' ? '/service-board' : '/dashboard')}
            className="cursor-pointer p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-200 group"
          >
            <Home className="h-5 w-5 text-blue-400 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-white font-medium">{currentRole === 'customer' ? 'Board' : 'Dashboard'}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate("/community-dashboard")}
            className="cursor-pointer p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all duration-200 group"
          >
            <Users className="h-5 w-5 text-purple-400 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-white font-medium">Community</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate("/analytics-dashboard")}
            className="cursor-pointer p-3 rounded-lg hover:bg-gradient-to-r hover:from-emerald-600/20 hover:to-teal-600/20 transition-all duration-200 group"
          >
            <BarChart3 className="h-5 w-5 text-emerald-400 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-white font-medium">Analytics</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-slate-700 my-2" />

        {/* Profile Settings */}
        <div className="px-2 space-y-1">
          <DropdownMenuItem
            onClick={() => navigate("/profile")}
            className="cursor-pointer p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
          >
            <Settings className="h-5 w-5 text-slate-400 mr-3 group-hover:text-white transition-colors" />
            <span className="text-white font-medium">Profile Settings</span>
          </DropdownMenuItem>

          {/* Help & Support */}
          <DropdownMenuItem
            onClick={() => navigate("/help")}
            className="cursor-pointer p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
          >
            <HelpCircle className="h-5 w-5 text-slate-400 mr-3 group-hover:text-white transition-colors" />
            <span className="text-white font-medium">Help & Support</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-slate-700 my-2" />

        {/* Sign Out with Danger Styling */}
        <div className="px-2 pb-2">
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer p-3 rounded-lg hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-700/20 border border-transparent hover:border-red-500/30 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 text-red-400 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-red-400 font-medium group-hover:text-red-300">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
