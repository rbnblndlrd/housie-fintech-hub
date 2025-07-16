// Canon Broadcast Panel - Floating display of public Canon echoes
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Radio, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CanonBroadcastEntry {
  id: string;
  message: string;
  userName: string;
  stampName: string;
  canonStatus: 'canon' | 'non-canon';
  timestamp: Date;
  location?: string;
}

interface CanonBroadcastProps {
  className?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

export function CanonBroadcast({ 
  className, 
  position = 'bottom-left' 
}: CanonBroadcastProps) {
  const [broadcasts, setBroadcasts] = useState<CanonBroadcastEntry[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Mock data - in real implementation would connect to Canon Echo system
  useEffect(() => {
    const mockBroadcasts: CanonBroadcastEntry[] = [
      {
        id: '1',
        message: "📡 Broadcast: Lamarre just earned 'Road Warrior' for crossing 50km. Stamp #734 – Canonical",
        userName: 'Lamarre',
        stampName: 'Road Warrior',
        canonStatus: 'canon',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        location: 'Montreal'
      },
      {
        id: '2',
        message: "🌀 Echo: Martinez earned 'One-Woman Army' - 3 solo jobs completed. Verification pending.",
        userName: 'Martinez',
        stampName: 'One-Woman Army',
        canonStatus: 'non-canon',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: '3',
        message: "📡 Broadcast: Chen achieved 'Clockwork' - perfect punctuality streak. Stamp #891 – Canonical",
        userName: 'Chen',
        stampName: 'Clockwork',
        canonStatus: 'canon',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        location: 'Laval'
      },
      {
        id: '4',
        message: "📡 Broadcast: Taylor earned 'Loyal Return' - client rebooked within 7 days. Stamp #456 – Canonical",
        userName: 'Taylor',
        stampName: 'Loyal Return',
        canonStatus: 'canon',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '5',
        message: "🌀 Echo: Rodriguez earned 'Crew Commander' - team leadership detected. Verification pending.",
        userName: 'Rodriguez',
        stampName: 'Crew Commander',
        canonStatus: 'non-canon',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ];

    setBroadcasts(mockBroadcasts);

    // Simulate new broadcasts coming in
    const interval = setInterval(() => {
      const newBroadcast: CanonBroadcastEntry = {
        id: Date.now().toString(),
        message: `📡 Broadcast: Provider${Math.floor(Math.random() * 100)} earned 'Performance Stamp' - verified achievement.`,
        userName: `Provider${Math.floor(Math.random() * 100)}`,
        stampName: 'Performance Stamp',
        canonStatus: Math.random() > 0.3 ? 'canon' : 'non-canon',
        timestamp: new Date(),
        location: Math.random() > 0.5 ? 'Montreal' : undefined
      };

      setBroadcasts(prev => [newBroadcast, ...prev.slice(0, 4)]);
    }, 30000); // New broadcast every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'fixed bottom-4 left-4 z-50';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50';
      case 'top-left':
        return 'fixed top-20 left-4 z-50';
      case 'top-right':
        return 'fixed top-20 right-4 z-50';
      default:
        return 'fixed bottom-4 left-4 z-50';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return timestamp.toLocaleDateString();
  };

  if (!isVisible) return null;

  return (
    <div className={cn(getPositionClasses(), className)}>
      <Card className="w-96 bg-card/95 backdrop-blur-md border-border/20 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Radio className="h-4 w-4 text-green-500 animate-pulse" />
              📡 Echo Feed
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="pt-0">
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {broadcasts.map((broadcast) => (
                  <div
                    key={broadcast.id}
                    className="p-3 rounded-lg border bg-card/50 animate-fade-in"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={broadcast.canonStatus === 'canon' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {broadcast.canonStatus === 'canon' ? '✅ Canonical' : '🌀 Pending'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(broadcast.timestamp)}
                          </span>
                          {broadcast.location && (
                            <span className="text-xs text-muted-foreground">
                              📍 {broadcast.location}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">
                          {broadcast.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-3 pt-2 border-t border-border/20">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Live feed from HOUSIE network</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

// Helper component to toggle visibility
export function CanonBroadcastToggle() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {!isVisible && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 left-4 z-40 gap-2"
        >
          <Radio className="h-4 w-4" />
          📡 Echo Feed
        </Button>
      )}
      {isVisible && <CanonBroadcast />}
    </>
  );
}