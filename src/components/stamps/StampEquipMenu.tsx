import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEquippedStamps } from '@/hooks/useEquippedStamps';
import { useStamps } from '@/hooks/useStamps';
import { getStampDefinition } from '@/utils/stampDefinitions';
import { Star, StarOff } from 'lucide-react';
import { toast } from 'sonner';

export function StampEquipMenu() {
  const { stamps } = useStamps();
  const { equippedStamps, equipStamp, unequipStamp } = useEquippedStamps();

  const isStampEquipped = (stampId: string) => {
    return equippedStamps.some(eq => eq.stamp_id === stampId);
  };

  const getNextAvailablePosition = () => {
    for (let pos = 1; pos <= 3; pos++) {
      if (!equippedStamps.some(eq => eq.display_position === pos)) {
        return pos;
      }
    }
    return null;
  };

  const handleToggleEquip = async (stampId: string) => {
    const isEquipped = isStampEquipped(stampId);
    
    if (isEquipped) {
      const success = await unequipStamp(stampId);
      if (success) {
        toast.success('Stamp unequipped');
      } else {
        toast.error('Failed to unequip stamp');
      }
    } else {
      if (equippedStamps.length >= 3) {
        toast.error('You can only equip up to 3 stamps');
        return;
      }
      
      const position = getNextAvailablePosition();
      if (!position) {
        toast.error('No available positions');
        return;
      }
      
      const success = await equipStamp(stampId, position);
      if (success) {
        toast.success('Stamp equipped!');
      } else {
        toast.error('Failed to equip stamp');
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Manage Your Medal Display</h3>
          <Badge variant="outline">{equippedStamps.length}/3 Equipped</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Choose up to 3 stamps to display on your public profile. Equipped stamps influence Annette's responses!
        </p>

        <div className="grid gap-3">
          {stamps.map((userStamp) => {
            const stamp = userStamp.stamp;
            if (!stamp) return null;

            const stampDefinition = getStampDefinition(stamp.id);
            if (!stampDefinition) return null;

            const isEquipped = isStampEquipped(stamp.id);
            
            return (
              <div
                key={stamp.id}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${isEquipped 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-muted hover:border-muted-foreground/50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{stampDefinition.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{stampDefinition.title}</h4>
                        {stampDefinition.canonical && (
                          <Badge variant="secondary" className="text-xs">Canon</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{stampDefinition.description}</p>
                    </div>
                  </div>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isEquipped ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleEquip(stamp.id)}
                        disabled={!isEquipped && equippedStamps.length >= 3}
                      >
                        {isEquipped ? (
                          <>
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            Equipped
                          </>
                        ) : (
                          <>
                            <StarOff className="w-4 h-4 mr-1" />
                            Equip
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isEquipped 
                        ? 'Remove from profile display' 
                        : equippedStamps.length >= 3 
                          ? 'Unequip another stamp first' 
                          : 'Display on your profile'
                      }
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}