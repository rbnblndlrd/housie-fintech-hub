import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEquippedStamps } from '@/hooks/useEquippedStamps';
import { format } from 'date-fns';

interface EquippedStampRowProps {
  userId: string;
  className?: string;
}

export function EquippedStampRow({ userId, className = '' }: EquippedStampRowProps) {
  const { equippedStamps, loading } = useEquippedStamps(userId);

  if (loading) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-12 h-12 bg-muted/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (equippedStamps.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className={`flex gap-2 ${className}`}>
        {equippedStamps.map((equippedStamp) => {
          const { definition } = equippedStamp;
          if (!definition) return null;

          return (
            <Tooltip key={equippedStamp.stamp_id}>
              <TooltipTrigger>
                <div className="relative group">
                  <div 
                    className={`
                      w-12 h-12 rounded-lg border-2 
                      flex items-center justify-center text-xl
                      transition-all duration-300 hover:scale-110
                      ${definition.canonical 
                        ? 'border-primary bg-primary/10 shadow-primary/20 shadow-lg' 
                        : 'border-muted-foreground/30 bg-muted/20'
                      }
                    `}
                  >
                    <span className="text-xl">{definition.icon}</span>
                    {definition.canonical && (
                      <div className="absolute -top-1 -right-1">
                        <Badge variant="secondary" className="h-4 w-4 p-0 text-[10px] rounded-full">
                          ✅
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {definition.canonical && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-primary-foreground/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </TooltipTrigger>
              
              <TooltipContent side="bottom" className="max-w-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{definition.title}</span>
                    {definition.canonical && <Badge variant="secondary" className="text-xs">Canon</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{definition.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Equipped: {format(new Date(equippedStamp.equipped_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}