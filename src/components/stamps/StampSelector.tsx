import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStampDefinitions, type StampDefinition } from '@/hooks/useStampDefinitions';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Sparkles, Shield, Crown, Diamond } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface StampSelectorProps {
  eventId: string;
  eventType?: string;
  eventTitle?: string;
  onStampAssigned?: (stamp: any) => void;
  children?: React.ReactNode;
}

export const StampSelector: React.FC<StampSelectorProps> = ({ 
  eventId, 
  eventType = 'broadcast_custom',
  eventTitle = '',
  onStampAssigned,
  children 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { stamps, assignStampToEvent } = useStampDefinitions();
  const { user } = useAuth();

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-3 h-3" />;
      case 'unique': return <Diamond className="w-3 h-3" />;
      case 'rare': return <Sparkles className="w-3 h-3" />;
      default: return <Shield className="w-3 h-3" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'unique': return 'text-purple-600 border-purple-200 bg-purple-50';
      case 'rare': return 'text-blue-600 border-blue-200 bg-blue-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const handleStampSelect = async (stamp: StampDefinition) => {
    if (!user) {
      toast.error('Please sign in to assign stamps');
      return;
    }

    setLoading(true);
    try {
      const result = await assignStampToEvent(stamp.id, eventId);
      toast.success(`Assigned "${stamp.name}" stamp to event`);
      
      // Trigger Annette commentary for rare/legendary stamps
      if (['rare', 'legendary', 'unique'].includes(stamp.rarity)) {
        try {
          await supabase.functions.invoke('stamp-commentary', {
            body: {
              eventId,
              stampName: stamp.name,
              stampRarity: stamp.rarity,
              stampEmotionFlavor: stamp.emotion_flavor,
              eventType,
              eventTitle
            }
          });
        } catch (commentaryError) {
          console.error('Failed to generate Annette commentary:', commentaryError);
          // Don't show error to user - stamp assignment succeeded
        }
      }
      
      onStampAssigned?.(result);
      setOpen(false);
    } catch (error: any) {
      if (error.message?.includes('duplicate key')) {
        toast.error('This stamp is already assigned to this event');
      } else {
        toast.error('Failed to assign stamp');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Stamp
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Assign Stamp of Legend
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <div className="space-y-3">
            {stamps.map((stamp) => (
              <div
                key={stamp.id}
                className={`p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all ${getRarityColor(stamp.rarity)}`}
                onClick={() => handleStampSelect(stamp)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{stamp.icon_url}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{stamp.name}</h3>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        {getRarityIcon(stamp.rarity)}
                        {stamp.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {stamp.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {stamp.emotion_flavor}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {loading && (
          <div className="text-center text-sm text-muted-foreground py-4">
            Assigning stamp...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};