import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const FloatingNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { currentRole, switchRole } = useRoleSwitch();
  const { toast } = useToast();

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
      {/* HOUSIE Logo */}
      <Link 
        to="/dashboard" 
        className="fixed top-5 left-5 z-[1000] cursor-pointer"
        style={{ 
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}
      >
        <img 
          src="/lovable-uploads/a4e647f0-865a-42ef-a0cc-19226d5f0a35.png" 
          alt="HOUSIE" 
          className="h-8 w-auto"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = '/lovable-uploads/243ecf21-712f-439a-9efc-a299b76af346.png';
          }}
        />
      </Link>

      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-5 left-15 z-[1000] text-white"
        style={{ 
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          left: '60px'
        }}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Slide-out Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[900] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 left-0 z-[950] w-80 h-screen bg-black/95 backdrop-blur-md animate-slide-in-right">
            <div className="pt-20 px-6">
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  item.action ? (
                    <button
                      key={index}
                      onClick={item.action === 'signOut' ? handleSignOut : handleRoleSwitch}
                      className="w-full flex items-center gap-4 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      key={index}
                      to={item.href!}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FloatingNavigation;