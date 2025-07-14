// Context-Aware Revollver™ Intelligence Demo Component
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Target, 
  Sparkles, 
  Trophy, 
  Clock, 
  MapPin,
  Zap
} from 'lucide-react';
import { getCanonContext, generateContextAwareResponse, type UserContext } from '@/utils/contextAwareEngine';
import { getClipDefinition, enhancedClipDefinitions } from '@/types/clipDefinitions';
import { getCanonInsightStats } from '@/utils/annetteCanonLog';

export const ContextAwareDemo: React.FC = () => {
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [demoResults, setDemoResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canonStats, setCanonStats] = useState<any>(null);

  useEffect(() => {
    loadUserContext();
    loadCanonStats();
  }, []);

  const loadUserContext = async () => {
    try {
      const context = await getCanonContext();
      setUserContext(context);
    } catch (error) {
      console.error('Error loading context:', error);
    }
  };

  const loadCanonStats = async () => {
    try {
      const stats = await getCanonInsightStats();
      setCanonStats(stats);
    } catch (error) {
      console.error('Error loading Canon stats:', error);
    }
  };

  const runContextDemo = async () => {
    if (!userContext) return;
    
    setIsLoading(true);
    const results = [];

    // Test different clips with current context
    const testClips = [
      'parse-ticket',
      'optimize-route', 
      'check-prestige',
      'suggest-provider',
      'scan-crew-potential'
    ];

    for (const clipId of testClips) {
      const clipDef = getClipDefinition(clipId);
      if (clipDef) {
        const response = await generateContextAwareResponse(
          clipDef.action,
          clipDef.defaultLine,
          userContext,
          clipId
        );
        
        results.push({
          clipId,
          clipLabel: clipDef.label,
          defaultLine: clipDef.defaultLine,
          contextAwareLine: response.voiceLine,
          canonStatus: response.flavorType,
          contextTags: response.contextTags,
          wasEnhanced: response.voiceLine !== clipDef.defaultLine
        });
      }
    }

    setDemoResults(results);
    setIsLoading(false);
  };

  if (!userContext) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Context-Aware Revollver™ Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading user context...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* Context Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Current User Context
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-sm font-medium">Prestige Rank</p>
            <p className="text-lg font-bold">{userContext.prestigeRank}</p>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-sm font-medium">Jobs Today</p>
            <p className="text-lg font-bold">{userContext.totalBookingsToday}</p>
          </div>
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm font-medium">Upcoming</p>
            <p className="text-lg font-bold">{userContext.upcomingSlots.length}</p>
          </div>
          <div className="text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-sm font-medium">Mode</p>
            <p className="text-lg font-bold capitalize">{userContext.userMode}</p>
          </div>
        </CardContent>
        
        {userContext.equippedTitle && (
          <>
            <Separator />
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {userContext.equippedTitle.icon} {userContext.equippedTitle.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Tier {userContext.equippedTitle.tier} • {userContext.equippedTitle.category}
                </span>
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {/* Canon Statistics */}
      {canonStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Canon Intelligence Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{canonStats.canonInsights}</div>
              <p className="text-sm text-muted-foreground">Canon Insights</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{canonStats.nonCanonInsights}</div>
              <p className="text-sm text-muted-foreground">Non-Canon</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(canonStats.canonRatio * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Canon Ratio</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{canonStats.totalInsights}</div>
              <p className="text-sm text-muted-foreground">Total Insights</p>
            </div>
          </CardContent>
          {canonStats.topContextTags.length > 0 && (
            <>
              <Separator />
              <CardContent className="pt-4">
                <p className="text-sm font-medium mb-2">Top Context Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {canonStats.topContextTags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </>
          )}
        </Card>
      )}

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Context-Aware Response Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runContextDemo} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Analyzing Context...' : 'Run Context-Aware Demo'}
          </Button>
        </CardContent>
      </Card>

      {/* Demo Results */}
      {demoResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Context-Aware Results</h3>
          {demoResults.map((result, index) => (
            <Card key={index} className={result.wasEnhanced ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{result.clipLabel}</CardTitle>
                  <div className="flex items-center gap-2">
                    {result.wasEnhanced && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Context Enhanced
                      </Badge>
                    )}
                    <Badge 
                      variant={result.canonStatus === 'canon' ? 'default' : 'secondary'}
                      className={result.canonStatus === 'canon' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                    >
                      {result.canonStatus === 'canon' ? '✅ Canon' : '🌀 Non-Canon'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Default Line:</p>
                  <p className="text-sm italic">"{result.defaultLine}"</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Context-Aware Line:</p>
                  <p className="text-sm font-medium">"{result.contextAwareLine}"</p>
                </div>
                {result.contextTags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Context Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {result.contextTags.map((tag: string, tagIndex: number) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};