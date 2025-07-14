import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StampImprint } from '@/utils/stampEngine';
import { Pin, PinOff, Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleImprintPin } from '@/utils/stampEngine';
import { toast } from 'sonner';

interface StampImprintFeedProps {
  imprints: StampImprint[];
  showPinnedOnly?: boolean;
  maxDisplay?: number;
  onImprintUpdate?: () => void;
}

const StampImprintFeed = ({ 
  imprints, 
  showPinnedOnly = false, 
  maxDisplay,
  onImprintUpdate
}: StampImprintFeedProps) => {
  const [loadingPin, setLoadingPin] = useState<string | null>(null);

  const filteredImprints = showPinnedOnly 
    ? imprints.filter(imprint => imprint.isPinned)
    : imprints;
    
  const displayImprints = maxDisplay 
    ? filteredImprints.slice(0, maxDisplay) 
    : filteredImprints;

  const handleTogglePin = async (imprintId: string, currentlyPinned: boolean) => {
    setLoadingPin(imprintId);
    try {
      const success = await toggleImprintPin(imprintId, !currentlyPinned);
      if (success) {
        toast.success(
          currentlyPinned ? 'Imprint unpinned' : 'Imprint pinned to profile'
        );
        onImprintUpdate?.();
      } else {
        toast.error('Failed to update imprint');
      }
    } catch (error) {
      toast.error('Failed to update imprint');
    } finally {
      setLoadingPin(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit'
    });
  };

  if (displayImprints.length === 0) {
    return (
      <Card className="fintech-metric-card">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="font-bold mb-2">
            {showPinnedOnly ? 'No Pinned Imprints' : 'No Imprints Yet'}
          </h3>
          <p className="text-sm opacity-70">
            {showPinnedOnly 
              ? 'Pin your favorite stamp moments to display them here.'
              : 'Stamp imprints will appear here as you earn achievements.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {displayImprints.map((imprint) => {
        const stamp = imprint.userStamp?.stamp;
        
        return (
          <Card key={imprint.id} className={cn(
            "fintech-metric-card transition-all",
            imprint.isPinned && "ring-2 ring-primary/20 bg-primary/5"
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {stamp && (
                    <div className="text-2xl">{stamp.icon}</div>
                  )}
                  <div>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <span>{stamp?.name || 'Unknown Stamp'}</span>
                      {imprint.isPinned && (
                        <Pin className="h-4 w-4 text-primary" />
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-sm opacity-70 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(imprint.createdAt)}</span>
                      <span>•</span>
                      <span>{formatTime(imprint.createdAt)}</span>
                      {imprint.location && (
                        <>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{imprint.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTogglePin(imprint.id, imprint.isPinned)}
                  disabled={loadingPin === imprint.id}
                  className="shrink-0"
                >
                  {imprint.isPinned ? (
                    <PinOff className="h-4 w-4" />
                  ) : (
                    <Pin className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-sm leading-relaxed font-medium">
                  {imprint.narrative}
                </p>
                
                {imprint.contextSummary && (
                  <p className="text-xs opacity-70 italic">
                    {imprint.contextSummary}
                  </p>
                )}
                
                {stamp && (
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {stamp.category}
                    </Badge>
                    <span className="text-xs opacity-60">
                      "{stamp.flavorText}"
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {maxDisplay && filteredImprints.length > maxDisplay && (
        <div className="text-center py-4">
          <Badge variant="outline">
            +{filteredImprints.length - maxDisplay} more imprints
          </Badge>
        </div>
      )}
    </div>
  );
};

export default StampImprintFeed;