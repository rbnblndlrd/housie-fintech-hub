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
      {/* Enhanced HOUSIE Logo Card */}
      <Link 
        to="/dashboard" 
        className="fixed top-5 left-5 z-[1000] cursor-pointer animate-pulse"
        style={{ 
          width: '100px',
          height: '60px'
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl border border-white/30 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
             style={{ 
               boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
               animation: 'breathe 3s ease-in-out infinite'
             }}>
          <img 
            src="/lovable-uploads/a4e647f0-865a-42ef-a0cc-19226d5f0a35.png" 
            alt="HOUSIE" 
            className="h-8 w-auto"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<span class="text-2xl font-bold text-orange-800">HOUSIE</span>';
              }
            }}
          />
        </div>
      </Link>

      {/* Hamburger Menu Button - Properly spaced */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed z-[1000] text-white flex items-center justify-center"
        style={{ 
          top: '30px',
          left: '140px',
          width: '28px',
          height: '28px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}
      >
        {isMenuOpen ? (
          <X className="h-7 w-7" />
        ) : (
          <Menu className="h-7 w-7" />
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