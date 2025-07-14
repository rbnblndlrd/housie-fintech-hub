import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBroadcastBeacon, type BroadcastRangeFilter } from '@/hooks/useBroadcastBeacon';
import { Search, Radio, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CanonEchoFeedBeacon = () => {
  const {
    echoes,
    loading,
    rangeFilter,
    setRangeFilter,
    unreadCount,
    pulseActive,
    markEchoesAsRead,
    getBroadcastIcon,
    getBroadcastLabel,
    generateAnnetteTransmissionLine
  } = useBroadcastBeacon();

  const [searchTerm, setSearchTerm] = useState('');
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [viewedEchoes, setViewedEchoes] = useState<Set<string>>(new Set());

  const filteredEchoes = echoes.filter(echo =>
    echo.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    echo.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEchoView = (echoId: string) => {
    if (!viewedEchoes.has(echoId)) {
      setViewedEchoes(prev => new Set([...prev, echoId]));
      markEchoesAsRead([echoId]);
    }
  };

  const getRangeFilterLabel = (filter: BroadcastRangeFilter) => {
    switch (filter) {
      case 'all': return 'All Signals';
      case 'global': return '🌍 Global';
      case 'city': return '🏙️ City';
      case 'local': return '📍 Local';
      default: return filter;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Canon Echo Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 bg-muted rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative">
      {/* Beacon Pulse Animation */}
      {pulseActive && (
        <div className="absolute inset-0 rounded-lg border-2 border-primary animate-ping opacity-75 pointer-events-none"></div>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "relative",
              pulseActive && "animate-pulse"
            )}>
              <Radio className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <span>Canon Echo Feed</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiveMode(!isLiveMode)}
            className="flex items-center gap-2"
          >
            {isLiveMode ? (
              <>
                <Volume2 className="h-4 w-4" />
                Live
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4" />
                Muted
              </>
            )}
          </Button>
        </CardTitle>
        
        {/* Broadcast Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transmissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={rangeFilter} onValueChange={(value: BroadcastRangeFilter) => setRangeFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Signals</SelectItem>
              <SelectItem value="local">📍 Local</SelectItem>
              <SelectItem value="city">🏙️ City</SelectItem>
              <SelectItem value="global">🌍 Global</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {filteredEchoes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Radio className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No active transmissions</p>
              <p className="text-sm">
                {rangeFilter === 'all' 
                  ? "The Canon grid is quiet right now" 
                  : `No ${getRangeFilterLabel(rangeFilter).toLowerCase()} signals detected`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEchoes.map((echo) => (
                <div
                  key={echo.id}
                  onClick={() => handleEchoView(echo.id)}
                  className={cn(
                    "group p-4 rounded-lg border cursor-pointer transition-all duration-200",
                    echo.is_unread && "border-primary bg-primary/5",
                    echo.pulse_active && "animate-pulse",
                    "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className={cn(
                        "text-lg",
                        echo.pulse_active && "animate-bounce"
                      )}>
                        {getBroadcastIcon(echo.broadcast_range)}
                      </div>
                      <Badge 
                        variant={echo.broadcast_range === 'global' ? 'default' : 'secondary'}
                        className="text-xs px-1 py-0"
                      >
                        {getBroadcastLabel(echo.broadcast_range)}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {echo.is_unread && (
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {new Date(echo.created_at).toLocaleTimeString()}
                          </span>
                          {echo.canon_confidence >= 0.8 && (
                            <Badge variant="outline" className="text-xs">
                              Canon ✓
                            </Badge>
                          )}
                        </div>
                        
                        {echo.engagement_count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {echo.engagement_count} reactions
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-relaxed">
                          {isLiveMode 
                            ? generateAnnetteTransmissionLine(echo)
                            : echo.message
                          }
                        </p>
                        
                        {echo.location && (
                          <p className="text-xs text-muted-foreground">
                            📍 {echo.location}
                          </p>
                        )}
                        
                        {echo.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {echo.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {unreadCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={() => markEchoesAsRead(echoes.filter(e => e.is_unread).map(e => e.id))}
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              Mark all as read ({unreadCount})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};