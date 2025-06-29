
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { label: 'Services', href: '/services' },
    { label: 'Us vs Them', href: '/competitive-advantage' },
    { label: 'Help Center', href: '/help' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="p-2 hover:bg-gray-800 text-white"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-20 w-64 bg-white shadow-lg rounded-lg border z-50">
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
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

export default HamburgerMenu;
