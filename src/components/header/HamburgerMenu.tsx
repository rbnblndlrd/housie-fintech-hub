
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AutoTranslate from '@/components/AutoTranslate';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Services', href: '/services' },
    { label: 'Community', href: '/community-dashboard' },
    { label: 'Us vs Them', href: '/competitive-advantage' },
    { label: 'Help Center', href: '/help' },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="default"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:bg-gray-800"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-10 left-0 w-56 bg-black/95 backdrop-blur-sm shadow-lg rounded-lg border border-gray-800 z-50">
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-4 py-2.5 text-white hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <AutoTranslate>{item.label}</AutoTranslate>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
