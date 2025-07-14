// Stamp Scanner™ Demo Component - Test the Canon stamp recognition system
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { triggerManualStampScan, processJobCompletionStamps, type ScanResult, type StampAward } from '@/utils/canonStampScanner';
import { Scan, Award, Zap, Target, Clock, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function StampScannerDemo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  const handleManualScan = async () => {
    if (!user?.id) {
      toast({
        title: "❌ Authentication Required",
        description: "Please log in to scan for stamps.",
        variant: "destructive",
      });
      return;
    }

    setScanning(true);
    try {
      const result = await triggerManualStampScan(user.id);
      setScanResults(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
      setLastScanTime(new Date());
      
      if (result.awardedStamps.length > 0) {
        toast({
          title: "🏆 New Stamps Earned!",
          description: `Awarded ${result.awardedStamps.length} stamp(s)!`,
          duration: 5000,
        });
      } else {
        toast({
          title: "🔍 Scan Complete",
          description: "No new stamps available right now.",
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

  const handleJobCompletionScan = async () => {
    if (!user?.id) return;

    setScanning(true);
    try {
      // Simulate a job completion scan with mock job ID
      const mockJobId = `mock-job-${Date.now()}`;
      const result = await processJobCompletionStamps(user.id, mockJobId);
      setScanResults(prev => [result, ...prev.slice(0, 4)]);
      setLastScanTime(new Date());
      
      if (result.awardedStamps.length > 0) {
        toast({
          title: "🎯 Job Completion Scan",
          description: `Job completed! Earned ${result.awardedStamps.length} stamp(s)!`,
          duration: 5000,
        });
      } else {
        toast({
          title: "📋 Job Completed",
          description: "Great work! No new stamps this time.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Job completion scan error:', error);
      toast({
        title: "❌ Scan Failed",
        description: "Unable to process job completion.",
        variant: "destructive",
      });
    } finally {
      setScanning(false);
    }
  };

  const getCanonBadge = (canonStatus: string) => {
    return canonStatus === 'canon' ? (
      <Badge variant="default" className="text-xs">
        ✅ Canon
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        🌀 Non-Canon
      </Badge>
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'uncommon': return 'text-green-600';
      case 'rare': return 'text-blue-600';
      case 'legendary': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-6 w-6" />
            Canon Stamp Scanner™ Demo
          </CardTitle>
          <CardDescription>
            Test the dynamic stamp recognition system. Canon stamps are verified by real data, 
            while Non-Canon stamps are based on Annette's intuition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              onClick={handleManualScan}
              disabled={scanning}
              className="flex items-center gap-2"
            >
              <Scan className={`h-4 w-4 ${scanning ? 'animate-spin' : ''}`} />
              {scanning ? 'Scanning...' : 'Manual Scan'}
            </Button>
            <Button
              onClick={handleJobCompletionScan}
              disabled={scanning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Simulate Job Completion
            </Button>
          </div>
          
          {lastScanTime && (
            <p className="text-sm text-muted-foreground mt-3">
              Last scan: {lastScanTime.toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Recent Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {scanResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Scan #{scanResults.length - index}
                        </span>
                      </div>
                      {getCanonBadge(result.canonStatus)}
                    </div>

                    {/* Eligible Stamps */}
                    {result.eligibleStamps.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-2">
                          Eligible Stamps ({result.eligibleStamps.length})
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {result.eligibleStamps.map((stamp) => (
                            <div key={stamp.id} className="flex items-center gap-2 text-sm p-2 rounded bg-secondary/20">
                              <span>{stamp.icon}</span>
                              <span className="truncate">{stamp.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Awarded Stamps */}
                    {result.awardedStamps.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Awarded Stamps ({result.awardedStamps.length})
                        </h4>
                        <div className="space-y-2">
                          {result.awardedStamps.map((award, awardIndex) => (
                            <div key={awardIndex} className="p-3 rounded bg-primary/10 border border-primary/20">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🏆</span>
                                <span className="font-medium">{award.stampId}</span>
                                {getCanonBadge(award.canonLevel)}
                              </div>
                              <p className="text-sm text-muted-foreground italic">
                                "{award.voiceLine}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Annette's Response */}
                    {result.annetteResponse && (
                      <div className="mt-3 p-3 rounded-lg bg-secondary/20 border border-secondary">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-bold">A</span>
                          </div>
                          <span className="text-sm font-medium">Annette Says</span>
                          {getCanonBadge(result.canonStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground italic">
                          "{result.annetteResponse}"
                        </p>
                      </div>
                    )}

                    {/* No Results */}
                    {result.eligibleStamps.length === 0 && result.awardedStamps.length === 0 && (
                      <div className="text-center text-muted-foreground py-4">
                        <Scan className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No stamps detected this scan</p>
                        <p className="text-xs">Keep completing jobs to earn stamps!</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                ✅ Canon Stamps
                <Badge variant="default" className="text-xs">Verified</Badge>
              </h4>
              <p className="text-sm text-muted-foreground">
                Based on real, measurable data from your jobs, bookings, and platform activity. 
                These achievements are verified and carry more prestige.
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                🌀 Non-Canon Stamps
                <Badge variant="secondary" className="text-xs">Intuition</Badge>
              </h4>
              <p className="text-sm text-muted-foreground">
                Based on Annette's AI intuition and behavioral patterns. 
                Still meaningful achievements, but speculative rather than verified.
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Available Stamps Include:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>🛣️ Road Warrior (Canon)</div>
              <div>⚡ One-Woman Army (Canon)</div>
              <div>🔄 Loyal Return (Canon)</div>
              <div>👥 Crew Commander (Canon)</div>
              <div>⭐ Prestige Rising (Non-Canon)</div>
              <div>🌅 Early Bird (Canon)</div>
              <div>⛈️ Storm Rider (Non-Canon)</div>
              <div>⭐⭐⭐⭐⭐ 5-Star Sweep (Canon)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}