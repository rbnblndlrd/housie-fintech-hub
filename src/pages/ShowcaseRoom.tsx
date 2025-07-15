import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useShowcaseSettings } from '@/hooks/useShowcaseSettings';
import { useFusionStamps } from '@/hooks/useFusionStamps';
import { useStamps } from '@/hooks/useStamps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Eye, EyeOff, Crown, Sparkles, Map, Radio } from 'lucide-react';
import { ShowcaseCard } from '@/components/showcase/ShowcaseCard';
import { RoomBuilder } from '@/components/showcase/RoomBuilder';
import { CanonAuraEffect } from '@/components/showcase/CanonAuraEffect';
import { SeasonalTimeline } from '@/components/seasonal/SeasonalTimeline';

export default function ShowcaseRoom() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // For now, we'll use the current user's ID - in production, you'd resolve username to userId
  const targetUserId = user?.id;
  const isOwnRoom = targetUserId === user?.id;

  const { settings, loading: settingsLoading } = useShowcaseSettings(targetUserId);
  const { userFusionStamps, loading: fusionLoading } = useFusionStamps();
  const { stamps: userStamps, loading: stampsLoading } = useStamps();

  const loading = settingsLoading || fusionLoading || stampsLoading;

  const featuredStamps = userStamps.filter(stamp => 
    settings?.featured_stamp_ids.includes(stamp.stamp?.id || '')
  );

  const fusionStampsCount = userFusionStamps.filter(fs => fs.is_equipped).length;
  const hasCanonAura = fusionStampsCount >= 5;

  if (loading) {
    return (
      <div className="min-h-screen bg-black/95 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-muted/20 rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted/20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!settings?.is_public && !isOwnRoom) {
    return (
      <div className="min-h-screen bg-black/95 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <EyeOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Private Showcase</h2>
            <p className="text-muted-foreground">
              This showcase room is private and cannot be viewed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      settings?.room_theme === 'dark' ? 'bg-black/95' : 
      settings?.room_theme === 'pulse' ? 'bg-gradient-to-br from-black via-primary/10 to-black' :
      'bg-gradient-to-br from-background via-muted/5 to-background'
    }`}>
      {/* Header with Canon Aura */}
      <div className="relative border-b border-border/20 bg-card/10 backdrop-blur-sm">
        {hasCanonAura && <CanonAuraEffect />}
        
        <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center ${
                  hasCanonAura ? 'ring-4 ring-primary/30 ring-offset-4 ring-offset-background' : ''
                }`}>
                  <Crown className="h-8 w-8 text-white" />
                </div>
                {hasCanonAura && (
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                      Canon Guardian
                    </Badge>
                  </div>
                )}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {settings?.room_title || 'Achievement Gallery'}
                </h1>
                <p className="text-muted-foreground">
                  {username && `@${username}`} • Prestige Showcase
                </p>
                
                {settings?.annette_intro_line && (
                  <div className="mt-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm italic text-primary">
                      "{settings.annette_intro_line}"
                    </p>
                    <p className="text-xs text-primary/70 mt-1">— Annette</p>
                  </div>
                )}
              </div>
            </div>

            {isOwnRoom && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBuilderMode(!isBuilderMode)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isBuilderMode ? 'Exit Builder' : 'Edit Room'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {isBuilderMode && isOwnRoom ? (
          <RoomBuilder settings={settings} />
        ) : (
          <div className="space-y-8">
            {/* Featured Stamps Section */}
            {featuredStamps.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Featured Stamps
                </h2>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {featuredStamps.map((userStamp) => (
                    <ShowcaseCard 
                      key={userStamp.id}
                      type="stamp"
                      data={userStamp}
                      theme={settings?.room_theme}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Fusion Stamps Section */}
            {userFusionStamps.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Fusion Stamps
                  {hasCanonAura && (
                    <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500 ml-2">
                      Canon Aura Active
                    </Badge>
                  )}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userFusionStamps.map((fusionStamp) => (
                    <ShowcaseCard 
                      key={fusionStamp.id}
                      type="fusion"
                      data={fusionStamp}
                      theme={settings?.room_theme}
                      hasCanonAura={hasCanonAura}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Drop Points & Imprints Gallery */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Map className="h-5 w-5 text-blue-500" />
                Geographic Imprints
              </h2>
              <Card className="bg-card/30 border-border/20">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Geographic stamp locations and drop point discoveries will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Seasonal Canon Timeline */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Radio className="h-5 w-5 text-green-500" />
                Temporal Canon Timeline
              </h2>
              <SeasonalTimeline
                userId={username}
                stamps={userStamps}
                fusionTitles={userFusionStamps}
                imprints={[]}
              />
            </section>
          </div>
        )}
      </div>

      {/* Privacy Badge */}
      {!settings?.is_public && isOwnRoom && (
        <div className="fixed bottom-4 right-4">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            <EyeOff className="h-3 w-3 mr-1" />
            Private Room
          </Badge>
        </div>
      )}
    </div>
  );
}