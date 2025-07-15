import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingDown } from 'lucide-react';
import { useSeasonalData } from '@/hooks/useSeasonalData';

export function SeasonalLeaderboard() {
  const { 
    currentSeason, 
    allSeasons, 
    getSeasonThemeIcon, 
    getSeasonThemeColor,
    loading 
  } = useSeasonalData();
  const [selectedView, setSelectedView] = useState<string>('current');

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Canon Leaderboards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current" className="flex items-center gap-2">
              {currentSeason && getSeasonThemeIcon(currentSeason.theme)}
              Current Season
            </TabsTrigger>
            <TabsTrigger value="past">Past Seasons</TabsTrigger>
            <TabsTrigger value="lifetime">Lifetime View</TabsTrigger>
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
                </div>
                
                {/* Placeholder for current season leaderboard */}
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-4">
                    Season ends: {new Date(currentSeason.end_date).toLocaleDateString()}
                  </div>
                  
                  {/* Mock leaderboard entries */}
                  {[
                    { rank: 1, name: "Alexis Chen", score: 247, trend: "up" },
                    { rank: 2, name: "Marcus Rodriguez", score: 189, trend: "steady" },
                    { rank: 3, name: "Sarah Kim", score: 156, trend: "down" },
                    { rank: 4, name: "You", score: 89, trend: "up", isCurrentUser: true },
                    { rank: 5, name: "David Thompson", score: 78, trend: "up" }
                  ].map((entry) => (
                    <div 
                      key={entry.rank} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.isCurrentUser ? 'bg-primary/5 border-primary/20' : 'bg-background'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          entry.rank === 1 ? 'bg-yellow-500 text-white' :
                          entry.rank === 2 ? 'bg-gray-400 text-white' :
                          entry.rank === 3 ? 'bg-orange-500 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {entry.rank}
                        </div>
                        <div>
                          <div className="font-medium">{entry.name}</div>
                          {entry.isCurrentUser && (
                            <div className="text-xs text-muted-foreground">That's you!</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{entry.score}</div>
                        {entry.trend === "down" && (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground text-center pt-4">
                  Rankings update every 6 hours based on Canon activity
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No active season currently
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Previous Seasons</h3>
              <div className="grid gap-4">
                {allSeasons.filter(season => !season.active).map((season) => (
                  <Card key={season.id} className="relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${getSeasonThemeColor(season.theme)} opacity-5`} />
                    <CardContent className="p-4 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getSeasonThemeIcon(season.theme)}</span>
                          <div>
                            <div className="font-medium">{season.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(season.start_date).toLocaleDateString()} - {new Date(season.end_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lifetime" className="mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold">All-Time Canon Leaders</h3>
              <div className="text-sm text-muted-foreground">
                Combined rankings across all seasons and activities
              </div>
              
              {/* Placeholder for lifetime leaderboard */}
              <div className="space-y-2">
                {[
                  { rank: 1, name: "Canon Legend", score: 1547, seasons: 8 },
                  { rank: 2, name: "Echo Master", score: 1289, seasons: 6 },
                  { rank: 3, name: "Prestige Elite", score: 1156, seasons: 7 },
                ].map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-3 rounded-lg border bg-background">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-xs text-muted-foreground">{entry.seasons} seasons</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{entry.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}