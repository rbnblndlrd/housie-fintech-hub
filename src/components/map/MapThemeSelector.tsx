
import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { useMapTheme } from '@/hooks/useMapTheme';

const MapThemeSelector: React.FC = () => {
  const { currentThemeConfig, cycleTheme } = useMapTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycleTheme}
      className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white/95 transition-all duration-200 min-w-[120px] justify-start"
    >
      <Palette className="h-4 w-4 mr-2" />
      <span className="font-medium">Theme: {currentThemeConfig.name}</span>
    </Button>
  );
};

export default MapThemeSelector;
