// Stamp Tracker Widget - Display earned stamps with Canon badges
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStamps } from '@/hooks/useStamps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { triggerManualStampScan, type ScanResult } from '@/utils/canonStampScanner';
import { Scan, Award, Star, Clock, Users, Heart, Shield, Settings, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StampInspectorPanel } from './StampInspectorPanel';
import { BroadcastControlsCard } from './BroadcastControlsCard';

interface StampTrackerWidgetProps {
  className?: string;
  showBroadcastControls?: boolean;
}

export function StampTrackerWidget({ className, showBroadcastControls = false }: StampTrackerWidgetProps) {
  const { user } = useAuth();
  const { stamps, stats, loading, refreshStamps } = useStamps();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);

  const handleManualScan = async () => {
    if (!user?.id) return;

    setScanning(true);
    try {
      const result = await triggerManualStampScan(user.id);
      setLastScanResult(result);
      
      if (result.awardedStamps.length > 0) {
        toast({
          title: "🏆 New Stamps Earned!",
          description: `Awarded ${result.awardedStamps.length} stamp(s). ${result.annetteResponse}`,
          duration: 5000,
        });
        refreshStamps();
      } else {
        toast({
          title: "🔍 Scan Complete",
          description: "No new stamps available right now. Keep up the great work!",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Manual scan error:', error);
      toast({
        title: "❌ Scan Failed",
        description: "Unable to scan for stamps. Please try again.",
        variant: "destructive",
      });
    } finally {
      setScanning(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Performance': return <Star className="h-4 w-4" />;
      case 'Loyalty': return <Heart className="h-4 w-4" />;
      case 'Crew': return <Users className="h-4 w-4" />;
      case 'Behavior': return <Clock className="h-4 w-4" />;
      case 'Reputation': return <Shield className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getCanonBadge = (canonLevel: string) => {
    return canonLevel === 'canon' ? (
      <Badge variant="default" className="text-xs">
        ✅ Canon
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        🌀 Non-Canon
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Stamp Tracker™
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Loading stamps...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Stamp Tracker™
            </CardTitle>
            <CardDescription>
              Earned stamps with Canon validation
            </CardDescription>
          </div>
          <Button
            onClick={handleManualScan}
            disabled={scanning}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Scan className={`h-4 w-4 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Scanning...' : 'Scan for Stamps'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalStamps}</div>
            <div className="text-xs text-muted-foreground">Total Stamps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {stamps.filter(s => s.stamp?.canonLevel === 'canon').length}
            </div>
            <div className="text-xs text-muted-foreground">Canon Verified</div>
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.keys(stats.stampsByCategory).length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">By Category</h4>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(stats.stampsByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center gap-2 text-sm">
                  {getCategoryIcon(category)}
                  <span className="text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* Recent Stamps */}
        <div>
          <h4 className="text-sm font-medium mb-3">Recent Stamps</h4>
          {stats.recentStamps.length > 0 ? (
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {stats.recentStamps.map((userStamp) => (
                  <StampInspectorPanel key={userStamp.id} userStamp={userStamp}>
                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/20 cursor-pointer transition-colors">
                      <div className="text-2xl">{userStamp.stamp?.icon || '🏆'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium truncate">
                            {userStamp.stamp?.name || 'Unknown Stamp'}
                          </h5>
                          {userStamp.stamp?.canonLevel && getCanonBadge(userStamp.stamp.canonLevel)}
                          <Search className="h-3 w-3 text-muted-foreground ml-auto" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {userStamp.stamp?.flavorText}
                        </p>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(userStamp.stamp?.category || 'Performance')}
                          <span className="text-xs text-muted-foreground">
                            {new Date(userStamp.earnedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </StampInspectorPanel>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No stamps earned yet</p>
              <p className="text-xs">Complete jobs to earn your first stamps!</p>
            </div>
          )}
        </div>

        {/* Last Scan Result */}
        {lastScanResult && lastScanResult.annetteResponse && (
          <div className="mt-4 p-3 rounded-lg bg-secondary/20 border border-secondary">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">A</span>
              </div>
              <span className="text-sm font-medium">Annette's Latest</span>
              {lastScanResult.canonStatus === 'canon' ? (
                <Badge variant="default" className="text-xs">✅ Canon</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">🌀 Non-Canon</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground italic">
              "{lastScanResult.annetteResponse}"
            </p>
          </div>
        )}

        {/* Broadcast Controls */}
        {showBroadcastControls && (
          <div className="mt-4">
            <BroadcastControlsCard />
          </div>
        )}
      </CardContent>
    </Card>
  );
}