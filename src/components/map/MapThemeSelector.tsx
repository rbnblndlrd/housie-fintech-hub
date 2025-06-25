
import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { useMapTheme } from '@/hooks/useMapTheme';

const MapThemeSelector: React.FC = () => {
  const { currentTheme, currentThemeConfig, cycleTheme } = useMapTheme();

  const handleThemeChange = () => {
    console.log('🎨 MapThemeSelector: Theme button clicked, current theme:', currentTheme);
    cycleTheme();
    console.log('🎨 MapThemeSelector: cycleTheme() called');
  };

  console.log('🎨 MapThemeSelector render:', { 
    currentTheme, 
    themeName: currentThemeConfig.name,
    hasStyles: !!currentThemeConfig.styles
  });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleThemeChange}
      className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-400 hover:border-gray-500 transition-all duration-200 min-w-[120px] justify-start font-medium pointer-events-auto"
    >
      <Palette className="h-4 w-4 mr-2 text-gray-900" />
      <span className="font-medium text-gray-900">Theme: {currentThemeConfig.name}</span>
    </Button>
  );
};

export default MapThemeSelector;
