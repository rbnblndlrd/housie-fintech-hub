import React from 'react';
import { ServiceLayoutType } from '@/hooks/useServiceLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Scissors, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ServiceLayoutSelectorProps {
  currentLayout: ServiceLayoutType;
  detectedLayout: ServiceLayoutType;
  isManualOverride: boolean;
  onLayoutChange: (layout: ServiceLayoutType | null) => void;
  availableLayouts: ServiceLayoutType[];
  className?: string;
}

const layoutIcons = {
  cleaning: Sparkles,
  tattoo: Scissors,
  default: Monitor
};

const layoutNames = {
  cleaning: 'Cleaner Mode',
  tattoo: 'Tattoo Artist',
  default: 'Default View'
};

const ServiceLayoutSelector: React.FC<ServiceLayoutSelectorProps> = ({
  currentLayout,
  detectedLayout,
  isManualOverride,
  onLayoutChange,
  availableLayouts,
  className = ""
}) => {
  const CurrentIcon = layoutIcons[currentLayout];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Display Mode:</span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4" />
            {layoutNames[currentLayout]}
            {isManualOverride && (
              <span className="text-xs bg-primary/10 text-primary px-1 rounded">Manual</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Layout Presets</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => onLayoutChange(null)}
            className="flex items-center gap-2"
          >
            <Monitor className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Auto (detect from jobs)</div>
              <div className="text-xs text-muted-foreground">
                Currently: {layoutNames[detectedLayout]}
              </div>
            </div>
            {!isManualOverride && <span className="text-xs text-primary">Active</span>}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {availableLayouts.map((layout) => {
            const Icon = layoutIcons[layout];
            return (
              <DropdownMenuItem
                key={layout}
                onClick={() => onLayoutChange(layout)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{layoutNames[layout]}</span>
                {isManualOverride && currentLayout === layout && (
                  <span className="text-xs text-primary">Active</span>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Optional: Save preference toggle */}
      {isManualOverride && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-2">
            <div className="text-xs text-blue-700">
              Mode manually set. Will persist for this session.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceLayoutSelector;