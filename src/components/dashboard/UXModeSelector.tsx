import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Sparkles, Zap, Settings, Save } from 'lucide-react';
import { UX_MODES } from '@/types/uxModes';
import { triggerAnnetteAction } from '@/components/assistant/AnnetteIntegration';

interface UXModeSelectorProps {
  currentMode: string;
  isAutoDetected: boolean;
  detectedMode: string;
  onModeChange: (mode: string, saveForJobType?: boolean) => void;
  availableModes: string[];
  className?: string;
}

export function UXModeSelector({ 
  currentMode, 
  isAutoDetected, 
  detectedMode,
  onModeChange, 
  availableModes,
  className = ''
}: UXModeSelectorProps) {
  const [showSaveOption, setShowSaveOption] = useState(false);

  const currentModeDefinition = UX_MODES[currentMode];

  const handleModeSelect = (modeId: string) => {
    const selectedMode = UX_MODES[modeId];
    
    // Trigger Annette voice line for mode switch
    if (selectedMode && modeId !== currentMode) {
      triggerAnnetteAction('ux_mode_switch', {
        newMode: selectedMode.name,
        voiceLine: selectedMode.annetteVoiceLine
      });
    }

    onModeChange(modeId);
    setShowSaveOption(modeId !== 'auto' && modeId !== currentMode);
  };

  const handleSaveForJobType = () => {
    onModeChange(currentMode, true);
    setShowSaveOption(false);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">Display Mode:</span>
            <span className="text-foreground/80">
              {currentModeDefinition?.name || 'Auto'}
            </span>
            {isAutoDetected && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                Auto
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64 bg-background/95 backdrop-blur-sm">
          <DropdownMenuLabel className="text-sm font-medium">
            Choose Display Mode
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => handleModeSelect('auto')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Zap className="h-4 w-4 text-blue-500" />
            <div className="flex-1">
              <div className="font-medium">Auto (detect from jobs)</div>
              <div className="text-xs text-muted-foreground">
                Currently: {UX_MODES[detectedMode]?.name || 'Route Hero'}
              </div>
            </div>
            {isAutoDetected && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {availableModes.map(modeId => {
            const mode = UX_MODES[modeId];
            if (!mode) return null;
            
            const isSelected = currentMode === modeId && !isAutoDetected;
            
            return (
              <DropdownMenuItem
                key={modeId}
                onClick={() => handleModeSelect(modeId)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">{mode.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {mode.applicableTo.slice(0, 3).join(', ')}
                    {mode.applicableTo.length > 3 && '...'}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </DropdownMenuItem>
            );
          })}
          
          {showSaveOption && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSaveForJobType}
                className="flex items-center gap-2 cursor-pointer text-primary"
              >
                <Save className="h-4 w-4" />
                <div className="font-medium">Save this mode for this job type</div>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {currentModeDefinition && (
        <div className="text-sm text-muted-foreground hidden md:block">
          {currentModeDefinition.features.length} features active
        </div>
      )}
    </div>
  );
}