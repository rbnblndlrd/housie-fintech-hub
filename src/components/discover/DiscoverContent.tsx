import React from 'react';
import { Compass, Map, Radar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImprintTimeline } from '@/components/stamps/ImprintTimeline';
import { DropPointScanner } from '@/components/stamps/DropPointScanner';

export const DiscoverContent: React.FC = () => {
  const handleImprintLogged = (result: any) => {
    console.log('Imprint logged from discover:', result);
    // Could trigger animations, sounds, or other effects here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Compass className="h-6 w-6" />
          Discover & Explore
        </h2>
        <p className="text-muted-foreground">
          Find drop points, log imprints, and explore the canon grid around you
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Drop Point Scanner */}
        <DropPointScanner onImprintLogged={handleImprintLogged} />

        {/* Quick Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Discovery Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">📍</div>
                <div className="text-sm font-medium">Drop Points</div>
                <div className="text-xs text-muted-foreground">Nearby zones</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">🎯</div>
                <div className="text-sm font-medium">Imprints</div>
                <div className="text-xs text-muted-foreground">Your marks</div>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Radar className="h-4 w-4" />
                <span>Use the scanner to find drop points and log imprints</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Imprint Timeline */}
      <ImprintTimeline />
    </div>
  );
};