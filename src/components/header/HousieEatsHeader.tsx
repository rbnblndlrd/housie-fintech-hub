
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/header/UserMenu';

const HousieEatsHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Services', href: '/services' },
    { label: 'Us vs Them', href: '/competitive-advantage' },
    { label: 'Help Center', href: '/help' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Menu + Logo */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/" className="flex items-center">
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
          </div>

          {/* Right Side - Auth Buttons or User Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-white hover:bg-gray-800">Dashboard</Button>
                </Link>
                <UserMenu />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="ghost" className="text-white hover:bg-gray-800">
                    Log in
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-white text-black hover:bg-gray-200">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-16 left-4 w-64 bg-black/95 backdrop-blur-sm shadow-lg rounded-lg border border-gray-800 z-50">
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default HousieEatsHeader;
