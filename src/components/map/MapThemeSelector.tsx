
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useMapTheme } from '@/hooks/useMapTheme';

const MapThemeSelector: React.FC = () => {
  const { isDark, toggleLightDark } = useMapTheme();

  const handleThemeToggle = () => {
    console.log('🎨 MapThemeSelector: Theme toggle clicked, current isDark:', isDark);
    toggleLightDark();
  };

  console.log('🎨 MapThemeSelector render:', { isDark });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleThemeToggle}
      className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-400 hover:border-gray-500 transition-all duration-200 min-w-[100px] justify-center font-medium pointer-events-auto"
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 mr-2" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 mr-2" />
          <span>Dark</span>
        </>
      )}
    </Button>
  );
};

export default MapThemeSelector;
