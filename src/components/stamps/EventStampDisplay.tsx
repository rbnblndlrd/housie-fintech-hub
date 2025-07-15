import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStampDefinitions, type StampUsage } from '@/hooks/useStampDefinitions';
import { useAuth } from '@/contexts/AuthContext';
import { X, Crown, Diamond, Sparkles, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface EventStampDisplayProps {
  eventId: string;
  eventUserId: string;
  compact?: boolean;
  showAddButton?: boolean;
  onStampRemoved?: () => void;
}

export const EventStampDisplay: React.FC<EventStampDisplayProps> = ({
  eventId,
  eventUserId,
  compact = false,
  showAddButton = false,
  onStampRemoved
}) => {
  const [eventStamps, setEventStamps] = useState<StampUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const { getStampsForEvent, removeStampFromEvent } = useStampDefinitions();
  const { user } = useAuth();

  const canRemoveStamp = (stamp: StampUsage) => {
    return user && (user.id === eventUserId || user.id === stamp.assigned_by);
  };

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
      case 'legendary': return 'border-yellow-300 bg-yellow-50 text-yellow-800';
      case 'unique': return 'border-purple-300 bg-purple-50 text-purple-800';
      case 'rare': return 'border-blue-300 bg-blue-50 text-blue-800';
      default: return 'border-gray-300 bg-gray-50 text-gray-800';
    }
  };

  const fetchEventStamps = async () => {
    try {
      const stamps = await getStampsForEvent(eventId);
      setEventStamps(stamps);
    } catch (error) {
      console.error('Error fetching event stamps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStamp = async (stampUsageId: string) => {
    try {
      await removeStampFromEvent(stampUsageId);
      toast.success('Stamp removed');
      setEventStamps(prev => prev.filter(s => s.id !== stampUsageId));
      onStampRemoved?.();
    } catch (error) {
      toast.error('Failed to remove stamp');
    }
  };

  useEffect(() => {
    fetchEventStamps();
  }, [eventId]);

  if (loading) {
    return <div className="text-xs text-muted-foreground">Loading stamps...</div>;
  }

  if (eventStamps.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {eventStamps.map((stampUsage) => (
          <div
            key={stampUsage.id}
            className="flex items-center gap-1 group relative"
            title={`${stampUsage.stamp_definitions?.name} - ${stampUsage.stamp_definitions?.emotion_flavor}`}
          >
            <span className="text-sm">{stampUsage.stamp_definitions?.icon_url}</span>
            {getRarityIcon(stampUsage.stamp_definitions?.rarity || 'common')}
            {canRemoveStamp(stampUsage) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveStamp(stampUsage.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground">Stamps of Legend</div>
      <div className="flex flex-wrap gap-2">
        {eventStamps.map((stampUsage) => (
          <Badge
            key={stampUsage.id}
            variant="outline"
            className={`flex items-center gap-1 pr-1 ${getRarityColor(
              stampUsage.stamp_definitions?.rarity || 'common'
            )}`}
          >
            <span>{stampUsage.stamp_definitions?.icon_url}</span>
            <span className="text-xs">{stampUsage.stamp_definitions?.name}</span>
            {getRarityIcon(stampUsage.stamp_definitions?.rarity || 'common')}
            {canRemoveStamp(stampUsage) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveStamp(stampUsage.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};