
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import HamburgerMenu from './header/HamburgerMenu';
import UserMenu from './header/UserMenu';
import LanguageToggle from './LanguageToggle';
import AutoTranslate from './AutoTranslate';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate('/auth');
    } catch (error) {
      console.error('Sign-out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <header className="housie-header-locked">
        <div className="housie-header-container">
          {/* HOUSIE Logo - Locked at 128px from left edge */}
          <div className="housie-logo-position">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/a4e647f0-865a-42ef-a0cc-19226d5f0a35.png" 
                alt="HOUSIE" 
                className="h-8 w-auto"
                onError={(e) => {
                  console.log('🖼️ Primary HOUSIE logo failed, trying fallback...');
                  const target = e.currentTarget;
                  target.src = '/lovable-uploads/243ecf21-712f-439a-9efc-a299b76af346.png';
                  target.onerror = () => {
                    console.log('🖼️ Fallback logo also failed, using final fallback...');
                    target.src = '/lovable-uploads/7e58a112-189a-4048-9103-cd1a291fa6a5.png';
                    target.onerror = () => {
                      console.log('🖼️ All logos failed, hiding image and showing text');
                      target.style.display = 'none';
                      const nextSibling = target.nextElementSibling as HTMLElement;
                      if (nextSibling) {
                        nextSibling.style.display = 'block';
                      }
                    };
                  };
                }}
              />
              <span className="text-lg font-bold text-white ml-1 hidden">HOUSIE</span>
            </Link>
          </div>

          {/* Hamburger Menu - Locked at 280px from left edge */}
          <div className="housie-hamburger-position">
            <HamburgerMenu />
          </div>

          {/* Right Group - Locked at 96px from right edge */}
          <div className="housie-right-group-position">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-white hover:bg-gray-800 px-4 py-2">
                    <AutoTranslate>Dashboard</AutoTranslate>
                  </Button>
                </Link>
                <UserMenu />
                <LanguageToggle />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                    <AutoTranslate>Log in</AutoTranslate>
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                    <AutoTranslate>Sign up</AutoTranslate>
                  </Button>
                </Link>
                <LanguageToggle />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Permanently locked header styles - immune to all future changes */}
      <style>{`
        /* HOUSIE Header - Permanently Locked Layout */
        .housie-header-locked {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 50 !important;
          height: 64px !important;
          background-color: rgb(0, 0, 0) !important;
          border-bottom: 1px solid rgb(31, 41, 55) !important;
        }
        
        .housie-header-container {
          position: relative !important;
          width: 100% !important;
          height: 64px !important;
        }
        
        /* Logo - Locked at exactly 128px from left */
        .housie-logo-position {
          position: absolute !important;
          left: 128px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          align-items: center !important;
          z-index: 52 !important;
        }
        
        /* Hamburger Menu - Locked at exactly 280px from left */
        .housie-hamburger-position {
          position: absolute !important;
          left: 280px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          align-items: center !important;
          z-index: 51 !important;
        }
        
        /* Right Group - Locked at exactly 96px from right */
        .housie-right-group-position {
          position: absolute !important;
          right: 96px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          align-items: center !important;
          z-index: 51 !important;
        }
        
        /* Override any future margin/padding changes that might affect this header */
        .housie-header-locked * {
          box-sizing: border-box !important;
        }
      `}</style>
    </>
  );
};

export default Header;
