import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, GripVertical, Trash2, Volume2, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClipPreference } from '@/hooks/useClipPreferences';

interface ClipAction {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  voiceLine: string;
  action: string;
}

interface ClipManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: ClipPreference[];
  allClips: ClipAction[];
  onToggleFavorite: (clipId: string) => void;
  onUpdateOrder: (clipId: string, newOrderIndex: number) => void;
  isFavorited: (clipId: string) => boolean;
}

export const ClipManagerModal: React.FC<ClipManagerModalProps> = ({
  isOpen,
  onClose,
  favorites,
  allClips,
  onToggleFavorite,
  onUpdateOrder,
  isFavorited
}) => {
  const [playingVoiceLine, setPlayingVoiceLine] = useState<string | null>(null);

  const moveClip = (clipId: string, direction: 'up' | 'down') => {
    const currentIndex = favorites.findIndex(f => f.clip_id === clipId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= favorites.length) return;

    onUpdateOrder(clipId, newIndex);
  };

  const playVoiceLine = (clipId: string, voiceLine: string) => {
    setPlayingVoiceLine(clipId);
    console.log(`🎤 Annette: "${voiceLine}"`);
    setTimeout(() => setPlayingVoiceLine(null), 3000);
  };

  const getFavoriteClips = () => {
    return favorites
      .map(fav => allClips.find(clip => clip.id === fav.clip_id))
      .filter(Boolean) as ClipAction[];
  };

  const getAvailableClips = () => {
    return allClips.filter(clip => !isFavorited(clip.id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Clip Manager
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-auto">
          {/* Favorited Clips */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">⭐️ Custom Cylinder</h3>
              <Badge variant="secondary">{favorites.length}/7</Badge>
            </div>

            <div className="space-y-2 min-h-[200px] bg-muted/30 rounded-lg p-4">
              {getFavoriteClips().map((clip, index) => (
                <div
                  key={clip.id}
                  className="bg-card border rounded-lg p-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveClip(clip.id, 'up')}
                        disabled={index === 0}
                        className="w-6 h-6 p-0"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveClip(clip.id, 'down')}
                        disabled={index === getFavoriteClips().length - 1}
                        className="w-6 h-6 p-0"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <clip.icon className="w-4 h-4 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-sm">{clip.label}</div>
                      <div className="text-xs text-muted-foreground italic">
                        "{clip.voiceLine}"
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playVoiceLine(clip.id, clip.voiceLine)}
                        className={cn(
                          "w-8 h-8 p-0",
                          playingVoiceLine === clip.id && "text-green-500"
                        )}
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onToggleFavorite(clip.id)}
                        className="w-8 h-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {favorites.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No favorite clips yet</p>
                  <p className="text-xs">Add clips from the available list</p>
                </div>
              )}
            </div>
          </div>

          {/* Available Clips */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">🎯 Available Clips</h3>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {getAvailableClips().map((clip) => (
                <div
                  key={clip.id}
                  className="bg-card border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <clip.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-sm">{clip.label}</div>
                      <div className="text-xs text-muted-foreground italic">
                        "{clip.voiceLine}"
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playVoiceLine(clip.id, clip.voiceLine)}
                        className={cn(
                          "w-8 h-8 p-0",
                          playingVoiceLine === clip.id && "text-green-500"
                        )}
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onToggleFavorite(clip.id)}
                        className="w-8 h-8 p-0 text-yellow-500 hover:text-yellow-600"
                        disabled={favorites.length >= 7}
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {favorites.length < 7 ? (
              `Add ${7 - favorites.length} more clips to fill your custom cylinder`
            ) : (
              "Custom cylinder is full! (7/7)"
            )}
          </div>
          
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};