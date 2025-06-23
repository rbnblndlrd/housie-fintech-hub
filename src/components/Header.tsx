
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import DynamicNavigation from '@/components/DynamicNavigation';
import UserMenu from '@/components/header/UserMenu';
import HeaderActions from '@/components/header/HeaderActions';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const navigate = useNavigate();

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <img 
                src="/lovable-uploads/new-housie-logo.png" 
                alt="HOUSIE" 
                className="h-8 w-auto" 
              />
            </div>
            <DynamicNavigation />
          </div>

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center space-x-4">
            <HeaderActions />
            {user ? (
              <UserMenu />
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
