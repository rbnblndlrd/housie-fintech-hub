import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useBroadcastBeacon } from '@/hooks/useBroadcastBeacon';
import { useCanonPreferences } from '@/hooks/useCanonPreferences';
import { Radio, Globe, MapPin, MessageSquare, TrendingUp } from 'lucide-react';

export const AnnetteTransmissionCenter = () => {
  const { echoes, loading } = useBroadcastBeacon();
  const { preferences } = useCanonPreferences();

  const globalEvents = echoes.filter(e => e.broadcast_range === 'global');
  const cityEvents = echoes.filter(e => e.broadcast_range === 'city');
  const localEvents = echoes.filter(e => e.broadcast_range === 'local');

  const getAnnetteGreeting = () => {
    const style = preferences?.voice_style || 'default';
    const time = new Date().getHours();
    
    let greeting = "Canon frequencies are active";
    
    if (time < 12) {
      switch (style) {
        case 'professional':
          greeting = "Good morning. Canon systems online.";
          break;
        case 'warm':
          greeting = "Good morning, friend. The Canon grid is buzzing today.";
          break;
        case 'sassy':
          greeting = "Rise and grind, sugar! Canon signals are lighting up the board.";
          break;
        case 'softspoken':
          greeting = "Morning. Canon transmissions are coming through clearly.";
          break;
        default:
          greeting = "Well, well! Look who's tuning into the Canon frequency this morning.";
      }
    } else if (time < 18) {
      switch (style) {
        case 'professional':
          greeting = "Afternoon status: Canon operations running smoothly.";
          break;
        case 'warm':
          greeting = "Good afternoon! The Canon network is quite active today.";
          break;
        case 'sassy':
          greeting = "Afternoon check-in, baby! The Canon grid is absolutely humming.";
          break;
        case 'softspoken':
          greeting = "Afternoon. Canon signals are strong and clear.";
          break;
        default:
          greeting = "Afternoon transmission! The Canon network is alive and kicking.";
      }
    } else {
      switch (style) {
        case 'professional':
          greeting = "Evening report: Canon transmissions remain active.";
          break;
        case 'warm':
          greeting = "Good evening! Canon events are still flowing in.";
          break;
        case 'sassy':
          greeting = "Evening vibes! The Canon grid never sleeps, honey.";
          break;
        case 'softspoken':
          greeting = "Evening. Canon frequencies remain stable.";
          break;
        default:
          greeting = "Evening broadcast! Canon signals coming in loud and clear.";
      }
    }
    
    return greeting;
  };

  const getTransmissionSummary = () => {
    const style = preferences?.voice_style || 'default';
    const total = echoes.length;
    
    if (total === 0) {
      switch (style) {
        case 'professional':
          return "No Canon events detected in current monitoring period.";
        case 'warm':
          return "Things are quiet on the Canon front right now.";
        case 'sassy':
          return "Radio silence on the Canon channels. Someone wake up Montreal!";
        case 'softspoken':
          return "The Canon grid is peaceful at the moment.";
        default:
          return "The Canon airwaves are suspiciously quiet. Too quiet...";
      }
    }
    
    switch (style) {
      case 'professional':
        return `${total} Canon events logged across all transmission ranges.`;
      case 'warm':
        return `${total} Canon achievements are brightening up the network today.`;
      case 'sassy':
        return `${total} Canon events and counting! Someone's been busy, sugar.`;
      case 'softspoken':
        return `${total} Canon transmissions recorded across the network.`;
      default:
        return `${total} Canon signals detected! The grid is absolutely buzzing today.`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 animate-pulse" />
            Annette Transmission Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="relative">
            <Radio className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          Annette Transmission Center
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Live from the HOUSIE Canon grid
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Annette's Greeting */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📡</div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Annette Broadcasting:</p>
              <p className="text-sm italic">"{getAnnetteGreeting()}"</p>
            </div>
          </div>
        </div>

        {/* Transmission Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Network Status
          </h4>
          <p className="text-sm text-muted-foreground">
            {getTransmissionSummary()}
          </p>
        </div>

        <Separator />

        {/* Range Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Global Signals</span>
              <Badge variant="outline">{globalEvents.length}</Badge>
            </div>
            {globalEvents.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Grid-wide transmissions detected
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">City Broadcasts</span>
              <Badge variant="outline">{cityEvents.length}</Badge>
            </div>
            {cityEvents.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Montreal-wide activity
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Local Echoes</span>
              <Badge variant="outline">{localEvents.length}</Badge>
            </div>
            {localEvents.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Neighborhood signals
              </p>
            )}
          </div>
        </div>

        {echoes.length > 0 && (
          <>
            <Separator />
            
            {/* Latest Transmission */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Latest Transmission
              </h4>
              
              {echoes[0] && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {echoes[0].broadcast_range === 'global' ? '🌍' : 
                       echoes[0].broadcast_range === 'city' ? '🏙️' : '📍'}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {echoes[0].broadcast_range}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(echoes[0].created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">
                    {echoes[0].message}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Tune In Button */}
        <Button className="w-full" variant="outline">
          <Radio className="h-4 w-4 mr-2" />
          Tune into Full Canon Feed
        </Button>
      </CardContent>
    </Card>
  );
};