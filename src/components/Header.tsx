
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
      <header className="housie-header-permanently-locked">
        <div className="housie-header-container-locked">
          {/* HOUSIE Logo - Permanently locked at 128px from left edge */}
          <div className="housie-logo-permanently-locked">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/a4e647f0-865a-42ef-a0cc-19226d5f0a35.png" 
                alt="HOUSIE" 
                className="h-20 w-auto"
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

          {/* Hamburger Menu - Permanently locked at 280px from left edge */}
          <div className="housie-hamburger-permanently-locked">
            <HamburgerMenu />
          </div>

          {/* Right Group - Permanently locked at 96px from right edge */}
          <div className="housie-right-group-permanently-locked">
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

      {/* PERMANENTLY LOCKED - ULTRA PROTECTION - DO NOT MODIFY UNDER ANY CIRCUMSTANCES */}
      <style>{`
        /* HOUSIE Header - PERMANENTLY LOCKED - MAXIMUM PROTECTION - NEVER CHANGE */
        .housie-header-permanently-locked {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 9999 !important;
          height: 64px !important;
          background-color: rgb(0, 0, 0) !important;
          border-bottom: 1px solid rgb(31, 41, 55) !important;
          pointer-events: auto !important;
        }
        
        .housie-header-container-locked {
          position: relative !important;
          width: 100% !important;
          height: 64px !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Logo - PERMANENTLY locked at exactly 128px from left - NEVER CHANGE */
        .housie-logo-permanently-locked {
          position: absolute !important;
          left: 128px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          align-items: center !important;
          z-index: 10002 !important;
          pointer-events: auto !important;
        }
        
        /* Hamburger Menu - PERMANENTLY locked at exactly 280px from left - NEVER CHANGE */
        .housie-hamburger-permanently-locked {
          position: absolute !important;
          left: 280px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          align-items: center !important;
          z-index: 10001 !important;
          pointer-events: auto !important;
        }
        
        /* Right Group - PERMANENTLY locked at exactly 96px from right - NEVER CHANGE */
        .housie-right-group-permanently-locked {
          position: absolute !important;
          right: 96px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          align-items: center !important;
          z-index: 10001 !important;
          pointer-events: auto !important;
        }
        
        /* ULTRA PROTECTION - Override any future changes that might affect this header */
        .housie-header-permanently-locked,
        .housie-header-permanently-locked *,
        .housie-header-container-locked,
        .housie-header-container-locked *,
        .housie-logo-permanently-locked,
        .housie-logo-permanently-locked *,
        .housie-hamburger-permanently-locked,
        .housie-hamburger-permanently-locked *,
        .housie-right-group-permanently-locked,
        .housie-right-group-permanently-locked * {
          box-sizing: border-box !important;
        }
        
        /* FORCE override any container constraints that might affect header positioning */
        .housie-header-permanently-locked {
          margin-left: 0 !important;
          margin-right: 0 !important;
          max-width: none !important;
          width: 100vw !important;
        }
      `}</style>
    </>
  );
};

export default Header;
