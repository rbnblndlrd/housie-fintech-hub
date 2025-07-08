
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
// import { useMapTheme } from '@/hooks/useMapTheme'; // Removed with Google Maps

const MapThemeSelector: React.FC = () => {
  // Theme selector disabled - Google Maps removed
  return (
    <Button
      variant="outline"
      size="sm"
      disabled
      className="bg-white/60 text-gray-500 border-2 border-gray-300 min-w-[100px] justify-center font-medium pointer-events-none opacity-50"
    >
      <Sun className="h-4 w-4 mr-2" />
      <span>Theme</span>
    </Button>
  );
};

export default MapThemeSelector;
