import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const FloatingNavigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { currentRole, switchRole } = useRoleSwitch();
  const { toast } = useToast();

  // Pages that HAVE headers - don't show floating navigation
  const pagesWithHeader = [
    '/provider-profile/',  // This will match /provider-profile/:id
    '/social',
    '/competitive-advantage',
    '/help',
    '/help-center',
    '/profile',
    '/services'
  ];
  
  const shouldShowFloatingNav = !pagesWithHeader.some(path => {
    if (path.endsWith('/')) {
      // For dynamic routes like /provider-profile/:id
      return location.pathname.startsWith(path);
    }
    return location.pathname === path;
  });
  
  // Don't render if this page has a header
  if (!shouldShowFloatingNav) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign-out error:', error);
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
    setIsMenuOpen(false);
  };

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
    { icon: '🗺️', label: 'Interactive Map', href: '/interactive-map' },
    { icon: '👥', label: 'Crew Center', href: '/manager' },
    { icon: '👤', label: 'Profile Settings', href: '/profile' },
    { icon: '🔄', label: `Switch to ${currentRole === 'customer' ? 'Provider' : 'Customer'}`, action: 'roleSwitch' },
    { icon: '❓', label: 'Help & Support', href: '/help' },
    { icon: '🚪', label: 'Sign Out', action: 'signOut' }
  ];

  return (
    <>
      {/* Original HOUSIE Logo - Even Larger */}
      <Link 
        to="/" 
        className="fixed top-5 left-5 z-[1000] cursor-pointer hover:scale-105 transition-transform duration-300"
        style={{ 
          width: '180px',
          height: '80px',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2)) hover:drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
        }}
      >
        <img 
          src="/lovable-uploads/2d34b4a9-1bd5-4c5f-9776-a4fa884c3d0c.png" 
          alt="HOUSIE" 
          className="w-full h-full object-contain"
        />
      </Link>

      {/* Hamburger Menu Button - Smaller and properly spaced with rotation */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed z-[1000] text-white flex items-center justify-center transition-transform duration-300"
        style={{ 
          top: '35px',
          left: '210px',
          width: '30px',
          height: '30px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
        }}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" style={{ transform: 'rotate(180deg)' }} />
        )}
      </button>

      {/* Traditional Hamburger Dropdown Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[900] bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Dropdown Menu Panel */}
          <div 
            className="fixed z-[950] bg-black/95 backdrop-blur-md rounded-lg border border-white/20 animate-fade-in"
            style={{
              top: '75px',
              left: '20px',
              width: '240px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}
          >
            <div className="py-2">
              {menuItems.map((item, index) => (
                item.action ? (
                  <button
                    key={index}
                    onClick={item.action === 'signOut' ? handleSignOut : handleRoleSwitch}
                    className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors text-left"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={index}
                    to={item.href!}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FloatingNavigation;