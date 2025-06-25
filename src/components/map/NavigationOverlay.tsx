
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation, Volume2, VolumeX, Plus, X } from 'lucide-react';

interface NavigationOverlayProps {
  isNavigationMode: boolean;
  onToggleNavigation: () => void;
  currentStreet?: string;
  distanceToTurn?: string;
  nextInstruction?: string;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

const NavigationOverlay: React.FC<NavigationOverlayProps> = ({
  isNavigationMode,
  onToggleNavigation,
  currentStreet = "Rue Saint-Catherine",
  distanceToTurn = "0.2km",
  nextInstruction = "Turn right onto Boulevard Saint-Laurent",
  voiceEnabled,
  onToggleVoice
}) => {
  if (!isNavigationMode) {
    return (
      <div className="absolute top-4 right-4 z-30">
        <Button
          onClick={onToggleNavigation}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 shadow-lg"
        >
          <Navigation className="mr-2 h-4 w-4" />
          Navigation Mode
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Turn-by-turn banner */}
      <div className="absolute top-0 left-0 right-0 pointer-events-auto">
        <Card className="mx-4 mt-4 bg-blue-900/95 backdrop-blur-sm border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex-1">
                <div className="text-2xl font-bold mb-1">{currentStreet}</div>
                <div className="text-lg opacity-90">{nextInstruction}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400">{distanceToTurn}</div>
                <div className="text-sm opacity-75">to turn</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto">
        <Button
          onClick={onToggleVoice}
          variant={voiceEnabled ? "default" : "outline"}
          size="sm"
          className="bg-white/90 hover:bg-white text-gray-900"
        >
          {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 hover:bg-white text-gray-900"
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={onToggleNavigation}
          variant="destructive"
          size="sm"
          className="bg-red-600 hover:bg-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NavigationOverlay;
