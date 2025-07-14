// Stamp Inspector Panel - Detailed view of stamp information
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Star, 
  Award,
  ExternalLink,
  Shield,
  Clock
} from 'lucide-react';
// Import UserStamp type from stamps hook
interface UserStamp {
  id: string;
  stampId: string;
  earnedAt: string;
  contextData?: any;
  jobId?: string;
  stamp?: {
    id: string;
    name: string;
    icon: string;
    flavorText: string;
    category: string;
    canonLevel: string;
  };
}

interface StampInspectorPanelProps {
  userStamp: UserStamp;
  children: React.ReactNode;
}

export function StampInspectorPanel({ userStamp, children }: StampInspectorPanelProps) {
  const getCanonBadge = (canonLevel: string) => {
    return canonLevel === 'canon' ? (
      <Badge variant="default" className="text-xs">
        <Shield className="h-3 w-3 mr-1" />
        ✅ Canon Verified
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        <Star className="h-3 w-3 mr-1" />
        🌀 Non-Canon
      </Badge>
    );
  };

  const getContextBreakdown = () => {
    const context = userStamp.contextData as any;
    if (!context) return null;

    const breakdown = [];

    if (context.distance_km) {
      breakdown.push({
        label: 'Distance Challenge',
        value: `${context.distance_km} km from base`,
        score: '+15 Canon Points'
      });
    }

    if (context.early_arrivals) {
      breakdown.push({
        label: 'Punctuality Streak',
        value: `${context.early_arrivals} consecutive early arrivals`,
        score: '+10 Canon Points'
      });
    }

    if (context.jobs_today) {
      breakdown.push({
        label: 'Daily Productivity',
        value: `${context.jobs_today} jobs completed in one day`,
        score: '+20 Canon Points'
      });
    }

    if (context.five_star_count) {
      breakdown.push({
        label: 'Excellence Streak',
        value: `${context.five_star_count} consecutive 5-star reviews`,
        score: '+25 Canon Points'
      });
    }

    return breakdown;
  };

  const contextBreakdown = getContextBreakdown();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{userStamp.stamp?.icon || '🏆'}</span>
            <div>
              <h3 className="font-bold">{userStamp.stamp?.name || 'Unknown Stamp'}</h3>
              <div className="flex items-center gap-2 mt-1">
                {userStamp.stamp?.canonLevel && getCanonBadge(userStamp.stamp.canonLevel)}
                <Badge variant="outline" className="text-xs">
                  {userStamp.stamp?.category || 'Performance'}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <div className="space-y-4">
            {/* Flavor Text */}
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground italic">
                "{userStamp.stamp?.flavorText || 'A badge of honor and achievement.'}"
              </p>
            </div>

            {/* Trigger Event & Timestamp */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Earned on:</span>
                <span className="font-medium">
                  {new Date(userStamp.earnedAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">
                  {new Date(userStamp.earnedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {userStamp.jobId && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Job Reference:</span>
                  <span className="font-mono text-xs">
                    {userStamp.jobId.slice(0, 8)}...
                  </span>
                </div>
              )}
            </div>

            {/* Canon Scoring Breakdown */}
            {contextBreakdown && contextBreakdown.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Canon Scoring Breakdown
                  </h4>
                  <div className="space-y-2">
                    {contextBreakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.value}</p>
                        </div>
                        <Badge variant="outline" className="text-xs text-green-600">
                          {item.score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* View Canon Log Button */}
            <Separator />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                // TODO: Navigate to canon log view
                console.log('View canon log for stamp:', userStamp.id);
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Canon Record
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}