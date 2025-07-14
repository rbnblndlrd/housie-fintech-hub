import React, { useState, useEffect } from 'react';
import { MapPin, Radar, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  useNearbyDropPoints, 
  useLogImprint, 
  useCurrentPosition,
  NearbyDropPoint 
} from '@/hooks/useDropPoints';
import { useAuth } from '@/contexts/AuthContext';

interface DropPointScannerProps {
  className?: string;
  onImprintLogged?: (result: any) => void;
}

export const DropPointScanner: React.FC<DropPointScannerProps> = ({ 
  className, 
  onImprintLogged 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyDrops, setNearbyDrops] = useState<NearbyDropPoint[]>([]);
  
  const { getCurrentPosition } = useCurrentPosition();
  const nearbyDropsMutation = useNearbyDropPoints();
  const logImprintMutation = useLogImprint();

  const scanForDropPoints = async () => {
    if (!user) return;
    
    setIsScanning(true);
    try {
      const position = await getCurrentPosition();
      setCurrentPosition(position);
      
      const nearby = await nearbyDropsMutation.mutateAsync(position);
      setNearbyDrops(nearby);
      
      if (nearby.length === 0) {
        toast({
          title: "📍 Scan Complete",
          description: "No drop points detected nearby",
        });
      } else {
        toast({
          title: "🎯 Drop Points Found",
          description: `Detected ${nearby.length} point${nearby.length > 1 ? 's' : ''} nearby`,
        });
      }
    } catch (error) {
      console.error('Scan failed:', error);
      toast({
        title: "Scan Failed",
        description: "Could not access location services",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const logVisitImprint = async (dropPoint: NearbyDropPoint) => {
    if (!user || !currentPosition) return;

    try {
      const result = await logImprintMutation.mutateAsync({
        userId: user.id,
        coordinates: currentPosition,
        actionType: 'visit',
        note: `Visited ${dropPoint.name} via Scanner`
      });

      onImprintLogged?.(result);
      
      // Update nearby drops to refresh distances
      const updated = await nearbyDropsMutation.mutateAsync(currentPosition);
      setNearbyDrops(updated);
    } catch (error) {
      console.error('Failed to log visit:', error);
    }
  };

  const getDropPointIcon = (type: string) => {
    switch (type) {
      case 'historic': return '🏛️';
      case 'event': return '🎉';
      case 'seasonal': return '❄️';
      default: return '🏘️';
    }
  };

  const getDistanceColor = (distance: number) => {
    if (distance <= 100) return 'bg-green-500/10 text-green-700 border-green-200';
    if (distance <= 300) return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    return 'bg-red-500/10 text-red-700 border-red-200';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radar className="h-5 w-5" />
          Drop Point Scanner
          {isScanning && (
            <div className="animate-spin">
              <Target className="h-4 w-4" />
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button 
          onClick={scanForDropPoints}
          disabled={isScanning || !user}
          className="w-full"
          variant={nearbyDrops.length > 0 ? "secondary" : "default"}
        >
          <Radar className="h-4 w-4 mr-2" />
          {isScanning ? 'Scanning...' : 'Scan for Drop Points'}
        </Button>

        {currentPosition && (
          <div className="text-xs text-muted-foreground text-center">
            📍 {currentPosition[1].toFixed(4)}, {currentPosition[0].toFixed(4)}
          </div>
        )}

        {nearbyDrops.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Nearby Points ({nearbyDrops.length})
            </h4>
            
            {nearbyDrops.map((dropPoint) => (
              <DropPointCard
                key={dropPoint.drop_point_id}
                dropPoint={dropPoint}
                onLogVisit={() => logVisitImprint(dropPoint)}
                isLogging={logImprintMutation.isPending}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DropPointCardProps {
  dropPoint: NearbyDropPoint;
  onLogVisit: () => void;
  isLogging: boolean;
}

const DropPointCard: React.FC<DropPointCardProps> = ({ 
  dropPoint, 
  onLogVisit, 
  isLogging 
}) => {
  const getDropPointIcon = (type: string) => {
    switch (type) {
      case 'historic': return '🏛️';
      case 'event': return '🎉';
      case 'seasonal': return '❄️';
      default: return '🏘️';
    }
  };

  const getDistanceColor = (distance: number) => {
    if (distance <= 100) return 'bg-green-500/10 text-green-700 border-green-200';
    if (distance <= 300) return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    return 'bg-red-500/10 text-red-700 border-red-200';
  };

  const isInRange = dropPoint.distance_m <= 500;

  return (
    <div className="border border-border/50 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getDropPointIcon(dropPoint.type)}</span>
          <div>
            <h5 className="font-medium text-sm">{dropPoint.name}</h5>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {dropPoint.type}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${getDistanceColor(dropPoint.distance_m)}`}
              >
                {Math.round(dropPoint.distance_m)}m away
              </Badge>
            </div>
          </div>
        </div>

        {isInRange && (
          <Button
            size="sm"
            variant="outline"
            onClick={onLogVisit}
            disabled={isLogging}
            className="shrink-0"
          >
            <Zap className="h-3 w-3 mr-1" />
            {isLogging ? 'Logging...' : 'Log Visit'}
          </Button>
        )}
      </div>

      {dropPoint.bonus_stamp_id && (
        <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
          ⭐ Bonus Stamp: {dropPoint.bonus_stamp_id}
        </div>
      )}

      {!isInRange && (
        <div className="text-xs text-muted-foreground">
          Move closer to log an imprint (within 500m)
        </div>
      )}
    </div>
  );
};