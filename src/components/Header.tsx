
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import HamburgerMenu from './header/HamburgerMenu';
import UserMenu from './header/UserMenu';

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Left: HOUSIE Logo + Hamburger Menu - moved logo +2 inches toward center */}
          <div className="flex items-center space-x-2 ml-4">
            <Link to="/" className="flex items-center pl-44">
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
            <HamburgerMenu />
          </div>

          {/* Right: Login/Signup or User Menu - moved +1 inch toward center */}
          <div className="flex items-center space-x-2 mr-4 pr-20">
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                    Log in
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
