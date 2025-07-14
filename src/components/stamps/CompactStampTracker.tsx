// Compact Stamp Tracker - Smaller version for sidebars
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStamps } from '@/hooks/useStamps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Scan } from 'lucide-react';
import { triggerManualStampScan } from '@/utils/canonStampScanner';
import { useToast } from '@/hooks/use-toast';

interface CompactStampTrackerProps {
  className?: string;
  showScanButton?: boolean;
}

export function CompactStampTracker({ 
  className,
  showScanButton = true 
}: CompactStampTrackerProps) {
  const { user } = useAuth();
  const { stamps, stats, loading, refreshStamps } = useStamps();
  const { toast } = useToast();
  const [scanning, setScanning] = React.useState(false);

  const handleManualScan = async () => {
    if (!user?.id) return;

    setScanning(true);
    try {
      const result = await triggerManualStampScan(user.id);
      
      if (result.awardedStamps.length > 0) {
        toast({
          title: "🏆 New Stamps!",
          description: `Earned ${result.awardedStamps.length} stamp(s)`,
          duration: 3000,
        });
        refreshStamps();
      }
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Award className="h-4 w-4" />
          Stamps
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-primary">{stats.totalStamps}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent">
              {stamps.filter(s => s.stamp?.canonLevel === 'canon').length}
            </div>
            <div className="text-xs text-muted-foreground">Canon</div>
          </div>
        </div>

        {/* Recent Stamps */}
        {stats.recentStamps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Recent</h4>
            {stats.recentStamps.slice(0, 2).map((userStamp) => (
              <div key={userStamp.id} className="flex items-center gap-2 p-2 rounded-md border bg-card/50">
                <div className="text-lg">{userStamp.stamp?.icon || '🏆'}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">
                    {userStamp.stamp?.name || 'Stamp'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant={userStamp.stamp?.canonLevel === 'canon' ? 'default' : 'secondary'}
                      className="text-xs h-4"
                    >
                      {userStamp.stamp?.canonLevel === 'canon' ? '✅' : '🌀'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(userStamp.earnedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scan Button */}
        {showScanButton && (
          <Button
            onClick={handleManualScan}
            disabled={scanning}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <Scan className={`h-3 w-3 mr-2 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Scanning...' : 'Scan'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}