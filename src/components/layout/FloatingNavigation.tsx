import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const FloatingNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: 'Services', href: '/services' },
    { label: 'Community', href: '/community' },
    { label: 'Us vs Them', href: '/competitive-advantage' },
    { label: 'Help Center', href: '/help' },
  ];

  // Pages that have their own headers - don't show FloatingNavigation
  const pagesWithHeader = [
    '/provider-profile/',  // This will match /provider-profile/:id
    '/competitive-advantage',
    '/help',
    '/help-center',
    '/services'
  ];
  
  const shouldShowFloatingNav = !pagesWithHeader.some(path => {
    if (path.endsWith('/')) {
      // For dynamic routes like /provider-profile/:id
      return location.pathname.startsWith(path);
    }
    return location.pathname === path;
  });
  
  if (!shouldShowFloatingNav) {
    return null;
  }

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

      {/* Hamburger Menu Button - Smaller and properly spaced */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed z-[1000] text-white flex items-center justify-center"
        style={{ 
          top: '35px',
          left: '210px',
          width: '30px',
          height: '30px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="fixed w-56 bg-black/95 backdrop-blur-sm shadow-lg rounded-lg border border-gray-800 z-[950]"
             style={{ 
               top: '75px',
               left: '210px'
             }}>
          <div className="py-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="block px-4 py-2.5 text-white hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingNavigation;