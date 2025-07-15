import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { useSeasonalData } from '@/hooks/useSeasonalData';
import CanonTimeline from '@/components/canon/CanonTimeline';

interface SeasonalTimelineProps {
  userId: string;
  stamps: any[];
  fusionTitles: any[];
  imprints: any[];
}

export function SeasonalTimeline({ userId, stamps, fusionTitles, imprints }: SeasonalTimelineProps) {
  const { allSeasons, currentSeason, getSeasonThemeIcon, getSeasonThemeColor } = useSeasonalData();
  const [selectedSeason, setSelectedSeason] = useState<string>('current');

  // Filter events by season
  const filterEventsBySeason = (events: any[], seasonId: string) => {
    if (seasonId === 'lifetime') return events;
    if (seasonId === 'current' && currentSeason) {
      return events.filter(event => {
        const eventDate = new Date(event.created_at || event.timestamp);
        const seasonStart = new Date(currentSeason.start_date);
        const seasonEnd = new Date(currentSeason.end_date);
        return eventDate >= seasonStart && eventDate <= seasonEnd;
      });
    }
    
    const season = allSeasons.find(s => s.id === seasonId);
    if (!season) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.created_at || event.timestamp);
      const seasonStart = new Date(season.start_date);
      const seasonEnd = new Date(season.end_date);
      return eventDate >= seasonStart && eventDate <= seasonEnd;
    });
  };

  const getFilteredData = (seasonId: string) => {
    return {
      stamps: filterEventsBySeason(stamps, seasonId),
      fusionTitles: filterEventsBySeason(fusionTitles, seasonId),
      imprints: filterEventsBySeason(imprints, seasonId)
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Temporal Canon Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedSeason} onValueChange={setSelectedSeason} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="current" className="flex items-center gap-2">
              {currentSeason && getSeasonThemeIcon(currentSeason.theme)}
              Current Season
            </TabsTrigger>
            <TabsTrigger value="lifetime">
              <Calendar className="w-4 h-4 mr-2" />
              Lifetime View
            </TabsTrigger>
            {allSeasons.slice(0, 2).map((season) => (
              <TabsTrigger 
                key={season.id} 
                value={season.id}
                className="flex items-center gap-2"
              >
                {getSeasonThemeIcon(season.theme)}
                <span className="hidden sm:inline">{season.name}</span>
                <span className="sm:hidden">{season.theme}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="current" className="mt-6">
            {currentSeason ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getSeasonThemeIcon(currentSeason.theme)}</span>
                    <h3 className="font-semibold">{currentSeason.name}</h3>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(currentSeason.start_date).toLocaleDateString()} - {new Date(currentSeason.end_date).toLocaleDateString()}
                  </div>
                </div>
                <CanonTimeline 
                  userId={userId}
                  {...getFilteredData('current')}
                  limit={50}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No active season currently
              </div>
            )}
          </TabsContent>

          <TabsContent value="lifetime" className="mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Complete Canon History</h3>
              <CanonTimeline 
                userId={userId}
                stamps={stamps}
                fusionTitles={fusionTitles}
                imprints={imprints}
                limit={100}
              />
            </div>
          </TabsContent>

          {allSeasons.map((season) => (
            <TabsContent key={season.id} value={season.id} className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getSeasonThemeIcon(season.theme)}</span>
                    <h3 className="font-semibold">{season.name}</h3>
                    <Badge variant={season.active ? "default" : "secondary"}>
                      {season.active ? "Active" : "Completed"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(season.start_date).toLocaleDateString()} - {new Date(season.end_date).toLocaleDateString()}
                  </div>
                </div>
                <CanonTimeline 
                  userId={userId}
                  {...getFilteredData(season.id)}
                  limit={50}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}