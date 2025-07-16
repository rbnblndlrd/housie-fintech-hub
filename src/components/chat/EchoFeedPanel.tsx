import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Radio, Clock, MapPin, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CanonEcho, getUserCanonEchoes } from '@/utils/canonEchoEngine';

interface EchoFeedPanelProps {
  onBack: () => void;
}

export const EchoFeedPanel: React.FC<EchoFeedPanelProps> = ({ onBack }) => {
  const [echoes, setEchoes] = useState<CanonEcho[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Mobile swipe support
  useEffect(() => {
    let startX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      // Swipe right to go back (threshold: 50px)
      if (diffX < -50) {
        onBack();
      }
    };
    
    const panel = panelRef.current;
    if (panel) {
      panel.addEventListener('touchstart', handleTouchStart);
      panel.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        panel.removeEventListener('touchstart', handleTouchStart);
        panel.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [onBack]);

  useEffect(() => {
    loadEchoes();
  }, []);

  const loadEchoes = async () => {
    setLoading(true);
    try {
      const data = await getUserCanonEchoes(false, 50); // All echoes, more items
      setEchoes(data);
    } catch (error) {
      console.error('Error loading Echo Feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEchoIcon = (source: string) => {
    switch (source) {
      case 'job': return '💼';
      case 'stamp': return '🏆';
      case 'prestige': return '👑';
      case 'map': return '🗺️';
      default: return '📡';
    }
  };

  const getEchoColor = (canonical: boolean) => {
    return canonical 
      ? 'bg-green-500/10 text-green-700 border-green-500/20'
      : 'bg-orange-500/10 text-orange-700 border-orange-500/20';
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  return (
    <div ref={panelRef} className="h-full flex flex-col bg-gray-900 text-white animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-slate-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0 hover:bg-slate-600 text-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-green-400" />
            <h3 className="font-semibold text-white">Echo Feed</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            📡 Live
          </Badge>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-11">
          Canon achievements & prestige broadcasts
        </p>
      </div>

      {/* Feed Content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {loading ? (
            <div className="text-center text-gray-400 py-8">
              <Radio className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p>Loading echo feed...</p>
            </div>
          ) : echoes.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium">No echoes detected</p>
              <p className="text-xs mt-1">Complete achievements to broadcast!</p>
              <div className="mt-4 p-3 bg-slate-800 rounded-lg text-left">
                <p className="text-xs text-purple-400 font-medium mb-1">
                  💡 Annette says:
                </p>
                <p className="text-xs text-gray-300">
                  "Well look who showed up to work! Get out there and make some noise - this feed is looking mighty quiet without your achievements lighting it up!"
                </p>
              </div>
            </div>
          ) : (
            echoes.map((echo) => (
              <div 
                key={echo.id}
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getEchoIcon(echo.source)}</span>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getEchoColor(echo.canonical))}
                    >
                      {echo.canonical ? 'Canon ✅' : 'Non-Canon 🌀'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(echo.created_at!)}</span>
                  </div>
                </div>

                {/* Message */}
                <p className="text-sm text-gray-200 mb-2 leading-relaxed">
                  {echo.message}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {echo.location && echo.location !== 'none' && (
                      <Badge variant="secondary" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {echo.location.replace('-', ' ')}
                      </Badge>
                    )}
                    {echo.tags && echo.tags.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        #{echo.tags[0]}
                      </Badge>
                    )}
                  </div>
                  
                  {echo.canon_confidence && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Zap className="w-3 h-3" />
                      <span>{Math.round(echo.canon_confidence * 100)}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 bg-slate-800/50">
        <p className="text-xs text-gray-400 text-center">
          Echoes broadcast your verified achievements across HOUSIE
        </p>
      </div>
    </div>
  );
};