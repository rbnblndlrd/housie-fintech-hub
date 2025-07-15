import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Zap, Radio } from 'lucide-react';
import { useSeasonalData } from '@/hooks/useSeasonalData';

export function SeasonalDashboard() {
  const {
    currentSeason,
    getCurrentSeasonStats,
    getCurrentSeasonTitles,
    getUserTitleProgress,
    getSeasonThemeIcon,
    getSeasonThemeColor,
    loading
  } = useSeasonalData();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentSeason) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No active season currently</p>
        </CardContent>
      </Card>
    );
  }

  const stats = getCurrentSeasonStats();
  const seasonTitles = getCurrentSeasonTitles();
  const themeIcon = getSeasonThemeIcon(currentSeason.theme);
  const themeGradient = getSeasonThemeColor(currentSeason.theme);

  return (
    <div className="space-y-6">
      {/* Season Header */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${themeGradient} opacity-10`} />
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{themeIcon}</span>
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentSeason.name}
                <Badge variant="secondary" className="bg-background/50">
                  Active
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(currentSeason.start_date).toLocaleDateString()} - {new Date(currentSeason.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Season Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{stats.stamps_earned}</div>
              <div className="text-xs text-muted-foreground">Stamps Earned</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.canon_earned}</div>
              <div className="text-xs text-muted-foreground">Canon Events</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Badge className="w-6 h-6 p-0 mx-auto mb-2 bg-purple-500" />
              <div className="text-2xl font-bold">{stats.fusion_titles_earned}</div>
              <div className="text-xs text-muted-foreground">Fusion Titles</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Radio className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.broadcasts_triggered}</div>
              <div className="text-xs text-muted-foreground">Echoes Sent</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Seasonal Titles Progress */}
      {seasonTitles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Titles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {seasonTitles.map((title) => {
              const progress = getUserTitleProgress(title.title_id);
              const requirements = typeof title.requirements === 'object' && title.requirements !== null 
                ? title.requirements as Record<string, any> 
                : {};
              const isCompleted = progress?.completed_at !== null;
              
              // Calculate progress percentage (simplified)
              let progressPercent = 0;
              if (stats && requirements.min_stamps) {
                progressPercent = Math.min(100, (stats.stamps_earned / requirements.min_stamps) * 100);
              }

              return (
                <div key={title.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{title.icon}</span>
                      <div>
                        <div className="font-semibold">{title.name}</div>
                        <div className="text-xs text-muted-foreground">{title.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isCompleted ? "default" : "secondary"}>
                        {isCompleted ? "Earned" : "In Progress"}
                      </Badge>
                      {progress?.equipped && (
                        <Badge variant="outline">Equipped</Badge>
                      )}
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <div className="space-y-1">
                      <Progress value={progressPercent} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {requirements.min_stamps && `${stats?.stamps_earned || 0}/${requirements.min_stamps} stamps`}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Annette Voice Line */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold">A</span>
            </div>
            <div className="text-sm italic">
              "New Canon season started: {currentSeason.name}. Let's see what you stamp this time around."
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}