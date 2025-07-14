// Broadcast Dashboard Panel - Admin view of live canon feed and controls
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Radio, 
  Pause, 
  Play, 
  Flag, 
  TrendingUp,
  MapPin,
  Flame,
  Shield,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getPublicBroadcasts, BroadcastEvent } from '@/utils/broadcastEngine';

export function BroadcastDashboardPanel() {
  const { user } = useAuth();
  const [broadcasts, setBroadcasts] = useState<BroadcastEvent[]>([]);
  const [echoPaused, setEchoPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user has admin permissions
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.email === '7utile@gmail.com';

  useEffect(() => {
    fetchBroadcasts();
    const interval = setInterval(fetchBroadcasts, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const data = await getPublicBroadcasts('local', 'Montreal', 15);
      setBroadcasts(data);
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCanonBadge = (confidence: number) => {
    return confidence > 0.8 ? (
      <Badge variant="default" className="text-xs">
        <Shield className="h-3 w-3 mr-1" />
        Canon
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        Non-Canon
      </Badge>
    );
  };

  const flagBroadcast = (broadcastId: string) => {
    console.log('Flagging broadcast:', broadcastId);
    // TODO: Implement admin flagging
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Broadcast Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Admin access required</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-5 w-5" />
          Broadcast Dashboard
          <Badge variant="outline" className="text-xs">Admin</Badge>
        </CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Switch
              id="echo-pause"
              checked={!echoPaused}
              onCheckedChange={(checked) => setEchoPaused(!checked)}
            />
            <Label htmlFor="echo-pause" className="text-sm">
              Live Echo Feed
            </Label>
          </div>
          {!echoPaused && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Activity className="h-3 w-3 animate-pulse" />
              Live
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed">Live Feed</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="streaks">Streaks</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Canon Echo Feed</h4>
                <Badge variant="outline" className="text-xs">
                  {broadcasts.length} active
                </Badge>
              </div>
              
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {broadcasts.map((broadcast) => (
                    <div key={broadcast.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCanonBadge(broadcast.canon_confidence)}
                          <Badge variant="outline" className="text-xs">
                            {broadcast.event_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => flagBroadcast(broadcast.id!)}
                            className="h-6 w-6 p-0"
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            {new Date(broadcast.created_at!).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm">{broadcast.content}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {broadcast.city}
                        <span>•</span>
                        <span>{broadcast.engagement_count} reactions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Canon Ratio Heatmap</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/20 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">87%</div>
                  <div className="text-xs text-muted-foreground">Montreal Canon Ratio</div>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">23</div>
                  <div className="text-xs text-muted-foreground">Active Clusters</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">USER CLUSTER TRENDS</h5>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span>Downtown Core</span>
                    <Badge variant="outline" className="text-xs">92% Canon</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Plateau</span>
                    <Badge variant="outline" className="text-xs">84% Canon</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Westmount</span>
                    <Badge variant="outline" className="text-xs">95% Canon</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="streaks" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <h4 className="text-sm font-medium">Canon Streak Watch</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                  <div>
                    <p className="text-sm font-medium">User #a1b2c3</p>
                    <p className="text-xs text-muted-foreground">Road Warrior Specialist</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Flame className="h-3 w-3" />
                      <span className="text-sm font-bold">12</span>
                    </div>
                    <p className="text-xs text-muted-foreground">day streak</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                  <div>
                    <p className="text-sm font-medium">User #d4e5f6</p>
                    <p className="text-xs text-muted-foreground">Clockwork Master</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Flame className="h-3 w-3" />
                      <span className="text-sm font-bold">8</span>
                    </div>
                    <p className="text-xs text-muted-foreground">day streak</p>
                  </div>
                </div>
                
                <div className="text-center text-muted-foreground py-2 text-xs">
                  🔥 Looking for the next Canon champion!
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}